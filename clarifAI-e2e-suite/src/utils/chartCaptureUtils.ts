import { Page, TestInfo } from "@playwright/test";
import { VisionDeficiency } from "../enums/visionDeficiency";
import { BarChartJson } from "../types";
import { generateImageFileName, generateJsonFileName, logImageAndJson } from "./utils";
import { extractJsonForFunctionalTesting, extractJsonForReadability } from "../chartProcessor";
import { BASE_SCREENSHOT_PATH } from "../constants";

async function captureAndExtractJson(
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string | null,
    deficiencyType: VisionDeficiency,
    extractorType: 'readability' | 'functional'
): Promise<BarChartJson> {
    const screenshotBuffer = await captureScreenshotWithVisionDeficiency(page, outputFilePath, canvasSelector, baseUrlChart, deficiencyType);

    const jsonDeficiency = extractorType === 'readability'
        ? await extractJsonForReadability(screenshotBuffer)
        : await extractJsonForFunctionalTesting(screenshotBuffer);

    logImageAndJson(testInfo, outputFilePath, screenshotBuffer, jsonFilePath, jsonDeficiency);

    return jsonDeficiency.data;
}

// Funzione per fare lo screenshot del canvas
async function screenshotCanvas(
    page: Page,
    outputFilePath: string,
    canvasSelector: string,
    url: string,
    milllisecondsToWait: number = 4000
): Promise<Buffer> {
    await page.goto(url);
    // Attendere che all'interno del canvas termini l'animazione
    await page.waitForTimeout(milllisecondsToWait);
    const canvasElement = await page.waitForSelector(canvasSelector);

    // Concatenare BASE_SCREENSHOT_PATH con outputFilePath se BASE_SCREENSHOT_PATH è valorizzata
    const fullOutputFilePath = BASE_SCREENSHOT_PATH ? `${BASE_SCREENSHOT_PATH}/${outputFilePath}` : undefined;

    // Fare uno screenshot dell'elemento canvas
    // await canvasElement.screenshot({ path: outputFilePath });
    // console.log(`Screenshot del canvas salvato in: ${outputFilePath}`);
    return await canvasElement.screenshot({ type: 'png', path: fullOutputFilePath });
}

// Funzione per catturare screenshot con diversi deficit visivi
async function captureScreenshotWithVisionDeficiency(
    page: Page,
    outputFilePath: string,
    canvasSelector: string,
    url: string,
    deficiency: VisionDeficiency,
    milllisecondsToWait: number = 4000
): Promise<Buffer> {
    const client = await page.context().newCDPSession(page);
    await client.send("Emulation.setEmulatedVisionDeficiency", {
        type: deficiency
    });
    return await screenshotCanvas(page, outputFilePath, canvasSelector, url, milllisecondsToWait);
}

export async function captureAndExtractJsonForReadability(
    page: Page,
    testInfo: TestInfo,
    baseUrlChart: string,
    canvasSelector: string,
    outputFilePath: string,
    jsonFilePath: string | null,
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
    from: string,
    to: string
): Promise<BarChartJson> {
    return captureAndExtractJsonForFunctionalTesting(
        page,
        testInfo,
        `${baseUrlChart}&from=${Date.parse(from)}&to=${Date.parse(to)}`,
        canvasSelector,
        generateImageFileName('chart', from, to),
        generateJsonFileName('api-response', from, to)
    );
}