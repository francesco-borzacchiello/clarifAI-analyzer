import axios from 'axios'; // Assicurati di installare axios: npm install axios
import fs from 'fs'; // Libreria nativa per leggere i file
import FormData from 'form-data';

import { BarChartJson } from "./types";

async function extractJsonFromBarChart(
    imagePath: string,
    whitelist: string = 'integer',
    valueExtractorType: string = 'initial',
    lang: string = 'eng'
): Promise<BarChartJson> {
    const apiUrl = 'http://127.0.0.1:5000/extract-json-from-horizontal-bar-chart';
    try {
        const fileBuffer = fs.readFileSync(imagePath); // Legge il file come buffer
        const formData = new FormData();
        formData.append('image', fileBuffer, { filename: 'chart.png' }); // Aggiunge il file al payload
        formData.append('whitelist', whitelist);
        formData.append('value_extractor_type', valueExtractorType);
        formData.append('lang', lang);

        const response = await axios.post(apiUrl, formData, {
            headers: formData.getHeaders(), // Imposta gli header corretti
        });

        return response.data;
    } catch (error) {
        console.error('Error calling the API:', error);
        throw error;
    }
}

export async function extractJsonForReadability(
    imagePath: string
): Promise<BarChartJson> {
    return extractJsonFromBarChart(imagePath, '0123456789', 'initial');
}

export async function extractJsonForFunctionalTesting(
    imagePath: string
): Promise<BarChartJson> {
    return extractJsonFromBarChart(imagePath, '0123456789', 'default');
}