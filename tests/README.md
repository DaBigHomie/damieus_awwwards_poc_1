# E2E Test Suite

Comprehensive end-to-end tests for Damieus Showcase using Puppeteer and Jest.

## Test Files

- **homepage.test.ts** - Homepage functionality, navigation, content, SEO
- **mobile-optimization.test.ts** - Mobile responsive design, touch interactions
- **performance.test.ts** - Load times, bundle sizes, Core Web Vitals
- **scroll.test.ts** - Smooth scrolling, sticky navigation, scroll performance
- **devtools.test.ts** - Console errors, network requests, security

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:e2e:watch

# Run specific test file
npm run test:e2e -- homepage.test.ts

# Run with verbose output
npm run test:e2e -- --verbose
```

## Test Configuration

- **Environment**: Node.js
- **Browser**: Headless Chrome (Puppeteer)
- **Timeout**: 60 seconds per test
- **Base URL**: https://showcase.damieus.app

## Test Coverage

### Homepage Tests (9 tests)
- Page load and meta tags
- Navigation (sticky, background, mega menu)
- Content (hero, services, images)
- Click-through navigation (About, Services, Contact)
- Scroll behavior and sticky nav
- Footer and footer links

### Mobile Tests (24+ tests)
- 4 device configurations (iPhone 12, Galaxy S21, iPad Mini, iPhone SE)
- Viewport responsiveness
- Touch interactions
- Mobile performance
- Responsive layout

### Performance Tests (13 tests)
- Load time (<3s)
- DOMContentLoaded speed
- Resource optimization (JS/CSS bundle size)
- Image optimization and lazy loading
- Core Web Vitals (LCP, FID)
- Memory leak detection

### Scroll Tests (12 tests)
- Smooth scrolling
- Sticky navigation behavior
- Scroll progress tracking
- Scroll performance
- Element visibility on scroll
- Mobile scroll behavior

### DevTools Tests (12 tests)
- Console error detection
- JavaScript error tracking
- Network request failures
- Resource loading (images, CSS, JS)
- Security headers (HTTPS, HSTS)
- Accessibility violations

## Expected Results

✅ **70+ total tests**  
✅ **All tests should pass in production**  
✅ **No console errors**  
✅ **No failed network requests**  
✅ **All images load successfully**  
✅ **Performance metrics within thresholds**

## Troubleshooting

### Tests timing out
Increase timeout in jest.config.cjs:
```js
testTimeout: 120000 // 2 minutes
```

### Puppeteer installation issues
```bash
# Install Chromium manually
npx puppeteer browsers install chrome
```

### Network issues
- Check that site is accessible at https://showcase.damieus.app
- Ensure firewall isn't blocking requests
- Try running tests with increased timeout

### Headless mode issues
Edit test files to run in headed mode for debugging:
```ts
browser = await puppeteer.launch({
  headless: false, // Set to false to see browser
  devtools: true,  // Open DevTools
});
```
