import { Page } from '@playwright/test';
import { BASE_URL, PASSWORD, USERNAME } from '../constants';

export async function login(page: Page) {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('email or username').click();
    await page.getByPlaceholder('email or username').fill(USERNAME);
    await page.getByPlaceholder('password').click();
    await page.getByPlaceholder('password').fill(PASSWORD);
    await page.getByLabel('Login button').click();
    await page.getByLabel('Skip change password button').click();
}