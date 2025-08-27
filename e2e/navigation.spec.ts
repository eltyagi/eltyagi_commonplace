import { test, expect } from '@playwright/test';

test.describe('Portfolio Navigation', () => {
  test('should navigate between pages successfully', async ({ page }) => {
    await page.goto('/');
    
    // Test landing page loads
    await expect(page).toHaveTitle(/commonplace/i);
    
    // Navigate to thoughts page
    await page.click('text=Thoughts');
    await expect(page).toHaveURL(/.*thoughts/);
    
    // Navigate to meditations page
    await page.click('text=Meditations');
    await expect(page).toHaveURL(/.*meditations/);
    
    // Navigate to dock page
    await page.click('text=Dock');
    await expect(page).toHaveURL(/.*dock/);
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check mobile navigation is visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Test mobile navigation works
    await page.click('text=Thoughts');
    await expect(page).toHaveURL(/.*thoughts/);
  });
  
  test('should work on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    
    // Check desktop layout
    await expect(page.locator('nav')).toBeVisible();
  });
});
