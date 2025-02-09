import { expect, Page, TestInfo } from '@playwright/test';
import axios from 'axios'; // Assicurati di installare axios: npm install axios
import fs from 'fs'; // Libreria nativa per leggere i file
import FormData from 'form-data';
import { VisionDeficiency } from '../enums/visionDeficiency';

interface RiskCounts {
    [riskCategory: string]: number;
}

export interface BarChartJson {
    [personName: string]: RiskCounts;
}

export async function extractJsonFromBarChart(imagePath: string): Promise<BarChartJson> {
    const apiUrl = 'http://127.0.0.1:5000/extract-json-from-horizontal-bar-chart';
    try {
        const fileBuffer = fs.readFileSync(imagePath); // Legge il file come buffer
        const formData = new FormData();
        formData.append('image', fileBuffer, { filename: 'chart.png' }); // Aggiunge il file al payload

        const response = await axios.post(apiUrl, formData, {
            headers: formData.getHeaders(), // Imposta gli header corretti
        });

        return response.data;
    } catch (error) {
        console.error('Error calling the API:', error);
        throw error;
    }
}

export function compareJsons(json1: BarChartJson, json2: BarChartJson) {
    for (const key in json1) {
        if (json2[key]) {
            for (const subKey in json1[key]) {
                if (json2[key][subKey] !== undefined) {
                    expect(
                        json2[key][subKey] < json1[key][subKey],
                        `${key} - ${subKey}: ${json2[key][subKey]} < ${json1[key][subKey]}`
                    ).toBeTruthy();
                }
            }
        }
    }
}

export function equalsJsons(
    json1: BarChartJson,
    json2: BarChartJson,
    errorMessage: string
) {
    for (const key in json1) {
        expect.soft(json2[key], `${key} ${errorMessage}`).toBeDefined();
        if (json2[key]) {
            for (const subKey in json1[key]) {
                expect.soft(json2[key][subKey], `${key}.${subKey} ${errorMessage}`).toBeDefined();
                if (json2[key][subKey] !== undefined) {
                    expect.soft(
                        json1[key][subKey] === json2[key][subKey],
                        `${key} - ${subKey}: ${json1[key][subKey]} = ${json2[key][subKey]}`
                    ).toBeTruthy();
                }
            }
        }
    }
}

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
    fileNameJson: string,
    json: BarChartJson
) {
    testInfo.attach(imagePath, {
        path: imagePath,
        contentType: 'image/png',
    });
    logJson(testInfo, fileNameJson, json);
}

export function logJson(testInfo: TestInfo, fileNameJson: string, json: BarChartJson) {
    testInfo.attach(fileNameJson, {
        contentType: 'application/json',
        body: JSON.stringify(json, null, 2),
    });
}

export function generateFileName(
    baseName: string,
    from: number,
    to: number,
    deficiencyType: VisionDeficiency
): string {
    return `${baseName}-from=${from}-to=${to}-${deficiencyType}.png`;
}

export function generateJsonFileName(
    baseName: string,
    from: number,
    to: number,
    deficiencyType: VisionDeficiency
): string {
    return `${baseName}-from=${from}-to=${to}-${deficiencyType}.json`;
}