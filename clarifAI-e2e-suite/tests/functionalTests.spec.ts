import { test } from '@playwright/test';
import { login } from '../src/utils/authUtils';
import { compareChartsForIntervals } from '../src/chartComparison';
import { captureAndExtractJsonForInterval } from '../src/utils/chartCaptureUtils';
import { expect } from '../src/assertions/functionalAssertions';
import { BASE_URL, CANVAS_SELECTOR } from '../src/constants';
import { intervalPairs } from '../src/testCases';
import { BarChartJson } from '../src/types';

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
    Object.entries(intervalPairs).forEach(([testName, { url, selector, largerInterval, smallerInterval }]) => {
        test(testName, async ({ page }, testInfo) => {
            const baseUrlChart = BASE_URL + url;

            await compareChartsForIntervals(
                page,
                testInfo,
                baseUrlChart,
                selector,
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

test('Chart with legend and integer values - (2020-11-30 - 2021-02-15) - Functional checks', async ({ page }, testInfo) => {
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';

    const chartDescription: BarChartJson = (await captureAndExtractJsonForInterval(
            page,
            testInfo,
            baseUrlChart,
            CANVAS_SELECTOR,
            "2020-11-30",
            "2021-02-15"
        )).data;

    await expect.soft(chartDescription).hasLabel("Constantina Quintanar");    
    await expect.soft(chartDescription).hasLabel("Luis Segura");
    await expect.soft(chartDescription).hasCategory("Jacob Capurro", "High Risk Confirmed");
    await expect.soft(chartDescription).hasCategoryValue("Jason Pagan", 2, "Voided High Risk");
    await expect.soft(chartDescription).hasCategoryValue("Elsa Elias", 12, "Low Risk");
});

test('Chart with one category and integer values - (2020-11-30 - 2021-02-15) - Functional checks', async ({ page }, testInfo) => {
  const baseUrlChart = BASE_URL + '/d/e2740b66-3972-408a-8299-5e7d5af64233/measurements-per-person-1?orgId=1&var-group=All&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';

  const chartDescription: BarChartJson = (await captureAndExtractJsonForInterval(
          page,
          testInfo,
          baseUrlChart,
          CANVAS_SELECTOR,
          "2020-11-30",
          "2021-02-15"
      )).data;

  await expect.soft(chartDescription).hasCategoryValue("Elsa Elias", 12);
});