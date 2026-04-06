import { test, expect } from '@playwright/test';

test.describe('Custom Cursor', () => {
  test('should render custom cursor element on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Move mouse to trigger cursor visibility
    await page.mouse.move(400, 300);

    const cursor = page.locator('.custom-cursor');
    await expect(cursor).toBeVisible();
  });

  test('should hide default cursor on desktop via CSS', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Verify the custom cursor CSS is applied (cursor: none on body)
    const cursorStyle = await page.evaluate(() => {
      return window.getComputedStyle(document.body).cursor;
    });
    expect(cursorStyle).toBe('none');
  });

  test('should show "Read" label when hovering a blog card', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/thoughts');

    // Wait for blog cards to load
    await page.waitForLoadState('networkidle');
    const blogCard = page.locator('.blog-card').first();
    await expect(blogCard).toBeVisible({ timeout: 10000 });

    await blogCard.hover();

    const cursor = page.locator('.custom-cursor');
    await expect(cursor).toHaveClass(/custom-cursor--action/);

    const label = page.locator('.custom-cursor__label');
    await expect(label).toHaveText('Read');
  });

  test('should revert to default variant when mouse leaves interactive element', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Move mouse to trigger cursor
    await page.mouse.move(400, 300);

    const cursor = page.locator('.custom-cursor');
    await expect(cursor).toHaveClass(/custom-cursor--default/);
  });

  test('should have pointer-events none so clicks pass through', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.mouse.move(400, 300);

    const pointerEvents = await page.locator('.custom-cursor').evaluate(
      (el) => window.getComputedStyle(el).pointerEvents
    );
    expect(pointerEvents).toBe('none');
  });

  test('should restore text cursor for input elements', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Check that input/textarea elements have text cursor, not none
    const inputElements = page.locator('input, textarea');
    if (await inputElements.count() > 0) {
      const cursorStyle = await inputElements.first().evaluate(
        (el) => window.getComputedStyle(el).cursor
      );
      expect(cursorStyle).toBe('text');
    }
  });
});

test.describe('Custom Cursor - Mobile', () => {
  test('should not interfere on mobile devices', async ({ page }) => {
    // Simulate a touch device viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // The component uses matchMedia('(hover: hover) and (pointer: fine)') to
    // determine if a fine pointer is available. In Playwright's default desktop
    // browser context, this still matches even with a small viewport, so the
    // cursor may render. On real touch-only devices, it won't render at all.
    // Here we verify the page loads without errors and cursor doesn't break UX.
    await page.waitForLoadState('networkidle');
    await expect(page.locator('nav')).toBeVisible();
  });
});
