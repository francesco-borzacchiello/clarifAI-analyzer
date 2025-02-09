import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByPlaceholder('email or username').click();
  await page.getByPlaceholder('email or username').fill('admin');
  await page.getByPlaceholder('password').click();
  await page.getByPlaceholder('password').fill('admin');
  await page.getByPlaceholder('password').press('Enter');
  await page.getByLabel('Login button').click();
  await page.locator('#new-password').click();
  await page.locator('#new-password').fill('admin');
  await page.locator('#confirm-new-password').click();
  await page.locator('#confirm-new-password').fill('adin');
  await page.locator('#confirm-new-password').press('Enter');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByLabel('Skip change password button').click();
  await page.locator('path:nth-child(45)').click();
  await page.locator('body').press('F12');
});