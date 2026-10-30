// usage : node slides/capture.cjs → slides/amer-sports-1.png … -6.png (1080 × 1350)
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (let i = 1; i <= 6; i++) { await pg.goto('file://' + path.resolve(__dirname, '../carrousel.html') + '?p=' + i); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(250);
    await pg.screenshot({ path: path.resolve(__dirname, 'amer-sports-' + i + '.png') }); }
  await b.close(); })();
