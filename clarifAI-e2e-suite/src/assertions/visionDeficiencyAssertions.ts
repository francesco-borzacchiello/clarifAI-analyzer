import { test, expect as baseExpext } from '@playwright/test';
import { BarChartJson } from '../types';
import { equalsChartJsons } from '../utils/chartJsonComparisonUtils';

export const expect = baseExpext.extend({
  async isAccessibleWithVisionDeficiency(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
  ) {
    const { assertions, failures } = equalsChartJsons(oracle, effective, errorMessage);
    const percentage = (failures / assertions) * 100;
    
    let accessibilityMessage: string;
    if (percentage === 0) accessibilityMessage = 'fully accessible';
    else if (percentage <= 50) accessibilityMessage = 'partially accessible';
    else accessibilityMessage = 'not accessible';

    let resultMessagge = `The chart is ${accessibilityMessage}. Assertions: ${assertions}, Failures: ${failures}, Percentage: ${percentage.toFixed(2)}%`;

    test.info().annotations.push({
        type: "accessibility-check",
        description: resultMessagge
    });

    return {
      pass: percentage === 0,
      message: () => resultMessagge
    };
  },
});