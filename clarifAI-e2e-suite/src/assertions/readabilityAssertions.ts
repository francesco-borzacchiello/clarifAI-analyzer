import { test, expect as baseExpext } from '@playwright/test';
import { BarChartJson, ClarifAIConverterAnalysisResult } from "../types";
import { equalsChartJsons } from '../utils/chartJsonComparisonUtils';

export const expect = baseExpext.extend({
  async isReadable(
    oracle: BarChartJson,
    effective: ClarifAIConverterAnalysisResult,
    errorMessage: string
  ) {
    const effectiveData: BarChartJson = effective.data;

    const { assertions, failures, mismatchedItems, falsePositive } = equalsChartJsons(oracle, effectiveData, errorMessage);
    const percentage = (failures / assertions) * 100;
    
    let readabilityMessage: string;
    if (percentage === 0) readabilityMessage = 'fully readable';
    else if (percentage <= 50) readabilityMessage = 'partially readable';
    else readabilityMessage = 'not readable';

    let resultMessage = `The chart is ${readabilityMessage}.\n\t● Assertions: ${assertions}\n\t● Failures: ${failures}\n\t● Failure rate: ${percentage.toFixed(2)}%`;

    test.info().annotations.push({
        type: "Readability check",
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
            return `● ${label}, ${categories.size} out of ${oracleCategoriesCount} → ${Array.from(categories).join(', ')}`;
          }).join('\n\t');
      
        test.info().annotations.push({
          type: "Risk Category Values with Readability Issues",
          description: `${totalMismatchedElements} on ${totalCategoriesInOracle} (${((totalMismatchedElements / totalCategoriesInOracle) * 100).toFixed(2)}%), detailed as follows:\n\t${mismatchedItemsList}`
        });
      }

      const totalUnexpectedCategories = Object.values(falsePositive)
        .reduce((acc, categories) => acc + Object.keys(categories).length, 0);

      if(totalUnexpectedCategories > 0) {
        const falsePositiveList = Object.entries(falsePositive)
          .map(([label, categories]) => {
            const categoriesList = Object.entries(categories)
              .map(([category, value]) => {
                const valueString = value ? ` value ${value}` : 'out value';
                return `${category} with${valueString}`;
              }).join(', ');
            return `● ${label}: ${categoriesList}`;
          }).join('\n\t');
        
        test.info().annotations.push({
          type: `Unexpected Risk Categories`,
          description: `A total of ${totalUnexpectedCategories} cases, detailed as follows:\n\t${falsePositiveList}`
        });
      }

      // Count the number of labels with confidence less than 0.8
      const lowConfidenceLabelsCount = Object.values(effective.labels)
        .filter(label => label.confidence < 0.8)
        .length;
        
        if (lowConfidenceLabelsCount > 0) {      
          const totalLowConfidenceLabels = Object.values(effective.labels).length;
  
          const lowConfidenceLabels = Object.entries(effective.labels)
            .filter(([label, { confidence }]) => confidence < 0.8)
            .map(([label, { confidence }]) => `● ${label}: Confidence ${(confidence * 100).toFixed(2)}%`)
            .join('\n\t');


          test.info().annotations.push({
            type: "Labels with Readability Issues",
            description: `${lowConfidenceLabelsCount} on ${totalLowConfidenceLabels}, in detail:\n\t${lowConfidenceLabels}`
          });
        }
    }

    return {
      pass: percentage === 0,
      message: () => resultMessage
    };
  }
});