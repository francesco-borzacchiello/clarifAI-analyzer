import { Page, TestInfo } from "@playwright/test";
import { BarChartJson, ClarifAIConverterAnalysisResult, Labels } from "../types";
import { captureAndExtractJsonForReadability } from "./chartCaptureUtils";
import { VisionDeficiency } from "../enums/visionDeficiency";
import { expect } from "../assertions/readabilityAssertions";
import { logJson } from "./utils";

export async function getNormalVisionReference(
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string | null = null
): Promise<ClarifAIConverterAnalysisResult> {
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

export async function testReadabilityWithNormalVision(
    oracle : BarChartJson,
    page: Page, 
    testInfo: TestInfo, 
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string | null = null
){
    logJson(testInfo, "oracle.json", oracle)

    const jsonNormalVision = await getNormalVisionReference(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        outputFilePath,
        jsonFilePath
    );

    expect(oracle).isReadable(jsonNormalVision, "is readable")
}