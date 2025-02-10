import { expect, Page, TestInfo } from '@playwright/test';
import { VisionDeficiency } from '../enums/visionDeficiency';
import { BarChartJson } from '../types';

// Funzione per fare lo screenshot del canvas
export async function screenshotCanvas(
    page: Page,
    canvasSelector: string,
    url: string,
    outputFilePath: string,
    milllisecondsToWait: number = 4000
) {
    await page.goto(url);
    // Attendere che all'interno del canvas termini l'animazione
    await page.waitForTimeout(milllisecondsToWait);
    const canvasElement = await page.waitForSelector(canvasSelector);

    // Fare uno screenshot dell'elemento canvas
    await canvasElement.screenshot({ path: outputFilePath });
    console.log(`Screenshot del canvas salvato in: ${outputFilePath}`);
}

// Funzione per catturare screenshot con diversi deficit visivi
export async function captureScreenshotWithVisionDeficiency(
    page: Page,
    canvasSelector: string,
    url: string,
    fileName: string,
    deficiency: VisionDeficiency,
    milllisecondsToWait: number = 4000
) {
    const client = await page.context().newCDPSession(page);
    await client.send("Emulation.setEmulatedVisionDeficiency", {
        type: deficiency
    });
    await screenshotCanvas(page, canvasSelector, url, fileName, milllisecondsToWait);
}

export function logImageAndJson(
    testInfo: TestInfo,
    imagePath: string,
    fileNameJson: string | null,
    json: BarChartJson
) {
    testInfo.attach(imagePath, {
        path: imagePath,
        contentType: 'image/png',
    });

    if (fileNameJson)
        logJson(testInfo, fileNameJson, json);
}

export function logJson(testInfo: TestInfo, fileNameJson: string, json: BarChartJson) {
    testInfo.attach(fileNameJson, {
        contentType: 'application/json',
        body: JSON.stringify(json, null, 2),
    });
}

export function generateStringWithOptionalParts(
    baseName: string,
    from: number | null = null,
    to: number | null = null,
    deficiencyType: VisionDeficiency | null = null,
    extension: string | null = null,
    delimiter: string = '-'
): string {
    const fromToPart = from !== null && to !== null ? `${delimiter}from=${from}${delimiter}to=${to}` : '';
    const deficiencyPart = deficiencyType !== null ? `${delimiter}${deficiencyType}` : '';
    const extensionPart = extension !== null ? `.${extension}` : '';
    return `${baseName}${fromToPart}${deficiencyPart}${extensionPart}`;
}

export function generateImageFileName(
    baseName: string,
    from: number | null = null,
    to: number | null = null,
    deficiencyType: VisionDeficiency | null = null
): string {
    return generateStringWithOptionalParts(baseName, from, to, deficiencyType, 'png');
}

export function generateJsonFileName(
    baseName: string,
    from: number | null = null,
    to: number | null = null,
    deficiencyType: VisionDeficiency | null = null
): string {
    return generateStringWithOptionalParts(baseName, from, to, deficiencyType, 'json');
}

export function generateUrlWithParams(
    baseUrl: string,
    from: number | null = null,
    to: number | null = null
): string {
    return generateStringWithOptionalParts(baseUrl, from, to, null, null, '&');
}