import { CANVAS_SELECTOR, SVG_SELECTOR } from "./constants";
import { BarChartJson } from "./types";

export interface UnFunctionalTestCase {
    url: string;
    oracle?: BarChartJson | null;
    from: string;
    to: string;
}

export interface IntervalTestCase {
    url: string;
    largerInterval: { from: string; to: string };
    smallerInterval: { from: string; to: string };
    selector: string;
}

export const testCases: { [key: string]: UnFunctionalTestCase } = {
    'Chart with legend and integer values - (2020-12-01 - 2021-09-05) - with oracle': {
        url: '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        oracle:{
            "Agustin Maugus Carlos": {
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
            "DeLgado": {
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
        },
        from: "2020-12-01",
        to: "2021-09-05"
    },
    'Chart with legend and integer values - (2020-12-01 - 2021-02-15)' : {
        url: '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        from: "2020-12-01",
        to: "2021-02-15"
    },
    'Chart with legend and integer values - (2020-02-01 - 2021-03-01)' : {
        url: '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        from: "2020-02-01",
        to: "2021-03-01"
    },
    'Chart with one category and integer values - (2020-12-01 - 2021-09-05)': {
        url: '/d/e2740b66-3972-408a-8299-5e7d5af64233/measurements-per-person-1?orgId=1&var-group=All&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        from: "2020-12-01",
        to: "2021-09-05"
    },
}

export const intervalPairs: { [key: string]: IntervalTestCase } = {
    'Chart with legend and integer values - |2020-12-01 - 2021-02-01| <= |2020-12-01 - 2021-02-15|': {
        url: '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        selector: CANVAS_SELECTOR,
        largerInterval: { from: "2020-12-01", to: "2021-02-15" },
        smallerInterval: { from: "2020-12-01", to: "2021-02-01" }
    },
    'Chart with legend and integer values - |2021-02-15 - 2021-03-01| <= |2021-02-01 - 2021-03-01|': {
        url: '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        selector: CANVAS_SELECTOR,
        largerInterval: { from: "2021-02-01", to: "2021-03-01" },
        smallerInterval: { from: "2021-02-15", to: "2021-03-01" }
    },
    'Chart with one category and integer values - |2020-12-01 - 2021-02-01| <= |2020-12-01 - 2021-02-15|': {
        url: '/d/e2740b66-3972-408a-8299-5e7d5af64233/measurements-per-person-1?orgId=1&var-group=All&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        selector: CANVAS_SELECTOR,
        largerInterval: { from: "2020-12-01", to: "2021-02-15" },
        smallerInterval: { from: "2020-12-01", to: "2021-02-01" }
    },
    'Chart with one category and integer values - |2021-02-15 - 2021-03-01| <= |2021-02-01 - 2021-03-01|': {
        url: '/d/e2740b66-3972-408a-8299-5e7d5af64233/measurements-per-person-1?orgId=1&var-group=All&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        selector: CANVAS_SELECTOR,
        largerInterval: { from: "2021-02-01", to: "2021-03-01" },
        smallerInterval: { from: "2021-02-15", to: "2021-03-01" }
    },
    'SVG Chart with legend and integer values - |2020-12-01 - 2021-02-01| <= |2020-12-01 - 2021-02-15|': {
        url: '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        selector: SVG_SELECTOR,
        largerInterval: { from: "2020-12-01", to: "2021-02-15" },
        smallerInterval: { from: "2020-12-01", to: "2021-02-01" }
    },
    'SVG Chart with legend and integer values - |2021-02-15 - 2021-03-01| <= |2021-02-01 - 2021-03-01|': {
        url: '/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        selector: SVG_SELECTOR,
        largerInterval: { from: "2021-02-01", to: "2021-03-01" },
        smallerInterval: { from: "2021-02-15", to: "2021-03-01" }
    },
    'SVG Chart with one category and integer values - |2020-12-01 - 2021-02-01| <= |2020-12-01 - 2021-02-15|': {
        url: '/d/e2740b66-3972-408a-8299-5e7d5af64233/measurements-per-person-1?orgId=1&var-group=All&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        selector: SVG_SELECTOR,
        largerInterval: { from: "2020-12-01", to: "2021-02-15" },
        smallerInterval: { from: "2020-12-01", to: "2021-02-01" }
    },
    'SVG Chart with one category and integer values - |2021-02-15 - 2021-03-01| <= |2021-02-01 - 2021-03-01|': {
        url: '/d/e2740b66-3972-408a-8299-5e7d5af64233/measurements-per-person-1?orgId=1&var-group=All&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db',
        selector: SVG_SELECTOR,
        largerInterval: { from: "2021-02-01", to: "2021-03-01" },
        smallerInterval: { from: "2021-02-15", to: "2021-03-01" }
    }
};