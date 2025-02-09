import { expect } from "@playwright/test";

interface RiskCounts {
    [riskCategory: string]: number;
}

export interface BarChartJson {
    [personName: string]: RiskCounts;
}

export function equalsJsons(
    oracle: BarChartJson,
    effective: BarChartJson,
    errorMessage: string
) {
    let assertions = 0;
    let failures = 0;

    for (const key in oracle) {
        assertions++;
        expect.soft(effective[key], `${key} ${errorMessage}`).toBeDefined();
        if (effective[key]) {
            for (const subKey in oracle[key]) {
                assertions++;
                expect.soft(effective[key][subKey], `${key}.${subKey} ${errorMessage}`).toBeDefined();
                if (effective[key][subKey] !== undefined) {
                    expect.soft(
                        oracle[key][subKey] === effective[key][subKey],
                        `${key} - ${subKey}: ${oracle[key][subKey]} = ${effective[key][subKey]}`
                    ).toBeTruthy();
                    if (oracle[key][subKey] !== effective[key][subKey]) failures++;
                } else failures++;
            }
        } else failures++;
    }

    return { assertions, failures };
}