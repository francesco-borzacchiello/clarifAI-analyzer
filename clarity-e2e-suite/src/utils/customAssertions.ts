import { expect, Page } from '@playwright/test';
import { BarChartJson } from './utils';
import { VisionDeficiency } from '../enums/visionDeficiency';
import { testVisionDeficiencyVersusNormalVision } from './visionDeficiencyUtils';

    page: Page, 
    testInfo: TestInfo,
    baseUrlChart: string, 
    canvasSelector: string, 
    outputFilePath: string, 
    jsonFilePath: string,
    oracle: BarChartJson | null = null
)

expect.extend({
  async isAccessibleWithProtanopia(
    page: Page,
     json: BarChartJson, baseUrlChart: string, canvasSelector: string, from: number, to: number) {
    const testInfo = this;
    const outputFilePath = generateFileName('chart-3', from, to, VisionDeficiency.Protanopia);
    const jsonFilePath = generateJsonFileName('api-response', from, to, VisionDeficiency.Protanopia);

    const jsonDeficiency = await testVisionDeficiencyVersusNormalVision(
      page,
      testInfo: TestInfo,
      baseUrlChart,
      canvasSelector,
      outputFilePath,
      jsonFilePath,
      VisionDeficiency.Protanopia,
      json
    );

    return {
      pass: true,
      message: () => `Expected chart to be accessible with Protanopia`,
    };
  },

  async isAccessibleWithDeuteranopia(page, json: BarChartJson, baseUrlChart: string, canvasSelector: string, from: number, to: number) {
    const testInfo = this;
    const outputFilePath = generateFileName('chart-3', from, to, VisionDeficiency.Deuteranopia);
    const jsonFilePath = generateJsonFileName('api-response', from, to, VisionDeficiency.Deuteranopia);

    const jsonDeficiency = await testVisionDeficiencyVersusNormalVision(
      page,
      testInfo,
      baseUrlChart,
      canvasSelector,
      outputFilePath,
      jsonFilePath,
      VisionDeficiency.Deuteranopia,
      json
    );

    return {
      pass: true,
      message: () => `Expected chart to be accessible with Deuteranopia`,
    };
  },

  async isAccessibleWithTritanopia(page, json: BarChartJson, baseUrlChart: string, canvasSelector: string, from: number, to: number) {
    const testInfo = this;
    const outputFilePath = generateFileName('chart-3', from, to, VisionDeficiency.Tritanopia);
    const jsonFilePath = generateJsonFileName('api-response', from, to, VisionDeficiency.Tritanopia);

    const jsonDeficiency = await testVisionDeficiencyVersusNormalVision(
      page,
      testInfo,
      baseUrlChart,
      canvasSelector,
      outputFilePath,
      jsonFilePath,
      VisionDeficiency.Tritanopia,
      json
    );

    return {
      pass: true,
      message: () => `Expected chart to be accessible with Tritanopia`,
    };
  },
});