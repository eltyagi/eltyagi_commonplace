import { test, expect } from '@playwright/test';

test.describe('Page Titles', () => {
  test('landing page has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Lakshya Tyagi');
  });

  test('thoughts page has correct title', async ({ page }) => {
    await page.goto('/thoughts');
    await expect(page).toHaveTitle('Thoughts · Lakshya Tyagi');
  });

  test('individual blog post has correct title', async ({ page }) => {
    await page.goto('/thoughts/pillow-for-my-helmet');
    // Wait for the page to load and title to update
    await page.waitForTimeout(1000);
    await expect(page).toHaveTitle('Pillow for my Helmet · Lakshya Tyagi');
  });

  test('meditations page has correct title', async ({ page }) => {
    await page.goto('/meditations');
    await expect(page).toHaveTitle('Meditations · Lakshya Tyagi');
  });

  test('contact page has correct title', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle('Say hi? · Lakshya Tyagi');
  });
});
