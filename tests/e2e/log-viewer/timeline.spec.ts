import { expect, test } from '@playwright/test';
import { VALID_LOG_TEXT } from '../../fixtures/p2pLogSamples';

test('timeline selection updates the visible text panel', async ({ page }) => {
  await page.goto('/');

  await page.locator('[data-testid="header-file-input"]').setInputFiles({
    name: 'timeline.log',
    mimeType: 'text/plain',
    buffer: Buffer.from(VALID_LOG_TEXT),
  });

  await expect(page.getByText('timeline.log')).toBeVisible();

  const slider = page.locator('[data-testid="timeline-slider"]');
  await slider.fill(String(new Date('2026-03-26 14:31:00.999+08:00').getTime()));

  await expect(page.locator('[data-testid="text-log-panel"]')).toHaveAttribute('data-anchor-index', '2');
});
