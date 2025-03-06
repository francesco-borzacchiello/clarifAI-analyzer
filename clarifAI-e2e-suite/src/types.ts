export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Color {
    r: number;
    g: number;
    b: number;
}

export interface LegendInfo {
    bounding_box: BoundingBox;
    color: Color;
    confidence: number;
}

export interface LabelInfo {
    bounding_box: BoundingBox;
    confidence: number;
}

export interface Legend {
    [riskCategory: string]: LegendInfo;
}

export interface Labels {
    [label: string]: LabelInfo;
}
export interface RiskCounts {
    [riskCategory: string]: number;
}

export interface BarChartJson {
    [label: string]: RiskCounts;
}

export interface ClarifAIConverterFullResponse {
    data: BarChartJson;
    processed_image: string; // base64 encoded image
    confidence_values: BarChartJson;
    legend: Legend;
    labels: Labels;
}

export interface ClarifAIConverterAnalysisResult {
    data: BarChartJson;
    confidence_values: BarChartJson;
    legend: Legend;
    labels: Labels;
}