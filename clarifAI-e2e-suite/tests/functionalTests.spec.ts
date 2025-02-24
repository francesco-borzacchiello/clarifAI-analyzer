import { test } from '@playwright/test';
import { login } from '../src/utils/authUtils';
import { compareChartsForIntervals } from '../src/chartComparison';
import { captureAndExtractJsonForInterval } from '../src/utils/chartCaptureUtils';
import { expect } from '../src/assertions/functionalAssertions';
import { BASE_URL, CANVAS_SELECTOR } from '../src/constants';
import { intervalPairs } from '../src/testCases';

test.beforeEach(async ({ page }) => {
    // Esegui la login con il valore corrente di baseUrlChart
    await login(page);
});

test('chart-3 - solaris - |2020-12-01 - 2021-02-01| <= |2020-12-01 - 2021-02-15|', async ({ page }, testInfo) => {
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';

    await compareChartsForIntervals(
        page,
        testInfo,
        baseUrlChart,
        CANVAS_SELECTOR,
        { from: "2020-12-01", to: "2021-02-15" },
        { from: "2020-12-01", to: "2021-02-01" }
    );
});

test.describe.parallel('Confronto tra grafici con intervalli diversi', () => {
    Object.entries(intervalPairs).forEach(([testName, { url, largerInterval, smallerInterval }]) => {
        test(testName, async ({ page }, testInfo) => {
            const baseUrlChart = BASE_URL + url;

            await compareChartsForIntervals(
                page,
                testInfo,
                baseUrlChart,
                CANVAS_SELECTOR,
                largerInterval,
                smallerInterval
            );
        });
    });
});

/*

{
  "Constantina Quintanar": {
    "Low Risk": 38,
    "Unverified High Risk": 4
  },
  "Deanna Rosheck": {
    "Low Risk": 47,
    "Voided High Risk": 2
  },
  "Elsa Elias": {
    "Low Risk": 12
  },
  "Estephanie Diaz": {
    "Low Risk": 41,
    "Voided High Risk": 3
  },
  "Ivania Torres": {
    "Low Risk": 30
  },
  "Jacob Capurro": {
    "High Risk Confirmed": 1,
    "Low Risk": 48,
    "Preliminar High Risk": 1
  },
  "Jason Pagan": {
    "Low Risk": 45,
    "Voided High Risk": 2
  },
  "Joaquin Montes": {
    "Low Risk": 39,
    "Voided High Risk": 3
  },
  "Juan Delgado": {
    "Low Risk": 39
  },
  "Luis Segura": {
    "Low Risk": 42,
    "Voided High Risk": 2
  }
}

*/

test('chart-3 - solaris - (2020-11-30 - 2021-02-15) - Functional checks', async ({ page }, testInfo) => {
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db'

    const chartDescription = await captureAndExtractJsonForInterval(
            page,
            testInfo,
            baseUrlChart,
            CANVAS_SELECTOR,
            "2020-11-30",
            "2021-02-15"
        );

    await expect.soft(chartDescription).hasLabel("Constantina Quintanar");    
    await expect.soft(chartDescription).hasLabel("Luis Segura");
    await expect.soft(chartDescription).hasCategory("Jacob Capurro", "High Risk Confirmed");
    await expect.soft(chartDescription).hasCategoryValue("Jason Pagan", "Voided High Risk", 2);
});

/*
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
*/