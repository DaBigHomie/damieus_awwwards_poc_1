#!/usr/bin/env node
/**
 * Playwright-based Browser Test
 * Tests SPA routing, click-through, and performance
 * 
 * Install: npm install --save-dev playwright
 * Run: npm run test:browser
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://showcase.damieus.app';

console.log('╔════════════════════════════════════════╗');
console.log('║  BROWSER TEST SUITE                    ║');
console.log('║  showcase.damieus.app                  ║');
console.log('╚════════════════════════════════════════╝\n');

async function runBrowserTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
  };
  
  try {
    // Test 1: Homepage loads
    console.log('1️⃣  Testing Homepage...');
    const startTime = Date.now();
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    const title = await page.title();
    const hasNav = await page.locator('nav').isVisible();
    const hasHero = await page.locator('header, .hero').isVisible();
    
    results.tests.push({
      name: 'Homepage Load',
      passed: hasNav && hasHero,
      loadTime: `${loadTime}ms`,
      title,
    });
    
    console.log(`   ${hasNav && hasHero ? '✓' : '✗'} Page loaded (${loadTime}ms)`);
    console.log(`   Title: ${title}`);
    console.log(`   ${hasNav ? '✓' : '✗'} Navigation present`);
    console.log(`   ${hasHero ? '✓' : '✗'} Hero section present\n`);
    
    // Test 2: Navigation Links
    console.log('2️⃣  Testing Navigation Links...');
    const navLinks = await page.locator('nav a, nav button').all();
    console.log(`   Found ${navLinks.length} navigation items`);
    
    for (const link of navLinks.slice(0, 5)) {
      const text = await link.textContent();
      const cleanText = text.trim().replace(/\s+/g, ' ');
      
      try {
        await link.click({ timeout: 3000 });
        await page.waitForTimeout(500);
        const currentUrl = page.url();
        
        results.tests.push({
          name: `Nav Link: ${cleanText}`,
          passed: true,
          url: currentUrl,
        });
        
        console.log(`   ✓ ${cleanText} → ${currentUrl}`);
      } catch (error) {
        results.tests.push({
          name: `Nav Link: ${cleanText}`,
          passed: false,
          error: error.message,
        });
        console.log(`   ✗ ${cleanText} - ${error.message}`);
      }
      
      await page.goto(SITE_URL);
    }
    
    // Test 3: Mega Menu (Services)
    console.log('\n3️⃣  Testing Mega Menu...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    const servicesBtn = page.locator('nav button:has-text("Services")');
    if (await servicesBtn.count() > 0) {
      await servicesBtn.click();
      await page.waitForTimeout(500);
      
      const megaMenuVisible = await page.locator('.mega-menu.active').isVisible();
      const serviceCards = await page.locator('.mega-menu-item').count();
      
      results.tests.push({
        name: 'Mega Menu',
        passed: megaMenuVisible && serviceCards > 0,
        serviceCards,
      });
      
      console.log(`   ${megaMenuVisible ? '✓' : '✗'} Mega menu opens`);
      console.log(`   ${serviceCards > 0 ? '✓' : '✗'} Service cards visible (${serviceCards} found)`);
      
      // Click first service card
      if (serviceCards > 0) {
        await page.locator('.mega-menu-item').first().click();
        await page.waitForLoadState('networkidle');
        const serviceUrl = page.url();
        const isServicePage = serviceUrl.includes('/services/');
        
        results.tests.push({
          name: 'Service Page Navigation',
          passed: isServicePage,
          url: serviceUrl,
        });
        
        console.log(`   ${isServicePage ? '✓' : '✗'} Service page loaded: ${serviceUrl}`);
      }
    } else {
      console.log('   ⚠️  Services button not found');
    }
    
    // Test 4: Page Sections (Home)
    console.log('\n4️⃣  Testing Page Sections...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    const sections = {
      navigation: await page.locator('nav').isVisible(),
      hero: await page.locator('header, .hero').isVisible(),
      services: await page.locator('.services, section:has(.card)').isVisible(),
      about: await page.locator('.about, section:has-text("About")').isVisible(),
      footer: await page.locator('footer').isVisible(),
    };
    
    Object.entries(sections).forEach(([name, visible]) => {
      console.log(`   ${visible ? '✓' : '✗'} ${name.charAt(0).toUpperCase() + name.slice(1)} section`);
      results.tests.push({
        name: `Section: ${name}`,
        passed: visible,
      });
    });
    
    // Test 5: Scroll Behavior
    console.log('\n5️⃣  Testing Scroll Behavior...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    const initialScroll = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    const afterScroll = await page.evaluate(() => window.scrollY);
    
    results.tests.push({
      name: 'Smooth Scroll',
      passed: afterScroll > initialScroll,
      scrolled: `${initialScroll}px → ${afterScroll}px`,
    });
    
    console.log(`   ${afterScroll > initialScroll ? '✓' : '✗'} Scroll works (${initialScroll}px → ${afterScroll}px)`);
    
    // Test 6: Performance Metrics
    console.log('\n6️⃣  Collecting Performance Metrics...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: Math.round(perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart),
        loadComplete: Math.round(perf.loadEventEnd - perf.loadEventStart),
        domInteractive: Math.round(perf.domInteractive - perf.fetchStart),
        transferSize: Math.round(perf.transferSize / 1024),
      };
    });
    
    results.tests.push({
      name: 'Performance Metrics',
      passed: metrics.domInteractive < 3000,
      metrics,
    });
    
    console.log(`   DOMContentLoaded: ${metrics.domContentLoaded}ms`);
    console.log(`   Load Complete: ${metrics.loadComplete}ms`);
    console.log(`   DOM Interactive: ${metrics.domInteractive}ms`);
    console.log(`   Transfer Size: ${metrics.transferSize}KB`);
    
    // Test 7: Responsive Design
    console.log('\n7️⃣  Testing Responsive Design...');
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(SITE_URL);
      await page.waitForLoadState('networkidle');
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      
      results.tests.push({
        name: `Responsive: ${viewport.name}`,
        passed: !hasHorizontalScroll,
        viewport: `${viewport.width}x${viewport.height}`,
      });
      
      console.log(`   ${!hasHorizontalScroll ? '✓' : '✗'} ${viewport.name} (${viewport.width}x${viewport.height}) - No horizontal scroll`);
    }
    
    // Test 8: Image Loading
    console.log('\n8️⃣  Testing Image Loading...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');
    
    const images = await page.locator('img').all();
    let loadedImages = 0;
    let brokenImages = 0;
    
    for (const img of images.slice(0, 10)) {
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      
      if (naturalWidth > 0) {
        loadedImages++;
      } else {
        brokenImages++;
        console.log(`   ⚠️  Broken image: ${src}`);
      }
    }
    
    results.tests.push({
      name: 'Image Loading',
      passed: brokenImages === 0,
      loaded: loadedImages,
      broken: brokenImages,
      total: Math.min(images.length, 10),
    });
    
    console.log(`   ${loadedImages}/${Math.min(images.length, 10)} images loaded successfully`);
    if (brokenImages > 0) console.log(`   ⚠️  ${brokenImages} broken images`);
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    results.error = error.message;
  } finally {
    await browser.close();
  }
  
  // Summary
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  TEST SUMMARY                          ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const passed = results.tests.filter(t => t.passed).length;
  const failed = results.tests.filter(t => !t.passed).length;
  const total = results.tests.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${failed}/${total}`);
  console.log(`📊 Success Rate: ${Math.round((passed / total) * 100)}%`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Site is working great!');
  } else if (passed / total > 0.8) {
    console.log('\n✅ Most tests passed. Review failed tests for minor improvements.');
  } else {
    console.log('\n⚠️  Several tests failed. Review issues above.');
  }
  
  // Save results
  import('fs').then(fs => {
    fs.writeFileSync(
      'test-results/browser-test-results.json',
      JSON.stringify(results, null, 2)
    );
    console.log('\n📄 Results saved to: test-results/browser-test-results.json');
  });
  
  return results;
}

// Run tests
runBrowserTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
