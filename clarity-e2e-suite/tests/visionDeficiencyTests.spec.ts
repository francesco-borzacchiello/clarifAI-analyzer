import { test, expect, Page, TestInfo } from '@playwright/test';
import { testNormalVision, testDeuteranopia, testProtanopia, testTritanopia, testVisionDeficiencyVersusNormalVision} from '../src/utils/visionDeficiencyUtils';
import { BarChartJson, generateFileName, generateJsonFileName, equalsJsons } from '../src/utils/utils';
import { VisionDeficiency } from '../src/enums/visionDeficiency';

const baseUrl = 'http://localhost:3000';

const canvasSelector = '[data-zr-dom-id="zr_0"]'

const testCases = {
    'chart-3 - solaris - (2020-12-01 - 2021-09-05)': {
        url: '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        oracle:
    {
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
    },
        from: 1606777200000,
        to: 1630792800000
    }
}

test.beforeEach(async ({ page }, testInfo) => {
    // await page.setViewportSize({ width: 1536, height: 825 });

    await page.goto(baseUrl);

    await page.getByPlaceholder('email or username').click();
    await page.getByPlaceholder('email or username').fill('admin');
    await page.getByPlaceholder('password').click();
    await page.getByPlaceholder('password').fill('admin');
    await page.getByLabel('Login button').click();
    await page.getByLabel('Skip change password button').click();
});

/*
async function testVisionDeficiency(page: Page, testInfo: TestInfo, baseUrlChart: String, from: Number, to: Number, deficiencyType: VisionDeficiency) {
    const canvasSelector = '[data-zr-dom-id="zr_0"]';
    let outputFilePath = `chart-3-from=${from}-to=${to}-${deficiencyType}+test.png`;

    await utils.captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart + "&from=" + from + "&to=" + to, outputFilePath, deficiencyType);

    const jsonDeficiency = await utils.extractJsonFromBarChart(outputFilePath);

    utils.logImageAndJson(testInfo, outputFilePath, `api-response-from=${from}-to=${to}-${deficiencyType}.json`, jsonDeficiency);

    return jsonDeficiency;
}

async function testProtanopia(page, testInfo, baseUrlChart, from, to) {
    return await testVisionDeficiency(page, testInfo, baseUrlChart, from, to, VisionDeficiency.Protanopia);
}

async function testDeuteranopia(page, testInfo, baseUrlChart, from, to) {
    return await testVisionDeficiency(page, testInfo, baseUrlChart, from, to, VisionDeficiency.Deuteranopia);
}

async function testTritanopia(page, testInfo, baseUrlChart, from, to) {
    return await testVisionDeficiency(page, testInfo, baseUrlChart, from, to, VisionDeficiency.Tritanopia);
}
*/

/*
test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus protanopia', async ({ page }, testInfo) => {
    let from = 1606777200000, to = 1630792800000;
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + from + "&to=" + to;

    await testProtanopia(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        generateFileName('chart-3', from, to, VisionDeficiency.Protanopia),
        generateJsonFileName('api-response', from, to, VisionDeficiency.Protanopia)
    );
});


test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus deuteranopia', async ({ page }, testInfo) => {
    let from = 1606777200000, to = 1630792800000;
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + from + "&to=" + to;

    await testDeuteranopia(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        generateFileName('chart-3', from, to, VisionDeficiency.Deuteranopia),
        generateJsonFileName('api-response', from, to, VisionDeficiency.Deuteranopia)
    );
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus tritanopia', async ({ page }, testInfo) => {
    let from = 1606777200000, to = 1630792800000;
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + from + "&to=" + to;

    await testTritanopia(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        generateFileName('chart-3', from, to, VisionDeficiency.Tritanopia),
        generateJsonFileName('api-response', from, to, VisionDeficiency.Tritanopia)
    );
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision', async ({ page }, testInfo) => {
    let from = 1606777200000, to = 1630792800000;
    const baseUrlChart = baseUrl + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + from + "&to=" + to;

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
        canvasSelector,
        generateFileName('chart-3', from, to, VisionDeficiency.None),
        generateJsonFileName('api-response', from, to, VisionDeficiency.None)
    );

    equalsJsons(oracle, jsonNormalVision, " in normal vision");
});
*/

test.describe('Grafici - Test visivi', () => {
    Object.entries(testCases).forEach(([chartName, { url, oracle, from, to }]) => {
        let calculatedOracle: BarChartJson | null = oracle;
        
        test.beforeEach(async ({ page }) => {
            if (!oracle) {
                const baseUrlChart = baseUrl + url;
                calculatedOracle = await testNormalVision(
                    page,
                    test.info(),
                    baseUrlChart,
                    canvasSelector,
                    generateFileName(chartName, from, to, VisionDeficiency.None),
                    generateJsonFileName('api-response', from, to, VisionDeficiency.None)
                );
            }
        });

        [VisionDeficiency.None, VisionDeficiency.Protanopia, VisionDeficiency.Deuteranopia, VisionDeficiency.Tritanopia].forEach(visionDeficiency => {
            test(`${chartName} - ${visionDeficiency}`, async ({ page }) => {
                const testInfo = test.info();

                const baseUrlChart = baseUrl + url;
                await testVisionDeficiencyVersusNormalVision(
                    page,
                    testInfo,
                    baseUrlChart,
                    canvasSelector,
                    generateFileName(chartName, from, to, visionDeficiency),
                    generateJsonFileName('api-response', from, to, visionDeficiency),
                    visionDeficiency,
                    calculatedOracle
                );
            });
        });
    });
});

/*
test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - get screenshot', async ({ page }, testInfo) => {
    const baseUrlChart = baseUrl + '/d/bc8fe775-01d8-4fd5-b1c4-760e96eda404/baseline-percentage-2-coral?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';


    await utils.screenshotCanvas(page, '[data-zr-dom-id="zr_0"]', baseUrlChart, "chart2-coral-with-legend.png");
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus protanopia - test', async ({ page }, testInfo) => {
    const baseUrlChart = baseUrl + '/d/b1ccae45-b9cf-4be3-8cc7-121e8d5c89d0/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3-deficit-test?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';
    let from = 1606777200000, to = 1630792800000;

    const jsonNormalVision = await testVisionDeficiency(page, testInfo, baseUrlChart, from, to, VisionDeficiency.None);
    const jsonProtanopia = await testProtanopia(page, testInfo, baseUrlChart, from, to);

    utils.equalsJsons(jsonNormalVision, jsonProtanopia, " in protanopia vision");
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus deuteranopia - test', async ({ page }, testInfo) => {
    const baseUrlChart = baseUrl + '/d/d90d4718-daef-45e5-9e61-ba9a91cf7d06/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3-deuteranopia?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';
    let from = 1606777200000, to = 1630792800000;

    const jsonNormalVision = await testVisionDeficiency(page, testInfo, baseUrlChart, from, to, VisionDeficiency.None);
    const jsonDeuteranopia = await testDeuteranopia(page, testInfo, baseUrlChart, from, to);

    utils.equalsJsons(jsonNormalVision, jsonDeuteranopia, " in deuteranopia vision");
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - normal vision versus tritanopia - test', async ({ page }, testInfo) => {
    const baseUrlChart = baseUrl + '/d/b1ccae45-b9cf-4be3-8cc7-121e8d5c89d0/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3-deficit-test?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db';
    let from = 1606777200000, to = 1630792800000;

    const jsonNormalVision = await testVisionDeficiency(page, testInfo, baseUrlChart, from, to, VisionDeficiency.None);
    const jsonTritanopia = await testTritanopia(page, testInfo, baseUrlChart, from, to);

    utils.equalsJsons(jsonNormalVision, jsonTritanopia, " in tritanopia vision");
});
*/