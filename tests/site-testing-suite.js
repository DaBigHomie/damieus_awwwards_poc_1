/**
 * Comprehensive Site Testing Suite
 * Tests: Performance, Click-through, Scroll, Responsive, Accessibility
 * 
 * Install dependencies:
 * npm install --save-dev playwright lighthouse chrome-launcher pa11y
 */

import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import pa11y from 'pa11y';
import { writeFileSync } from 'fs';

const SITE_URL = 'https://showcase.damieus.app';
const RESULTS_DIR = './test-results';

// Test Configuration
const config = {
  routes: [
    '/',
    '/about',
    '/services',
    '/services/artificial-intelligence',
    '/services/web-development',
    '/services/cloud-solutions',
    '/work',
    '/gallery',
    '/contact',
  ],
  viewports: [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ],
  performanceThresholds: {
    performanceScore: 80,
    accessibilityScore: 90,
    bestPracticesScore: 85,
    seoScore: 90,
    fcp: 1800, // First Contentful Paint (ms)
    lcp: 2500, // Largest Contentful Paint (ms)
    cls: 0.1,  // Cumulative Layout Shift
    tti: 3500, // Time to Interactive (ms)
  },
};

// ============================================
// 1. PERFORMANCE TESTING (Lighthouse)
// ============================================
async function runPerformanceTests() {
  console.log('\n🚀 Running Performance Tests (Lighthouse)...\n');
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const results = {};
  
  for (const route of config.routes) {
    const url = `${SITE_URL}${route}`;
    console.log(`Testing: ${url}`);
    
    try {
      const runnerResult = await lighthouse(url, options);
      const { lhr } = runnerResult;
      
      results[route] = {
        url,
        scores: {
          performance: Math.round(lhr.categories.performance.score * 100),
          accessibility: Math.round(lhr.categories.accessibility.score * 100),
          bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
          seo: Math.round(lhr.categories.seo.score * 100),
        },
        metrics: {
          fcp: lhr.audits['first-contentful-paint'].numericValue,
          lcp: lhr.audits['largest-contentful-paint'].numericValue,
          cls: lhr.audits['cumulative-layout-shift'].numericValue,
          tti: lhr.audits['interactive'].numericValue,
          speedIndex: lhr.audits['speed-index'].numericValue,
          totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
        },
        passed: lhr.categories.performance.score >= config.performanceThresholds.performanceScore / 100,
      };
      
      console.log(`  ✓ Performance: ${results[route].scores.performance}/100`);
      console.log(`  ✓ Accessibility: ${results[route].scores.accessibility}/100`);
      console.log(`  ✓ FCP: ${Math.round(results[route].metrics.fcp)}ms`);
      console.log(`  ✓ LCP: ${Math.round(results[route].metrics.lcp)}ms\n`);
      
    } catch (error) {
      console.error(`  ✗ Error testing ${url}:`, error.message);
      results[route] = { error: error.message };
    }
  }
  
  await chrome.kill();
  
  // Save results
  writeFileSync(
    `${RESULTS_DIR}/performance-results.json`,
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

// ============================================
// 2. CLICK-THROUGH TESTING (Navigation)
// ============================================
async function runClickThroughTests() {
  console.log('\n🖱️  Running Click-Through Tests...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
  };
  
  try {
    // Test 1: Navigation Menu Links
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    const navLinks = await page.locator('nav .nav-item').all();
    console.log(`Found ${navLinks.length} navigation links`);
    
    for (let i = 0; i < navLinks.length; i++) {
      const link = navLinks[i];
      const text = await link.textContent();
      
      try {
        await link.click();
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        const currentUrl = page.url();
        
        results.tests.push({
          test: 'Navigation Link',
          element: text.trim(),
          status: 'passed',
          url: currentUrl,
          loadTime: await page.evaluate(() => performance.timing.loadEventEnd - performance.timing.navigationStart),
        });
        
        console.log(`  ✓ ${text.trim()} → ${currentUrl}`);
        
        // Go back for next test
        await page.goto(SITE_URL);
        await page.waitForLoadState('networkidle');
      } catch (error) {
        results.tests.push({
          test: 'Navigation Link',
          element: text.trim(),
          status: 'failed',
          error: error.message,
        });
        console.log(`  ✗ ${text.trim()} - ${error.message}`);
      }
    }
    
    // Test 2: Mega Menu (Services)
    console.log('\nTesting Mega Menu...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    // Click Services to open mega menu
    await page.click('nav button:has-text("Services")');
    await page.waitForTimeout(500); // Wait for animation
    
    const megaMenuVisible = await page.locator('.mega-menu.active').isVisible();
    results.tests.push({
      test: 'Mega Menu Open',
      status: megaMenuVisible ? 'passed' : 'failed',
    });
    console.log(`  ${megaMenuVisible ? '✓' : '✗'} Mega Menu Opens`);
    
    // Test service cards in mega menu
    const serviceCards = await page.locator('.mega-menu-item').all();
    console.log(`  Found ${serviceCards.length} service cards`);
    
    if (serviceCards.length > 0) {
      const firstCard = serviceCards[0];
      await firstCard.click();
      await page.waitForLoadState('networkidle');
      const serviceUrl = page.url();
      
      results.tests.push({
        test: 'Mega Menu Service Card',
        status: serviceUrl.includes('/services/') ? 'passed' : 'failed',
        url: serviceUrl,
      });
      console.log(`  ${serviceUrl.includes('/services/') ? '✓' : '✗'} Service card navigation → ${serviceUrl}`);
    }
    
    // Test 3: Footer Links
    console.log('\nTesting Footer Links...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    const footerLinks = await page.locator('footer a').all();
    console.log(`  Found ${footerLinks.length} footer links`);
    
    for (let i = 0; i < Math.min(footerLinks.length, 5); i++) {
      const link = footerLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      
      if (href && href.startsWith('/')) {
        try {
          await link.click();
          await page.waitForLoadState('networkidle', { timeout: 3000 });
          results.tests.push({
            test: 'Footer Link',
            element: text.trim(),
            status: 'passed',
            url: page.url(),
          });
          console.log(`  ✓ ${text.trim()}`);
          await page.goto(SITE_URL);
        } catch (error) {
          results.tests.push({
            test: 'Footer Link',
            element: text.trim(),
            status: 'failed',
            error: error.message,
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Click-through test error:', error);
    results.error = error.message;
  } finally {
    await browser.close();
  }
  
  writeFileSync(
    `${RESULTS_DIR}/clickthrough-results.json`,
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

// ============================================
// 3. SCROLL TESTING (Smooth scroll, animations)
// ============================================
async function runScrollTests() {
  console.log('\n📜 Running Scroll Tests...\n');
  
  const browser = await chromium.launch({ headless: false }); // Visual feedback
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
  };
  
  await page.goto(SITE_URL);
  await page.waitForLoadState('networkidle');
  
  // Test 1: Scroll behavior
  console.log('Testing scroll behavior...');
  const initialScroll = await page.evaluate(() => window.scrollY);
  
  await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'smooth' }));
  await page.waitForTimeout(1000);
  
  const afterScroll = await page.evaluate(() => window.scrollY);
  results.tests.push({
    test: 'Smooth Scroll',
    status: afterScroll > initialScroll ? 'passed' : 'failed',
    scrolled: `${initialScroll}px → ${afterScroll}px`,
  });
  console.log(`  ${afterScroll > initialScroll ? '✓' : '✗'} Smooth scroll: ${initialScroll}px → ${afterScroll}px`);
  
  // Test 2: Check for scroll animations (fade-in, etc.)
  console.log('\nTesting scroll animations...');
  await page.goto(SITE_URL);
  await page.waitForLoadState('networkidle');
  
  const animations = await page.evaluate(() => {
    const elements = document.querySelectorAll('[class*="fade"], [class*="animate"]');
    return elements.length;
  });
  
  results.tests.push({
    test: 'Animated Elements',
    count: animations,
    status: animations > 0 ? 'passed' : 'info',
  });
  console.log(`  Found ${animations} animated elements`);
  
  // Test 3: Scroll to bottom
  console.log('\nTesting full page scroll...');
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  
  const finalScroll = await page.evaluate(() => window.scrollY);
  results.tests.push({
    test: 'Scroll to Bottom',
    status: finalScroll > (scrollHeight * 0.8) ? 'passed' : 'failed',
    scrollHeight,
    finalPosition: finalScroll,
  });
  console.log(`  ${finalScroll > (scrollHeight * 0.8) ? '✓' : '✗'} Scrolled to bottom (${finalScroll}/${scrollHeight}px)`);
  
  // Test 4: Check for scroll jank/layout shift
  console.log('\nChecking for layout shifts during scroll...');
  await page.goto(SITE_URL);
  await page.waitForLoadState('networkidle');
  
  const cls = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      
      setTimeout(() => {
        observer.disconnect();
        resolve(clsValue);
      }, 3000);
    });
  });
  
  results.tests.push({
    test: 'Cumulative Layout Shift',
    cls,
    status: cls < 0.1 ? 'passed' : (cls < 0.25 ? 'warning' : 'failed'),
    threshold: 0.1,
  });
  console.log(`  ${cls < 0.1 ? '✓' : '⚠️'} CLS: ${cls.toFixed(4)} (threshold: 0.1)`);
  
  await browser.close();
  
  writeFileSync(
    `${RESULTS_DIR}/scroll-results.json`,
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

// ============================================
// 4. RESPONSIVE DESIGN TESTING
// ============================================
async function runResponsiveTests() {
  console.log('\n📱 Running Responsive Design Tests...\n');
  
  const browser = await chromium.launch({ headless: true });
  const results = {
    timestamp: new Date().toISOString(),
    viewports: [],
  };
  
  for (const viewport of config.viewports) {
    console.log(`Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);
    
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    
    const viewportResults = {
      name: viewport.name,
      size: `${viewport.width}x${viewport.height}`,
      tests: [],
    };
    
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    // Test 1: Page renders without horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    viewportResults.tests.push({
      test: 'No Horizontal Scroll',
      status: !hasHorizontalScroll ? 'passed' : 'failed',
    });
    console.log(`  ${!hasHorizontalScroll ? '✓' : '✗'} No horizontal scroll`);
    
    // Test 2: Navigation is accessible
    const navVisible = await page.locator('nav').isVisible();
    viewportResults.tests.push({
      test: 'Navigation Visible',
      status: navVisible ? 'passed' : 'failed',
    });
    console.log(`  ${navVisible ? '✓' : '✗'} Navigation visible`);
    
    // Test 3: Content readability (font sizes)
    const minFontSize = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, span, li');
      let min = 100;
      elements.forEach(el => {
        const size = parseFloat(window.getComputedStyle(el).fontSize);
        if (size < min) min = size;
      });
      return min;
    });
    
    const fontSizeOk = viewport.name === 'Mobile' ? minFontSize >= 14 : minFontSize >= 16;
    viewportResults.tests.push({
      test: 'Readable Font Sizes',
      minFontSize: `${minFontSize}px`,
      status: fontSizeOk ? 'passed' : 'warning',
    });
    console.log(`  ${fontSizeOk ? '✓' : '⚠️'} Min font size: ${minFontSize}px`);
    
    // Test 4: Touch targets (mobile)
    if (viewport.name === 'Mobile') {
      const smallTargets = await page.evaluate(() => {
        const links = document.querySelectorAll('a, button');
        let count = 0;
        links.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) count++;
        });
        return count;
      });
      
      viewportResults.tests.push({
        test: 'Touch Target Size',
        smallTargets,
        status: smallTargets === 0 ? 'passed' : 'warning',
      });
      console.log(`  ${smallTargets === 0 ? '✓' : '⚠️'} ${smallTargets} small touch targets`);
    }
    
    // Screenshot
    await page.screenshot({
      path: `${RESULTS_DIR}/screenshot-${viewport.name.toLowerCase()}.png`,
      fullPage: false,
    });
    console.log(`  ✓ Screenshot saved\n`);
    
    results.viewports.push(viewportResults);
    await context.close();
  }
  
  await browser.close();
  
  writeFileSync(
    `${RESULTS_DIR}/responsive-results.json`,
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

// ============================================
// 5. ACCESSIBILITY TESTING (Pa11y)
// ============================================
async function runAccessibilityTests() {
  console.log('\n♿ Running Accessibility Tests (WCAG 2.1 AA)...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    routes: [],
  };
  
  for (const route of config.routes.slice(0, 5)) { // Test first 5 pages
    const url = `${SITE_URL}${route}`;
    console.log(`Testing: ${url}`);
    
    try {
      const testResults = await pa11y(url, {
        standard: 'WCAG2AA',
        includeNotices: false,
        includeWarnings: true,
      });
      
      results.routes.push({
        url,
        errors: testResults.issues.filter(i => i.type === 'error').length,
        warnings: testResults.issues.filter(i => i.type === 'warning').length,
        notices: testResults.issues.filter(i => i.type === 'notice').length,
        issues: testResults.issues.slice(0, 10), // Top 10 issues
        status: testResults.issues.filter(i => i.type === 'error').length === 0 ? 'passed' : 'failed',
      });
      
      console.log(`  ${testResults.issues.filter(i => i.type === 'error').length === 0 ? '✓' : '✗'} Errors: ${testResults.issues.filter(i => i.type === 'error').length}`);
      console.log(`  ⚠️  Warnings: ${testResults.issues.filter(i => i.type === 'warning').length}\n`);
      
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}\n`);
      results.routes.push({ url, error: error.message });
    }
  }
  
  writeFileSync(
    `${RESULTS_DIR}/accessibility-results.json`,
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  DAMIEUS SHOWCASE - TEST SUITE        ║');
  console.log('║  URL: showcase.damieus.app             ║');
  console.log('╚════════════════════════════════════════╝');
  
  // Create results directory
  import('fs').then(fs => {
    if (!fs.existsSync(RESULTS_DIR)) {
      fs.mkdirSync(RESULTS_DIR, { recursive: true });
    }
  });
  
  const startTime = Date.now();
  
  try {
    // Run all tests
    const performanceResults = await runPerformanceTests();
    const clickThroughResults = await runClickThroughTests();
    const scrollResults = await runScrollTests();
    const responsiveResults = await runResponsiveTests();
    const accessibilityResults = await runAccessibilityTests();
    
    // Generate summary report
    const summary = {
      timestamp: new Date().toISOString(),
      duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      performance: {
        avgScore: Object.values(performanceResults)
          .filter(r => r.scores)
          .reduce((sum, r) => sum + r.scores.performance, 0) / config.routes.length,
        passed: Object.values(performanceResults).filter(r => r.passed).length,
        total: config.routes.length,
      },
      clickThrough: {
        passed: clickThroughResults.tests.filter(t => t.status === 'passed').length,
        failed: clickThroughResults.tests.filter(t => t.status === 'failed').length,
        total: clickThroughResults.tests.length,
      },
      scroll: {
        passed: scrollResults.tests.filter(t => t.status === 'passed').length,
        warnings: scrollResults.tests.filter(t => t.status === 'warning').length,
        total: scrollResults.tests.length,
      },
      responsive: {
        viewportsTested: config.viewports.length,
        allPassed: responsiveResults.viewports.every(v => 
          v.tests.every(t => t.status === 'passed')
        ),
      },
      accessibility: {
        pagesWithErrors: accessibilityResults.routes.filter(r => r.errors > 0).length,
        totalErrors: accessibilityResults.routes.reduce((sum, r) => sum + (r.errors || 0), 0),
        totalWarnings: accessibilityResults.routes.reduce((sum, r) => sum + (r.warnings || 0), 0),
      },
    };
    
    writeFileSync(
      `${RESULTS_DIR}/test-summary.json`,
      JSON.stringify(summary, null, 2)
    );
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  TEST SUMMARY                          ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`⏱️  Duration: ${summary.duration}`);
    console.log(`\n📊 Performance: ${summary.performance.avgScore.toFixed(1)}/100 avg`);
    console.log(`   ${summary.performance.passed}/${summary.performance.total} pages passed`);
    console.log(`\n🖱️  Click-Through: ${summary.clickThrough.passed}/${summary.clickThrough.total} passed`);
    console.log(`\n📜 Scroll: ${summary.scroll.passed}/${summary.scroll.total} passed`);
    console.log(`\n📱 Responsive: ${summary.responsive.viewportsTested} viewports tested`);
    console.log(`\n♿ Accessibility: ${summary.accessibility.totalErrors} errors, ${summary.accessibility.totalWarnings} warnings`);
    console.log(`\n✅ Results saved to: ${RESULTS_DIR}/`);
    
    return summary;
    
  } catch (error) {
    console.error('\n❌ Test suite error:', error);
    throw error;
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export {
  runAllTests,
  runPerformanceTests,
  runClickThroughTests,
  runScrollTests,
  runResponsiveTests,
  runAccessibilityTests,
};
