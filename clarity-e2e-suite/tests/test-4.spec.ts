import { test, expect } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import { PNG } from 'pngjs';

test('test', async ({ page }) => {
  await page.goto('https://administrator.optovera.synclab.it/grafana-server/login');
  /*
  await page.evaluate(() => {
    debugger;
    window.moveTo(0, 0); // Sposta la finestra all'angolo in alto a sinistra
    window.resizeTo(screen.width, screen.height); // Rimuove la dimensione della finestra in base alla dimensione dello schermo
  });
  */

  await page.getByPlaceholder('email or username').click();
  await page.getByPlaceholder('email or username').fill('admin');
  await page.getByPlaceholder('password').click();
  await page.getByPlaceholder('password').fill('P@ssw0rd');
  await page.getByLabel('Login button').click();
  await page.getByLabel('Toggle menu').click();
  await page.getByTestId('navbarmenu').getByRole('link', { name: 'Dashboards' }).click();
  await page.getByText('solaris-global_db').click();
  await page.getByRole('link', { name: 'Measurements per person -' }).click();

  // Aspetta che il grafico sia completamente caricato
  await page.waitForSelector('canvas'); // Assicurati che il selettore corrisponda al tuo grafico
  await page.waitForTimeout(3000);

  // Screenshot normale senza deficit visivi
  await captureScreenshotWithVisionDeficiency(page, 'none', 'chart-normal.png');

  // Screenshot con protanopia (difficoltà a distinguere il rosso)
  await captureScreenshotWithVisionDeficiency(page, 'protanopia', 'chart-protanopia.png');

  // Screenshot con deuteranopia (difficoltà a distinguere il verde)
  await captureScreenshotWithVisionDeficiency(page, 'deuteranopia', 'chart-deuteranopia.png');

  const boundingBox = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    };
  });
  
  // Calcola la posizione relativa per cliccare
  const x = boundingBox.x + (boundingBox.width * 0.5); // Clicca al centro in orizzontale
  const y = boundingBox.y + (boundingBox.height * 0.5); // Clicca al centro in verticale

  // Esegui il click sulla posizione calcolata
  await page.mouse.click(x, y);

  // Screenshot dopo l'azione per vedere il cambiamento di colore
  await captureScreenshotWithVisionDeficiency(page, 'none', 'chart-action-normal.png');
  await captureScreenshotWithVisionDeficiency(page, 'protanopia', 'chart-action-protanopia.png');
  await captureScreenshotWithVisionDeficiency(page, 'deuteranopia', 'chart-action-deuteranopia.png');

  // Chiudi il browser
  //await browser.close();

  // Confronta le immagini per deficit visivo (ad esempio: protanopia)
  const diffProtanopia = compareImages('chart-protanopia.png', 'chart-action-protanopia.png', 'diff-protanopia.png');
  const diffDeuteranopia = compareImages('chart-action-deuteranopia.png', 'chart-deuteranopia.png', 'diff-deuteranopia.png');
  const diffNormal = compareImages('chart-normal.png', 'chart-action-normal.png', 'diff-normal.png');

  console.log(`Pixel diversi con protanopia: ${diffProtanopia}`);
  console.log(`Pixel diversi con deuteranopia: ${diffDeuteranopia}`);
  console.log(`Pixel diversi con visione normale: ${diffNormal}`);

  if (diffProtanopia === 0) {
    console.log('Attenzione: il cambiamento di colore non è percepibile con protanopia.');
  }

  if (diffDeuteranopia === 0) {
    console.log('Attenzione: il cambiamento di colore non è percepibile con deuteranopia.');
  }

  /*
  await client.send("Emulation.setEmulatedVisionDeficiency", {
    type: "achromatopsia"
  });
  await client.send("Emulation.setEmulatedVisionDeficiency", {
    type: "deuteranopia"
  });
  await client.send("Emulation.setEmulatedVisionDeficiency", {
    type: "protanopia"
  });
  await client.send("Emulation.setEmulatedVisionDeficiency", {
    type: "tritanopia"
  });
  */
});

// Funzione per catturare screenshot con diversi deficit visivi
async function captureScreenshotWithVisionDeficiency(page, deficiency, fileName) {
  const client = await page.context().newCDPSession(page);
  await client.send("Emulation.setEmulatedVisionDeficiency", {
    type: deficiency
  });
  await page.screenshot({ path: fileName });
  console.log(`Screenshot salvato per ${deficiency}: ${fileName}`);
}

// Funzione per confrontare due immagini
function compareImages(img1Path, img2Path, diffPath) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return numDiffPixels;
}