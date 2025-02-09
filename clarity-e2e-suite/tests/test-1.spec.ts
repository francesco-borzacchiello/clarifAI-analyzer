import { test, expect } from '@playwright/test';
import fs from 'fs';
// import pixelmatch from 'pixelmatch';
// import { PNG } from 'pngjs';

// Funzione per confrontare due immagini
/*
function compareImages(img1Path, img2Path, diffPath) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return numDiffPixels;
}
*/

test('test', async ({ page }) => {
  debugger;
  await page.goto('https://administrator.optovera.synclab.it/grafana-server/d/b0ea9be3-5619-40d9-ba2f-e9ce2cded8b0/measurements-per-person-1?orgId=1');
  await page.waitForSelector('canvas');

  /*
  await page.locator('canvas').click({
    position: {
      x: 604,
      y: 325
    }
  });
  */

  /*
  await page.evaluate(() => {
    // Simula il click sulla prima barra (seriesIndex: 0, dataIndex: 0)
    window.echartsInstance.dispatchAction({
      type: 'click',
      seriesIndex: 0,  // Prima serie
      dataIndex: 0     // Prima barra
    });

    window.echartsInstance.dispatchAction({
      type: 'click',
      seriesIndex: 0,  // Prima serie
      dataIndex: 3     // Prima barra
    });
  });
  */

  // Funzione per catturare screenshot con diversi deficit visivi
  async function captureScreenshotWithVisionDeficiency(deficiency, fileName) {
    await page.emulateVisionDeficiency(deficiency);
    await page.screenshot({ path: fileName });
    console.log(`Screenshot salvato per ${deficiency}: ${fileName}`);
  }

  // Screenshot normale senza deficit visivi
  await captureScreenshotWithVisionDeficiency('none', 'chart-normal.png');

  // Screenshot con protanopia (difficoltà a distinguere il rosso)
  await captureScreenshotWithVisionDeficiency('protanopia', 'chart-protanopia.png');

  // Screenshot con deuteranopia (difficoltà a distinguere il verde)
  await captureScreenshotWithVisionDeficiency('deuteranopia', 'chart-deuteranopia.png');

  // Esegui un'azione sul grafico (esempio: simulare il click che cambia il colore)
    await page.locator('canvas').click({
    position: {
      x: 737,
      y: 201
    }
  });
  await page.waitForTimeout(500); // Aspetta che l'azione si rifletta nel grafico

  // Screenshot dopo l'azione per vedere il cambiamento di colore
  await captureScreenshotWithVisionDeficiency('none', 'chart-action-normal.png');
  await captureScreenshotWithVisionDeficiency('protanopia', 'chart-action-protanopia.png');
  await captureScreenshotWithVisionDeficiency('deuteranopia', 'chart-action-deuteranopia.png');

});