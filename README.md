# Jason St George — Personal Site

Canonical public identity site for Jason St George. Functions as an identity layer, credibility/proof layer, routing surface into endorsed properties, and conversion surface for advisory, research, writing, and collaboration inquiries.

Built with [Astro](https://astro.build), static-first, minimal JavaScript, strong typography.

## Stack

| Layer         | Choice                                  |
| ------------- | --------------------------------------- |
| Framework     | Astro v5                                |
| Language      | TypeScript (strict)                     |
| Styling       | Vanilla CSS with design tokens          |
| Fonts         | Newsreader (serif), Inter (sans), IBM Plex Mono |
| Sitemap       | @astrojs/sitemap                        |
| Content       | Astro Content Collections (Markdown + Zod) |
| Deployment    | Vercel / Netlify (static output)        |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server at localhost:4321
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── ui/              # Button, Section, Eyebrow, Divider
│   └── sections/        # Page-level section components
├── content/
│   ├── work/            # Case study markdown files
│   └── research/        # Publication markdown files
├── layouts/
│   └── BaseLayout.astro # Global HTML shell with SEO
├── lib/
│   ├── site.ts          # Site config, nav links, endorsed properties
│   └── seo.ts           # Per-page meta builder
├── pages/
│   ├── index.astro      # Homepage
│   ├── about.astro      # Narrative bio + principles
│   ├── work.astro       # Case studies + capabilities
│   ├── writing.astro    # Writing hub + start-here path
│   ├── research.astro   # Publications + ongoing investigations
│   ├── resume.astro     # CV highlights + experience + toolchain
│   └── contact.astro    # Inquiry form + direct links
└── styles/
    ├── tokens.css       # Design tokens (color, type, spacing, radius)
    └── global.css       # Reset, base styles, utility classes

public/
├── favicon.svg
└── robots.txt
```

## Pages

| Route       | Purpose                                                      |
| ----------- | ------------------------------------------------------------ |
| `/`         | Hero, proof bar, featured domains, selected work, bio, CTA   |
| `/about`    | Narrative bio, current focus, principles                     |
| `/work`     | Capability areas, case studies, engagement types              |
| `/writing`  | Writing surfaces (AfterFiat, Eschatology Report), start-here |
| `/research` | Published papers, ongoing investigations                     |
| `/resume`   | Metrics, experience timeline, publications, toolchain        |
| `/contact`  | Inquiry form with type routing, direct links                 |

## Design System

### Color Palette

| Token            | Value                        | Usage                          |
| ---------------- | ---------------------------- | ------------------------------ |
| `--color-ink`    | `#101826`                    | Headlines, body text           |
| `--color-bone`   | `#F5F1E8`                    | Background                     |
| `--color-slate`  | `#5E6875`                    | Supporting text, metadata      |
| `--color-brass`  | `#A98752`                    | Accents, links, dividers       |
| `--color-oxblood`| `#4F2432`                    | Rare highlights, hover states  |
| `--color-line`   | `rgba(16, 24, 38, 0.12)`    | Borders, rules                 |
| `--color-card`   | `rgba(255, 255, 255, 0.55)` | Card backgrounds               |

### Typography

- **Headlines:** Newsreader (serif) — display through H3
- **Body:** Inter (sans) — body, meta, UI text
- **Mono:** IBM Plex Mono — metadata labels, code, eyebrows

### Type Scale

| Token             | Size / Line-height |
| ----------------- | ------------------ |
| `--text-display`  | 64 / 72            |
| `--text-h1`       | 48 / 56            |
| `--text-h2`       | 34 / 40            |
| `--text-h3`       | 24 / 30            |
| `--text-body-lg`  | 20 / 32            |
| `--text-body`     | 18 / 30            |
| `--text-meta`     | 14 / 22            |
| `--text-mono-meta`| 13 / 20            |

## Components

### UI Primitives

- **Button** — `primary`, `secondary`, `text` variants; renders as `<a>` or `<button>`
- **Section** — padded container wrapper with optional `narrow` mode
- **Eyebrow** — uppercase mono label for section categorization
- **Divider** — thin horizontal rule

### Section Components

| Component               | Used On          | Purpose                            |
| ----------------------- | ---------------- | ---------------------------------- |
| `HeroHome`              | Homepage         | Two-column hero with geometric SVG |
| `PageHero`              | All inner pages  | Title + body + optional slot       |
| `ProofBar`              | Homepage         | Three proof-of-credibility blocks  |
| `FeatureGrid`           | Homepage         | Four featured domain cards         |
| `SelectedWorkPreview`   | Homepage         | Stacked work/research list         |
| `AssociatedProperties`  | Homepage         | Endorsed properties strip          |
| `ShortBio`              | Homepage         | Bio paragraph + CTA links          |
| `CallToActionBand`      | All pages        | Configurable heading + body + CTAs |
| `CapabilityGrid`        | Work             | Four capability area cards         |
| `CaseStudyList`         | Work             | Structured case study blocks       |
| `EngagementTypes`       | Work             | List of engagement categories      |
| `WritingSurfaceGrid`    | Writing          | Three writing surface cards        |
| `StartHereList`         | Writing          | Numbered reading path              |
| `EssayList`             | Writing          | Selected essay links               |
| `PublicationList`       | Research         | Full publication entries           |
| `ResearchInterestGrid`  | Research         | Ongoing investigation cards        |
| `ResumeHighlights`      | Resume           | Metric highlight blocks            |
| `ExperienceTimeline`    | Resume           | Role timeline                      |
| `PublicationMiniList`   | Resume           | Compact publication cards          |
| `ToolchainTags`         | Resume           | Grouped technology tags            |
| `NarrativeSection`      | About, Work, etc | Prose container with styled `<p>`  |
| `FocusGrid`             | About            | Three current-focus cards          |
| `PrinciplesGrid`        | About            | Three principle cards              |

## Content Collections

### Work (`src/content/work/`)

Markdown files with frontmatter schema:

```yaml
title: string
summary: string
role: string
status: public | selective
order: number
tags: string[]
year: string
featured: boolean
```

### Research (`src/content/research/`)

Markdown files with frontmatter schema:

```yaml
title: string
authors: string
venue: string
year: string
summary: string
links: { label: string, href: string }[]
featured: boolean
```

## Configuration

### Site Config (`src/lib/site.ts`)

Central config for site name, description, URL, social links, navigation, and endorsed properties. Update this file to change nav links, external URLs, or contact info.

### Environment Variables

Copy `.env.example` to `.env` and fill in production values:

```bash
cp .env.example .env
```

## SEO

Each page has unique `<title>`, `<meta description>`, Open Graph, and Twitter Card metadata, built via the `buildMeta()` helper in `src/lib/seo.ts`. The `@astrojs/sitemap` integration auto-generates `sitemap-index.xml` at build time. A `robots.txt` pointing to the sitemap is in `public/`.

## Deployment

The site outputs static HTML. Deploy to any static host:

```bash
npm run build   # outputs to dist/
```

**Vercel:** Connect the repo; framework detection picks up Astro automatically.

**Netlify:** Connect the repo with build command `npm run build` and publish directory `dist`.

## Assets Checklist

Before going live, replace placeholder links and add:

- [ ] Final headshot or abstract hero artwork
- [ ] Resume PDF at `public/resume.pdf`
- [ ] Real URLs for AfterFiat, Eschatology Report, AlchemicalAI
- [ ] Paper links (DOI / arXiv / PDF) in research content files
- [ ] Contact form endpoint (Netlify Forms, serverless function, etc.)
- [ ] Custom OG images per page (optional, falls back to `public/og-default.png`)
- [ ] Analytics snippet (Plausible / Fathom)

## License

Private. All rights reserved.
