import { test, expect } from '@playwright/test';
import * as utils from './utils';
// import { Canvg } from 'canvg';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db&from=now-5y&to=now');
  await page.getByPlaceholder('email or username').click();
  await page.getByPlaceholder('email or username').fill('admin');
  await page.getByPlaceholder('password').click();
  await page.getByPlaceholder('password').fill('admin');
  await page.getByLabel('Login button').click();
  await page.getByLabel('Skip change password button').click();

  debugger;
  
  // Carica Canvg nella pagina
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/canvg/dist/browser/canvg.min.js' });
  
  const canvas = await page.$('[data-zr-dom-id="zr_0"]');
  
  // Assicurati che il canvas sia stato trovato
  if (canvas) {
      await page.evaluate(element => {
        debugger;
        canvg(element, `
            <svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}">
              ${element.toDataURL('image/svg+xml')}
            </svg>
        `);
        return element.toDataURL('image/png')
      }, canvas);

      // Inserisci l'SVG nella pagina per vedere il risultato
      // const svgElement = document.createElement('div');
      // svgElement.innerHTML = svgContent;
      // document.body.appendChild(svgElement);
  } else {
      console.log("Canvas non trovato.");
  }
});

test('getScreenshoot', async ({ page }) => {
  await page.goto('http://localhost:3000/d/ac159a53-38b3-4646-9fb3-6620b4ff7a7f/count-of-high-risk-all-and-confirmed-vs-low-risk-results-by-user-3?orgId=1&var-employee=All&var-includeDisabledEmployees=false&var-datasource=PostgreSQL-solaris-global_db&from=now-5y&to=now');
  await page.getByPlaceholder('email or username').click();
  await page.getByPlaceholder('email or username').fill('admin');
  await page.getByPlaceholder('password').click();
  await page.getByPlaceholder('password').fill('admin');
  await page.getByLabel('Login button').click();
  await page.getByLabel('Skip change password button').click();

  debugger;
  
  const canvasSelector = '[data-zr-dom-id="zr_0"]'; // Seleziona il tuo canvas (es. '#myCanvas' per un ID specifico)
  const outputFilePath = 'low_risk_without_label.png';

  await page.waitForTimeout(4000);

  await utils.screenshotCanvas(page, canvasSelector, outputFilePath);
});

/*
// Funzione per fare lo screenshot del canvas
async function screenshotCanvas(page, canvasSelector, outputFilePath) {
  // Attendere che il canvas sia caricato
  const canvasElement = await page.waitForSelector(canvasSelector);
  
  // Fare uno screenshot dell'elemento canvas
  await canvasElement.screenshot({ path: outputFilePath });
  console.log(`Screenshot del canvas salvato in: ${outputFilePath}`);
}
*/