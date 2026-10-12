// Capture a fully rendered instrument workspace at its production origin.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/tmp/geogeek-pw/node_modules/playwright');
const [url, output, mode = 'overview', inject = '0'] = process.argv.slice(2);
const slug = new URL(url).pathname.split('/').filter(Boolean)[0];
assert(['orbital-commons', 'earth-pulse', 'world-as-relation'].includes(slug), 'Unknown instrument');
assert(['overview', 'analysis'].includes(mode), 'Unknown capture mode');
assert(mode !== 'analysis' || slug === 'earth-pulse', 'Analysis applies to Earth Pulse');

async function capture() {
  const browser = await chromium.launch({ headless:true });
  const page = await browser.newPage({ viewport:{ width:1600, height:920 }, deviceScaleFactor:1 });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message || e)));
  try {
    if (inject === '1') {
      const html = fs.readFileSync('index.html', 'utf8');
      await page.route(url, route => route.fulfill({ status:200, contentType:'text/html; charset=utf-8', body:html }));
    }
    const response = await page.goto(url, { waitUntil:'domcontentloaded', timeout:60000 });
    assert(response?.ok(), 'Instrument entrypoint response failed');

    await page.waitForFunction(() =>
      document.querySelector('#instrumentStage')?.dataset.runtimeReady === 'true' &&
      window.GeoProviderStability?.installed === true &&
      window.GeoDataSupply?.installed === true
    , null, { timeout:90000 });

    if (slug === 'orbital-commons') {
      await page.waitForFunction(() => {
        const count = document.querySelector('#orbitCatalogCount')?.textContent || '';
        const status = document.querySelector('#orbitHudStatus')?.textContent || '';
        const readout = document.querySelector('#orbitHudReadout')?.textContent || '';
        const canvas = document.querySelector('#orbitCanvasV2');
        const root = document.querySelector('.orbit-v2');
        return root?.dataset.orbitRound2 === '1' &&
          root?.dataset.orbitEnhancedV3 === '1' &&
          Number(count.replace(/[^0-9]/g, '')) > 100 &&
          /ACTIVE OBJECTS/.test(status) &&
          !/INITIALIZING|LOADING/.test(readout) &&
          canvas?.width > 300 && canvas?.height > 200;
      }, null, {timeout:65000});
      const transport = await page.evaluate(() => window.GeoDataSupply.describe('orbit-active')?.transport);
      assert.equal(transport, 'same-origin-snapshot');
    } else if (slug === 'earth-pulse') {
      await page.waitForFunction(() => {
        const root = document.querySelector('.pulse-observation-lab[data-state="ready"]');
        const scene = root?.querySelector('.pulse-map');
        const heading = root?.querySelector('#pulseFieldTitle')?.textContent || '';
        const events = root?.querySelectorAll('.pulse-event').length || 0;
        return Boolean(root && scene?.querySelectorAll('path').length > 4 &&
          /EVENTS/.test(heading) && events > 0);
      }, null, {timeout:65000});
      const transport = await page.evaluate(() => window.GeoDataSupply.describe('usgs-earthquakes-day')?.transport);
      assert.equal(transport, 'same-origin-snapshot');
      if (mode === 'analysis') {
        const button = page.locator('[data-pulse-task="analyze"]');
        await button.waitFor({state:'visible'});
        assert(!(await button.isDisabled()), 'Analyze is disabled');
        await button.click();
        await page.waitForFunction(() => {
          const workflow = document.querySelector('#instrumentStage .pulse-workflow');
          const loaded = workflow?.querySelector('[data-pw="loaded"]')?.textContent || '';
          const countA = workflow?.querySelector('[data-pc="a-count"]')?.textContent || '';
          const cells = workflow?.querySelectorAll('.pw-event').length || 0;
          return workflow && !workflow.hidden && /^\d[\d,]*$/.test(loaded) &&
            Number(loaded.replace(/,/g,'')) > 0 &&
            /^\d[\d,]*\s*EVENTS/.test(countA) && cells > 0;
        }, null, {timeout:65000});
        await page.evaluate(() => {
          const side = document.querySelector('#instrumentStage .pw-side');
          const comparison = side?.querySelector('[data-pw-section="compare"]') ||
            side?.querySelector('[data-pc="a-count"]');
          if (side && comparison) side.scrollTop = Math.max(0, comparison.offsetTop - side.offsetTop - 70);
        });
      }
    } else {
      await page.waitForFunction(() => {
        const svg = document.querySelector('svg.world-map');
        const metrics = document.querySelector('#wMetrics')?.textContent || '';
        return svg?.querySelectorAll('.countries path').length > 50 &&
          metrics.includes('LOCAL DISTORTION');
      }, null, {timeout:65000});
      await page.locator('#wCompareToggle').click();
      await page.locator('#wTissotQuick').click();
      await page.waitForFunction(() => {
        const views = document.querySelector('#wViews');
        const secondary = document.querySelector('svg.world-map-secondary');
        const metrics = document.querySelector('#wMetrics')?.textContent || '';
        return views?.classList.contains('compare') &&
          secondary?.querySelectorAll('.countries path').length > 50 &&
          document.querySelectorAll('svg.world-map .tissot path').length > 0 &&
          metrics.includes('AREA');
      }, null, {timeout:25000});
    }

    const stage = page.locator('#instrumentStage');
    const snapshotText = await stage.innerText();
    assert(!/Reading the active orbital field|Reading the seismic field|Building projection field|Loading .*production runtime|INITIALIZING PROPAGATION/i.test(snapshotText), 'Loading interface is still visible');
    assert.equal(await stage.locator('.instrument-loading:visible, .pulse-loading:visible, .instrument-error:visible').count(), 0, 'Loading or error panel is visible');
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.waitForTimeout(600);
    fs.mkdirSync(path.dirname(output), {recursive:true});
    await stage.screenshot({path:output, animations:'disabled', timeout:30000});
    const size = fs.statSync(output).size;
    assert(size > 60000, 'Screenshot is unexpectedly small');
    console.log(JSON.stringify({instrument:slug,mode,screenshot:output,bytes:size,loading:false,errors:errors.slice(0,3)}));
  } catch (e) {
    console.error('Screenshot readiness failed:', e.message);
    console.error('STAGE:', (await page.locator('#instrumentStage').innerText().catch(()=>'')).slice(0,850));
    console.error('PAGE ERRORS:', errors.slice(0,8));
    throw e;
  } finally {
    await browser.close();
  }
}
capture().catch(error => { console.error(error); process.exit(1); });
