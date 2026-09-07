#!/usr/bin/env node
/**
 * Freshness check for facts this site mirrors from somewhere else.
 *
 * The site restates things it does not own: the AfterFiat thesis version, the
 * shape of its argument, whether a linked artifact still resolves. Those facts
 * drift on their source's schedule, not this repo's, and nothing in a build or
 * a unit test can notice — the page renders perfectly while saying something
 * that stopped being true weeks ago.
 *
 * This script is the noticing. It hits the network, so it is deliberately not
 * part of `npm test`: run it on a schedule, or before publishing.
 *
 *   npm run check:freshness
 *
 * Exit code 0 = every mirrored fact still matches its source.
 * Exit code 1 = at least one fact drifted, or a source could not be reached.
 *
 * To add a fact: give it a source URL, a way to read the current value out of
 * that source, and the value this repo currently claims. Keep the claimed value
 * pointing at the constant the site actually renders — never a second copy.
 */
import { readFileSync } from 'node:fs';

const site = readFileSync(new URL('../src/lib/site.ts', import.meta.url), 'utf8');

/** Reads an exported string constant out of site.ts without importing TypeScript. */
const constant = (name) => {
  const m = site.match(new RegExp(`export const ${name} = '([^']*)'`));
  if (!m) throw new Error(`site.ts no longer exports ${name}`);
  return m[1];
};
const numericConstant = (name) => {
  const m = site.match(new RegExp(`export const ${name} = (\\d+)`));
  if (!m) throw new Error(`site.ts no longer exports ${name}`);
  return Number(m[1]);
};

const AFTERFIAT = constant('AFTERFIAT_URL');
const VERSION = constant('AFTERFIAT_VERSION');
const RED_LINES = numericConstant('AFTERFIAT_RED_LINES');

const text = async (url) => {
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const html = await res.text();
  return html
    .replace(/<(script|style|svg)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');
};

const reachable = async (url) => {
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(45_000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return `${res.status}`;
};

const NUMBER_WORDS = {
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
};

const checks = [
  {
    name: 'AfterFiat thesis version',
    source: `${AFTERFIAT}/`,
    claimed: VERSION,
    async current() {
      const t = await text(`${AFTERFIAT}/`);
      const m = t.match(/v(\d+\.\d+(?:\.\d+)?)[^a-z0-9]{1,8}checksummed/i);
      if (!m) throw new Error('version banner not found — the source page changed shape');
      return m[1];
    },
    fix: "update AFTERFIAT_VERSION in src/lib/site.ts (and AFTERFIAT_VERSION_YEAR if the year moved)",
  },
  {
    name: 'AfterFiat red-line count',
    source: `${AFTERFIAT}/`,
    claimed: String(RED_LINES),
    async current() {
      const t = await text(`${AFTERFIAT}/`);
      const m = t.match(/(\w+)\s+red\s+lines/i);
      if (!m) throw new Error('red-line phrase not found — the source page changed shape');
      const word = m[1].toLowerCase();
      return String(NUMBER_WORDS[word] ?? Number(word) ?? word);
    },
    fix: 'update AFTERFIAT_RED_LINES in src/lib/site.ts and the spelled-out word on /afterfiat',
  },
  {
    name: 'AfterFiat canonical read URL resolves',
    source: constant('AFTERFIAT_URL'),
    claimed: '200',
    current: () => reachable(`${AFTERFIAT}/v/${VERSION}/read/`),
    fix: 'the versioned reading URL moved; check AFTERFIAT_VERSION and the /v/<version>/read/ path shape',
  },
  {
    name: 'AfterFiat canonical PDF resolves',
    source: constant('AFTERFIAT_URL'),
    claimed: '200',
    current: () => reachable(`${AFTERFIAT}/pdf/next-gen-sov-v${VERSION}.pdf`),
    fix: 'the PDF filename convention changed; update AFTERFIAT_PDF_URL in src/lib/site.ts',
  },
  {
    // The cited DOI is a Zenodo *version* DOI for the v1.0 deposit, not the
    // concept DOI (10.5281/zenodo.18902694) that always resolves to latest.
    // Expect this to read red until a v3.0 deposit exists, or until the site
    // switches to the concept DOI. That is the check working, not noise.
    name: 'Zenodo deposit matches the cited thesis version',
    source: 'https://zenodo.org/api/records/18902696',
    claimed: VERSION,
    async current() {
      const res = await fetch('https://zenodo.org/api/records/18902696', {
        headers: { 'user-agent': 'jasonstgeorge.com freshness check' },
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const record = await res.json();
      return record?.metadata?.version ?? 'unknown';
    },
    fix: 'deposit the current version on Zenodo, or cite the concept DOI 10.5281/zenodo.18902694, which always resolves to the latest deposit',
  },
  // Repository links rendered as "View GitHub" buttons. A private or renamed
  // repo is a 404 to every logged-out visitor, which is what the site's readers
  // are, so anything but 200 is a broken button.
  ...[
    ['Capability Commons', constant('CAPABILITY_COMMONS_GITHUB')],
    ['SwarmOS', constant('SWARMOS_GITHUB')],
    ['Agentic Data', constant('AGENTICDATA_GITHUB')],
  ].map(([project, url]) => ({
    name: `${project} repository link resolves for a logged-out visitor`,
    source: url,
    claimed: '200',
    current: () => reachable(url),
    fix: 'push or unarchive the repo, make it public, or drop the "View GitHub" button from that page',
  })),
];

let drift = 0;
let unreachable = 0;

for (const check of checks) {
  let current;
  try {
    current = await check.current();
  } catch (error) {
    unreachable += 1;
    console.log(`?  ${check.name}\n   could not read ${check.source}: ${error.message}`);
    continue;
  }
  if (current === check.claimed) {
    console.log(`ok ${check.name} — ${current}`);
  } else {
    drift += 1;
    console.log(
      `!! ${check.name}\n   site says ${check.claimed}, ${check.source} says ${current}\n   fix: ${check.fix}`,
    );
  }
}

console.log(
  `\n${checks.length} checked · ${drift} drifted · ${unreachable} unreachable`,
);
process.exit(drift + unreachable > 0 ? 1 : 0);
