import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
execFileSync('npm', ['run', 'build'], {
  cwd: projectRoot,
  encoding: 'utf8',
  stdio: 'pipe',
});

const port = '5179';
const server = spawn(process.execPath, ['dist/server/entry.mjs'], {
  cwd: projectRoot,
  env: { ...process.env, HOST: '127.0.0.1', PORT: port },
  stdio: 'ignore',
});

after(() => server.kill());

for (let attempt = 0; attempt < 50; attempt += 1) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    if (response.ok) break;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

async function renderedPage(path) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`);
  assert.equal(response.status, 200, `${path || '/'} should render successfully`);
  return response.text();
}

// PRD: WebsiteRedesignAug2026 §§3, 8–13, 53–55.
test('homepage presents the canonical systems-architect position and ordered proof', async () => {
  const html = await renderedPage('');
  const hero = html.match(/<section class="hero[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(hero, /PRINCIPAL SYSTEMS ARCHITECT/i);
  assert.match(hero, /constraints are real/i);
  assert.match(hero, /obvious abstraction is usually wrong/i);
  assert.match(hero, /href="#selected-work"/);
  assert.match(hero, /Discuss an engagement/);
  assert.match(hero, /Download Résumé/);
  assert.match(html, /href="\/turnkeyhq"/);
  assert.match(html, /TurnkeyHQ/);
  assert.doesNotMatch(hero, /TurnkeyHQ/);
  assert.match(html, /&lt;50 ms/);
  assert.match(html, /128 GPUs/);
  assert.match(html, /~\$60M/);
  assert.match(html, /Define the system/);
  assert.match(html, /Build the critical path/);
  assert.match(html, /De-risk the system/);
});

// PRD: WebsiteRedesignAug2026 §19.
test('TurnkeyHQ case study connects product ownership to the full operating lifecycle', async () => {
  const html = await renderedPage('/turnkeyhq');

  assert.match(html, /full-lifecycle case study/i);
  assert.match(html, /What this case demonstrates/);
  assert.match(html, /tenant isolation/i);
  assert.match(html, /Release engineering/i);
  assert.match(html, /private beta/i);
  assert.match(html, /href="https:\/\/alchemicalai\.com/);
});

// PRD: WebsiteRedesignAug2026 §§4, 14–18, 39–42.
test('global navigation, work, and resume reinforce the canonical positioning', async () => {
  const work = await renderedPage('/work');
  const resume = await renderedPage('/resume');
  const home = await renderedPage('');

  assert.match(home, />Research</);
  assert.match(home, />Resume</);
  assert.match(home, /Discuss an engagement/);
  assert.match(home, />Engage</);
  assert.match(home, /href="\/engage"/);
  assert.match(work, /href="\/engage"/);
  assert.doesNotMatch(home, /Read the Thesis/);
  assert.match(work, /href="\/turnkeyhq"/);
  assert.match(work, /Systems built under real constraints/);
  assert.match(work, /How I contribute/);
  assert.match(resume, /Principal Systems Architect/);
  assert.match(resume, /Alchemical AI LLC \/ TurnkeyHQ/);
  assert.match(resume, /href="\/turnkeyhq"/);
  assert.match(resume, /Agentic Data/);
  assert.match(resume, /SwarmOS/);
});

test('AfterFiat research profile presents the canonical v1.9 thesis and authorship', async () => {
  const html = await renderedPage('/afterfiat');

  assert.match(html, /Sole author/);
  assert.match(html, /v1\.9/);
  assert.match(html, /conditional monetary candidate/i);
  assert.match(html, /ten premises/i);
  assert.match(html, /nine-link/i);
  assert.match(html, /fifteen red lines/i);
  assert.match(html, /VerifyPrice/);
  assert.match(html, /VerifyReach/);
  assert.match(html, /VerifySettle/);
  assert.match(html, /VerifyFlow/);
  assert.match(html, /href="https:\/\/afterfiat\.xyz\/v\/1\.9\/read\//);
  assert.match(html, /href="https:\/\/afterfiat\.xyz\/pdf\/next-gen-sov-v1\.9\.pdf/);
});

// PRD: WebsiteRedesignAug2026 §§25–26, 29–30, 33.
test('research is canonical, Agentic Data is crawler-visible, and Structure Lab targets Work', async () => {
  const research = await renderedPage('/research');
  const writing = await renderedPage('/writing');
  const projects = await renderedPage('/projects');
  const agenticData = await renderedPage('/agentic-data');

  assert.match(research, /Research &amp; Labs/);
  assert.match(writing, /Writing is where I make system models explicit/i);
  assert.match(projects, /Research &amp; Labs/);
  assert.match(agenticData, /<h1[^>]*>Agentic Data<\/h1>/);
  assert.match(agenticData, /Persistent context infrastructure/i);
  assert.match(agenticData, /rel="canonical"/);
  assert.match(agenticData, /og:title/);
  assert.match(research, /href="\/work#structure-lab"/);
});

// Commercial interface: /engage is the bounded, priced entry point for advisory work.
test('engage page presents three priced offers and routes to the inquiry form', async () => {
  const engage = await renderedPage('/engage');

  assert.match(engage, /<h1[^>]*>Work with Jason<\/h1>/);
  assert.match(engage, /Architecture &amp; Risk Review/);
  assert.match(engage, /AI Systems De-Risking Sprint/);
  assert.match(engage, /Fractional Principal Architecture/);
  assert.match(engage, /\$8K–\$15K/);
  assert.match(engage, /\$15K–\$30K/);
  assert.match(engage, /\$7\.5K–\$10K/);
  assert.match(engage, /How engagements work/);
  assert.match(engage, /href="\/contact#engagement"/);
  assert.match(engage, /href="\/work#secure-distributed-ml"/);
  assert.match(engage, /href="\/work#real-time-underwater-detection"/);
  assert.match(engage, /href="\/work#adversarial-storage-incentives"/);
  assert.doesNotMatch(engage, /per hour|hourly rate/i);
});

// The contact form should arrive pre-classified against the published engagement types.
test('contact form mirrors the published engagement types', async () => {
  const contact = await renderedPage('/contact');

  assert.match(contact, /Architecture &amp; risk review/);
  assert.match(contact, /AI systems de-risking sprint/);
  assert.match(contact, /Fractional principal architecture/);
  assert.match(contact, /Technical diligence/);
  assert.match(contact, /href="\/engage"/);
});
