#!/usr/bin/env node
/**
 * Renders the link-preview images in public/og/ (1200×630) with headless Chromium.
 *
 *   npm run build:og
 *
 * The images carry text, so they go stale when positioning changes. Edit CARDS
 * and re-run instead of hand-editing PNGs. Needs network for Google Fonts at
 * render time; the output PNGs are committed.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const out = new URL('../public/og/', import.meta.url);
mkdirSync(out, { recursive: true });

const CARDS = [
  {
    file: 'default',
    eyebrow: 'Principal Systems Architect',
    title: 'I architect intelligent systems for problems where the constraints are real.',
    detail: 'AI · Autonomy · High-constraint infrastructure',
  },
  {
    file: 'engage',
    eyebrow: 'Engage',
    title: 'Architecture reviews, de-risking sprints, and fractional principal architecture.',
    detail: 'For consequential AI and systems decisions',
  },
  {
    file: 'turnkeyhq',
    eyebrow: 'Case study',
    title: 'TurnkeyHQ: from product thesis to production operations.',
    detail: 'Multi-tenant vertical AI platform · private beta',
  },
  {
    file: 'afterfiat',
    eyebrow: 'Research',
    title: 'AfterFiat: a versioned, falsifiable monetary thesis.',
    detail: 'Privacy · Proofs · Compute',
  },
];

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const page = (card) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@500&display=block">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #141B27; color: #E8E4DB; font-family: Inter, sans-serif;
         display: grid; grid-template-rows: auto 1fr auto; padding: 72px 88px 64px; position: relative; overflow: hidden; }
  body::after { content: ''; position: absolute; right: -140px; top: 115px; width: 520px; height: 520px; border-radius: 50%;
                border: 1px solid rgba(169,135,82,0.16); box-shadow: 0 0 0 70px rgba(169,135,82,0.03), 0 0 0 140px rgba(169,135,82,0.02); }
  .top { display: flex; align-items: center; gap: 18px; }
  .rule { width: 48px; height: 3px; background: #A98752; }
  .eyebrow { font: 500 20px/1 'IBM Plex Mono', monospace; letter-spacing: 0.12em; text-transform: uppercase; color: #A98752; }
  .main { align-self: center; max-width: 900px; position: relative; z-index: 1; }
  h1 { font: 500 62px/1.1 Newsreader, Georgia, serif; letter-spacing: -0.015em; text-wrap: balance; }
  .detail { margin-top: 26px; font: 400 26px/1.4 Inter, sans-serif; color: rgba(232,228,219,0.66); }
  .foot { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid rgba(232,228,219,0.12); padding-top: 22px; }
  .name { font: 500 30px/1 Newsreader, Georgia, serif; }
  .domain { font: 500 18px/1 'IBM Plex Mono', monospace; letter-spacing: 0.1em; color: rgba(232,228,219,0.55); }
</style></head><body>
  <div class="top"><span class="rule"></span><span class="eyebrow">${escape(card.eyebrow)}</span></div>
  <div class="main"><h1>${escape(card.title)}</h1><p class="detail">${escape(card.detail)}</p></div>
  <div class="foot"><span class="name">Jason St George</span><span class="domain">JASONSTGEORGE.COM</span></div>
</body></html>`;

const browser = await chromium.launch();
try {
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const card of CARDS) {
    await tab.setContent(page(card), { waitUntil: 'networkidle' });
    await tab.evaluate(() => document.fonts.ready);
    const path = new URL(`${card.file}.png`, out);
    await tab.screenshot({ path: path.pathname, type: 'png' });
    console.log(`public/og/${card.file}.png`);
  }
} finally {
  await browser.close();
}
