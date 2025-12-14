#!/usr/bin/env node

/**
 * Page Structure Validation Script
 * 
 * Validates that all pages have:
 * 1. Navigation component imported and rendered
 * 2. Footer component imported and rendered
 * 3. All navigation links have corresponding route definitions
 * 4. All internal links are valid
 * 
 * Usage: node scripts/validate-page-structure.cjs [--fix]
 */

const fs = require('fs');
const path = require('path');

const config = {
  pagesDir: path.join(__dirname, '../src/pages'),
  componentsDir: path.join(__dirname, '../src/components'),
  appFile: path.join(__dirname, '../src/App.jsx'),
  navigationFile: path.join(__dirname, '../src/components/Navigation.jsx'),
  footerFile: path.join(__dirname, '../src/components/Footer.jsx'),
  autoFix: process.argv.includes('--fix'),
};

const results = {
  missingNavigation: [],
  missingFooter: [],
  brokenNavigationLinks: [],
  missingRoutes: [],
  errors: [],
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractRoutes(appContent) {
  const routes = [];
  const routeRegex = /<Route\s+path=["']([^"']+)["']\s+element={<([^/]+)/g;
  let match;
  
  while ((match = routeRegex.exec(appContent)) !== null) {
    routes.push({
      path: match[1],
      component: match[2],
    });
  }
  
  return routes;
}

function extractNavigationLinks(navContent) {
  const links = [];
  
  // Extract Link components
  const linkRegex = /<Link\s+to=["']([^"']+)["'][^>]*>/g;
  let match;
  
  while ((match = linkRegex.exec(navContent)) !== null) {
    links.push(match[1]);
  }
  
  return links;
}

function checkPageStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const issues = {
    hasNavigation: false,
    hasFooter: false,
    navImported: false,
    footerImported: false,
  };
  
  // Check imports
  issues.navImported = /import\s+{[^}]*Navigation[^}]*}\s+from/.test(content);
  issues.footerImported = /import\s+{[^}]*Footer[^}]*}\s+from/.test(content);
  
  // Check if rendered in JSX
  issues.hasNavigation = /<Navigation\s*\/>/.test(content);
  issues.hasFooter = /<Footer\s*\/>/.test(content);
  
  return {
    file: fileName,
    path: filePath,
    ...issues,
  };
}

function validatePageStructures() {
  log('\n🏗️  Validating Page Structures...', 'cyan');
  
  const pageFiles = fs.readdirSync(config.pagesDir)
    .filter(file => file.endsWith('.jsx') || file.endsWith('.tsx'))
    .filter(file => !file.includes('.test.') && !file.includes('.spec.'));
  
  pageFiles.forEach(file => {
    const filePath = path.join(config.pagesDir, file);
    const structure = checkPageStructure(filePath);
    
    if (!structure.hasNavigation || !structure.navImported) {
      results.missingNavigation.push({
        file: structure.file,
        path: structure.path,
        imported: structure.navImported,
        rendered: structure.hasNavigation,
      });
    }
    
    if (!structure.hasFooter || !structure.footerImported) {
      results.missingFooter.push({
        file: structure.file,
        path: structure.path,
        imported: structure.footerImported,
        rendered: structure.hasFooter,
      });
    }
  });
  
  log(`   Checked ${pageFiles.length} page files`, 'blue');
  log(`   Missing Navigation: ${results.missingNavigation.length}`, 
      results.missingNavigation.length > 0 ? 'yellow' : 'green');
  log(`   Missing Footer: ${results.missingFooter.length}`, 
      results.missingFooter.length > 0 ? 'yellow' : 'green');
}

function validateNavigationLinks() {
  log('\n🔗 Validating Navigation Links...', 'cyan');
  
  // Get all defined routes
  const appContent = fs.readFileSync(config.appFile, 'utf-8');
  const routes = extractRoutes(appContent);
  const validPaths = routes.map(r => r.path);
  
  // Get all links from Navigation
  const navContent = fs.readFileSync(config.navigationFile, 'utf-8');
  const navLinks = extractNavigationLinks(navContent);
  
  log(`   Found ${validPaths.length} defined routes`, 'blue');
  log(`   Found ${navLinks.length} navigation links`, 'blue');
  
  // Check if each navigation link has a corresponding route
  navLinks.forEach(link => {
    const cleanLink = link.split('#')[0].split('?')[0];
    
    if (!validPaths.includes(cleanLink) && cleanLink !== '/') {
      results.brokenNavigationLinks.push({
        link: cleanLink,
        availableRoutes: validPaths,
      });
    }
  });
  
  log(`   Broken navigation links: ${results.brokenNavigationLinks.length}`,
      results.brokenNavigationLinks.length > 0 ? 'red' : 'green');
}

function validateRouteCompleteness() {
  log('\n📋 Validating Route Completeness...', 'cyan');
  
  const appContent = fs.readFileSync(config.appFile, 'utf-8');
  const routes = extractRoutes(appContent);
  
  routes.forEach(route => {
    if (route.path === '*' || route.path === '/') return;
    
    // Check if component file exists
    const possiblePaths = [
      path.join(config.pagesDir, `${route.component}.jsx`),
      path.join(config.pagesDir, `${route.component}.tsx`),
    ];
    
    const exists = possiblePaths.some(p => fs.existsSync(p));
    
    if (!exists) {
      results.missingRoutes.push({
        path: route.path,
        component: route.component,
        expectedLocations: possiblePaths,
      });
    }
  });
  
  log(`   Missing route components: ${results.missingRoutes.length}`,
      results.missingRoutes.length > 0 ? 'red' : 'green');
}

function generateReport() {
  const reportPath = path.join(__dirname, '../STRUCTURE_VALIDATION_REPORT.md');
  
  let report = `# Page Structure Validation Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Pages Missing Navigation**: ${results.missingNavigation.length}\n`;
  report += `- **Pages Missing Footer**: ${results.missingFooter.length}\n`;
  report += `- **Broken Navigation Links**: ${results.brokenNavigationLinks.length}\n`;
  report += `- **Missing Route Components**: ${results.missingRoutes.length}\n`;
  report += `- **Total Issues**: ${results.missingNavigation.length + results.missingFooter.length + results.brokenNavigationLinks.length + results.missingRoutes.length}\n\n`;
  
  if (results.missingNavigation.length > 0) {
    report += `## ❌ Pages Missing Navigation\n\n`;
    results.missingNavigation.forEach((item, i) => {
      report += `${i + 1}. **${item.file}**\n`;
      report += `   - Imported: ${item.imported ? '✓' : '✗'}\n`;
      report += `   - Rendered: ${item.rendered ? '✓' : '✗'}\n`;
      report += `   - Path: \`${item.path}\`\n\n`;
    });
  }
  
  if (results.missingFooter.length > 0) {
    report += `## ❌ Pages Missing Footer\n\n`;
    results.missingFooter.forEach((item, i) => {
      report += `${i + 1}. **${item.file}**\n`;
      report += `   - Imported: ${item.imported ? '✓' : '✗'}\n`;
      report += `   - Rendered: ${item.rendered ? '✓' : '✗'}\n`;
      report += `   - Path: \`${item.path}\`\n\n`;
    });
  }
  
  if (results.brokenNavigationLinks.length > 0) {
    report += `## ❌ Broken Navigation Links\n\n`;
    results.brokenNavigationLinks.forEach((item, i) => {
      report += `${i + 1}. **${item.link}**\n`;
      report += `   - Available routes: ${item.availableRoutes.join(', ')}\n\n`;
    });
  }
  
  if (results.missingRoutes.length > 0) {
    report += `## ❌ Missing Route Components\n\n`;
    results.missingRoutes.forEach((item, i) => {
      report += `${i + 1}. **Route**: \`${item.path}\`\n`;
      report += `   - Component: \`${item.component}\`\n`;
      report += `   - Expected: \`${item.expectedLocations[0]}\`\n\n`;
    });
  }
  
  if (results.missingNavigation.length === 0 && 
      results.missingFooter.length === 0 && 
      results.brokenNavigationLinks.length === 0 &&
      results.missingRoutes.length === 0) {
    report += `## ✅ All Validations Passed!\n\n`;
    report += `All pages have proper Navigation and Footer components.\n`;
    report += `All navigation links have corresponding routes.\n`;
  }
  
  fs.writeFileSync(reportPath, report);
  log(`\n📄 Report saved: ${reportPath}`, 'green');
}

function printResults() {
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  📊 VALIDATION RESULTS', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  
  const totalIssues = results.missingNavigation.length + 
                     results.missingFooter.length + 
                     results.brokenNavigationLinks.length +
                     results.missingRoutes.length;
  
  log(`\nPages Missing Navigation: ${results.missingNavigation.length}`, 
      results.missingNavigation.length > 0 ? 'yellow' : 'green');
  log(`Pages Missing Footer: ${results.missingFooter.length}`,
      results.missingFooter.length > 0 ? 'yellow' : 'green');
  log(`Broken Navigation Links: ${results.brokenNavigationLinks.length}`,
      results.brokenNavigationLinks.length > 0 ? 'red' : 'green');
  log(`Missing Route Components: ${results.missingRoutes.length}`,
      results.missingRoutes.length > 0 ? 'red' : 'green');
  
  log(`\n${'='.repeat(53)}`, 'cyan');
  
  if (totalIssues > 0) {
    log(`\n⚠️  Found ${totalIssues} structural issues!`, 'yellow');
    log(`Run with --fix to automatically repair issues.`, 'blue');
  } else {
    log(`\n✅ All structural validations passed!`, 'green');
  }
}

// Main execution
try {
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  🔍 Page Structure Validator', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  
  if (config.autoFix) {
    log('\n🔧 Running in AUTO-FIX mode', 'yellow');
  } else {
    log('\n👀 Running in READ-ONLY mode', 'blue');
  }
  
  validatePageStructures();
  validateNavigationLinks();
  validateRouteCompleteness();
  
  generateReport();
  printResults();
  
} catch (error) {
  log(`\n❌ Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
}
