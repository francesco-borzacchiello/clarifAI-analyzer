import { test, expect } from '@playwright/test';
import * as utils from './utils';

const baseUrl = 'http://localhost:3000';

test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('email or username').click();
    await page.getByPlaceholder('email or username').fill('admin');
    await page.getByPlaceholder('password').click();
    await page.getByPlaceholder('password').fill('admin');
    await page.getByLabel('Login button').click();
    await page.getByLabel('Skip change password button').click();
});

async function testResolution(page, testInfo, baseUrlChart, from, to, resolution) {
    const canvasSelector = '[data-zr-dom-id="zr_0"]';
    let outputFilePath = `chart-3-from=${from}-to=${to}-${resolution.width}x${resolution.height}.png`;

    await page.setViewportSize(resolution);
    await utils.screenshotCanvas(page, canvasSelector, baseUrlChart + "&from=" + from + "&to=" + to, outputFilePath);

    await utils.extractJsonFromBarChart(outputFilePath);
    const jsonResolution = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}-${resolution.width}x${resolution.height}.json`, jsonResolution);

    return jsonResolution;
}

const resolutions = [
    //{ width: 1920, height: 1080 },
    /*
    { width: 1366, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
     */
    //{ width: 1600, height: 900 }
    { width: 1536, height: 825 }
];

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - different resolutions', async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';
    let from = 1606777200000, to = 1630792800000;

    for (const resolution of resolutions) {
        await testResolution(page, testInfo, baseUrlChart, from, to, resolution);
    }
});
