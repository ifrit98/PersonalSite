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
  { file: 'default', title: 'I design and build AI systems that have to work under real constraints.', detail: 'Private deployment, edge inference, agent reliability, adversarial systems' },
  { file: 'engage', title: 'Architecture reviews, de-risking sprints, and fractional principal architecture.', detail: 'For consequential AI and systems decisions' },
  { file: 'turnkeyhq', title: 'TurnkeyHQ: from product thesis to production operations.', detail: 'A multi-tenant vertical AI platform in private beta' },
  { file: 'afterfiat', title: 'AfterFiat: a versioned, falsifiable monetary thesis.', detail: 'Privacy, proofs, and compute as money' },
  { file: 'secure-ml', title: 'Your AI has to run privately or offline.', detail: 'Secure ML architecture: controlled artifacts, reproducible dependencies, an operator path that survives' },
  { file: 'adversarial-storage', title: 'Participants have a reason to game the system.', detail: 'Adversarial storage and verification: what is proved, when, and what stays cheap to fake' },
];

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A title never breaks inside a hyphenated word ("de-risking").
const keepWhole = (s) => s.replace(/\S+-\S+/g, (word) => `<span class="nw">${word}</span>`);

const page = (card) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&family=IBM+Plex+Mono:wght@500&display=block">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #F2F4F1; color: #14243A; font-family: Archivo, sans-serif;
         display: grid; grid-template-rows: 1fr auto; padding: 80px 88px 64px; }
  .main { align-self: center; max-width: 960px; }
  h1 { font: 600 66px/1.04 Archivo, sans-serif; font-stretch: 84%; letter-spacing: -0.025em; text-wrap: balance; }
  .detail { margin-top: 28px; font: 400 27px/1.4 Archivo, sans-serif; color: #546079; max-width: 900px; }
  .foot { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid #14243A; padding-top: 22px; }
  .name { font: 600 30px/1 Archivo, sans-serif; font-stretch: 90%; }
  .nw { white-space: nowrap; }
  .domain { font: 500 20px/1 'IBM Plex Mono', monospace; color: #546079; }
</style></head><body>
  <div class="main"><h1>${keepWhole(escape(card.title))}</h1><p class="detail">${escape(card.detail)}</p></div>
  <div class="foot"><span class="name">Jason St George</span><span class="domain">jasonstgeorge.com</span></div>
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
