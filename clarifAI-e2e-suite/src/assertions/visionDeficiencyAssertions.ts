import { test, expect as baseExpext } from '@playwright/test';
import { BarChartJson } from '../types';

export const expect = baseExpext.extend({
  async isAccessibleWithVisionDeficiency(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
  ) {
    const { assertions, failures } = equalsJsons(oracle, effective, errorMessage);
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
  
  async isReadable(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
  ) {
    const { assertions, failures } = equalsJsons(oracle, effective, errorMessage);
    const percentage = (failures / assertions) * 100;
    
    let readabilityMessage: string;
    if (percentage === 0) readabilityMessage = 'fully readable';
    else if (percentage <= 50) readabilityMessage = 'partially readable';
    else readabilityMessage = 'not readable';

    let resultMessage = `The chart is ${readabilityMessage}. Assertions: ${assertions}, Failures: ${failures}, Percentage: ${percentage.toFixed(2)}%`;

    test.info().annotations.push({
        type: "readability-check",
        description: resultMessage
    });

    return {
      pass: percentage === 0,
      message: () => resultMessage
    };
  }
});

export function equalsJsons(
  oracle: BarChartJson,
  effective: BarChartJson,
  errorMessage: string
) {
  let assertions = 0;
  let failures = 0;

  for (const key in oracle) {
      assertions++;
      baseExpext.soft(effective[key], `${key} ${errorMessage}`).toBeDefined();
      if (effective[key]) {
          for (const subKey in oracle[key]) {
              assertions++;
              baseExpext.soft(effective[key][subKey], `${key}.${subKey} ${errorMessage}`).toBeDefined();
              if (effective[key][subKey] !== undefined) {
                  baseExpext.soft(
                      oracle[key][subKey] === effective[key][subKey],
                      `${key} - ${subKey}: ${oracle[key][subKey]} = ${effective[key][subKey]}`
                  ).toBeTruthy();
                  if (oracle[key][subKey] !== effective[key][subKey]) failures++;
              } else failures++;
          }
          const oracleSubKeys = new Set(Object.keys(oracle[key]));
          const effectiveSubKeys = new Set(Object.keys(effective[key]));
          // Calcolare l'insieme delle subkey che sono in effective ma non in oracle
          const difference = [...effectiveSubKeys].filter(subKey => !oracleSubKeys.has(subKey));
          for (const subKey of difference) {
              assertions++;
              baseExpext.soft(oracle[key][subKey], `...`).not.toBeDefined();
              if (oracle[key][subKey]) failures++;
          }
      } else failures++;
  }

  return { assertions, failures };
}