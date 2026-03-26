import { expect, test } from '@playwright/test';
import { VALID_LOG_TEXT, VALID_LOG_LINES } from '../../fixtures/p2pLogSamples';

test('text panel can expand rows and switch to topology placeholder', async ({ page }) => {
  await page.goto('/');

  await page.locator('[data-testid="header-file-input"]').setInputFiles({
    name: 'panel.log',
    mimeType: 'text/plain',
    buffer: Buffer.from(VALID_LOG_TEXT),
  });

  await page.getByRole('tab', { name: '拓扑面板' }).click();
  await expect(page.getByText('拓扑分析能力尚未开放')).toBeVisible();

  await page.getByRole('tab', { name: '文本面板' }).click();
  await page.getByText('[P2P]StartMatch').click();

  await expect(page.getByText(VALID_LOG_LINES[0])).toBeVisible();
});
