import * as echarts from 'echarts';
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('grafana canvas', async ({ page }) => {
  await page.goto('https://solaris-global.optovera.synclab.it/grafana-server/d/b0ea9be3-5619-40d9-ba2f-e9ce2cded8b0/measurements-per-person-1');

  debugger;

  const echartsExists = await page.evaluate(() => {
    return !!window.echartsInstance;
  });
  expect(echartsExists).toBeTruthy();

  // Recupera i dati delle serie del grafico (opzioni)
  const chartData = await page.evaluate(() => {
    return window.echartsInstance.getOption();
  });
  
  console.log('Chart data:', chartData);

  // Simula un click sulla prima barra (supponendo che sia una bar chart)
  await page.evaluate(() => {
    window.echartsInstance.dispatchAction({
      type: 'highlight', // Puoi usare 'highlight' per evidenziare una barra
      seriesIndex: 0,    // L'indice della serie del grafico (in genere 0 per una singola serie)
      dataIndex: 0       // L'indice del punto dati (la prima barra)
    });

    // Simula il click sulla prima barra
    window.echartsInstance.dispatchAction({
      type: 'click',
      seriesIndex: 0,    // L'indice della serie del grafico
      dataIndex: 0       // L'indice della barra da cliccare
    });
  });
  
  const canvasHtml = await page.locator('div[_echarts_instance_]').evaluate(el => el.outerHTML);
  console.log(canvasHtml);
  console.log();

  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js' });
  
  // Eseguire questo script in Playwright
  await page.evaluate(() => {
    debugger;
    const echartsId = document.querySelector('div[_echarts_instance_]')?.getAttribute('_echarts_instance_');
    let echartsInstance = echarts.getInstanceById(echartsId);
    if(echartsInstance === undefined) return;
    
    // Registriamo l'evento click per osservare i parametri ricevuti
    echartsInstance.on('click', function (params) {
        console.log('Click event data:', params);
    });
  });
  debugger;
  // Simuliamo un click in una posizione del canvas
  await page.click('#main canvas', { position: { x: 500, y: 500 } });

  // Attendi che il canvas del grafico sia caricato
  const chartCanvas = await page.waitForSelector('canvas');
  //const canvasHtml = await page.locator('canvas').evaluate(el => el.outerHTML);
  //console.log(canvasHtml);

  // Esegui uno script nel contesto del browser per ottenere l'istanza ECharts
  const chartInstance = await page.evaluate(() => {
    debugger;
    const chartDom = document.querySelector('canvas'); // Seleziona il canvas

    if (window.echarts) {
      console.log('echarts');
    }
    if (window.echartsInstance) {
      console.log('echartsInstance');
    }
    // return echarts.getInstanceByDom(chartDom); // Ottieni l'istanza di ECharts dal canvas
  });
});