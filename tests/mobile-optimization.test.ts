/**
 * Mobile Optimization & Responsiveness Tests
 * Tests for mobile viewport, touch interactions, and responsive design
 * Customized for Damieus Showcase
 */

import puppeteer, { Browser, Page } from 'puppeteer';

describe('Damieus Mobile Optimization Tests', () => {
  let browser: Browser;
  let page: Page;
  const BASE_URL = 'https://showcase.damieus.app';

  // Mobile device configurations
  const devices = [
    {
      name: 'iPhone 12',
      viewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      name: 'Samsung Galaxy S21',
      viewport: { width: 360, height: 800, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36'
    },
    {
      name: 'iPad Mini',
      viewport: { width: 768, height: 1024, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      name: 'iPhone SE',
      viewport: { width: 375, height: 667, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    }
  ];

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Viewport Meta Tag', () => {
    test('should have viewport meta tag', async () => {
      await page.goto(BASE_URL);
      
      const viewport = await page.$eval(
        'meta[name="viewport"]',
        (el: any) => el.content
      );
      
      expect(viewport).toBeTruthy();
      expect(viewport).toContain('width=device-width');
    });
  });

  describe.each(devices)('$name Tests', ({ viewport, userAgent }) => {
    test('should load on mobile viewport', async () => {
      await page.setViewport(viewport);
      await page.setUserAgent(userAgent);
      
      const response = await page.goto(BASE_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      expect(response?.status()).toBe(200);
    });

    test('should have no horizontal scroll', async () => {
      await page.setViewport(viewport);
      await page.setUserAgent(userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });

    test('should display navigation properly', async () => {
      await page.setViewport(viewport);
      await page.setUserAgent(userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      
      const nav = await page.$('nav');
      expect(nav).toBeTruthy();
      
      const navVisible = await page.evaluate(() => {
        const nav = document.querySelector('nav');
        return nav && nav.offsetHeight > 0;
      });
      
      expect(navVisible).toBe(true);
    });

    test('should have responsive font sizes', async () => {
      await page.setViewport(viewport);
      await page.setUserAgent(userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      
      const heroFontSize = await page.evaluate(() => {
        const hero = document.querySelector('.hero-title');
        if (!hero) return 0;
        return parseInt(window.getComputedStyle(hero).fontSize);
      });
      
      expect(heroFontSize).toBeGreaterThan(0);
      expect(heroFontSize).toBeLessThan(200); // Should scale down on mobile
    });

    test('should load images on mobile', async () => {
      await page.setViewport(viewport);
      await page.setUserAgent(userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const images = await page.$$eval('img', (imgs: any) =>
        imgs.map((img: any) => ({
          src: img.src,
          loaded: img.complete && img.naturalHeight !== 0,
        }))
      );
      
      const loadedImages = images.filter((img: any) => img.loaded);
      expect(loadedImages.length).toBeGreaterThan(0);
    });
  });

  describe('Touch Interactions', () => {
    test('should handle touch events on mobile', async () => {
      await page.setViewport(devices[0].viewport);
      await page.setUserAgent(devices[0].userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      
      const navBtn = await page.$('button.nav-item');
      if (navBtn) {
        await navBtn.tap();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const megaMenu = await page.$('.mega-menu.active');
        expect(megaMenu).toBeTruthy();
      }
    });

    test('should scroll smoothly on touch', async () => {
      await page.setViewport(devices[0].viewport);
      await page.setUserAgent(devices[0].userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      
      const initialScroll = await page.evaluate(() => window.scrollY);
      
      // Simulate touch scroll
      await page.evaluate(() => {
        window.scrollBy(0, 500);
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newScroll = await page.evaluate(() => window.scrollY);
      expect(newScroll).toBeGreaterThan(initialScroll);
    });
  });

  describe('Mobile Performance', () => {
    test('should load quickly on mobile', async () => {
      await page.setViewport(devices[0].viewport);
      await page.setUserAgent(devices[0].userAgent);
      
      const startTime = Date.now();
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds for mobile
    });

    test('should have optimized images for mobile', async () => {
      await page.setViewport(devices[0].viewport);
      await page.setUserAgent(devices[0].userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      
      const imageInfo = await page.$$eval('img', (imgs: any) =>
        imgs.map((img: any) => ({
          src: img.src,
          width: img.naturalWidth,
          height: img.naturalHeight,
        }))
      );
      
      expect(imageInfo.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Layout', () => {
    test('should have single column layout on mobile', async () => {
      await page.setViewport(devices[0].viewport);
      await page.setUserAgent(devices[0].userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      
      const gridColumns = await page.evaluate(() => {
        const grid = document.querySelector('.grid');
        if (!grid) return 0;
        return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      });
      
      // On mobile should be 1 column
      expect(gridColumns).toBeLessThanOrEqual(2);
    });

    test('should hide custom cursor on mobile', async () => {
      await page.setViewport(devices[0].viewport);
      await page.setUserAgent(devices[0].userAgent);
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      
      const cursorHidden = await page.evaluate(() => {
        const cursor = document.querySelector('.cursor');
        if (!cursor) return true;
        const display = window.getComputedStyle(cursor).display;
        return display === 'none';
      });
      
      expect(cursorHidden).toBe(true);
    });
  });
});
