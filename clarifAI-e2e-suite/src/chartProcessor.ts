import axios from 'axios'; // Assicurati di installare axios: npm install axios
import fs from 'fs'; // Libreria nativa per leggere i file
import FormData from 'form-data';

import { AnnotatedBarChartJson } from "./types";

async function extractJsonFromBarChart(
    image: Buffer | string,
    whitelist: string = 'integer',
    valueExtractorType: string = 'initial',
    lang: string = 'eng'
): Promise<AnnotatedBarChartJson> {
    const apiUrl = 'http://127.0.0.1:5000/extract-json-from-horizontal-bar-chart';
    try {
        let fileBuffer: Buffer;

        if (typeof image === 'string') {
            fileBuffer = fs.readFileSync(image); // Legge il file come buffer
        } else {
            fileBuffer = image; // Usa direttamente il buffer
        }

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
    imagePath: string | Buffer
): Promise<AnnotatedBarChartJson> {
    return extractJsonFromBarChart(imagePath, '0123456789', 'initial');
}

export async function extractJsonForFunctionalTesting(
    imagePath: string | Buffer
): Promise<AnnotatedBarChartJson> {
    return extractJsonFromBarChart(imagePath, '0123456789', 'default');
}