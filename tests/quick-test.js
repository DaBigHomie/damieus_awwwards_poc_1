#!/usr/bin/env node
/**
 * Quick Site Test - Fast check of critical functionality
 * No external dependencies required
 */

import https from 'https';
import { performance } from 'perf_hooks';

const SITE_URL = 'https://showcase.damieus.app';
const TIMEOUT = 10000;

const routes = [
  '/',
  '/about',
  '/services',
  '/services/artificial-intelligence',
  '/work',
  '/gallery',
  '/contact',
];

console.log('╔════════════════════════════════════════╗');
console.log('║  QUICK SITE TEST                       ║');
console.log('║  showcase.damieus.app                  ║');
console.log('╚════════════════════════════════════════╝\n');

async function testRoute(route) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const url = new URL(route, SITE_URL);
    
    const req = https.get(url, { timeout: TIMEOUT }, (res) => {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const result = {
          route,
          status: res.statusCode,
          duration,
          size: Buffer.byteLength(data, 'utf8'),
          contentType: res.headers['content-type'],
          cacheControl: res.headers['cache-control'],
          passed: res.statusCode === 200,
        };
        
        // Check for critical elements
        if (res.statusCode === 200) {
          result.hasTitle = data.includes('<title>');
          result.hasNav = data.includes('<nav') || data.includes('class="nav');
          result.hasContent = data.length > 5000;
        }
        
        resolve(result);
      });
    });
    
    req.on('error', (error) => {
      resolve({
        route,
        status: 0,
        error: error.message,
        passed: false,
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        route,
        status: 0,
        error: 'Request timeout',
        passed: false,
      });
    });
  });
}

async function runQuickTests() {
  const results = [];
  let passed = 0;
  let failed = 0;
  
  console.log('Testing routes...\n');
  
  for (const route of routes) {
    const result = await testRoute(route);
    results.push(result);
    
    const icon = result.passed ? '✓' : '✗';
    const status = result.passed ? `${result.status}` : `${result.status || 'ERR'}`;
    const time = result.duration ? `${result.duration}ms` : 'timeout';
    const size = result.size ? `${(result.size / 1024).toFixed(1)}KB` : '-';
    
    console.log(`${icon} ${route.padEnd(40)} ${status.padEnd(5)} ${time.padEnd(8)} ${size}`);
    
    if (result.passed) {
      passed++;
      if (!result.hasTitle) console.log(`  ⚠️  Missing <title> tag`);
      if (!result.hasNav) console.log(`  ⚠️  Missing navigation`);
      if (!result.hasContent) console.log(`  ⚠️  Content seems too small`);
    } else {
      failed++;
      if (result.error) console.log(`  Error: ${result.error}`);
    }
  }
  
  // Summary
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  RESULTS                               ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const avgDuration = results
    .filter(r => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration).length;
  
  const totalSize = results
    .filter(r => r.size)
    .reduce((sum, r) => sum + r.size, 0);
  
  console.log(`✅ Passed: ${passed}/${routes.length}`);
  console.log(`❌ Failed: ${failed}/${routes.length}`);
  console.log(`⏱️  Avg Response: ${Math.round(avgDuration)}ms`);
  console.log(`📦 Total Size: ${(totalSize / 1024).toFixed(1)}KB`);
  
  // Performance rating
  let rating = 'Excellent';
  if (avgDuration > 500) rating = 'Good';
  if (avgDuration > 1000) rating = 'Fair';
  if (avgDuration > 2000) rating = 'Poor';
  
  console.log(`\n🎯 Performance Rating: ${rating}`);
  
  // Recommendations
  console.log('\n📝 Quick Checks:');
  const allHaveTitle = results.every(r => r.hasTitle !== false);
  const allHaveNav = results.every(r => r.hasNav !== false);
  const allCached = results.every(r => r.cacheControl);
  
  console.log(`   ${allHaveTitle ? '✓' : '✗'} All pages have <title> tags`);
  console.log(`   ${allHaveNav ? '✓' : '✗'} All pages have navigation`);
  console.log(`   ${allCached ? '✓' : '✗'} Cache headers present`);
  console.log(`   ${passed === routes.length ? '✓' : '✗'} All routes accessible`);
  
  if (passed === routes.length && avgDuration < 1000) {
    console.log('\n🎉 Site is performing well!');
  } else if (failed > 0) {
    console.log('\n⚠️  Some issues detected - review failed routes above');
  }
  
  return { passed, failed, avgDuration, results };
}

// Run tests
runQuickTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Test error:', error);
    process.exit(1);
  });
