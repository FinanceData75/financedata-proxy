// usage : node slides/capture.cjs → slides/veolia-1.png, -2.png (2160 × 2700, HD)
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  for (let i = 1; i <= 2; i++) { await pg.goto('file://' + path.resolve(__dirname, '../carrousel.html') + '?p=' + i); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(250);
    await pg.screenshot({ path: path.resolve(__dirname, 'veolia-' + i + '.png') }); }
  await b.close(); })();
