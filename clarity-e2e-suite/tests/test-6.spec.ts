import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://oauthdebugger.com/debug');
  await page.getByRole('link', { name: 'Start over' }).click();
  await page.getByLabel('Authorize URI (required)').click();
  await page.getByLabel('Authorize URI (required)').fill('http://172.28.16.1:8080/auth/oauth2/authorize');
  await page.getByLabel('Client ID (required)').click();
  await page.getByLabel('Client ID (required)').fill('client');
  await page.getByLabel('Scope (required)').click();
  await page.getByLabel('Scope (required)').fill('test.1');
  await page.getByRole('link', { name: 'Send Request ' }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('agent_francesco.borzacchiello@sobereye.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('6ERl30B6UTwy{636a8f928223563d87a9b32e}');
  await page.getByPlaceholder('Password').click();
  await page.getByRole('button', { name: 'Sign in' }).click();
});