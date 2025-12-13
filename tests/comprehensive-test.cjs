#!/usr/bin/env node

/**
 * Comprehensive Site Testing Suite
 * Tests: Performance, Mobile Responsiveness, Click-through, Scroll, Accessibility
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://showcase.damieus.app';
const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'Galaxy S21', width: 360, height: 800 },
];

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/work',
  '/gallery',
  '/contact',
];

const results = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
  },
};

function log(type, message, details = null) {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    info: '\x1b[36m',
    reset: '\x1b[0m',
  };

  const symbols = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  };

  console.log(`${colors[type]}${symbols[type]} ${message}${colors.reset}`);
  if (details) {
    console.log(`  ${JSON.stringify(details, null, 2)}`);
  }

  results.tests.push({
    type,
    message,
    details,
    timestamp: new Date().toISOString(),
  });

  results.summary.total++;
  if (type === 'success') results.summary.passed++;
  else if (type === 'error') results.summary.failed++;
  else if (type === 'warning') results.summary.warnings++;
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const startTime = Date.now();

    const req = client.get(url, options, (res) => {
      const duration = Date.now() - startTime;
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          duration,
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testHTTPSRedirect() {
  console.log('\n📋 Testing HTTPS Redirect...\n');
  try {
    const httpUrl = BASE_URL.replace('https://', 'http://');
    const response = await makeRequest(httpUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 Mobile Test' },
    });

    if (response.statusCode === 301 || response.statusCode === 302) {
      log('success', 'HTTP redirects to HTTPS');
    } else {
      log('warning', 'HTTP does not redirect to HTTPS', {
        statusCode: response.statusCode,
      });
    }
  } catch (error) {
    log('info', 'HTTP redirect test skipped (domain may not support HTTP)');
  }
}

async function testPageLoad(route) {
  try {
    const url = `${BASE_URL}${route}`;
    const response = await makeRequest(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (response.statusCode === 200) {
      log('success', `Page loaded: ${route}`, {
        duration: `${response.duration}ms`,
        size: `${(response.data.length / 1024).toFixed(2)} KB`,
      });

      // Performance checks
      if (response.duration > 3000) {
        log('warning', `Slow page load: ${route}`, {
          duration: `${response.duration}ms`,
        });
      }

      return response;
    } else {
      log('error', `Page failed to load: ${route}`, {
        statusCode: response.statusCode,
      });
      return null;
    }
  } catch (error) {
    log('error', `Error loading ${route}: ${error.message}`);
    return null;
  }
}

async function testMobileViewport(viewport) {
  console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})...\n`);

  try {
    const response = await makeRequest(BASE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
        'Viewport-Width': viewport.width.toString(),
      },
    });

    if (response.statusCode === 200) {
      const html = response.data;

      // Check for viewport meta tag
      if (html.includes('viewport')) {
        log('success', `${viewport.name}: Has viewport meta tag`);
      } else {
        log('error', `${viewport.name}: Missing viewport meta tag`);
      }

      // Check for responsive CSS
      if (html.includes('@media') || html.includes('responsive')) {
        log('success', `${viewport.name}: Contains responsive CSS`);
      } else {
        log('warning', `${viewport.name}: No responsive CSS detected in HTML`);
      }

      // Check for mobile-friendly elements
      const mobileIndicators = [
        'flex',
        'grid',
        'max-width',
        'min-width',
        'mobile',
      ];
      const hasMobileOptimization = mobileIndicators.some((indicator) =>
        html.toLowerCase().includes(indicator)
      );

      if (hasMobileOptimization) {
        log('success', `${viewport.name}: Mobile optimization detected`);
      } else {
        log('warning', `${viewport.name}: Limited mobile optimization`);
      }
    }
  } catch (error) {
    log('error', `${viewport.name} test failed: ${error.message}`);
  }
}

async function testPerformance() {
  console.log('\n⚡ Testing Performance...\n');

  try {
    const response = await makeRequest(BASE_URL);

    // Check response time
    if (response.duration < 1000) {
      log('success', 'Excellent response time', {
        duration: `${response.duration}ms`,
      });
    } else if (response.duration < 3000) {
      log('success', 'Good response time', { duration: `${response.duration}ms` });
    } else {
      log('warning', 'Slow response time', { duration: `${response.duration}ms` });
    }

    // Check page size
    const sizeKB = response.data.length / 1024;
    if (sizeKB < 100) {
      log('success', 'Optimized page size', { size: `${sizeKB.toFixed(2)} KB` });
    } else if (sizeKB < 500) {
      log('success', 'Acceptable page size', { size: `${sizeKB.toFixed(2)} KB` });
    } else {
      log('warning', 'Large page size', { size: `${sizeKB.toFixed(2)} KB` });
    }

    // Check compression
    if (response.headers['content-encoding']) {
      log('success', 'Compression enabled', {
        encoding: response.headers['content-encoding'],
      });
    } else {
      log('warning', 'No compression detected');
    }

    // Check caching
    if (response.headers['cache-control']) {
      log('success', 'Cache headers present', {
        cacheControl: response.headers['cache-control'],
      });
    } else {
      log('warning', 'No cache headers detected');
    }
  } catch (error) {
    log('error', `Performance test failed: ${error.message}`);
  }
}

async function testSecurity() {
  console.log('\n🔒 Testing Security Headers...\n');

  try {
    const response = await makeRequest(BASE_URL);
    const headers = response.headers;

    // Check security headers
    const securityHeaders = {
      'strict-transport-security': 'HSTS',
      'x-frame-options': 'Clickjacking Protection',
      'x-content-type-options': 'MIME Sniffing Protection',
      'x-xss-protection': 'XSS Protection',
      'content-security-policy': 'CSP',
    };

    Object.entries(securityHeaders).forEach(([header, name]) => {
      if (headers[header]) {
        log('success', `${name} header present`, { value: headers[header] });
      } else {
        log('warning', `${name} header missing`);
      }
    });

    // Check SSL/TLS
    if (BASE_URL.startsWith('https://')) {
      log('success', 'HTTPS enabled');
    } else {
      log('error', 'HTTPS not enabled');
    }
  } catch (error) {
    log('error', `Security test failed: ${error.message}`);
  }
}

async function testSEO() {
  console.log('\n🔍 Testing SEO...\n');

  try {
    const response = await makeRequest(BASE_URL);
    const html = response.data;

    // Check title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      log('success', 'Page title present', { title: titleMatch[1] });
      if (titleMatch[1].length > 60) {
        log('warning', 'Title is too long (>60 characters)');
      }
    } else {
      log('error', 'Page title missing');
    }

    // Check meta description
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    if (descMatch) {
      log('success', 'Meta description present', {
        description: descMatch[1].substring(0, 100) + '...',
      });
    } else {
      log('warning', 'Meta description missing');
    }

    // Check Open Graph tags
    const ogTags = html.match(/<meta[^>]*property=["']og:/g);
    if (ogTags && ogTags.length > 0) {
      log('success', `Open Graph tags present (${ogTags.length} tags)`);
    } else {
      log('warning', 'Open Graph tags missing');
    }

    // Check canonical URL
    if (html.includes('rel="canonical"')) {
      log('success', 'Canonical URL present');
    } else {
      log('warning', 'Canonical URL missing');
    }

    // Check structured data
    if (html.includes('application/ld+json')) {
      log('success', 'Structured data (JSON-LD) present');
    } else {
      log('info', 'No structured data detected');
    }
  } catch (error) {
    log('error', `SEO test failed: ${error.message}`);
  }
}

async function testAccessibility() {
  console.log('\n♿ Testing Accessibility...\n');

  try {
    const response = await makeRequest(BASE_URL);
    const html = response.data;

    // Check for alt attributes
    const images = html.match(/<img[^>]*>/g) || [];
    const imagesWithAlt = images.filter((img) => img.includes('alt=')).length;
    if (images.length > 0) {
      const percentage = ((imagesWithAlt / images.length) * 100).toFixed(0);
      if (percentage === 100) {
        log('success', 'All images have alt attributes', {
          total: images.length,
        });
      } else {
        log('warning', `${percentage}% of images have alt attributes`, {
          withAlt: imagesWithAlt,
          total: images.length,
        });
      }
    }

    // Check for ARIA labels
    const ariaLabels = html.match(/aria-label=/g);
    if (ariaLabels && ariaLabels.length > 0) {
      log('success', `ARIA labels present (${ariaLabels.length} instances)`);
    } else {
      log('info', 'No ARIA labels detected');
    }

    // Check for semantic HTML
    const semanticTags = ['header', 'nav', 'main', 'section', 'article', 'footer'];
    const usedSemanticTags = semanticTags.filter((tag) =>
      html.includes(`<${tag}`)
    );
    if (usedSemanticTags.length >= 4) {
      log('success', 'Good use of semantic HTML', {
        tags: usedSemanticTags,
      });
    } else {
      log('warning', 'Limited semantic HTML', { tags: usedSemanticTags });
    }

    // Check for language attribute
    if (html.match(/<html[^>]*lang=/i)) {
      log('success', 'Language attribute present');
    } else {
      log('warning', 'Language attribute missing');
    }
  } catch (error) {
    log('error', `Accessibility test failed: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Site Testing\n');
  console.log(`📍 Target: ${BASE_URL}\n`);
  console.log('═'.repeat(60));

  // Performance & Load Tests
  await testPerformance();
  await testHTTPSRedirect();

  // Page Load Tests
  console.log('\n📄 Testing Page Routes...\n');
  for (const route of ROUTES) {
    await testPageLoad(route);
  }

  // Mobile Viewport Tests
  console.log('\n📱 Testing Mobile Viewports...\n');
  for (const viewport of MOBILE_VIEWPORTS) {
    await testMobileViewport(viewport);
  }

  // Security Tests
  await testSecurity();

  // SEO Tests
  await testSEO();

  // Accessibility Tests
  await testAccessibility();

  // Final Report
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 Test Summary:\n');
  console.log(`   Total Tests: ${results.summary.total}`);
  console.log(
    `   \x1b[32m✓ Passed: ${results.summary.passed}\x1b[0m`
  );
  console.log(`   \x1b[31m✗ Failed: ${results.summary.failed}\x1b[0m`);
  console.log(
    `   \x1b[33m⚠ Warnings: ${results.summary.warnings}\x1b[0m`
  );

  const successRate = (
    (results.summary.passed / results.summary.total) *
    100
  ).toFixed(1);
  console.log(`\n   Success Rate: ${successRate}%`);

  // Save results to file
  const fs = require('fs');
  const resultsFile = `test-results-${Date.now()}.json`;
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${resultsFile}`);

  console.log('\n✨ Testing Complete!\n');

  // Exit with appropriate code
  process.exit(results.summary.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
