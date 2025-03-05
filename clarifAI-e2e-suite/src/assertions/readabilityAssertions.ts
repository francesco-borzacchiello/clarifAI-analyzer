import { test, expect as baseExpext } from '@playwright/test';
import { BarChartJson } from "../types";
import { equalsChartJsons } from '../utils/chartJsonComparisonUtils';

export const expect = baseExpext.extend({
  async isReadable(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
  ) {
    const { assertions, failures, mismatchedItems, falsePositive } = equalsChartJsons(oracle, effective, errorMessage);
    const percentage = (failures / assertions) * 100;
    
    let readabilityMessage: string;
    if (percentage === 0) readabilityMessage = 'fully readable';
    else if (percentage <= 50) readabilityMessage = 'partially readable';
    else readabilityMessage = 'not readable';

    let resultMessage = `The chart is ${readabilityMessage}. Assertions: ${assertions}, Failures: ${failures}, Failure rate: ${percentage.toFixed(2)}%`;

    test.info().annotations.push({
        type: "readability-check",
        description: resultMessage
    });

    if(percentage > 0 && mismatchedItems.size > 0){
      // Count the total number of elements in all sets
      const totalMismatchedElements = Array.from(mismatchedItems.values())
        .reduce((acc, categories) => acc + categories.size, 0);

      if(totalMismatchedElements > 0) {
        // Calculate totalCategoriesInOracle
        const totalCategoriesInOracle = Object.values(oracle)
          .reduce((total, categories) => total + Object.keys(categories).length, 0);

        const mismatchedItemsList = Array.from(mismatchedItems)
          .map(([label, categories]) => {
            const oracleCategoriesCount = oracle[label] ? Object.keys(oracle[label]).length : 0;
            return `- For employee ${label}, ${categories.size} out of ${oracleCategoriesCount}: ${Array.from(categories).join(', ')}`;
          }).join('\n');
      
        test.info().annotations.push({
          type: "Values of risk categories with readability problems",
          description: `${totalMismatchedElements} on ${totalCategoriesInOracle} (${((totalMismatchedElements / totalCategoriesInOracle) * 100).toFixed(2)}%), in detail:\n${mismatchedItemsList}`
        });
      }

      const totalUnexpectedCategories = Object.values(falsePositive)
        .reduce((acc, categories) => acc + Object.keys(categories).length, 0);

      if(totalUnexpectedCategories > 0) {
        let falsePositiveList = Object.entries(falsePositive)
          .map(([label, categories]) => {
            const categoriesList = Object.entries(categories)
              .map(([category, value]) => {
                const valueString = value ? ` value ${value}` : 'out value';
                return `${category} with${valueString}`;
              }).join(', ');
            return `- For employee ${label}: ${categoriesList}`;
          }).join('\n');
        
        test.info().annotations.push({
          type: "Unexpected Categories of Risk",
          description: `Altogether there are ${totalUnexpectedCategories} unexpected categories of risk, in detail:\n${falsePositiveList}`
        });
      }
    }

    return {
      pass: percentage === 0,
      message: () => resultMessage
    };
  }
});