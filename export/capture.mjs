// One-off capture script — opens each maturity mode on the Dispatch tab
// and writes a PNG of the full scrollable view to ./export/.
import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const MODES = [
  { label: 'Day 3',  chip: '3',     file: 'day-3.png' },
  { label: 'Day 30', chip: '30',    file: 'day-30.png' },
  { label: 'Day 90', chip: '90',    file: 'day-90.png' },
  { label: 'Error',  chip: 'Error', file: 'error.png' }
];

const URL = 'http://localhost:5173/MaintenanceCoordinator/';

const browser = await puppeteer.launch({
  headless: 'new',
  defaultViewport: { width: 402, height: 3600, deviceScaleFactor: 2 }
});
try {
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForSelector('header.MuiAppBar-root', { timeout: 15000 });

  for (const mode of MODES) {
    // Click the matching mode chip in the TopBar (rendered as div role=button).
    await page.evaluate((label) => {
      const btn = [...document.querySelectorAll('header [role="button"]')].find(
        (b) => (b.textContent || '').trim() === label
      );
      if (btn) btn.click();
    }, mode.chip);

    // Switch to Dispatch tab in case we drifted.
    await page.evaluate(() => {
      const disp = [...document.querySelectorAll('.MuiBottomNavigationAction-root')].find(
        (b) => /Dispatch/.test(b.textContent || '')
      );
      if (disp) disp.click();
    });

    // Let things settle.
    await new Promise((r) => setTimeout(r, 800));

    // Scroll the inner Box to top so the export starts at the banner.
    await page.evaluate(() => {
      const scroller = [...document.querySelectorAll('*')].find((e) => {
        const cs = getComputedStyle(e);
        return cs.overflowY === 'auto' || cs.overflowY === 'scroll';
      });
      if (scroller) scroller.scrollTop = 0;
    });
    await new Promise((r) => setTimeout(r, 300));

    const outPath = path.join(OUT, mode.file);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log('wrote', outPath);
  }
} finally {
  await browser.close();
}
