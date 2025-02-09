import { Page } from '@playwright/test';

export async function login(page: Page, baseUrl: string) {
    await page.goto(baseUrl);
    await page.getByPlaceholder('email or username').click();
    await page.getByPlaceholder('email or username').fill('admin');
    await page.getByPlaceholder('password').click();
    await page.getByPlaceholder('password').fill('admin');
    await page.getByLabel('Login button').click();
    await page.getByLabel('Skip change password button').click();
}