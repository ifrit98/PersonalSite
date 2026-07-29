# jasonstgeorge.com — Comprehensive Upgrade Plan

**Goal:** Make the site pass the smell test for serious institutional people (Mike Green, fund managers, researchers, podcast hosts) while retaining the consulting utility and creative breadth that makes it yours.

**Stack:** Astro 5 SSR, Supabase, deployed on Replit. Pages are `.astro` files. Content collections for `work/` and `research/`. Styles via CSS custom properties in `tokens.css` + `global.css`. No headless CMS — everything is in-source.

---

## Phase 0 — Quick wins (< 1 hour each)

These are high-signal, low-effort changes. Do them first because any one of them meaningfully moves the needle for a Green-type visitor.

### 0.1 Add headshot to About page

**File:** `src/pages/about.astro`
**Asset:** Add `headshot.jpg` (or `.webp`) to `public/`

Add a photo element at the top of the narrative section, after the hero and before the first `<p>`. Doesn't need to be corporate — something that looks like a person who builds things, taken in natural light. A clean 400×400 square or 3:4 portrait.

```html
<div class="about-portrait">
  <img src="/headshot.jpg" alt="Jason St George" width="280" height="280" loading="eager" />
</div>
```

Style it left-floated on desktop, full-width-centered above the text on mobile. Use `border-radius: var(--radius-card)` and a subtle `box-shadow` to match the card system.

### 0.2 Add SSRN link to visible surfaces

The thesis is on SSRN. That's a strong institutional signal — it's where Green's world publishes. Surface it.

**Files:**
- `src/pages/about.astro` — add an "Academic & Institutional" micro-section after Current Focus with SSRN + DOI links
- `src/pages/writing.astro` — add SSRN link under the AfterFiat writing-surface card
- `src/lib/site.ts` — add `SSRN_URL` constant

```typescript
export const SSRN_URL = 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=XXXXXXX'; // fill in
export const DOI_URL = 'https://doi.org/10.5281/zenodo.18902696';
```

### 0.3 Fix "Peer-reviewed research + public writing" claim

**File:** `src/pages/index.astro` — `proofItems` array

The homepage hero says "Peer-reviewed research + public writing." You have two peer-reviewed conference papers (MSV '18, ICAI '19). Make the claim precise:

```typescript
{ text: '2 peer-reviewed papers (MSV \'18, ICAI \'19) + 262-page thesis on SSRN', href: '/research' },
```

Or simpler:
```typescript
{ text: 'Peer-reviewed publications + 262pp thesis (SSRN)', href: '/research' },
```

### 0.4 Add Twitter/X to social links

Green is active on X. Having an X link in your nav signals you exist in his world.

**File:** `src/lib/site.ts`

```typescript
social: {
  github: 'https://github.com/ifrit98',
  linkedin: 'https://linkedin.com/in/stgeorgejas',
  twitter: 'https://x.com/YOUR_HANDLE',
},
```

**File:** `src/components/layout/Header.astro` and `Footer.astro` — add the X/Twitter link alongside GitHub and LinkedIn.

---

## Phase 1 — About page overhaul (2–3 hours)

The About page is the single most important page for the Green interaction. He'll click through from the email, scan the hero, and decide in 10 seconds whether you're a peer or a pitch. Currently it's strong on voice but missing institutional gravity.

### 1.1 Add "Background" section with institutional anchors

**File:** `src/pages/about.astro`

After the narrative paragraphs and before "What I Work On," add a brief professional timeline. Not a résumé — a selective list of 3–5 positions that establish you've operated in real environments.

```html
<section class="timeline fade-up" aria-labelledby="timeline-heading">
  <div class="container container--narrow">
    <h2 id="timeline-heading" class="section-heading">Background</h2>
    <ul class="timeline__list">
      <li>
        <span class="timeline__role">Protocol Architect & Technical Lead</span>
        <span class="timeline__org">[Named protocol or "Major decentralized storage network"]</span>
        <span class="timeline__detail">~$60M production revenue, incentive design, anti-tamper verification</span>
      </li>
      <li>
        <span class="timeline__role">ML Lead</span>
        <span class="timeline__org">[Defense contractor or "Navy-contracted defense program"]</span>
        <span class="timeline__detail">Sub-50ms operational inference, $5M multi-year follow-on</span>
      </li>
      <li>
        <span class="timeline__role">ML Infrastructure Architect</span>
        <span class="timeline__org">[Classified environment context]</span>
        <span class="timeline__detail">128-GPU distributed fine-tuning, TS/SCI SCIF</span>
      </li>
      <li>
        <span class="timeline__role">Researcher</span>
        <span class="timeline__org">Rochester Institute of Technology / CCRG</span>
        <span class="timeline__detail">Black hole sonification, music style transfer (MSV '18, ICAI '19)</span>
      </li>
    </ul>
  </div>
</section>
```

**Critical:** Name whatever you can name. Even "a major decentralized storage network" is better than nothing, because it distinguishes "I can't say" from "I'm making this up." If you can name Filecoin/Protocol Labs or the defense contractor, do.

### 1.2 Add "Selected Publications & Research" to About

After the timeline, before Principles:

```html
<section class="publications fade-up" aria-labelledby="pubs-heading">
  <div class="container container--narrow">
    <h2 id="pubs-heading" class="section-heading">Selected Publications</h2>
    <ul class="publications__list">
      <li>
        <strong>Next Generation Stores of Value: Privacy, Proofs, Compute.</strong>
        Version 1.3, July 2026. 262 pp. CC BY 4.0.
        <a href="https://afterfiat.xyz">Web</a> ·
        <a href="SSRN_URL">SSRN</a> ·
        <a href="https://doi.org/10.5281/zenodo.18902696">DOI</a>
      </li>
      <li>
        <strong>Music Style Transformer.</strong>
        St. George, J., Bischof, H.P. ICAI '19, pp. 22–33.
        <a href="/papers/ICAI_2019_Submission.pdf">PDF</a>
      </li>
      <li>
        <strong>Sonification of Simulated Black Hole Merger Data.</strong>
        St. George, J., Bischof, H.P., Kim, S.Y. MSV '18, pp. 3–9.
        <a href="/papers/SonificationBlackHolesMSV3510.pdf">PDF</a>
      </li>
    </ul>
  </div>
</section>
```

This is *the* highest-signal change for institutional credibility. Green's world runs on publications. Having three, with one on SSRN and two peer-reviewed, puts you in a different category than "internet writer."

### 1.3 Tighten "Current Focus" to match outreach priorities

The current text is diffuse ("systems that preserve signal under adversarial conditions, writing on verification and monetary architecture, knowledge infrastructure for practical public capability, and formal research on music, geometry, and lawful structure"). For someone like Green, shorten it to the things that matter to *him*:

> Right now, the primary focus is the formal monetary thesis (AfterFiat), its empirical validation through Kardashev Labs, and the Eschatology Report publication. I also take on selective architecture-heavy work where the problem is real and the constraints matter.

---

## Phase 2 — Homepage reframe (2–3 hours)

The homepage currently leads with consulting. The strategic reframe: lead with the intellectual identity, surface consulting as something you also do.

### 2.1 Reorder the hero

**File:** `src/pages/index.astro`

Currently:
- Eyebrow: "ARCHITECTURE-HEAVY SYSTEMS WORK"
- H1: "Secure ML, verification, and knowledge systems for real operating constraints."
- Body: consulting pitch
- CTA: "Discuss an Engagement" (primary) / "View Selected Work" (secondary)

Proposed:
- Eyebrow: "BUILDER · RESEARCHER · WRITER"
- H1: "Verification, monetary architecture, and systems that survive pressure."
- Body: "I build protocol-level infrastructure, write about money and verification, and publish formal research. The connecting thread: what still works when soft guarantees fail?"
- CTA: "Read the Thesis" (primary, links to afterfiat.xyz) / "View Work" (secondary)
- ProofBar stays the same — the metrics are strong

This doesn't remove consulting. It reframes the identity from "consultant who also thinks" to "builder/researcher who also consults."

### 2.2 Reorder the service cards → reframe as "domains"

Currently the cards are "Secure ML & High-Constraint Systems," "Protocols, Proofs & Incentives," "Knowledge, Retrieval & Public Capability," "Technical Synthesis & Fractional Leadership."

Consider reframing as areas of work rather than consulting services:

| Current | Proposed |
|---|---|
| Secure ML & High-Constraint Systems | Secure ML & Edge Inference |
| Protocols, Proofs & Incentives | Protocol Design & Monetary Architecture |
| Knowledge, Retrieval & Public Capability | Knowledge Systems & Retrieval |
| Technical Synthesis & Fractional Leadership | *Remove or fold into About* |

"Fractional Leadership" is the most consulting-coded phrase on the site. It communicates "hire me" rather than "I build things." Consider removing it from the homepage and keeping it only on the Work page where people looking for consulting will find it.

### 2.3 Reduce homepage property cards from 5 to 3

Currently shows: AfterFiat, Eschatology Report, GAMUT, SwarmOS, Agentic Data.

For the intellectual-credibility audience, show only: **AfterFiat, Eschatology Report, GAMUT**. These are the three that signal "thinker." SwarmOS and Agentic Data are engineering portfolio items — strong, but they belong on the Work or Projects page.

**File:** `src/pages/index.astro`

```typescript
const homePropertyNames = ['AfterFiat', 'Eschatology Report', 'GAMUT'];
```

---

## Phase 3 — Projects & Labs hierarchy (2–3 hours)

Currently all eight properties are presented in a flat grid with equal visual weight. AlchemicalAI (real estate SaaS) sits alongside AfterFiat (262-page formal thesis). For serious visitors, this dilutes the intellectual properties.

### 3.1 Create tiered presentation

**File:** `src/pages/projects.astro`

Replace the flat grid with two tiers:

**Tier 1 — "Core Intellectual Properties"** (large cards, prominent):
- AfterFiat
- Eschatology Report
- GAMUT

**Tier 2 — "Engineering & Applied Work"** (smaller cards, compact grid):
- SwarmOS
- Agentic Data
- Capability Commons
- Structure Lab
- AlchemicalAI

**Implementation:** Add a `tier` field to `ENDORSED_PROPERTIES` in `site.ts`:

```typescript
{
  name: 'AfterFiat',
  tagline: 'Thesis / Blueprint',
  tier: 'core',
  // ...
},
{
  name: 'SwarmOS',
  tagline: 'Research Platform / Agent Infrastructure',
  tier: 'engineering',
  // ...
},
```

Then in `projects.astro`, filter and render two separate grids.

### 3.2 Simplify "Active Lab Directions"

Cut from six to three. The current six overlap heavily with the named properties. Keep:
- Verified Compute & Proof-Bearing Systems
- Agentic Knowledge Infrastructure
- Music, Geometry & Lawful Form

The others (Public Capability, Quant Finance, Collective Intelligence) are already represented by their named properties and don't need a second listing.

---

## Phase 4 — Writing page + Research page merge (1–2 hours)

### 4.1 Add publications to the Writing page

Currently the Writing page has two writing surfaces (AfterFiat, Eschatology Report) and four themes. It has no publications.

Add a "Published Research" section between the writing surfaces and the themes:

```html
<section class="publications fade-up">
  <h2 class="section-heading">Published Research</h2>
  <!-- Same publication list as About, but with paper thumbnails or abstracts -->
</section>
```

### 4.2 Surface the Research page

There is a `src/pages/research.astro` page with the two conference papers, but it's not in the nav (`NAV_LINKS` in `site.ts`). Either:
- **Option A:** Add "Research" to the nav between "Writing" and "Projects & Labs"
- **Option B:** Merge the research content into the Writing page and remove the standalone page

Option B is probably cleaner — the Writing page becomes "Writing & Research" and houses both the publication-level work and the essayistic work.

---

## Phase 5 — CTA hierarchy (30 minutes)

### 5.1 Demote "Discuss an Engagement" from golden button

**File:** `src/components/layout/Header.astro`

Currently the golden (brass-colored) primary button in the top-right nav is "Discuss an Engagement." This is the strongest visual signal on the site, and it says "hire me."

Options:
- **Option A (recommended):** Change the golden button to "Read the Thesis" → `afterfiat.xyz`. Move "Discuss an Engagement" to a regular nav link or the Contact page.
- **Option B:** Keep the golden button but change it to "Get in Touch" — more neutral than "Discuss an Engagement," which is explicitly consulting-coded.
- **Option C:** Remove the golden button entirely and let all nav items be equal weight.

### 5.2 Update the homepage CTA band

**File:** `src/pages/index.astro` — the `finalCards` at the bottom

Currently: "Need shipped systems?" / "Need the larger map?" / "Need to talk?"

Proposed: "Read the thesis" / "View shipped systems" / "Get in touch"

The shift is from three consulting-adjacent pathways to one intellectual pathway + one portfolio pathway + one contact pathway.

---

## Phase 6 — SEO & structured data (1–2 hours)

### 6.1 Update structured data Person schema

**File:** `src/layouts/BaseLayout.astro`

The current `Person` schema has `jobTitle: 'Independent Builder & Researcher'`. Update to include:

```typescript
{
  '@type': 'Person',
  name: 'Jason St George',
  url: SITE.url,
  jobTitle: 'Researcher & Protocol Architect',
  description: SITE.description,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Rochester Institute of Technology',
  },
  sameAs: [
    SITE.social.github,
    SITE.social.linkedin,
    SITE.social.twitter,
    SSRN_URL,
    AFTERFIAT_URL,
    ESCHATOLOGY_URL,
  ],
}
```

### 6.2 Add ScholarlyArticle schema for AfterFiat

On the Writing page, add structured data for the thesis so Google Scholar can index it from this surface too:

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  name: 'Next Generation Stores of Value: Privacy, Proofs, Compute',
  author: { '@type': 'Person', name: 'Jason St George' },
  datePublished: '2026-07-27',
  url: 'https://afterfiat.xyz',
  identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: '10.5281/zenodo.18902696' },
}
```

### 6.3 Update `og-default.png`

The OG image is a generic fallback. Consider creating a bespoke one that includes your name, "Builder · Researcher · Writer," and the constellation graphic from the homepage. This is what appears when someone shares any page from your site on X/LinkedIn.

---

## Phase 7 — Chat widget assessment (30 minutes)

### 7.1 Evaluate the "Ask" button

The floating "Ask" chat button in the bottom-right corner uses Supabase + OpenAI. For a consulting site, it's a differentiator. For intellectual credibility, it creates a faint customer-service feel.

Options:
- **Keep but restyle:** Make it less prominent — perhaps a small icon rather than a labeled button, or move it to the Contact page only.
- **Keep as-is:** If it actually gets used and converts, the credibility cost is small.
- **Remove from homepage + About, keep on Work + Contact:** Remove it from the pages a Green-type visitor would see, keep it where consulting prospects land.

---

## Phase 8 — Content gaps to fill (varies)

### 8.1 Kardashev Labs mention

The outreach materials reference "Kardashev Labs" as the research lab you're building. The site doesn't mention it anywhere. Add a brief mention to:
- **About page** (Current Focus section): "...building Kardashev Labs, a research lab focused on open-source value-capture telemetry and verification tooling."
- **Projects page** (as an upcoming property or under lab directions)

### 8.2 LinkedIn audit

Verify your LinkedIn (`linkedin.com/in/stgeorgejas`) has:
- Current employment history matching the timeline on the About page
- AfterFiat listed as a project or publication
- SSRN link in the Featured section
- A professional headshot (same one as the site)

This is important because LinkedIn is Green's world's default background-check tool. If someone sends him an email, his assistant (or he) will check LinkedIn before responding.

### 8.3 Rename paper PDFs

Currently: `ICAI_2019_Submission.pdf` and `SonificationBlackHolesMSV3510.pdf`. These are submission-era filenames. Rename to:
- `st-george-bischof-music-style-transformer-icai-2019.pdf`
- `st-george-bischof-kim-black-hole-sonification-msv-2018.pdf`

Small detail, but anyone who downloads them sees the filename. Professional naming signals care.

---

## Execution order

The order below is optimized for maximum credibility improvement per hour invested, front-loaded for the Green outreach timeline:

| Priority | Phase | Effort | Signal value |
|---|---|---|---|
| **Do first** | 0.1 Headshot | 15 min | Very high |
| **Do first** | 0.2 SSRN link | 15 min | Very high |
| **Do first** | 0.3 Proof bar fix | 5 min | Medium |
| **Do first** | 0.4 Twitter/X link | 5 min | Low-medium |
| **Day 1** | 1.1 Background timeline | 1 hr | Very high |
| **Day 1** | 1.2 Publications section | 1 hr | Very high |
| **Day 1** | 1.3 Tighten current focus | 15 min | Medium |
| **Day 1** | 8.2 LinkedIn audit | 30 min | High |
| **Day 1** | 8.3 Rename papers | 5 min | Low |
| **Day 2** | 2.1 Homepage hero reframe | 1 hr | High |
| **Day 2** | 5.1 CTA hierarchy | 30 min | Medium |
| **Day 2** | 8.1 Kardashev Labs mention | 15 min | Medium |
| **Day 3** | 3.1 Projects tier system | 2 hr | Medium |
| **Day 3** | 4.1-4.2 Writing/Research merge | 1 hr | Medium |
| **Day 3** | 2.2-2.3 Homepage cards | 1 hr | Medium |
| **Week 2** | 6.1-6.3 SEO & structured data | 1-2 hr | Low-medium |
| **Week 2** | 7.1 Chat widget | 30 min | Low |
| **Week 2** | 5.2 CTA band | 30 min | Low |

**Total estimate:** ~12–15 hours across ~1 week.

**Critical path for Green outreach:** Phases 0 and 1 (headshot, SSRN, publications, timeline). Everything else is improvement; those four items are the difference between "interesting internet person" and "serious researcher who also ships."

---

## What NOT to change

- **The visual design.** The dark palette, Newsreader serif, Inter sans, constellation graphic, card system — all strong. Don't redesign.
- **The writing voice.** Dense, direct, no throat-clearing. Keep it.
- **The case studies.** Specific, verifiable, real. Keep them exactly as they are.
- **The Eschatology Report name.** It's your brand. Don't rename it for one audience.
- **The domain structure.** Separate sites for the personal brand and AfterFiat is correct. Don't merge them.
