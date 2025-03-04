import test from "@playwright/test";
import { BASE_URL, CANVAS_SELECTOR } from "../src/constants";
import { testReadabilityWithNormalVision } from "../src/utils/readabilityUtils";
import { generateImageFileName, generateJsonFileName } from "../src/utils/utils";
import { login } from "../src/utils/authUtils";

test.beforeEach(async ({ page }) => {
   await login(page);
});

test('chart-3 - solaris - (2020-12-01 - 2021-09-05) - Readability', async ({ page }, testInfo) => {
    let from = "2020-12-01", to = "2021-09-05";
    const baseUrlChart = BASE_URL + '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db' + "&from=" + Date.parse(from) + "&to=" + Date.parse(to);

    const oracle = {
        "Agust--in Maugus": {
            "Low Risk": 2
        },
        "Ben Cumpton": {
            "Low Risk": 80,
            "Unverified High Risk": 2,
            "Voided High Risk": 1
        },
        "Constantina Quintanar": {
            "Low Risk": 104,
            "Unverified High Risk": 22
        },
        "Ivanny DeLgado": {
            "Low Risk": 26
        },
        "Deanna Rosheck": {
            "High Risk Confirmed": 5,
            "Low Risk": 267,
            "Preliminar High Risk": 3,
            "Unverified High Risk": 4,
            "Voided High Risk": 15
        },
        "Drake Ferguson": {
            "High Risk Confirmed": 1,
            "Low Risk": 17,
            "Preliminar High Risk": 1,
            "Unverified High Risk": 5
        },
        "Elsa Elias": {
            "Low Risk": 45,
            "Unverified High Risk": 1
        },
        "Estephanie Diaz": {
            "Low Risk": 123,
            "Voided High Risk": 5
        },
        "Felipe Kason": {
            "Low Risk": 102,
            "Voided High Risk": 4,
            "Preliminar High Risk": 1,
            "High Risk Confirmed": 1
        },
        "Ivania Torres": {
            "Low Risk": 67
        }
    };
    
    await testReadabilityWithNormalVision(
        oracle,
        page,
        testInfo,
        baseUrlChart,
        CANVAS_SELECTOR,
        generateImageFileName('chart-3', from, to),
        generateJsonFileName('api-response', from, to)
    );
});