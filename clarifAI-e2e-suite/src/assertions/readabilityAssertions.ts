import { test, expect as baseExpext } from '@playwright/test';
import { BarChartJson } from "../types";
import { equalsChartJsons } from '../utils/chartJsonComparisonUtils';

export const expect = baseExpext.extend({
  async isReadable(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
  ) {
    const { assertions, failures, mismatchedItems } = equalsChartJsons(oracle, effective, errorMessage);
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

    if(percentage > 0 && mismatchedItems.size > 0){
      // Count the total number of elements in all sets
      const totalMismatchedElements = Array.from(mismatchedItems.values())
        .reduce((acc, categories) => acc + categories.size, 0);

      // Calculate totalCategoriesInOracle
      const totalCategoriesInOracle = Object.values(oracle)
        .reduce((total, categories) => total + Object.keys(categories).length, 0);

      const mismatchedItemsList = Array.from(mismatchedItems)
        .map(([label, categories]) => {
          const oracleCategoriesCount = oracle[label] ? Object.keys(oracle[label]).length : 0;
          return `- ${label} [${categories.size}/${oracleCategoriesCount}]: ${Array.from(categories).join(', ')}`
        }).join('\n');
    
      test.info().annotations.push({
        type: "Parts with readability problems",
        description: `${totalMismatchedElements} values of ${totalCategoriesInOracle}, in detail:\n${mismatchedItemsList}`
      });
    }

    return {
      pass: percentage === 0,
      message: () => resultMessage
    };
  }
});