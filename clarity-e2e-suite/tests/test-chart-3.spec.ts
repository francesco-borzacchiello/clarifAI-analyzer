import { test, expect } from '@playwright/test';
import * as utils from './utils';

const baseUrl = 'http://localhost:3000'

test.beforeEach(async ({ page }) => {
    // Esegui la login con il valore corrente di baseUrlChart
    await page.goto(baseUrl);
    await page.getByPlaceholder('email or username').click();
    await page.getByPlaceholder('email or username').fill('admin');
    await page.getByPlaceholder('password').click();
    await page.getByPlaceholder('password').fill('admin');
    await page.getByLabel('Login button').click();
    await page.getByLabel('Skip change password button').click();
});

test('chart-3 - solaris - (2020-12-01 - 2021-02-01) < (2020-12-01 - 2021-09-05)', async ({ page }, testInfo) => {
    // from: 2020-12-01 00:00:00, to: 2021-09-05 00:00:00
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db'
    let from = 1606777200000, to = 1630792800000;

    const canvasSelector = '[data-zr-dom-id="zr_0"]';
    let outputFilePath = `chart-3-from=${from}-to=${to}.png`;
  
    await utils.screenshotCanvas(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath);

    const jsonLargeIntervall = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}.json`, jsonLargeIntervall);

    // to: 2021-02-01 00:00:00
    to = 1612134000000;

    outputFilePath = "chart-3-"+ "from="+ from + "-to=" + to + ".png";
    
    await utils.screenshotCanvas(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath);  
    
    const jsonSmallIntervall = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}.json`, jsonSmallIntervall);

    utils.compareJsons(jsonSmallIntervall, jsonLargeIntervall);
});

/*
test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus protanopia', async ({ page }, testInfo) => {
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db'
    let from = 1606777200000, to = 1630792800000;

    const canvasSelector = '[data-zr-dom-id="zr_0"]';
    let outputFilePath = `chart-3-from=${from}-to=${to}-normal_vision.png`;
  
    await utils.captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath, 'none');

    const jsonNormalVision = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}-normal_vision.json`, jsonNormalVision);

    outputFilePath = `chart-3-from=${from}-to=${to}-protanopia.png`;

    await utils.captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath, 'protanopia', 0);

    const jsonProtanopia = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}-protanopia.json`, jsonProtanopia);

    utils.equalsJsons(jsonNormalVision, jsonProtanopia);
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus deuteranopia', async ({ page }, testInfo) => {
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db'
    let from = 1606777200000, to = 1630792800000;

    const canvasSelector = '[data-zr-dom-id="zr_0"]';
    let outputFilePath = `chart-3-from=${from}-to=${to}-normal_vision.png`;
  
    await utils.captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath, 'none');

    const jsonNormalVision = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}-normal_vision.json`, jsonNormalVision);

    outputFilePath = `chart-3-from=${from}-to=${to}-deuteranopia.png`;

    await utils.captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath, 'deuteranopia', 0);

    const jsonDeuteranopia = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}-deuteranopia.json`, jsonDeuteranopia);

    utils.equalsJsons(jsonNormalVision, jsonDeuteranopia);
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus tritanopia', async ({ page }, testInfo) => {
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db'
    let from = 1606777200000, to = 1630792800000;

    const canvasSelector = '[data-zr-dom-id="zr_0"]';
    let outputFilePath = `chart-3-from=${from}-to=${to}-normal_vision.png`;
  
    await utils.captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath, 'none');

    const jsonNormalVision = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}-normal_vision.json`, jsonNormalVision);

    outputFilePath = `chart-3-from=${from}-to=${to}-tritanopia.png`;

    await utils.captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath, 'tritanopia', 0);

    const jsonTritanopia = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}-tritanopia.json`, jsonTritanopia);

    utils.equalsJsons(jsonNormalVision, jsonTritanopia);
});
*/

test('chart-3 - solaris - ', async ({ page }, testInfo) => {
    // from: 2020-12-01 00:00:00, to: 2021-09-05 00:00:00
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db'
    let from = 1606777200000, to = 1630792800000;

    const canvasSelector = '[data-zr-dom-id="zr_0"]';
    let outputFilePath = `chart-3-from=${from}-to=${to}.png`;
  
    await utils.screenshotCanvas(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath);

    const jsonLargeIntervall = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}.json`, jsonLargeIntervall);

    // to: 2021-02-01 00:00:00
    to = 1612134000000;

    outputFilePath = "chart-3-"+ "from="+ from + "-to=" + to + ".png";
    
    await utils.screenshotCanvas(page, canvasSelector, baseUrlChart + "&from="+ from + "&to=" + to, outputFilePath);  
    
    const jsonSmallIntervall = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}.json`, jsonSmallIntervall);

    utils.compareJsons(jsonSmallIntervall, jsonLargeIntervall);
});