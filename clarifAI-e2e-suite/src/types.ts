export interface RiskCounts {
    [riskCategory: string]: number;
}

export interface BarChartJson {
    [label: string]: RiskCounts;
}

export interface AnnotatedBarChartJson {
    data: BarChartJson;
    processed_image: string; // base64 encoded image
}