import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match landing page design', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('landing-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match thoughts page desktop layout', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/thoughts');
    await page.waitForLoadState('networkidle');
    
    // Wait for blog cards to load
    await page.waitForSelector('.blog-card');
    
    await expect(page).toHaveScreenshot('thoughts-desktop.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match thoughts page mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/thoughts');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.blog-card');
    
    await expect(page).toHaveScreenshot('thoughts-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match blog card expanded state', async ({ page }) => {
    await page.goto('/thoughts');
    await page.waitForSelector('.blog-card');
    
    // Click on first card to expand it
    await page.locator('.blog-card').first().click();
    
    // Take screenshot of expanded card
    await expect(page.locator('.blog-card.expanded').first()).toHaveScreenshot('blog-card-expanded.png');
  });

  test('should match sceneries gallery', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/meditations');
    await page.waitForSelector('.meditation-cards');
    
    // Click on sceneries card
    await page.locator('.blog-card').first().click();
    
    // Wait for gallery to load
    await page.waitForSelector('.sceneries-gallery');
    
    // Take screenshot of gallery
    await expect(page.locator('.sceneries-gallery')).toHaveScreenshot('sceneries-gallery.png');
  });
});
