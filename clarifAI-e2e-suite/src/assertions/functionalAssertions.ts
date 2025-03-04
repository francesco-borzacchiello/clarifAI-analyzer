import { test, expect as baseExpect } from '@playwright/test';
import { BarChartJson } from '../types';

export const expect = baseExpect.extend({
  async containsTheInterval(
    largerIntervalChart: BarChartJson,
    smallerIntervalChart: BarChartJson
  ) {

    const { assertions, failures } = compareChartIntervals(largerIntervalChart, smallerIntervalChart);
    const percentage = (failures / assertions) * 100;
    let containmentMessage = 'not contained';
    if (percentage === 0) containmentMessage = 'fully contained';
    else if (percentage <= 50) containmentMessage = 'partially contained';

    let resultMessage = `The smaller interval chart is ${containmentMessage} within the larger interval chart. Assertions: ${assertions}, Failures: ${failures}, Percentage: ${percentage.toFixed(2)}%`;

    test.info().annotations.push({
      type: "interval-containment-check",
      description: resultMessage
    });

    return {
      pass: percentage === 0,
      message: () => resultMessage
    };
  },

  async hasLabel(
    chart: BarChartJson,
    labelOracle: string
  ) {
    const labelExists = chart.hasOwnProperty(labelOracle);

    return {
      pass: labelExists,
      message: () => labelExists
        ? `Expected chart not to have label ${labelOracle}`
        : `Expected chart to have label ${labelOracle}`
    };
  },

  async hasCategory(
    chart: BarChartJson,
    labelOracle: string,
    categoryOracle: string
  ) {
    const labelExists = chart.hasOwnProperty(labelOracle);
    const categoryExists = labelExists && chart[labelOracle].hasOwnProperty(categoryOracle);
    return {
      pass: categoryExists,
      message: () => categoryExists
        ? `Expected ${labelOracle} not to have category ${categoryOracle}`
        : `Expected ${labelOracle} to have category ${categoryOracle}`
    };
  },

  async hasCategoryValue(
    chart: BarChartJson,
    labelOracle: string,
    valueOracle: number,
    categoryOracle: string = "value"
  ) {
    const labelExists = chart.hasOwnProperty(labelOracle);
    const categoryExists = labelExists && chart[labelOracle].hasOwnProperty(categoryOracle);
    const valueMatches = categoryExists && chart[labelOracle][categoryOracle] === valueOracle;
    baseExpect(valueMatches, `Expected ${labelOracle} to have category ${categoryOracle} with value ${valueOracle}`).toBeDefined();
    
    return {
      pass: valueMatches,
      message: () => valueMatches
        ? `Expected ${labelOracle} not to have category ${categoryOracle} with value ${valueOracle}`
        : `Expected ${labelOracle} to have category ${categoryOracle} with value ${valueOracle}`
    };
  }
});

function compareChartIntervals(
    largerIntervalChart: BarChartJson,
    smallerIntervalChart: BarChartJson
) {
    let assertions = 0;
    let failures = 0;

    for (const key in largerIntervalChart)
        if (smallerIntervalChart[key])
            for (const subKey in largerIntervalChart[key])
                if (smallerIntervalChart[key][subKey] !== undefined) {
                    assertions++;
                    baseExpect.soft(
                        smallerIntervalChart[key][subKey] <= largerIntervalChart[key][subKey],
                        `${key} - ${subKey}: ${smallerIntervalChart[key][subKey]} < ${largerIntervalChart[key][subKey]}`
                    ).toBeTruthy();
                    if (smallerIntervalChart[key][subKey] > largerIntervalChart[key][subKey]) failures++;
                }

    return { assertions, failures };
}