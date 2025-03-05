import { expect as baseExpext } from '@playwright/test';
import { BarChartJson, RiskCounts } from "../types";

export function equalsChartJsons(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
): {
    assertions: number,
    failures: number,
    mismatchedItems: Map<string, Set<string>>,
    falsePositive: BarChartJson
} {
    let assertions = 0;
    let failures = 0;
    let mismatchedItems: Map<string, Set<string>> = new Map();
    let falsePositive: BarChartJson = {};

    for (const label in oracle) {
        assertions++;
        baseExpext.soft(effective[label], `${label} ${errorMessage}`).toBeDefined();
        if (effective[label]) {
            const result = equalsForASpecificItemOfChart(label, oracle[label], effective[label], errorMessage);
            assertions += result.assertions;
            failures += result.failures;
            if(result.mismatchedCategories.size > 0)
                mismatchedItems.set(label, result.mismatchedCategories);
            if(Object.keys(result.falsePositive).length > 0){
                if (!falsePositive[label]) falsePositive[label] = {};
                for (const category in result.falsePositive)
                    falsePositive[label][category] = result.falsePositive[category];
            }
        } else failures++;
    }

    return { assertions, failures, mismatchedItems, falsePositive };
}

function equalsForASpecificItemOfChart(
    item : string,
    itemOracle: RiskCounts,
    labelEffective: RiskCounts,
    errorMessage: string
): {
    assertions: number,
    failures: number,
    mismatchedCategories: Set<string>
    falsePositive: RiskCounts
} {
    let assertions = 0;
    let failures = 0;
    let mismatchedCategories: Set<string> = new Set();
    let falsePositive: RiskCounts = {};

    for (const category in itemOracle) {
        assertions++;
        baseExpext.soft(labelEffective[category], `${item}.${category} ${errorMessage}`).toBeDefined();
        if (labelEffective[category] !== undefined) {
            assertions++;
            baseExpext.soft(
                itemOracle[category] === labelEffective[category],
                `${item} - ${category}: ${itemOracle[category]} = ${labelEffective[category]}`
            ).toBeTruthy();
            if (itemOracle[category] !== labelEffective[category]) {
                failures++;
                mismatchedCategories.add(category);
            }
        } else failures++;
    }
    const oracleCategories = new Set(Object.keys(itemOracle));
    const effectiveCategories = new Set(Object.keys(labelEffective));
    // Calcolare l'insieme delle subkey che sono in effective ma non in oracle
    const difference = [...effectiveCategories].filter(subKey => !oracleCategories.has(subKey));
    for (const category of difference) {
        assertions++;
        failures++;
        baseExpext.soft(labelEffective[category], `False Positive: ${item}.${category} ${errorMessage} but not in oracle`).not.toBeDefined();
        falsePositive[category] = labelEffective[category];
    }
    return { assertions, failures, mismatchedCategories, falsePositive };
}
