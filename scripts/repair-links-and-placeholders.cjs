#!/usr/bin/env node

/**
 * Automated Link & Placeholder Repair Script
 * 
 * Purpose: Scan and fix broken links, missing pages, and placeholder content
 * Usage: node scripts/repair-links-and-placeholders.js [--dry-run] [--auto-fix]
 * 
 * Features:
 * - Scans all JSX/TSX files for broken navigation links
 * - Detects placeholder content and missing images
 * - Validates all routes against App.jsx
 * - Auto-generates missing page components
 * - Updates broken href/to attributes
 * - Creates comprehensive repair report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  srcDir: path.join(__dirname, '../src'),
  pagesDir: path.join(__dirname, '../src/pages'),
  componentsDir: path.join(__dirname, '../src/components'),
  appFile: path.join(__dirname, '../src/App.jsx'),
  dryRun: process.argv.includes('--dry-run'),
  autoFix: process.argv.includes('--auto-fix'),
  verbose: process.argv.includes('--verbose'),
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Results tracking
const results = {
  brokenLinks: [],
  placeholders: [],
  missingPages: [],
  missingImages: [],
  missingCSS: [],
  fixes: [],
  errors: [],
};

//═══════════════════════════════════════════════════════════════════════════════
// Utility Functions
//═══════════════════════════════════════════════════════════════════════════════

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function findFiles(dir, extensions, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findFiles(filePath, extensions, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function extractRoutes(appContent) {
  const routes = [];
  const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
  let match;
  
  while ((match = routeRegex.exec(appContent)) !== null) {
    routes.push(match[1]);
  }
  
  return routes;
}

function extractLinks(content, filePath) {
  const links = [];
  
  // Match React Router Link components
  const linkRegex = /<Link\s+to=["']([^"']+)["'][^>]*>/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      type: 'Link',
      href: match[1],
      file: filePath,
      line: content.substring(0, match.index).split('\n').length,
    });
  }
  
  // Match anchor tags
  const anchorRegex = /<a\s+href=["']([^"']+)["'][^>]*>/g;
  
  while ((match = anchorRegex.exec(content)) !== null) {
    const href = match[1];
    // Only check internal links (not http/https/mailto)
    if (!href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
      links.push({
        type: 'anchor',
        href,
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
      });
    }
  }
  
  return links;
}

function findPlaceholders(content, filePath) {
  const placeholders = [];
  const patterns = [
    { regex: /placeholder|PLACEHOLDER/gi, type: 'placeholder attribute' },
    { regex: /TODO|FIXME|HACK|XXX/gi, type: 'code comment' },
    { regex: /lorem\s+ipsum/gi, type: 'lorem ipsum text' },
    { regex: /coming\s+soon/gi, type: 'coming soon text' },
    { regex: /\[INSERT.*?\]/gi, type: 'insert marker' },
    { regex: /example\.com|test\.com|placeholder\.(jpg|png|webp)/gi, type: 'placeholder URL' },
  ];
  
  patterns.forEach(({ regex, type }) => {
    let match;
    regex.lastIndex = 0; // Reset regex
    
    while ((match = regex.exec(content)) !== null) {
      placeholders.push({
        type,
        text: match[0],
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        context: content.substring(Math.max(0, match.index - 50), match.index + 50),
      });
    }
  });
  
  return placeholders;
}

function findMissingImages(content, filePath) {
  const images = [];
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    
    // Skip external URLs and data URIs
    if (src.startsWith('http') || src.startsWith('data:')) continue;
    
    // Resolve path
    const imagePath = src.startsWith('/')
      ? path.join(__dirname, '..', 'public', src)
      : path.join(path.dirname(filePath), src);
    
    if (!fs.existsSync(imagePath)) {
      images.push({
        src,
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        resolvedPath: imagePath,
      });
    }
  }
  
  return images;
}

//═══════════════════════════════════════════════════════════════════════════════
// Analysis Functions
//═══════════════════════════════════════════════════════════════════════════════

function analyzeLinks() {
  log('\n📊 Analyzing Links...', 'cyan');
  
  // Get all routes from App.jsx
  const appContent = fs.readFileSync(config.appFile, 'utf-8');
  const validRoutes = extractRoutes(appContent);
  
  log(`   Found ${validRoutes.length} defined routes`, 'blue');
  if (config.verbose) {
    validRoutes.forEach(route => log(`   - ${route}`, 'blue'));
  }
  
  // Scan all JSX/TSX files
  const files = findFiles(config.srcDir, ['.jsx', '.tsx', '.js', '.ts']);
  log(`   Scanning ${files.length} files...`, 'blue');
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractLinks(content, file);
    
    links.forEach(link => {
      // Check if link is broken
      const routePath = link.href.split('#')[0].split('?')[0];
      
      // Skip hash-only links
      if (link.href.startsWith('#')) return;
      
      // Check if route exists
      if (routePath && !validRoutes.includes(routePath) && !validRoutes.includes('*')) {
        results.brokenLinks.push(link);
      }
    });
  });
  
  log(`   ✓ Found ${results.brokenLinks.length} broken links\n`, 
      results.brokenLinks.length > 0 ? 'yellow' : 'green');
}

function analyzePlaceholders() {
  log('📝 Analyzing Placeholders...', 'cyan');
  
  const files = findFiles(config.srcDir, ['.jsx', '.tsx', '.js', '.ts']);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const placeholders = findPlaceholders(content, file);
    results.placeholders.push(...placeholders);
  });
  
  log(`   ✓ Found ${results.placeholders.length} placeholders\n`,
      results.placeholders.length > 0 ? 'yellow' : 'green');
}

function analyzeMissingPages() {
  log('📄 Analyzing Missing Pages...', 'cyan');
  
  const appContent = fs.readFileSync(config.appFile, 'utf-8');
  const routes = extractRoutes(appContent);
  
  routes.forEach(route => {
    if (route === '*' || route === '/') return;
    
    // Guess page component name from route
    const pageName = route.substring(1).split('/')[0];
    const capitalizedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    const pagePath = path.join(config.pagesDir, `${capitalizedName}.jsx`);
    
    if (!fs.existsSync(pagePath)) {
      results.missingPages.push({
        route,
        expectedFile: pagePath,
        componentName: capitalizedName,
      });
    }
  });
  
  log(`   ✓ Found ${results.missingPages.length} missing pages\n`,
      results.missingPages.length > 0 ? 'yellow' : 'green');
}

function analyzeMissingImages() {
  log('🖼️  Analyzing Missing Images...', 'cyan');
  
  const files = findFiles(config.srcDir, ['.jsx', '.tsx']);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const images = findMissingImages(content, file);
    results.missingImages.push(...images);
  });
  
  log(`   ✓ Found ${results.missingImages.length} missing images\n`,
      results.missingImages.length > 0 ? 'yellow' : 'green');
}

function validatePageCSS() {
  log('🎨 Validating Page CSS...', 'cyan');
  
  const pageFiles = findFiles(config.pagesDir, ['.jsx', '.tsx']);
  const stylesDir = path.join(__dirname, '../src/styles');
  
  pageFiles.forEach(pageFile => {
    const content = fs.readFileSync(pageFile, 'utf-8');
    const pageName = path.basename(pageFile, path.extname(pageFile)).toLowerCase();
    
    // Skip special pages
    if (pageName === 'notfound' || pageName === 'index') return;
    
    // Check if CSS file exists
    const cssFile = path.join(stylesDir, `${pageName}.css`);
    
    // Check if CSS is imported
    const cssImportRegex = new RegExp(`import.*['"].*${pageName}\\.css['"]`);
    const hasCSSImport = cssImportRegex.test(content);
    
    if (!fs.existsSync(cssFile) || !hasCSSImport) {
      results.missingCSS.push({
        page: pageName,
        file: pageFile,
        cssFile: cssFile,
        exists: fs.existsSync(cssFile),
        imported: hasCSSImport,
      });
    }
  });
  
  log(`   ✓ Found ${results.missingCSS.length} pages without dedicated CSS\n`,
      results.missingCSS.length > 0 ? 'yellow' : 'green');
}

//═══════════════════════════════════════════════════════════════════════════════
// Repair Functions
//═══════════════════════════════════════════════════════════════════════════════

function repairBrokenLinks() {
  if (results.brokenLinks.length === 0) return;
  
  log('\n🔧 Repairing Broken Links...', 'cyan');
  
  results.brokenLinks.forEach(link => {
    log(`   Fixing: ${link.href} in ${path.basename(link.file)}:${link.line}`, 'yellow');
    
    // Suggest fixes
    let suggestedFix = link.href;
    
    // Convert anchor links to router links
    if (link.type === 'anchor' && link.href.startsWith('#')) {
      suggestedFix = `/${link.href.substring(1)}`;
      log(`     → Suggestion: Change to <Link to="${suggestedFix}">`, 'blue');
    }
    
    // Fix common routing issues
    if (link.href === '/#services') suggestedFix = '/services';
    if (link.href === '/#about') suggestedFix = '/about';
    if (link.href === '/#work') suggestedFix = '/work';
    
    if (config.autoFix && !config.dryRun) {
      try {
        let content = fs.readFileSync(link.file, 'utf-8');
        
        // Replace the broken link
        if (link.type === 'Link') {
          content = content.replace(
            new RegExp(`to="${link.href}"`, 'g'),
            `to="${suggestedFix}"`
          );
        } else {
          content = content.replace(
            new RegExp(`href="${link.href}"`, 'g'),
            `href="${suggestedFix}"`
          );
        }
        
        fs.writeFileSync(link.file, content, 'utf-8');
        results.fixes.push({ type: 'link', file: link.file, from: link.href, to: suggestedFix });
        log(`     ✓ Fixed!`, 'green');
      } catch (error) {
        results.errors.push({ type: 'link fix', file: link.file, error: error.message });
        log(`     ✗ Error: ${error.message}`, 'red');
      }
    } else {
      log(`     → Would fix: ${link.href} → ${suggestedFix}`, 'blue');
    }
  });
}

function generateMissingPages() {
  if (results.missingPages.length === 0) return;
  
  log('\n🏗️  Generating Missing Pages...', 'cyan');
  
  results.missingPages.forEach(page => {
    log(`   Creating: ${page.componentName}.jsx`, 'yellow');
    
    const pageTemplate = `import { Navigation, Footer } from '../components';
import '../styles/${page.componentName.toLowerCase()}.css';

export const ${page.componentName} = () => {
  return (
    <>
      <Navigation />
      <main className="${page.componentName.toLowerCase()}-page">
        <section className="hero-section">
          <div className="container">
            <h1>${page.componentName}</h1>
            <p>Welcome to the ${page.componentName} page.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
`;
    
    if (config.autoFix && !config.dryRun) {
      try {
        // Create pages directory if it doesn't exist
        if (!fs.existsSync(config.pagesDir)) {
          fs.mkdirSync(config.pagesDir, { recursive: true });
        }
        
        fs.writeFileSync(page.expectedFile, pageTemplate, 'utf-8');
        results.fixes.push({ type: 'page', file: page.expectedFile });
        log(`     ✓ Created!`, 'green');
        
        // Create corresponding CSS file
        const cssFile = path.join(__dirname, '../src/styles', `${page.componentName.toLowerCase()}.css`);
        const cssContent = `.${page.componentName.toLowerCase()}-page {
  min-height: 100vh;
}

.${page.componentName.toLowerCase()}-page .hero-section {
  padding: 120px 0 80px;
  text-align: center;
}

.${page.componentName.toLowerCase()}-page h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1.5rem;
}
`;
        
        fs.writeFileSync(cssFile, cssContent, 'utf-8');
        log(`     ✓ CSS created!`, 'green');
      } catch (error) {
        results.errors.push({ type: 'page generation', file: page.expectedFile, error: error.message });
        log(`     ✗ Error: ${error.message}`, 'red');
      }
    } else {
      log(`     → Would create: ${page.expectedFile}`, 'blue');
    }
  });
}

//═══════════════════════════════════════════════════════════════════════════════
// Report Generation
//═══════════════════════════════════════════════════════════════════════════════

function generateReport() {
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  📋 REPAIR REPORT', 'cyan');
  log('═══════════════════════════════════════════════════\n', 'cyan');
  
  // Summary
  log('Summary:', 'cyan');
  log(`  Broken Links: ${results.brokenLinks.length}`, 
      results.brokenLinks.length > 0 ? 'yellow' : 'green');
  log(`  Placeholders: ${results.placeholders.length}`,
      results.placeholders.length > 0 ? 'yellow' : 'green');
  log(`  Missing Pages: ${results.missingPages.length}`,
      results.missingPages.length > 0 ? 'yellow' : 'green');
  log(`  Missing Images: ${results.missingImages.length}`,
      results.missingImages.length > 0 ? 'yellow' : 'green');
  log(`  Missing CSS: ${results.missingCSS.length}`,
      results.missingCSS.length > 0 ? 'yellow' : 'green');
  log(`  Fixes Applied: ${results.fixes.length}`, 'green');
  log(`  Errors: ${results.errors.length}`, results.errors.length > 0 ? 'red' : 'green');
  
  // Detailed broken links
  if (results.brokenLinks.length > 0) {
    log('\n🔗 Broken Links:', 'yellow');
    results.brokenLinks.forEach((link, i) => {
      log(`  ${i + 1}. ${link.href}`, 'yellow');
      log(`     File: ${path.relative(process.cwd(), link.file)}:${link.line}`, 'blue');
      log(`     Type: ${link.type}`, 'blue');
    });
  }
  
  // Placeholder details
  if (results.placeholders.length > 0 && config.verbose) {
    log('\n📝 Placeholders Found:', 'yellow');
    results.placeholders.slice(0, 10).forEach((ph, i) => {
      log(`  ${i + 1}. ${ph.type}: "${ph.text}"`, 'yellow');
      log(`     File: ${path.relative(process.cwd(), ph.file)}:${ph.line}`, 'blue');
    });
    if (results.placeholders.length > 10) {
      log(`  ... and ${results.placeholders.length - 10} more`, 'yellow');
    }
  }
  
  // Save detailed report to file
  const reportPath = path.join(__dirname, '../REPAIR_REPORT.md');
  const reportContent = `# Link & Placeholder Repair Report

**Generated**: ${new Date().toISOString()}
**Mode**: ${config.dryRun ? 'Dry Run' : config.autoFix ? 'Auto-Fix' : 'Analysis Only'}

## Summary

- **Broken Links**: ${results.brokenLinks.length}
- **Placeholders**: ${results.placeholders.length}
- **Missing Pages**: ${results.missingPages.length}
- **Missing Images**: ${results.missingImages.length}
- **Missing CSS**: ${results.missingCSS.length}
- **Fixes Applied**: ${results.fixes.length}
- **Errors**: ${results.errors.length}
- **Missing Images**: ${results.missingImages.length}
- **Fixes Applied**: ${results.fixes.length}
- **Errors**: ${results.errors.length}

## Broken Links

${results.brokenLinks.map((link, i) => `${i + 1}. \`${link.href}\`
   - File: \`${path.relative(process.cwd(), link.file)}:${link.line}\`
   - Type: ${link.type}
`).join('\n')}

## Missing Pages

${results.missingPages.map((page, i) => `${i + 1}. Route: \`${page.route}\`
   - Expected File: \`${path.relative(process.cwd(), page.expectedFile)}\`
   - Component: ${page.componentName}
`).join('\n')}

## Placeholders

${results.placeholders.map((ph, i) => `${i + 1}. ${ph.type}: "${ph.text}"
   - File: \`${path.relative(process.cwd(), ph.file)}:${ph.line}\`
`).join('\n')}

## Missing CSS

${results.missingCSS.length > 0 ? results.missingCSS.map((css, i) => `${i + 1}. Page: ${css.page}
   - File: \`${path.relative(process.cwd(), css.file)}\`
   - CSS File: ${css.exists ? '✓ Exists' : '✗ Missing'} (\`${path.relative(process.cwd(), css.cssFile)}\`)
   - Import: ${css.imported ? '✓ Imported' : '✗ Not Imported'}
`).join('\n') : '_No issues found_'}

## Fixes Applied

${results.fixes.map((fix, i) => `${i + 1}. ${fix.type}: ${path.basename(fix.file)}
   ${fix.from ? `- Changed: \`${fix.from}\` → \`${fix.to}\`` : ''}
`).join('\n')}

## Next Steps

${results.brokenLinks.length > 0 ? '- [ ] Review and fix remaining broken links' : ''}
${results.placeholders.length > 0 ? '- [ ] Replace placeholder content with real data' : ''}
${results.missingImages.length > 0 ? '- [ ] Add missing images or update image paths' : ''}
${results.missingCSS.length > 0 ? '- [ ] Create missing CSS files and add imports' : ''}
${results.fixes.length > 0 ? '- [ ] Test all automated fixes' : ''}
${results.errors.length > 0 ? '- [ ] Resolve errors from automated fixes' : ''}
`;
  
  fs.writeFileSync(reportPath, reportContent, 'utf-8');
  log(`\n📄 Detailed report saved: ${reportPath}`, 'green');
  
  // Final status
  const totalIssues = results.brokenLinks.length + results.placeholders.length + 
                      results.missingPages.length + results.missingImages.length +
                      results.missingCSS.length;
  
  if (totalIssues === 0) {
    log('\n✅ No issues found! Site is clean.', 'green');
  } else if (config.dryRun) {
    log(`\n⚠️  Found ${totalIssues} issues. Run without --dry-run to apply fixes.`, 'yellow');
  } else if (config.autoFix) {
    log(`\n✅ Fixed ${results.fixes.length} issues automatically.`, 'green');
    if (totalIssues - results.fixes.length > 0) {
      log(`⚠️  ${totalIssues - results.fixes.length} issues require manual intervention.`, 'yellow');
    }
  } else {
    log(`\n⚠️  Found ${totalIssues} issues. Run with --auto-fix to apply automatic fixes.`, 'yellow');
  }
}

//═══════════════════════════════════════════════════════════════════════════════
// Main Execution
//═══════════════════════════════════════════════════════════════════════════════

function main() {
  log('═══════════════════════════════════════════════════', 'cyan');
  log('  🔧 Link & Placeholder Repair Tool', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  
  if (config.dryRun) {
    log('\n🔍 Running in DRY RUN mode (no changes will be made)', 'yellow');
  }
  
  if (config.autoFix) {
    log('\n🤖 Auto-fix mode enabled', 'green');
  }
  
  // Run analysis
  analyzeLinks();
  analyzePlaceholders();
  analyzeMissingPages();
  analyzeMissingImages();
  validatePageCSS();
  
  // Apply repairs if enabled
  if (config.autoFix && !config.dryRun) {
    repairBrokenLinks();
    generateMissingPages();
  }
  
  // Generate report
  generateReport();
}

// Execute
main();
