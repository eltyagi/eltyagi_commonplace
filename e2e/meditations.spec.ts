import { test, expect } from '@playwright/test';

test.describe('Meditations Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/meditations');
  });

  test('should display meditation cards', async ({ page }) => {
    await page.waitForSelector('.meditation-cards');
    
    // Check if meditation cards container is visible
    const meditationCards = page.locator('.blog-card');
    await expect(meditationCards).toHaveCount(3); // Assuming 3 meditation sections
  });

  test('should display sceneries gallery', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.waitForSelector('.meditation-cards');
    
    // Click on first card (Sceneries from my world)
    await page.locator('.blog-card').first().click();
    
    // Check if gallery is visible
    await expect(page.locator('.sceneries-gallery')).toBeVisible();
    
    // Check if images are loaded
    const images = page.locator('.scenery-card');
    await expect(images).toHaveCount(10); // 10 images on desktop
  });

  test('should expand images on click', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.waitForSelector('.meditation-cards');
    
    // Click on first card to show gallery
    await page.locator('.blog-card').first().click();
    
    // Wait for gallery to load
    await page.waitForSelector('.sceneries-gallery');
    
    // Click on first image
    await page.locator('.scenery-card').first().click();
    
    // Check if modal is opened
    await expect(page.locator('.image-modal-overlay')).toBeVisible();
    await expect(page.locator('.expanded-image')).toBeVisible();
    await expect(page.locator('.image-modal-close')).toBeVisible();
    
    // Test navigation arrows
    await expect(page.locator('.image-nav-button.prev')).toBeVisible();
    await expect(page.locator('.image-nav-button.next')).toBeVisible();
    
    // Test close modal
    await page.click('.image-modal-close');
    await expect(page.locator('.image-modal-overlay')).not.toBeVisible();
  });

  test('should show mobile gallery layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.waitForSelector('.meditation-cards');
    
    // Click on first card
    await page.locator('.blog-card').first().click();
    
    // Click view button to enter mobile content view
    await page.click('.blog-card-view-button');
    
    // Check if mobile gallery is visible (6 images)
    await expect(page.locator('.sceneries-gallery.mobile-gallery')).toBeVisible();
    const mobileImages = page.locator('.mobile-gallery .scenery-card');
    await expect(mobileImages).toHaveCount(6);
  });

  test('should navigate between meditation sections', async ({ page }) => {
    await page.waitForSelector('.meditation-cards');
    
    // Test clicking different meditation cards
    const cards = page.locator('.blog-card');
    
    // Click second card (Tech Stack)
    await cards.nth(1).click();
    await expect(cards.nth(1)).toHaveClass(/expanded/);
    
    // Click third card (Principles)
    await cards.nth(2).click();
    await expect(cards.nth(2)).toHaveClass(/expanded/);
  });
});
