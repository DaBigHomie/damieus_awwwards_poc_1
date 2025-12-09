/**
 * Pre-Deployment Validator
 * 
 * Runs comprehensive checks before deployment
 * Validates build, tests, code quality, and environment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PreDeploymentValidator {
  constructor(options = {}) {
    this.options = {
      strict: options.strict !== false,
      verbose: options.verbose !== false,
      ...options
    };
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      checks: []
    };
  }

  /**
   * Run a check and track result
   */
  runCheck(name, fn) {
    try {
      const result = fn();
      this.results.checks.push({
        name,
        status: 'passed',
        message: result
      });
      this.results.passed++;
      if (this.options.verbose) console.log(`✓ ${name}`);
      return true;
    } catch (error) {
      this.results.checks.push({
        name,
        status: 'failed',
        message: error.message
      });
      this.results.failed++;
      if (this.options.verbose) console.log(`✗ ${name}: ${error.message}`);
      return false;
    }
  }

  /**
   * Add a warning
   */
  warn(name, message) {
    this.results.checks.push({
      name,
      status: 'warning',
      message
    });
    this.results.warnings++;
    if (this.options.verbose) console.log(`⚠ ${name}: ${message}`);
  }

  /**
   * Check if tests pass
   */
  checkTests() {
    return this.runCheck('Tests Pass', () => {
      try {
        execSync('npm test -- --run', { stdio: 'pipe' });
        return 'All tests passed';
      } catch (error) {
        throw new Error('Test suite failed. Run: npm test');
      }
    });
  }

  /**
   * Check if build succeeds
   */
  checkBuild() {
    return this.runCheck('Build Succeeds', () => {
      try {
        execSync('npm run build', { stdio: 'pipe' });
        return 'Build completed successfully';
      } catch (error) {
        throw new Error('Build failed. Check logs above.');
      }
    });
  }

  /**
   * Check TypeScript
   */
  checkTypeScript() {
    return this.runCheck('TypeScript Check', () => {
      try {
        execSync('npm run type-check', { stdio: 'pipe' });
        return 'No type errors';
      } catch (error) {
        throw new Error('TypeScript errors found');
      }
    });
  }

  /**
   * Check linting
   */
  checkLinting() {
    return this.runCheck('Linting', () => {
      try {
        execSync('npm run lint', { stdio: 'pipe' });
        return 'No linting errors';
      } catch (error) {
        throw new Error('Linting errors found');
      }
    });
  }

  /**
   * Check environment variables
   */
  checkEnvironment() {
    return this.runCheck('Environment Setup', () => {
      const requiredVars = [
        'NODE_ENV',
        'VITE_API_BASE_URL'
      ];

      const missing = requiredVars.filter(v => !process.env[v]);
      if (missing.length > 0) {
        throw new Error(`Missing: ${missing.join(', ')}`);
      }
      return `All ${requiredVars.length} env vars present`;
    });
  }

  /**
   * Check build output size
   */
  checkBundleSize() {
    return this.runCheck('Bundle Size Check', () => {
      const distDir = path.join(process.cwd(), 'dist');
      if (!fs.existsSync(distDir)) {
        throw new Error('dist/ not found. Run: npm run build');
      }

      let totalSize = 0;
      const getSize = (dir) => {
        fs.readdirSync(dir).forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            getSize(filePath);
          } else {
            totalSize += stat.size;
          }
        });
      };
      getSize(distDir);

      const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
      if (totalSize > 150 * 1024) {
        this.warn('Large Bundle', `Total: ${sizeInMB}MB (recommend < 0.15MB)`);
      }
      return `Total size: ${sizeInMB}MB`;
    });
  }

  /**
   * Check git status
   */
  checkGitStatus() {
    return this.runCheck('Git Status', () => {
      try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim()) {
          this.warn('Uncommitted Changes', 'Make sure all changes are committed');
        }
        return 'Git clean or warned';
      } catch (error) {
        throw new Error('Not a git repository');
      }
    });
  }

  /**
   * Check if on main branch
   */
  checkBranch() {
    return this.runCheck('Branch Check', () => {
      try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
          encoding: 'utf8' 
        }).trim();
        
        if (branch !== 'main' && branch !== 'master') {
          throw new Error(`You are on '${branch}' branch. Deploy from main/master.`);
        }
        return `On ${branch} branch`;
      } catch (error) {
        throw new Error('Could not determine branch');
      }
    });
  }

  /**
   * Run all validations
   */
  async validate() {
    console.log('\n📋 PRE-DEPLOYMENT VALIDATION\n');

    this.checkTests();
    this.checkBuild();
    this.checkTypeScript();
    this.checkLinting();
    this.checkEnvironment();
    this.checkBundleSize();
    this.checkGitStatus();
    this.checkBranch();

    return this.getReport();
  }

  /**
   * Get validation report
   */
  getReport() {
    const total = this.results.passed + this.results.failed;
    const percentage = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;

    const report = {
      success: this.results.failed === 0,
      summary: `${this.results.passed}/${total} checks passed (${percentage}%)`,
      passed: this.results.passed,
      failed: this.results.failed,
      warnings: this.results.warnings,
      details: this.results.checks,
      readyToDeploy: this.results.failed === 0 && (!this.options.strict || this.results.warnings === 0)
    };

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log(report.summary);
    console.log('='.repeat(50));

    if (report.failed > 0) {
      console.log('\n❌ FAILED CHECKS:');
      this.results.checks
        .filter(c => c.status === 'failed')
        .forEach(c => console.log(`  ${c.name}: ${c.message}`));
    }

    if (report.warnings > 0) {
      console.log('\n⚠ WARNINGS:');
      this.results.checks
        .filter(c => c.status === 'warning')
        .forEach(c => console.log(`  ${c.name}: ${c.message}`));
    }

    console.log('\n' + (report.readyToDeploy ? '✅ READY TO DEPLOY' : '❌ NOT READY TO DEPLOY'));
    console.log('');

    return report;
  }
}

export default PreDeploymentValidator;

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new PreDeploymentValidator();
  const report = await validator.validate();
  process.exit(report.readyToDeploy ? 0 : 1);
}
