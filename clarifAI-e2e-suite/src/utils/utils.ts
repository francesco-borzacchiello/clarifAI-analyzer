import { TestInfo } from '@playwright/test';
import { VisionDeficiency } from '../enums/visionDeficiency';
import { ClarifAIConverterFullResponse, BarChartJson, ClarifAIConverterAnalysisResult } from '../types';

export function logImageAndJson(
    testInfo: TestInfo,
    imageName: string,
    image: Buffer,
    fileNameJson: string | null,
    json: ClarifAIConverterFullResponse
) {
    testInfo.attach(imageName, {
        body: image,
        contentType: 'image/png',
    });

    // Decodifica l'immagine base64
    const imageBuffer = Buffer.from(json.processed_image, 'base64');

    // Allegare l'immagine decodificata
    testInfo.attach(`processed_${imageName}`, {
        body: imageBuffer,
        contentType: 'image/png',
    });


    if (fileNameJson){
        const { processed_image, ...jsonWithoutImage } = json;
        logJson(testInfo, fileNameJson, jsonWithoutImage);
    }
}

export function logJson(testInfo: TestInfo, fileNameJson: string, json: BarChartJson | ClarifAIConverterAnalysisResult) {
    testInfo.attach(fileNameJson, {
        contentType: 'application/json',
        body: JSON.stringify('data' in json ? (json as ClarifAIConverterAnalysisResult).data : json, null, 2),
    });

    if ('data' in json) {
        testInfo.attach(`complete_${fileNameJson}`, {
            contentType: 'application/json',
            body: JSON.stringify(json, null, 2),
        });
    }
}

export function generateStringWithOptionalParts(
    baseName: string,
    from: string | null = null,
    to: string | null = null,
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
    from: number | null,
    to: number | null,
    deficiencyType?: VisionDeficiency | null
): string;
export function generateImageFileName(
    baseName: string,
    from: string | null,
    to: string | null,
    deficiencyType?: VisionDeficiency | null
): string;
export function generateImageFileName(
    baseName: string,
    from: number | string | null = null,
    to: number | string | null = null,
    deficiencyType: VisionDeficiency | null = null
): string {
    const fromStr = from !== null ? from.toString() : null;
    const toStr = to !== null ? to.toString() : null;
    return generateStringWithOptionalParts(baseName, fromStr, toStr, deficiencyType, 'png');
}


export function generateJsonFileName(
    baseName: string,
    from: string | null = null,
    to: string | null = null,
    deficiencyType: VisionDeficiency | null = null
): string {
    return generateStringWithOptionalParts(baseName, from?.toString(), to?.toString(), deficiencyType, 'json');
}

export function generateUrlWithParams(
    baseUrl: string,
    from: string | null = null,
    to: string | null = null
): string {
    return generateStringWithOptionalParts(baseUrl, from, to, null, null, '&');
}

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }