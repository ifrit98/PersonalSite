import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

/* ------------------------------------------------------------------ */
/*  Config & CLI                                                       */
/* ------------------------------------------------------------------ */

interface ScrapeOptions {
  url: string;
  linkSelector?: string;
  contentSelector?: string;
  outDir?: string;
  delay: number;
  maxPages: number;
  followExternal: boolean;
  useBrowser: boolean;
}

function parseArgs(): ScrapeOptions {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Usage: scrape <url> [options]

Options:
  --links <css>      CSS selector for links to follow from the page
  --content <css>    CSS selector for main content area (default: auto-detect)
  --out <dir>        Output directory (default: scraped/<domain-slug>)
  --delay <ms>       Delay between requests in ms (default: 1000)
  --max <n>          Max pages to scrape (default: 50)
  --follow-external  Follow links to external domains (default: same-origin only)
  --browser          Use headless Chromium via Playwright (for JS-rendered / Cloudflare sites)

Examples:
  scrape https://example.com
  scrape https://example.com --links "nav a" --content "main"
  scrape https://docs.example.com --links ".sidebar a" --browser --max 20
`);
    process.exit(0);
  }

  const url = args[0];
  const opts: ScrapeOptions = {
    url,
    delay: 1000,
    maxPages: 50,
    followExternal: false,
    useBrowser: false,
  };

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--links':
        opts.linkSelector = args[++i];
        break;
      case '--content':
        opts.contentSelector = args[++i];
        break;
      case '--out':
        opts.outDir = args[++i];
        break;
      case '--delay':
        opts.delay = parseInt(args[++i], 10);
        break;
      case '--max':
        opts.maxPages = parseInt(args[++i], 10);
        break;
      case '--follow-external':
        opts.followExternal = true;
        break;
      case '--browser':
        opts.useBrowser = true;
        break;
    }
  }

  return opts;
}

/* ------------------------------------------------------------------ */
/*  Page fetchers (plain HTTP vs headless browser)                     */
/* ------------------------------------------------------------------ */

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchPlain(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

type BrowserFetcher = {
  get: (url: string) => Promise<string>;
  close: () => Promise<void>;
};

async function createBrowserFetcher(): Promise<BrowserFetcher> {
  const { chromium } = await import('playwright');
  // prefer system Chrome (better at bypassing bot detection) with headless fallback
  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--disable-blink-features=AutomationControlled'],
    });
  } catch {
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-blink-features=AutomationControlled'],
    });
  }
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    locale: 'en-US',
    timezoneId: 'America/New_York',
  });

  // mask webdriver detection
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const page = await context.newPage();

  return {
    async get(url: string) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });

      // wait for Cloudflare or similar challenges to resolve (up to 15s)
      for (let i = 0; i < 15; i++) {
        const title = await page.title();
        const hasCfChallenge = title.includes('Just a moment')
          || title.includes('Attention Required')
          || title.includes('Checking');
        if (!hasCfChallenge) break;
        await page.waitForTimeout(1_000);
      }

      // let any remaining JS rendering settle
      await page.waitForTimeout(1_500);
      return page.content();
    },
    async close() {
      await browser.close();
    },
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/* ------------------------------------------------------------------ */
/*  HTML → clean text                                                  */
/* ------------------------------------------------------------------ */

const NOISE_SELECTORS = [
  'script', 'style', 'noscript', 'iframe', 'svg',
  'nav', 'footer', 'header',
  '.ad', '.ads', '.advertisement', '.sidebar',
  '.cookie-banner', '.cookie-consent',
  '[role="navigation"]', '[role="banner"]', '[aria-hidden="true"]',
];

function extractText(html: string, contentSelector?: string): string {
  const $ = cheerio.load(html);

  for (const sel of NOISE_SELECTORS) $(sel).remove();

  const root = contentSelector ? $(contentSelector) : $('body');

  return root
    .text()
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractTitle(html: string): string {
  const $ = cheerio.load(html);
  return $('h1').first().text().trim()
    || $('title').text().trim()
    || 'untitled';
}

/* ------------------------------------------------------------------ */
/*  Link discovery                                                     */
/* ------------------------------------------------------------------ */

function discoverLinks(
  html: string,
  baseUrl: string,
  selector: string,
  followExternal: boolean,
): string[] {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const seen = new Set<string>();
  const links: string[] = [];

  // ensure base ends with / so relative links resolve as children, not siblings
  const resolveBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

  $(selector).each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    let resolved: URL;
    try {
      resolved = new URL(href, resolveBase);
    } catch {
      return;
    }

    resolved.hash = '';
    if (!followExternal && resolved.origin !== base.origin) return;

    const ext = path.extname(resolved.pathname).toLowerCase();
    if (ext && !['.html', '.htm', '.php', '.asp', '.aspx', ''].includes(ext)) return;

    const canonical = resolved.href;
    if (seen.has(canonical)) return;
    seen.add(canonical);
    links.push(canonical);
  });

  return links;
}

/* ------------------------------------------------------------------ */
/*  File output                                                        */
/* ------------------------------------------------------------------ */

function simpleHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

interface ScrapedPage {
  url: string;
  title: string;
  file: string;
  chars: number;
}

function savePage(
  outDir: string,
  url: string,
  title: string,
  text: string,
  index: number,
): ScrapedPage {
  fs.mkdirSync(outDir, { recursive: true });

  const slug = slugify(title) || `page-${index}`;
  const filename = `${String(index).padStart(3, '0')}-${slug}.txt`;
  const filepath = path.join(outDir, filename);

  const header = `URL: ${url}\nTitle: ${title}\n${'='.repeat(60)}\n\n`;
  fs.writeFileSync(filepath, header + text, 'utf-8');

  return { url, title, file: filepath, chars: text.length };
}

function writeManifest(outDir: string, pages: ScrapedPage[]) {
  const manifest = {
    scrapedAt: new Date().toISOString(),
    totalPages: pages.length,
    totalChars: pages.reduce((sum, p) => sum + p.chars, 0),
    pages,
  };

  const filepath = path.join(outDir, '_manifest.json');
  fs.writeFileSync(filepath, JSON.stringify(manifest, null, 2), 'utf-8');
  return filepath;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  const opts = parseArgs();
  const baseUrl = new URL(opts.url);
  const outDir =
    opts.outDir ||
    path.join('scraped', slugify(baseUrl.hostname + baseUrl.pathname));

  console.log(`Scraping: ${opts.url}`);
  console.log(`Output:   ${outDir}/`);
  console.log(`Mode:     ${opts.useBrowser ? 'headless browser (Playwright)' : 'plain HTTP fetch'}`);
  if (opts.linkSelector) console.log(`Links:    ${opts.linkSelector}`);
  console.log();

  let browserFetcher: BrowserFetcher | null = null;
  if (opts.useBrowser) {
    console.log('Launching headless browser...');
    browserFetcher = await createBrowserFetcher();
  }

  const fetchHtml = browserFetcher
    ? (url: string) => browserFetcher!.get(url)
    : fetchPlain;

  const pages: ScrapedPage[] = [];
  const visited = new Set<string>();
  const urls: string[] = [];

  // fetch entry page and optionally discover links
  console.log('Fetching entry page...');
  const entryHtml = await fetchHtml(opts.url);
  visited.add(opts.url);

  const seenContent = new Set<string>();

  const entryText = extractText(entryHtml, opts.contentSelector);
  const entryTitle = extractTitle(entryHtml);
  if (entryText.length > 50) {
    const page = savePage(outDir, opts.url, entryTitle, entryText, 0);
    pages.push(page);
    seenContent.add(simpleHash(entryText));
    console.log(`  [0] ${entryTitle} (${entryText.length.toLocaleString()} chars)`);
  }

  if (opts.linkSelector) {
    const discovered = discoverLinks(
      entryHtml,
      opts.url,
      opts.linkSelector,
      opts.followExternal,
    );
    console.log(`\nFound ${discovered.length} links via "${opts.linkSelector}"\n`);
    urls.push(...discovered);
  }

  // scrape discovered pages
  for (let i = 0; i < urls.length && pages.length < opts.maxPages; i++) {
    const url = urls[i];
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      await sleep(opts.delay);
      const html = await fetchHtml(url);
      const text = extractText(html, opts.contentSelector);
      const title = extractTitle(html);

      if (text.length < 50) {
        console.log(`  [skip] ${url} (too short: ${text.length} chars)`);
        continue;
      }

      const hash = simpleHash(text);
      if (seenContent.has(hash)) {
        console.log(`  [skip] ${title} (duplicate content)`);
        continue;
      }
      seenContent.add(hash);

      const page = savePage(outDir, url, title, text, pages.length);
      pages.push(page);
      console.log(`  [${pages.length - 1}] ${title} (${text.length.toLocaleString()} chars)`);
    } catch (err) {
      console.error(`  [error] ${url}: ${(err as Error).message}`);
    }
  }

  if (browserFetcher) await browserFetcher.close();

  const totalChars = pages.reduce((s, p) => s + p.chars, 0);
  console.log(`\nScraped ${pages.length} pages, ${totalChars.toLocaleString()} chars total`);

  const manifestPath = writeManifest(outDir, pages);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`\nRun 'npm run ingest' to embed & vectorize the scraped content.`);
}

main().catch((err) => {
  console.error('Scrape failed:', err);
  process.exit(1);
});
