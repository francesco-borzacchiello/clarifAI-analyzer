import { Page, TestInfo } from '@playwright/test';
import { VisionDeficiency } from '../enums/visionDeficiency';
import { BarChartJson, captureScreenshotWithVisionDeficiency, extractJsonFromBarChart, logImageAndJson, equalsJsons, logJson} from './utils';
import { expect } from './customAssertions';

async function captureAndExtractJson(
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string, 
    deficiencyType: VisionDeficiency
): Promise<BarChartJson> {
    await captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart, outputFilePath, deficiencyType);

    const jsonDeficiency = await extractJsonFromBarChart(outputFilePath);

    logImageAndJson(testInfo, outputFilePath, jsonFilePath, jsonDeficiency);

    return jsonDeficiency;
}

export async function testNormalVision(
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string
): Promise<BarChartJson> {
    return await captureAndExtractJson(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        outputFilePath,
        jsonFilePath,
        VisionDeficiency.None
    );
}

export async function testVisionDeficiencyVersusNormalVision(
    page: Page, 
    testInfo: TestInfo,
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string, 
    deficiencyType: VisionDeficiency,
    oracle: BarChartJson | null = null
) {
    const jsonDeficiency = await captureAndExtractJson(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        outputFilePath,
        jsonFilePath,
        deficiencyType
    );

    if (oracle) logJson(testInfo, "oracle.json", oracle);

    await expect(
        !oracle
        ? await testNormalVision(
            page,
            testInfo,
            baseUrlChart,
            canvasSelector,
            "normal-vision-reference.png",
            "normal-vision-reference.json"
        ) : oracle
    ).isAccessibleWithVisionDeficiency(jsonDeficiency, ` in ${deficiencyType} vision`);

    /*
    equalsJsons(
        !oracle
        ? await testNormalVision(
            page,
            testInfo,
            baseUrlChart,
            canvasSelector,
            "normal-vision-reference.png",
            "normal-vision-reference.json"
        ) : oracle,
        jsonDeficiency,
        ` in ${deficiencyType} vision`
    );
    */
}

export async function testProtanopia(
    page: Page, 
    testInfo: TestInfo,
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string,
    oracle: BarChartJson | null = null
) {
    return await testVisionDeficiencyVersusNormalVision(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        outputFilePath,
        jsonFilePath,
        VisionDeficiency.Protanopia,
        oracle
    );
}

export async function testDeuteranopia(
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string,
    oracle: BarChartJson | null = null
) {
    return await testVisionDeficiencyVersusNormalVision(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        outputFilePath,
        jsonFilePath,
        VisionDeficiency.Deuteranopia,
        oracle
    );
}

export async function testTritanopia(
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string,
    oracle: BarChartJson | null = null
) {
    return await testVisionDeficiencyVersusNormalVision(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        outputFilePath,
        jsonFilePath,
        VisionDeficiency.Tritanopia,
        oracle
    );
}