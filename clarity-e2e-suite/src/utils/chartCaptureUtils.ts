import { Page, TestInfo } from "@playwright/test";
import { VisionDeficiency } from "../enums/visionDeficiency";
import { BarChartJson } from "../types";
import { captureScreenshotWithVisionDeficiency, generateImageFileName, generateJsonFileName, logImageAndJson } from "./utils";
import { extractJsonForFunctionalTesting, extractJsonForReadability } from "../chartProcessor";

async function captureAndExtractJson(
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string | null = null, 
    deficiencyType: VisionDeficiency,
    extractorType: 'readability' | 'functional'
): Promise<BarChartJson> {
    await captureScreenshotWithVisionDeficiency(page, canvasSelector, baseUrlChart, outputFilePath, deficiencyType);

    const jsonDeficiency = extractorType === 'readability'
        ? await extractJsonForReadability(outputFilePath)
        : await extractJsonForFunctionalTesting(outputFilePath);

    logImageAndJson(testInfo, outputFilePath, jsonFilePath, jsonDeficiency);

    return jsonDeficiency;
}

export async function captureAndExtractJsonForReadability(
    page: Page,
    testInfo: TestInfo,
    baseUrlChart: string,
    canvasSelector: string,
    outputFilePath: string,
    jsonFilePath: string | null = null,
    deficiencyType: VisionDeficiency
): Promise<BarChartJson> {
    return captureAndExtractJson(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        outputFilePath,
        jsonFilePath,
        deficiencyType,
        'readability'
    );
}

export async function captureAndExtractJsonForFunctionalTesting(
    page: Page,
    testInfo: TestInfo,
    baseUrlChart: string,
    canvasSelector: string,
    outputFilePath: string,
    jsonFilePath: string
): Promise<BarChartJson> {
    return captureAndExtractJson(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        outputFilePath,
        jsonFilePath,
        VisionDeficiency.None,
        'functional'
    );
}

export async function captureAndExtractJsonForInterval(
    page: Page,
    testInfo: TestInfo,
    baseUrlChart: string,
    canvasSelector: string,
    from: number,
    to: number
): Promise<BarChartJson> {
    return captureAndExtractJsonForFunctionalTesting(
        page,
        testInfo,
        `${baseUrlChart}&from=${from}&to=${to}`,
        canvasSelector,
        generateImageFileName('chart', from, to),
        generateJsonFileName('api-response', from, to)
    );
}