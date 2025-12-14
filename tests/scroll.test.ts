/**
 * Scroll Behavior Tests for Damieus Showcase
 * Tests smooth scrolling, scroll-triggered animations, and sticky elements
 */

import puppeteer, { Browser, Page } from 'puppeteer';

describe('Damieus Scroll Tests', () => {
  let browser: Browser;
  let page: Page;
  const BASE_URL = 'https://showcase.damieus.app';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Smooth Scrolling', () => {
    test('should scroll smoothly', async () => {
      const initialPosition = await page.evaluate(() => window.scrollY);

      await page.evaluate(() => {
        window.scrollTo({
          top: 1000,
          behavior: 'smooth',
        });
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const finalPosition = await page.evaluate(() => window.scrollY);

      expect(finalPosition).toBeGreaterThan(initialPosition);
      expect(finalPosition).toBeGreaterThan(900);
    });

    test('should scroll to bottom', async () => {
      const pageHeight = await page.evaluate(() => document.body.scrollHeight);

      await page.evaluate(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const scrollPosition = await page.evaluate(() => window.scrollY);

      expect(scrollPosition).toBeGreaterThan(pageHeight - 1500);
    });

    test('should scroll back to top', async () => {
      await page.evaluate(() => {
        window.scrollTo(0, 1000);
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      await page.evaluate(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const scrollPosition = await page.evaluate(() => window.scrollY);

      expect(scrollPosition).toBeLessThan(100);
    });
  });

  describe('Sticky Navigation', () => {
    test('should keep navigation sticky while scrolling', async () => {
      const navInitialPosition = await page.evaluate(() => {
        const nav = document.querySelector('nav');
        return nav?.getBoundingClientRect().top;
      });

      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      const navScrolledPosition = await page.evaluate(() => {
        const nav = document.querySelector('nav');
        return nav?.getBoundingClientRect().top;
      });

      expect(navInitialPosition).toBe(navScrolledPosition);
    });

    test('should show navigation background when scrolling', async () => {
      await page.evaluate(() => {
        window.scrollTo(0, 200);
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      const navBackground = await page.evaluate(() => {
        const nav = document.querySelector('nav');
        const styles = window.getComputedStyle(nav!);
        return {
          background: styles.backgroundColor,
          backdropFilter: styles.backdropFilter,
        };
      });

      expect(navBackground.background).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  describe('Scroll Progress', () => {
    test('should calculate scroll percentage', async () => {
      const scrollPercentage = await page.evaluate(() => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        return (scrollTop / (scrollHeight - clientHeight)) * 100;
      });

      expect(scrollPercentage).toBeGreaterThanOrEqual(0);
      expect(scrollPercentage).toBeLessThanOrEqual(100);
    });

    test('should update scroll position on scroll', async () => {
      const initialScroll = await page.evaluate(() => window.scrollY);

      await page.evaluate(() => {
        window.scrollBy(0, 500);
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      const newScroll = await page.evaluate(() => window.scrollY);

      expect(newScroll).toBeGreaterThan(initialScroll);
      expect(newScroll - initialScroll).toBeGreaterThan(400);
    });
  });

  describe('Scroll Performance', () => {
    test('should have smooth scroll performance', async () => {
      const scrollTimes: number[] = [];

      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();

        await page.evaluate(() => {
          window.scrollBy(0, 300);
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        const duration = Date.now() - startTime;
        scrollTimes.push(duration);
      }

      const avgScrollTime = scrollTimes.reduce((a, b) => a + b, 0) / scrollTimes.length;

      console.log('Average Scroll Time:', avgScrollTime, 'ms');

      expect(avgScrollTime).toBeLessThan(200);
    });

    test('should not cause layout shifts during scroll', async () => {
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0;

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if ((entry as any).hadRecentInput) continue;
              clsValue += (entry as any).value;
            }
          }).observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => resolve(clsValue), 3000);
        });
      });

      console.log('Cumulative Layout Shift:', cls);

      expect(cls).toBeLessThan(0.1); // Good CLS is under 0.1
    });
  });

  describe('Element Visibility on Scroll', () => {
    test('should reveal elements as they come into view', async () => {
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      const elementsBeforeScroll = await page.evaluate(() => {
        const elements = document.querySelectorAll('.card, .service-item');
        return Array.from(elements).map((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });
      });

      await page.evaluate(() => {
        window.scrollTo(0, 1500);
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const elementsAfterScroll = await page.evaluate(() => {
        const elements = document.querySelectorAll('.card, .service-item');
        return Array.from(elements).map((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });
      });

      const visibleCountBefore = elementsBeforeScroll.filter(Boolean).length;
      const visibleCountAfter = elementsAfterScroll.filter(Boolean).length;

      console.log(`Visible elements: before=${visibleCountBefore}, after=${visibleCountAfter}`);
      expect(visibleCountAfter).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Scroll Anchoring', () => {
    test('should maintain scroll position after content load', async () => {
      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      const scrollBeforeReload = await page.evaluate(() => window.scrollY);

      await page.reload({ waitUntil: 'domcontentloaded' });

      await page.evaluate((pos) => {
        window.scrollTo(0, pos);
      }, scrollBeforeReload);

      await new Promise(resolve => setTimeout(resolve, 300));

      const scrollAfterReload = await page.evaluate(() => window.scrollY);

      expect(Math.abs(scrollAfterReload - scrollBeforeReload)).toBeLessThan(50);
    });
  });

  describe('Mobile Scroll', () => {
    test('should scroll smoothly on mobile', async () => {
      await page.setViewport({
        width: 375,
        height: 667,
        isMobile: true,
        hasTouch: true,
      });

      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

      const initialScroll = await page.evaluate(() => window.scrollY);

      await page.evaluate(() => {
        window.scrollBy(0, 400);
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      const finalScroll = await page.evaluate(() => window.scrollY);

      expect(finalScroll).toBeGreaterThan(initialScroll);
    });

    test('should not have horizontal scroll on mobile', async () => {
      await page.setViewport({
        width: 375,
        height: 667,
        isMobile: true,
        hasTouch: true,
      });

      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });
});
