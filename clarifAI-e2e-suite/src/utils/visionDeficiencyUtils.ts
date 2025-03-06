import test, { Page, TestInfo } from '@playwright/test';
import { VisionDeficiency } from '../enums/visionDeficiency';
import { logJson } from './utils';
import { expect } from '../assertions/visionDeficiencyAssertions';
import { BarChartJson, ClarifAIConverterAnalysisResult } from '../types';
import { captureAndExtractJsonForReadability } from './chartCaptureUtils';
import { getNormalVisionReference } from './readabilityUtils';

export async function testVisionDeficiencyVersusNormalVision(
    page: Page, 
    testInfo: TestInfo,
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string, 
    deficiencyType: VisionDeficiency,
    oracle: ClarifAIConverterAnalysisResult | BarChartJson | null = null
) {
    if (oracle) logJson(testInfo, "oracle.json", oracle)
        else await test.step('Compute oracle using normal vision as a reference', async () => {
            oracle = await getNormalVisionReference(
                page,
                testInfo,
                baseUrlChart,
                canvasSelector,
                "normal-vision-reference.png",
                "normal-vision-reference.json")
            });

    await test.step(`Test vision deficiency: ${deficiencyType}`, async () => {
        const jsonDeficiency = await captureAndExtractJsonForReadability(
            page,
            testInfo,
            baseUrlChart,
            canvasSelector,
            outputFilePath,
            jsonFilePath,
            deficiencyType
        );
        
        if (oracle)
            await expect(oracle)
                .isAccessibleWithVisionDeficiency(jsonDeficiency, deficiencyType);
        else throw new Error("Oracle could not be computed or retrieved.");
    });
}

export async function testProtanopia(
    page: Page, 
    testInfo: TestInfo,
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string,
    oracle: ClarifAIConverterAnalysisResult | null = null
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
    oracle: ClarifAIConverterAnalysisResult | null = null
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
    oracle: ClarifAIConverterAnalysisResult | null = null
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