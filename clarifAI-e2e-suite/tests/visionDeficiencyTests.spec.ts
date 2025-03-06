import { test } from '@playwright/test';
import { testDeuteranopia, testProtanopia, testTritanopia, testVisionDeficiencyVersusNormalVision} from '../src/utils/visionDeficiencyUtils';
import { generateImageFileName, generateJsonFileName, generateUrlWithParams } from '../src/utils/utils';
import { VisionDeficiency } from '../src/enums/visionDeficiency';
import { testCases } from '../src/testCases';
import { login } from '../src/utils/authUtils';
import { BASE_URL, CANVAS_SELECTOR } from '../src/constants';

test.beforeEach(async ({ page }) => {
   await login(page);
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus protanopia', async ({ page }, testInfo) => {
    let from = "2020-12-01", to = "2021-09-05";
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + Date.parse(from) + "&to=" + Date.parse(to);

    await testProtanopia(
        page,
        testInfo,
        baseUrlChart,
        CANVAS_SELECTOR,
        generateImageFileName('chart-3', from, to, VisionDeficiency.Protanopia),
        generateJsonFileName('api-response', from, to, VisionDeficiency.Protanopia)
    );
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus deuteranopia', async ({ page }, testInfo) => {
    let from = "2020-12-01", to = "2021-09-05";
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + Date.parse(from) + "&to=" + Date.parse(to);

    await testDeuteranopia(
        page,
        testInfo,
        baseUrlChart,
        CANVAS_SELECTOR,
        generateImageFileName('chart-3', from, to, VisionDeficiency.Deuteranopia),
        generateJsonFileName('api-response', from, to, VisionDeficiency.Deuteranopia)
    );
});

test('Chart with legend and integer values - (2020-12-01 - 2021-09-05) - normal vision versus tritanopia', async ({ page }, testInfo) => {
    let from = "2020-12-01", to = "2021-09-05";
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + Date.parse(from) + "&to=" + Date.parse(to);

    await testTritanopia(
        page,
        testInfo,
        baseUrlChart,
        CANVAS_SELECTOR,
        generateImageFileName('chart-3', from, to, VisionDeficiency.Tritanopia),
        generateJsonFileName('api-response', from, to, VisionDeficiency.Tritanopia)
    );
});

test.describe.parallel('Grafici - Test visivi', () => {
    Object.entries(testCases).forEach(([name, { url, oracle, from, to }]) => {
        let baseUrlChart = `${BASE_URL + url}&from=${Date.parse(from)}&to=${Date.parse(to)}`;
        let visionDeficiencies = oracle
            ? Object.values(VisionDeficiency)
            : Object.values(VisionDeficiency).filter(vd => vd !== VisionDeficiency.None);

        test.describe.parallel(name, () => {
            visionDeficiencies.forEach(visionType => {
                test(visionType, async ({ page }, testInfo) => {
                    await testVisionDeficiencyVersusNormalVision(
                        page,
                        testInfo,
                        generateUrlWithParams(baseUrlChart, from, to),
                        CANVAS_SELECTOR,
                        generateImageFileName(name, from, to, visionType),
                        generateJsonFileName('api-response', from, to, visionType),
                        visionType,
                        oracle
                    );
                });                
            });
        });
    });
});