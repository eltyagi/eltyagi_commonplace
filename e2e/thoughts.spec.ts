import { test, expect } from '@playwright/test';

test.describe('Thoughts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/thoughts');
  });

  test('should display blog cards', async ({ page }) => {
    // Wait for blog cards to load
    await page.waitForSelector('.blog-card');
    
    // Check if blog cards are visible
    const blogCards = page.locator('.blog-card');
    await expect(blogCards).toHaveCount(6); // Assuming 6 blog posts
    
    // Check first card has classification
    const firstCard = blogCards.first();
    await expect(firstCard.locator('.blog-card-classification')).toBeVisible();
  });

  test('should expand blog card on click', async ({ page }) => {
    await page.waitForSelector('.blog-card');
    
    const firstCard = page.locator('.blog-card').first();
    
    // Click on the first blog card
    await firstCard.click();
    
    // Check if card is expanded (has expanded class)
    await expect(firstCard).toHaveClass(/expanded/);
    
    // Check if expanded content is visible
    await expect(firstCard.locator('.blog-card-title')).toBeVisible();
    await expect(firstCard.locator('.blog-card-excerpt')).toBeVisible();
    await expect(firstCard.locator('.blog-card-view-button')).toBeVisible();
  });

  test('should show content in desktop view', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.waitForSelector('.blog-card');
    
    // Click on first card to expand it
    await page.locator('.blog-card').first().click();
    
    // Wait for view button and click it
    await page.waitForSelector('.blog-card-view-button');
    await page.click('.blog-card-view-button');
    
    // Check if content display is visible
    await expect(page.locator('.blog-content-display')).toBeVisible();
    await expect(page.locator('.blog-content-title')).toBeVisible();
  });

  test('should handle mobile content view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.waitForSelector('.blog-card');
    
    // Click on first card
    await page.locator('.blog-card').first().click();
    
    // Click on view button
    await page.click('.blog-card-view-button');
    
    // Check if mobile content view is shown
    await expect(page.locator('.mobile-content-view')).toBeVisible();
    await expect(page.locator('.mobile-back-button')).toBeVisible();
    
    // Test back button
    await page.click('.mobile-back-button');
    await expect(page.locator('.mobile-content-view')).not.toBeVisible();
  });
});
