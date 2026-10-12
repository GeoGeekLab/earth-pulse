// Test the pending index.html on its production origin without deploying it.
// The production-origin route is intercepted only for the entrypoint document.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const slug = process.env.INSTRUMENT;
assert(['orbital-commons', 'earth-pulse', 'world-as-relation'].includes(slug), 'Invalid INSTRUMENT');
const url = `https://geogeeklab.github.io/${slug}/?qa=pull-request`;
const html = fs.readFileSync('index.html', 'utf8');
const failures = [];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  page.on('pageerror', e => failures.push(String(e.message || e)));
  try {
    await page.route(url, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert(response?.ok(), `Failed to load entrypoint: ${response?.status()}`);
    await page.waitForFunction(() => window.GeoProviderStability?.installed && window.GeoDataSupply?.installed, null, { timeout: 60000 });
    const stage = page.locator('#instrumentStage');
    await page.waitForFunction(() => document.querySelector('#instrumentStage')?.dataset.runtimeReady === 'true', null, { timeout: 90000 });
    assert.equal(await page.locator('.instrument-error').count(), 0, 'The production runtime reported an instrument error');
    if (slug === 'orbital-commons') {
      await page.waitForFunction(() => {
        const root = document.querySelector('.orbit-v2');
        return root?.dataset.orbitRound2 === '1' && root?.dataset.orbitEnhancedV3 === '1';
      }, null, { timeout: 30000 });
      assert(await page.locator('.orbit-panel [data-orbit-section="catalog"]').count(), 'Lab catalog sidebar was not mounted');
      const supply = await page.evaluate(() => window.GeoDataSupply.describe('orbit-active'));
      assert.equal(supply?.transport, 'same-origin-snapshot', 'Orbital data must use same-origin snapshot');
    }
    if (slug === 'earth-pulse') {
      await page.locator('[data-pulse-task="analyze"]').click();
      await page.waitForFunction(() => {
        const workspace = document.querySelector('#instrumentStage .pulse-workflow');
        return workspace && !workspace.hidden && workspace.querySelector('[data-pw-section="data"]') && workspace.querySelector('[data-pc="a-count"]');
      }, null, { timeout: 45000 });
      assert.equal(await page.locator('[data-pulse-task="analyze"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-pulse-task="observe"]').click();
      await page.waitForFunction(() => document.querySelector('#instrumentStage .pulse-workflow')?.hidden === true, null, { timeout: 10000 });
      const supply = await page.evaluate(() => window.GeoDataSupply.describe('usgs-earthquakes-day'));
      assert.equal(supply?.transport, 'same-origin-snapshot', 'Pulse data must use same-origin snapshot');
    }
    if (slug === 'world-as-relation') {
      await page.locator('#wCompareToggle').click();
      await page.waitForFunction(() => {
        const views = document.querySelector('#wViews');
        const second = document.querySelector('#wSecondView');
        return views?.classList.contains('compare') && second && !second.hidden;
      }, null, { timeout: 10000 });
      assert(await page.locator('#wMetrics').count(), 'Local distortion readout is unavailable');
    }
    await page.screenshot({ path: 'pr-smoke.png', fullPage: false });
    console.log(JSON.stringify({ instrument: slug, mounted: true, checks: 'passed', recoverablePageErrors: failures.slice(0, 4) }));
  } catch (error) {
    console.error('Stage:', (await page.locator('#instrumentStage').innerText().catch(() => '')).slice(0, 800));
    console.error('Browser errors:', failures.slice(0, 12));
    await page.screenshot({ path: 'pr-smoke.png', fullPage: false }).catch(() => {});
    throw error;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
