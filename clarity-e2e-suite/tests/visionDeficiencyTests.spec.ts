import { test } from '@playwright/test';
import { testNormalVision, testDeuteranopia, testProtanopia, testTritanopia, testVisionDeficiencyVersusNormalVision} from '../src/utils/visionDeficiencyUtils';
import { generateImageFileName, generateJsonFileName, generateUrlWithParams } from '../src/utils/utils';
import { VisionDeficiency } from '../src/enums/visionDeficiency';
import { testCases } from '../src/testCases';
import { BarChartJson, equalsJsons } from '../src/types';
import { login } from '../src/utils/authUtils';
import { BASE_URL, CANVAS_SELECTOR } from '../src/constants';
import { debug } from 'console';

test.beforeEach(async ({ page }) => {
    // await page.setViewportSize({ width: 1536, height: 825 });
   await login(page);
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus protanopia', async ({ page }, testInfo) => {
    let from = 1606777200000, to = 1630792800000;
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + from + "&to=" + to;

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
    let from = 1606777200000, to = 1630792800000;
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + from + "&to=" + to;

    await testDeuteranopia(
        page,
        testInfo,
        baseUrlChart,
        CANVAS_SELECTOR,
        generateImageFileName('chart-3', from, to, VisionDeficiency.Deuteranopia),
        generateJsonFileName('api-response', from, to, VisionDeficiency.Deuteranopia)
    );
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus tritanopia', async ({ page }, testInfo) => {
    let from = 1606777200000, to = 1630792800000;
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + from + "&to=" + to;

    await testTritanopia(
        page,
        testInfo,
        baseUrlChart,
        CANVAS_SELECTOR,
        generateImageFileName('chart-3', from, to, VisionDeficiency.Tritanopia),
        generateJsonFileName('api-response', from, to, VisionDeficiency.Tritanopia)
    );
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision', async ({ page }, testInfo) => {
    let from = 1606777200000, to = 1630792800000;
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + from + "&to=" + to;

    const oracle = {
        "Agust--in Maugus": {
            "Low Risk": 2
        },
        "Ben Cumpton": {
            "Low Risk": 80,
            "Unverified High Risk": 2,
            "Voided High Risk": 1
        },
        "Constantina Quintanar": {
            "Low Risk": 104,
            "Unverified High Risk": 22
        },
        "DeLgado": {
            "Low Risk": 26
        },
        "Deanna Rosheck": {
            "High Risk Confirmed": 5,
            "Low Risk": 267,
            "Preliminar High Risk": 3,
            "Unverified High Risk": 4,
            "Voided High Risk": 15
        },
        "Drake Ferguson": {
            "High Risk Confirmed": 1,
            "Low Risk": 17,
            "Preliminar High Risk": 1,
            "Unverified High Risk": 5
        },
        "Elsa Elias": {
            "Low Risk": 45,
            "Unverified High Risk": 1
        },
        "Estephanie Diaz": {
            "Low Risk": 123,
            "Voided High Risk": 5
        },
        "Felipe Kason": {
            "Low Risk": 102,
            "Voided High Risk": 4,
            "Preliminar High Risk": 1,
            "High Risk Confirmed": 1
        },
        "Ivania Torres": {
            "Low Risk": 67
        }
    };
    const jsonNormalVision = 
    await testNormalVision(
        page,
        testInfo,
        baseUrlChart,
        CANVAS_SELECTOR,
        generateImageFileName('chart-3', from, to, VisionDeficiency.None),
        generateJsonFileName('api-response', from, to, VisionDeficiency.None)
    );

    equalsJsons(oracle, jsonNormalVision, " in normal vision");
});

test.describe.parallel('Grafici - Test visivi', () => {
    Object.entries(testCases).forEach(([name, { url, oracle, from, to }]) => {
        let calculatedOracle: BarChartJson | null = oracle ?? null;;
        let baseUrlChart = BASE_URL + url;
        let visionDeficiencies = oracle
            ? Object.values(VisionDeficiency)
            : Object.values(VisionDeficiency).filter(vd => vd !== VisionDeficiency.None);

        test.describe(name, () => {
            visionDeficiencies.forEach(visionType => {
                test(visionType, async ({ page }, testInfo) => {
                    await test.step('Compute oracle if not provided', async () => {
                        if (!oracle) {
                            console.log("Compute oracle");
                            calculatedOracle = await testNormalVision(
                                page,
                                testInfo,
                                generateUrlWithParams(baseUrlChart, from, to),
                                CANVAS_SELECTOR,
                                generateImageFileName(name, from, to, VisionDeficiency.None)
                            );
                        }
                    });

                    await test.step(`Test vision deficiency: ${visionType}`, async () => {
                        await testVisionDeficiencyVersusNormalVision(
                            page,
                            testInfo,
                            generateUrlWithParams(baseUrlChart, from, to),
                            CANVAS_SELECTOR,
                            generateImageFileName(name, from, to, visionType),
                            generateJsonFileName('api-response', from, to, visionType),
                            visionType,
                            calculatedOracle
                        );
                    });
                });                
            });
        });
    });
});

/*
test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - get screenshot', async ({ page }, testInfo) => {
    const baseUrlChart = baseUrl + '/d/bc8fe775-01d8-4fd5-b1c4-760e96eda404/baseline-percentage-2-coral?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';


    await utils.screenshotCanvas(page, '[data-zr-dom-id="zr_0"]', baseUrlChart, "chart2-coral-with-legend.png");
});
*/