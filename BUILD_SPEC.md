# Astro Design Spec — Jason St George Personal Brand Site

## 1. Purpose

This document specifies the first production version of a personal canonical site for **Jason St George**. The site is intended to function as:

- the canonical public identity layer
- a credibility and proof layer
- a routing layer into endorsed properties
- a conversion surface for advisory, research, writing, and collaboration

This is **not** a generic portfolio site. It is a structured public interface for a body of work spanning:

- protocol and infrastructure design
- distributed systems and production ML
- real-time detection and edge inference
- long-form writing and publication
- formal research in music, sonification, and mathematical structure

The site should unify that breadth under one coherent question:

> How do we build trustworthy systems for truth, coordination, and value under adversarial conditions?

---

## 2. Product goals

### Primary goals
- Establish a serious, legible, institutional-quality public identity
- Make broad work feel coherent rather than fragmented
- Route visitors to the correct surface quickly
- Convert qualified visitors into inquiries, readers, and collaborators
- Provide a stable namespace for future subprojects and satellites

### Secondary goals
- Support long-term discoverability through strong information architecture and SEO
- Create a design system that can later extend to AfterFiat, AlchemicalAI, and related properties
- Preserve optionality for later additions like talks, notes, media, or advisory landing pages

### Non-goals for v1
- No blog engine migration if Eschatology Report remains offsite
- No ecommerce
- No member system
- No CMS dependency required for launch
- No animation-heavy or flashy visual language

---

## 3. Brand architecture

### Master brand
**Jason St George**

### Endorsed properties
- Eschatology Report
- AfterFiat
- AlchemicalAI

### Public-but-selective work
- Software / ML engineering work
- DoD-related public-safe summaries
- published research
- music geometry framework

### Low-visibility / selective-sharing work
- DSN deeper detail
- classified specifics
- sensitive architecture and operational detail

### Naming rule
The personal site is the root identity. Projects, publications, and companies are subordinate or endorsed properties.

---

## 4. Audience model

The site must serve at least five distinct visitor types:

### 4.1 Recruiters / hiring managers
Need a quick grasp of role fit, credibility, scope, and current level.

### 4.2 Consulting / advisory leads
Need proof of technical depth, system-level thinking, and fit for architecture-heavy or research-heavy work.

### 4.3 Readers / subscribers
Need a coherent entry point into writing, worldview, and the publication ecosystem.

### 4.4 Research collaborators
Need publications, current research interests, formal tone, and evidence of seriousness.

### 4.5 General high-agency visitors
Need a strong sense of who Jason is and what the work is about without needing prior context.

### Routing requirement
The homepage must make three actions obvious within the first screen:

- evaluate credibility
- read the writing
- discuss work / collaboration

---

## 5. Voice and tone system

### Voice attributes
- precise
- serious
- calm
- legible
- intellectually dense when needed
- not performative
- not startup-hype

### Tone rules
- Write with compression and clarity
- Prefer concrete nouns and verbs over abstractions
- Avoid inflated personal-brand clichés
- Use technical language only when it adds real precision
- Avoid overclaiming, especially around confidential work

### Vocabulary to favor
proof, verification, structure, signal, coordination, adversarial, infrastructure, form, resilience, reliability, legibility, synthesis, research, systems

### Vocabulary to avoid
visionary, disruptor, polymath, guru, hacker, ninja, rockstar, thought leader, futurist

---

## 6. Visual direction

### Aesthetic target
**Institutional + editorial + slightly symbolic**

The look should feel like a hybrid of:
- a serious research institute
- a premium essay publication
- a disciplined technical lab

Not cyberpunk. Not startup-dashboard. Not occult maximalism.

### Visual rules
- Light default theme
- Dark mode optional later
- Large typographic hierarchy
- Generous whitespace
- Thin rules and subtle section dividers
- Sparse accent color usage
- Minimal motion
- Strong stillness and composure

### Symbolic layer
Symbolic or geometric motifs may appear only as restrained accents:
- topological lines
- lattice-like structures
- musical geometry hints
- thin network forms

These must support the tone, not dominate it.

---

## 7. Design tokens

### Color palette
- `--color-ink: #101826`
- `--color-bone: #F5F1E8`
- `--color-slate: #5E6875`
- `--color-brass: #A98752`
- `--color-oxblood: #4F2432`
- `--color-line: rgba(16, 24, 38, 0.12)`
- `--color-card: rgba(255,255,255,0.55)`

### Typography
#### Headlines
Recommended direction:
- Newsreader
- Canela
- Tiempos

#### Body
Recommended direction:
- Inter
- IBM Plex Sans
- Suisse Int’l if licensed

#### Mono / metadata
- IBM Plex Mono
- JetBrains Mono

### Type scale
- Display: 64 / 72
- H1: 48 / 56
- H2: 34 / 40
- H3: 24 / 30
- Body Large: 20 / 32
- Body: 18 / 30
- Meta: 14 / 22
- Mono Meta: 13 / 20

### Spacing scale
- 4, 8, 12, 16, 24, 32, 48, 64, 96, 128

### Radius
- 0 for structural lines
- 8 for buttons
- 16 for cards
- Avoid playful large rounding

### Shadow usage
Very light, mostly for hover or card separation only.

---

## 8. Technical stack

### Framework
**Astro**

### Recommended implementation stack
- Astro for routing, layouts, static generation
- MDX for content-heavy sections
- TypeScript
- Tailwind CSS or vanilla CSS with tokens
- Astro image optimization for local assets
- optional: Framer Motion is not required and should likely be avoided in v1

### Content strategy
- static pages for top-level sections
- collection-based content for research, work case studies, and notes if later added
- minimal JS by default

### Analytics
- Plausible or Fathom
- privacy-conscious setup

### Forms
- serverless form handler or simple backend endpoint
- inquiry form with topic routing

### Deployment
- Vercel or Netlify
- static-first output preferred

---

## 9. Information architecture

### Primary navigation
- Home
- Work
- Writing
- Research
- About
- Resume
- Contact

### Utility links
- Read AfterFiat
- Eschatology Report

### Footer links
- GitHub
- LinkedIn
- Email
- AfterFiat
- Eschatology Report
- AlchemicalAI
- RSS (if used later)

---

## 10. Route map

### Core routes
- `/`
- `/work`
- `/writing`
- `/research`
- `/about`
- `/resume`
- `/contact`

### Optional v1.1 routes
- `/start-here`
- `/speaking`
- `/projects/afterfiat`
- `/projects/music-geometry`
- `/notes`

### Dynamic collection routes (optional)
- `/research/[slug]`
- `/work/[slug]`
- `/notes/[slug]`

---

## 11. Global layout spec

### Header
Sticky or semi-sticky, subtle background on scroll.

#### Left
- Name wordmark: `Jason St George`

#### Center / right
- primary nav links

#### Utility actions
- small text link: `Eschatology Report`
- primary button: `Read AfterFiat`

### Footer
Three-column footer on desktop, stacked on mobile.

#### Column 1
- name
- one-line descriptor

#### Column 2
- navigation

#### Column 3
- external properties and contact

### Global UI patterns
- section intro with eyebrow label optional
- strong H2 per section
- cards limited to featured domains or selected work
- button system: primary, secondary, text link
- subtle divider rules between major sections

---

## 12. Homepage spec (`/`)

### Purpose
- establish identity
- present throughline
- prove breadth without fragmentation
- route visitors to the right next step

### Section order
1. Hero
2. Proof bar
3. Featured domains
4. Selected work preview
5. Associated properties
6. Short bio
7. Final CTA band

### 12.1 Hero
#### Layout
2-column desktop, single column mobile.

#### Left content
- H1: `Systems for truth, coordination, and value under adversarial conditions`
- supporting body copy
- CTA row

#### Right content
- restrained abstract visual or portrait
- recommended approach: line-based geometric field or monochrome portrait with subtle line overlay

#### Copy
**Eyebrow:** Jason St George

**H1:** Systems for truth, coordination, and value under adversarial conditions

**Body:** I build and write about protocol, infrastructure, and research problems where trust is costly, failure is adversarial, and systems have to work outside ideal conditions. My work spans distributed systems, proofs, real-time ML, long-form writing, and formal research.

**Primary CTA:** View Selected Work
**Secondary CTA:** Read the Writing

### 12.2 Proof bar
Three horizontally aligned proof blocks.

#### Block 1
**Protocols & Infrastructure**  
Privacy-preserving systems, threat models, incentive design, verifiable compute.

#### Block 2
**Real-Time ML**  
Distributed training, edge inference, sensor fusion, operational latency.

#### Block 3
**Writing & Research**  
AfterFiat, Eschatology Report, peer-reviewed research, ongoing formal work.

### 12.3 Featured domains
Four-card grid.

#### Card 1
**AfterFiat**  
A book-length thesis on verification, repression, synthetic media, and the infrastructure required for credible truth and value in the AI era.

#### Card 2
**Eschatology Report**  
Long-form writing on AI acceleration, symbolic overload, civilizational drift, and the search for workable orientation.

#### Card 3
**Selected Systems Work**  
Engineering work across secure environments, distributed ML, real-time detection, and adversarial protocol design.

#### Card 4
**Research & Music**  
Published work in music generation and sonification, alongside ongoing work on formal musical and geometric structure.

### 12.4 Selected work preview
List or stacked preview cards linking into `/work` and `/research`.

Recommended items:
- Secure distributed ML
- Real-time underwater detection
- Adversarial storage & incentives
- Music style transformer

### 12.5 Associated properties
Logo or wordmark strip:
- AfterFiat
- Eschatology Report
- AlchemicalAI

### 12.6 Short bio
Short paragraph introducing the unified body of work.

### 12.7 Final CTA band
**Text:** Looking for technical depth, serious writing, or a clearer map of the work? Start with the selected work, the research archive, or get in touch directly.

Buttons:
- View Work
- View Research
- Contact

### Component list
- `HeroHome.astro`
- `ProofBar.astro`
- `FeatureGrid.astro`
- `SelectedWorkPreview.astro`
- `AssociatedProperties.astro`
- `ShortBio.astro`
- `CallToActionBand.astro`

---

## 13. Work page spec (`/work`)

### Purpose
Convert technical credibility into a legible consulting / advisory / architecture narrative.

### Section order
1. Hero
2. Work thesis
3. Capability areas
4. Selected case studies
5. Engagement types
6. CTA

### 13.1 Hero
**H1:** Selected Work

**Body:** Systems work across protocols, distributed ML, real-time inference, and production operations.

### 13.2 Work thesis
Paragraph explaining the kind of engineering problems that matter here: non-ideal conditions, adversarial assumptions, latency budgets, operational constraints, incentive misalignment.

### 13.3 Capability areas
Use four vertical blocks.

- Protocol & Mechanism Design
- Distributed ML & Production Systems
- Real-Time Detection & Edge Inference
- Technical Leadership

Each block should have:
- short description
- optional bullet list of example work

### 13.4 Selected case studies
Three to four structured case study blocks.

#### Recommended case studies
- Secure distributed ML
- Real-time underwater detection
- Adversarial storage & incentives
- RF / streaming ML deployment or earlier systems work

Each case study block should have:
- title
- one-line problem framing
- short narrative
- role
- constraints
- outcomes
- public-safe note if needed

### 13.5 Engagement types
Examples:
- architecture review
- protocol / threat-model analysis
- distributed ML systems advisory
- research memo / technical synthesis
- selective fractional technical leadership

### 13.6 CTA
**Heading:** Discuss an engagement

Buttons:
- Contact
- Request Capabilities Overview

### Component list
- `PageHero.astro`
- `CapabilityGrid.astro`
- `CaseStudyList.astro`
- `EngagementTypes.astro`
- `CallToActionBand.astro`

---

## 14. Writing page spec (`/writing`)

### Purpose
Provide a coherent writing hub without replacing satellite properties prematurely.

### Section order
1. Hero
2. Writing thesis
3. Featured writing surfaces
4. Start here section
5. Selected essays / texts
6. CTA

### 14.1 Hero
**H1:** Writing

**Body:** Essays, theses, and long-form work on verification, synthetic media, civilizational constraint, and the search for workable orientation.

### 14.2 Writing thesis
Explain that the writing extends the same core problem explored in the systems work: what survives when institutional legibility fails and synthetic persuasion scales.

### 14.3 Featured surfaces
Three blocks:
- AfterFiat
- Eschatology Report
- Selected essays / memos

### 14.4 Start here section
A curated entry path for new readers.

Suggested structure:
- If you are new here, start with AfterFiat
- Then read selected essays from Eschatology Report
- Then explore current notes or talks if available later

### 14.5 Selected essays / texts
In v1, this can be a curated list rather than a full blog system.

### 14.6 CTA
- Read AfterFiat
- Visit Eschatology Report
- Contact

### Component list
- `PageHero.astro`
- `WritingSurfaceGrid.astro`
- `StartHereList.astro`
- `EssayList.astro`
- `CallToActionBand.astro`

---

## 15. Research page spec (`/research`)

### Purpose
Create an institutional-quality research archive and formal-work landing page.

### Section order
1. Hero
2. Research thesis
3. Published papers
4. Ongoing investigations
5. Talks / notes (optional)
6. CTA

### 15.1 Hero
**H1:** Research

**Body:** Published papers, formal investigations, and ongoing work on structure across sound, systems, and mathematics.

### 15.2 Research thesis
This should explain that the research has two public anchors—peer-reviewed papers in music generation and sonification—and a broader interest in form, geometry, symmetry, dynamics, and computation.

### 15.3 Published papers
Each publication block should include:
- title
- venue / year
- abstract-like summary
- authors
- link to PDF / DOI / arXiv / related materials

### 15.4 Ongoing investigations
Brief cards for work in progress:
- music geometric framework
- manifold-style thinking about musical structure
- sonification and auditory display
- formal tools for hidden dynamics

### 15.5 CTA
- Read the papers
- Explore ongoing work
- Get in touch

### Component list
- `PublicationList.astro`
- `ResearchInterestGrid.astro`
- `CallToActionBand.astro`

---

## 16. About page spec (`/about`)

### Purpose
Provide the narrative bio that ties engineering, writing, and music together.

### Section order
1. Hero
2. Narrative bio
3. What I work on
4. Current focus
5. Principles
6. CTA

### 16.1 Hero
**H1:** About

**Body:** I work on systems that need to remain credible under pressure.

### 16.2 Narrative bio
Two or three strong paragraphs. This is the place to connect:
- protocol / infrastructure work
- real-time ML and secure systems
- writing about verification and synthetic media
- music and formal structure as an enduring mode of thought

### 16.3 What I work on
Five-item list or grid:
- protocol and infrastructure design
- distributed systems and production ML
- real-time detection and edge inference
- writing on verification and synthetic media
- research in music, sonification, and formal structure

### 16.4 Current focus
Three-column row or stacked cards:
- infrastructure and systems work
- long-form writing and publication
- formal work connecting music, geometry, and mathematical structure

### 16.5 Principles
Possible principle cards:
- verification over posture
- operations over demo value
- structure across domains

### 16.6 CTA
- View Work
- Read Research
- Contact

### Component list
- `NarrativeSection.astro`
- `PrinciplesGrid.astro`
- `FocusGrid.astro`

---

## 17. Resume page spec (`/resume`)

### Purpose
Present the public CV/resume in site-native form while allowing PDF download.

### Section order
1. Hero
2. Snapshot
3. Selected wins
4. Experience overview
5. Publications
6. Toolchain
7. Download CTA

### 17.1 Hero
**H1:** Resume / CV

**Body:** A concise overview of technical leadership, systems work, research, and public writing.

Buttons:
- Download Resume
- Contact

### 17.2 Snapshot
Short paragraph summarizing role and scope.

### 17.3 Selected wins
Compact highlight blocks.

### 17.4 Experience overview
High-level role timeline or grouped summaries instead of pasting raw resume formatting.

### 17.5 Publications
Two key publications with links.

### 17.6 Toolchain
Tag-style list or grouped lists.

### 17.7 Download CTA
Large button block for PDF.

### Component list
- `ResumeHighlights.astro`
- `ExperienceTimeline.astro`
- `PublicationMiniList.astro`
- `ToolchainTags.astro`

---

## 18. Contact page spec (`/contact`)

### Purpose
Convert qualified visitors while filtering low-fit inbound.

### Section order
1. Hero
2. Contact framing
3. Inquiry categories
4. Form
5. Direct links

### 18.1 Hero
**H1:** Contact

**Body:** For advisory, collaboration, writing, research, or speaking inquiries.

### 18.2 Inquiry categories
Provide selectable categories:
- advisory / consulting
- technical collaboration
- research / publication
- speaking / interview
- general

### 18.3 Form fields
- name
- email
- organization
- inquiry type
- short description
- timeline / urgency optional
- relevant link optional

### 18.4 Direct links
- Email
- LinkedIn
- GitHub

### UX note
The form should feel serious and efficient, not casual.

---

## 19. Content model for Astro content collections

### 19.1 Work collection
Suggested schema:
- `title`
- `slug`
- `summary`
- `role`
- `status` (public / selective)
- `order`
- `tags`
- `year`
- `featured`

### 19.2 Research collection
Suggested schema:
- `title`
- `authors`
- `venue`
- `year`
- `summary`
- `links`
- `featured`

### 19.3 Notes collection (optional later)
Suggested schema:
- `title`
- `date`
- `summary`
- `topic`
- `draft`

### 19.4 External property config
Store endorsed properties in a shared config for reuse in homepage, footer, and writing page.

---

## 20. SEO and metadata spec

### Global requirements
- unique `title` and `description` per route
- canonical URLs
- Open Graph image per top-level page
- Twitter card metadata
- JSON-LD structured data for Person and ScholarlyArticle where relevant
- sitemap.xml
- robots.txt

### Homepage SEO
Title idea:
`Jason St George — Protocol, Infrastructure, Research, Writing`

Meta description idea:
`Protocol and infrastructure work across distributed systems, proofs, real-time ML, research, and long-form writing.`

### Structured data
- `Person` on homepage
- `ScholarlyArticle` on publication pages
- `WebSite` global

---

## 21. Responsive behavior

### Mobile priorities
- keep hero concise
- collapse proof bar into vertical stack
- convert grids to single-column cards
- preserve CTA visibility near top
- ensure nav remains minimal and usable

### Tablet priorities
- 2-column layout where appropriate
- featured grids can shift to 2x2

### Desktop priorities
- maintain whitespace and composure
- 2-column hero
- multi-column sections only when they improve scanability

---

## 22. Accessibility requirements

- semantic heading hierarchy
- minimum AA contrast
- visible focus states
- keyboard navigable menus and forms
- descriptive link text
- reduced motion support
- alt text for images and diagrams

---

## 23. Launch content checklist

### Required assets before build completion
- final headshot or choose abstract hero artwork instead
- resume PDF
- 3 work case study summaries
- 2 publication entries with links
- final external URLs for endorsed properties
- contact email / form endpoint
- homepage featured selections

### Nice-to-have assets
- custom OG images
- logo lockups for associated properties
- a short speaker bio
- one or two diagrams for visual identity accents

---

## 24. Build order

### Phase 1: foundation
- project setup
- global layout
- tokens and typography
- header/footer
- base page hero and CTA components

### Phase 2: core pages
- Home
- About
- Work
- Research
- Resume
- Contact

### Phase 3: content collections
- work case studies
- publications
- optional writing hub enhancements

### Phase 4: polish
- metadata
- OG images
- performance audit
- accessibility pass
- analytics

---

## 25. Success criteria for v1

The site is successful if, within one visit, a high-agency stranger can answer all of the following:

1. Who is Jason St George?
2. What is the work really about?
3. Why is this person credible?
4. Where should I go next if I want writing, research, or technical work?
5. How do I contact him for the right kind of inquiry?

---

## 26. Recommended file / folder scaffold for Astro

```text
src/
  components/
    layout/
      Header.astro
      Footer.astro
    ui/
      Button.astro
      Section.astro
      Eyebrow.astro
      Divider.astro
    sections/
      HeroHome.astro
      PageHero.astro
      ProofBar.astro
      FeatureGrid.astro
      SelectedWorkPreview.astro
      AssociatedProperties.astro
      ShortBio.astro
      CapabilityGrid.astro
      CaseStudyList.astro
      PublicationList.astro
      ResearchInterestGrid.astro
      WritingSurfaceGrid.astro
      StartHereList.astro
      ResumeHighlights.astro
      ExperienceTimeline.astro
      ToolchainTags.astro
      CallToActionBand.astro
      FocusGrid.astro
      PrinciplesGrid.astro
  content/
    work/
    research/
    notes/
  layouts/
    BaseLayout.astro
    ContentLayout.astro
  pages/
    index.astro
    work.astro
    writing.astro
    research.astro
    about.astro
    resume.astro
    contact.astro
  styles/
    tokens.css
    global.css
  lib/
    site.ts
    seo.ts
```

---

## 27. Final direction

This v1 should feel like a **canonical, quiet, serious public interface** to a body of work that is broader than a standard resume but more disciplined than a personal miscellany site.

The site should not try to explain everything at once. Its job is to provide a clear and elegant structure through which the work becomes legible, cr
