import { expect as baseExpext } from '@playwright/test';
import { BarChartJson, RiskCounts } from "../types";

export function equalsChartJsons(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
): {
    assertions: number,
    failures: number,
    mismatchedItems: Map<string, Set<string>>
} {
    let assertions = 0;
    let failures = 0;
    let mismatchedItems: Map<string, Set<string>> = new Map();

    for (const label in oracle) {
        assertions++;
        baseExpext.soft(effective[label], `${label} ${errorMessage}`).toBeDefined();
        if (effective[label]) {
            const result = equalsForASpecificItemOfChart(label, oracle[label], effective[label], errorMessage);
            assertions += result.assertions;
            failures += result.failures;
            if(result.mismatchedCategories.size > 0)
                mismatchedItems.set(label, result.mismatchedCategories);
        } else failures++;
    }

    return { assertions, failures, mismatchedItems };
}

function equalsForASpecificItemOfChart(
    item : string,
    itemOracle: RiskCounts,
    itemEffective: RiskCounts,
    errorMessage: string
): {
    assertions: number,
    failures: number,
    mismatchedCategories: Set<string>
} {
    let assertions = 0;
    let failures = 0;
    let mismatchedCategories: Set<string> = new Set();

    for (const category in itemOracle) {
        assertions++;
        baseExpext.soft(itemEffective[category], `${item}.${category} ${errorMessage}`).toBeDefined();
        if (itemEffective[category] !== undefined) {
            assertions++;
            baseExpext.soft(
                itemOracle[category] === itemEffective[category],
                `${item} - ${category}: ${itemOracle[category]} = ${itemEffective[category]}`
            ).toBeTruthy();
            if (itemOracle[category] !== itemEffective[category]) {
                failures++;
                mismatchedCategories.add(category);
            }
        } else failures++;
    }
    const oracleSubKeys = new Set(Object.keys(itemOracle));
    const effectiveSubKeys = new Set(Object.keys(itemEffective));
    // Calcolare l'insieme delle subkey che sono in effective ma non in oracle
    const difference = [...effectiveSubKeys].filter(subKey => !oracleSubKeys.has(subKey));
    for (const subKey of difference) {
        assertions++;
        failures++;
        baseExpext.soft(itemEffective[subKey], `False Positive: ${item}.${subKey} ${errorMessage} but not in oracle`).not.toBeDefined();
    }
    return { assertions, failures, mismatchedCategories };
}
