const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const v of [1,2,3]) { await p.goto('file://' + __dirname + '/annotations.html?v=' + v); await p.waitForTimeout(500); await p.screenshot({ path: __dirname + '/annot-' + v + '.png', clip: { x: 0, y: 0, width: 1080, height: 1400 } }); }
  await b.close(); })();
