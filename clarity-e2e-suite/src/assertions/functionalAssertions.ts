import { test, expect as baseExpect } from '@playwright/test';
import { BarChartJson } from '../types';
import { compareChartIntervals } from '../chartComparison';

export const expect = baseExpect.extend({
  async containsIheInterval(
    largerIntervalChart: BarChartJson,
    smallerIntervalChart: BarChartJson
  ) {

    const { assertions, failures } = compareChartIntervals(largerIntervalChart, smallerIntervalChart);
    const percentage = (failures / assertions) * 100;
    const containmentMessage = percentage === 0
      ? 'fully contained'
      : percentage <= 50
      ? 'partially contained'
      : 'not contained';

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

  async hasEmployee(
    chart: BarChartJson,
    personName: string
  ) {
    const personExists = chart.hasOwnProperty(personName);
    console.log(personExists);

    return {
      pass: personExists,
      message: () => personExists
        ? `Expected chart not to have person ${personName}`
        : `Expected chart to have person ${personName}`
    };
  },

  async hasRiskCategory(
    chart: BarChartJson,
    personName: string,
    riskCategory: string
  ) {
    const personExists = chart.hasOwnProperty(personName);
    const riskCategoryExists = personExists && chart[personName].hasOwnProperty(riskCategory);
    return {
      pass: riskCategoryExists,
      message: () => riskCategoryExists
        ? `Expected ${personName} not to have risk category ${riskCategory}`
        : `Expected ${personName} to have risk category ${riskCategory}`
    };
  },

  async hasRiskCategoryValue(
    chart: BarChartJson,
    personName: string,
    riskCategory: string,
    value: number
  ) {
    const personExists = chart.hasOwnProperty(personName);
    const riskCategoryExists = personExists && chart[personName].hasOwnProperty(riskCategory);
    const valueMatches = riskCategoryExists && chart[personName][riskCategory] === value;
    baseExpect(valueMatches, `Expected ${personName} to have risk category ${riskCategory} with value ${value}`).toBeDefined();
    
    return {
      pass: valueMatches,
      message: () => valueMatches
        ? `Expected ${personName} not to have risk category ${riskCategory} with value ${value}`
        : `Expected ${personName} to have risk category ${riskCategory} with value ${value}`
    };
  }
});