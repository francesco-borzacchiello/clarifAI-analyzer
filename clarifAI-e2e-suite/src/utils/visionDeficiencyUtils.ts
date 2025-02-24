import { Page, TestInfo } from '@playwright/test';
import { VisionDeficiency } from '../enums/visionDeficiency';
import { logJson } from './utils';
import { expect } from '../assertions/visionDeficiencyAssertions';
import { BarChartJson } from '../types';
import { captureAndExtractJsonForReadability } from './chartCaptureUtils';

export async function testNormalVision(
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string | null = null
): Promise<BarChartJson> {
    return await captureAndExtractJsonForReadability(
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
    const jsonDeficiency = await captureAndExtractJsonForReadability(
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