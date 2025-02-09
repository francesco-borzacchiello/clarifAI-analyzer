import { test, expect as baseExpext } from '@playwright/test';
import { BarChartJson, equalsJsons, generateFileName, generateJsonFileName } from './utils';
import { VisionDeficiency } from '../enums/visionDeficiency';
import { testProtanopia, testVisionDeficiencyVersusNormalVision } from './visionDeficiencyUtils';

export const expect = baseExpext.extend({
  async isAccessibleWithVisionDeficiency(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
) {
    const { assertions, failures } = equalsJsons(oracle, effective, errorMessage);
    const percentage = (failures / assertions) * 100;
    
    const accessibilityMessage = percentage === 0
      ? 'fully accessible'
      : percentage <= 50
      ? 'partially accessible'
      : 'not accessible';

    let resultMessagge = `The chart is ${accessibilityMessage}. Assertions: ${assertions}, Failures: ${failures}, Percentage: ${percentage.toFixed(2)}%`;

    test.info().annotations.push({
        type: "accessibility-check",
        description: resultMessagge
    });

    return {
      pass: percentage === 0,
      message: () => resultMessagge
    };
  }

/*
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
  }
*/
});