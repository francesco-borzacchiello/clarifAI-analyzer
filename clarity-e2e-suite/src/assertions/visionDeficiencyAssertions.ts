import { test, expect as baseExpext } from '@playwright/test';
import { BarChartJson, equalsJsons } from '../types';

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
});