import { Page, TestInfo } from "@playwright/test";
import { BarChartJson } from "./types";
import { captureAndExtractJsonForInterval } from "./utils/chartCaptureUtils";
import { expect } from "./assertions/functionalAssertions";

export function compareChartIntervals(
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
                    expect.soft(
                        smallerIntervalChart[key][subKey] <= largerIntervalChart[key][subKey],
                        `${key} - ${subKey}: ${smallerIntervalChart[key][subKey]} < ${largerIntervalChart[key][subKey]}`
                    ).toBeTruthy();
                    if (smallerIntervalChart[key][subKey] > largerIntervalChart[key][subKey]) failures++;
                }

    return { assertions, failures };
}

export async function compareChartsForIntervals(
    page: Page,
    testInfo: TestInfo,
    baseUrlChart: string,
    canvasSelector: string,
    largerInterval: { from: number, to: number },
    smallerInterval: { from: number, to: number }
) {
    const largerIntervalJson = await captureAndExtractJsonForInterval(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        largerInterval.from,
        largerInterval.to,
    );

    const smallerIntervalJson = await captureAndExtractJsonForInterval(
        page,
        testInfo,
        baseUrlChart,
        canvasSelector,
        smallerInterval.from,
        smallerInterval.to
    );

    await expect(largerIntervalJson).containsIheInterval(smallerIntervalJson);
}