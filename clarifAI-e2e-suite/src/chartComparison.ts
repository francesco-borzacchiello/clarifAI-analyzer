import { Page, TestInfo } from "@playwright/test";
import { captureAndExtractJsonForInterval } from "./utils/chartCaptureUtils";
import { expect } from "./assertions/functionalAssertions";

export async function compareChartsForIntervals(
    page: Page,
    testInfo: TestInfo,
    baseUrlChart: string,
    canvasSelector: string,
    largerInterval: { from: string, to: string },
    smallerInterval: { from: string, to: string }
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

    await expect(largerIntervalJson).containsTheInterval(smallerIntervalJson);
}