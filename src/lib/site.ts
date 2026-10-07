export const SITE = {
  name: 'Jason St George',
  title: 'Jason St George | Principal Systems Architect — AI & Autonomous Systems',
  description:
    'Principal systems architect building AI, autonomous, distributed, and real-time systems under hard operational constraints. Work includes secure ML, edge inference, agent infrastructure, adversarial protocols, and 0→1 technical platforms.',
  url: 'https://jasonstgeorge.com',
  author: 'Jason St George',
  email: 'jason@jasonstgeorge.com',
  social: {
    github: 'https://github.com/ifrit98',
    linkedin: 'https://linkedin.com/in/stgeorgejas',
    twitter: 'https://x.com/jasonstgeorge_',
  },
} as const;

export const CONTACT_URL = '/contact?intent=engagement#engagement';
export const ENGAGE_URL = '/engage';
export const SECURE_ML_URL = '/work/secure-ml-architecture';
export const ADVERSARIAL_STORAGE_URL = '/work/adversarial-storage-protocol';

export const AFTERFIAT_URL = 'https://afterfiat.xyz';
export const AFTERFIAT_PROFILE_URL = '/afterfiat';

// AfterFiat is a fast-moving versioned research program — twenty releases since
// January 2026, eight of them inside two weeks of August — so the thesis version
// is the one fact on this site guaranteed to go stale. Everything that names or
// links a version derives from these constants: a new release is an edit here,
// not a hunt through six files. `npm run check:freshness` compares them against
// what afterfiat.xyz actually publishes.
export const AFTERFIAT_VERSION = '3.4';
export const AFTERFIAT_VERSION_YEAR = '2026';
export const AFTERFIAT_RED_LINES = 18;
// Premises and sections moved in v3.3 and v3.4 while the version check was the
// only one watching, so both are now constants with their own freshness checks.
// The web edition numbers sections §0–§33 plus §5b and the PDF numbers them
// 1–35: both hold 35, so the site states the count and never a numbering.
export const AFTERFIAT_PREMISES = 11;
export const AFTERFIAT_SECTIONS = 35;
export const AFTERFIAT_CANONICAL_URL = `${AFTERFIAT_URL}/v/${AFTERFIAT_VERSION}/`;
export const AFTERFIAT_READ_URL = `${AFTERFIAT_URL}/v/${AFTERFIAT_VERSION}/read/`;
export const AFTERFIAT_PDF_URL = `${AFTERFIAT_URL}/pdf/next-gen-sov-v${AFTERFIAT_VERSION}.pdf`;
export const AFTERFIAT_ARGUMENT_URL = `${AFTERFIAT_URL}/argument/`;
export const AFTERFIAT_MARKET_URL = `${AFTERFIAT_URL}/market-realization/`;
export const AFTERFIAT_UPDATES_URL = `${AFTERFIAT_URL}/updates/`;
export const AFTERFIAT_CITE_URL = `${AFTERFIAT_URL}/cite/`;
export const ESCHATOLOGY_URL = 'https://eschatologyreport.substack.com';
export const EXPLAINER_URL = 'https://ifrit98.github.io/Explainer/';
// shapeofmusic.org is what GAMUT's own pages name as canonical; the old
// musicalgeometry.replit.app address still serves the same site.
export const GAMUT_URL = 'https://shapeofmusic.org';
// GAMUT facts this site restates, exactly as the public GAMUT site states them
// (`npm run check:freshness` reads each one back from its source page):
// - GAMUT_SET_CLASSES is the count the Lean proof release certifies (/research/).
//   It is not what the explorer covers, so never say "explorer of all 223".
// - The explorer holds GAMUT_ORDERINGS orderings across GAMUT_FIBERS fibers:
//   enumerated through cardinality five, sampled above that, not every ordering.
// - GAMUT_PAPER_VERSION is the reviewed AMS proof paper, and the revision of the
//   copy mirrored into vector/ for the chatbot.
// The GAMUT site calls "metric ladder" only a historical organizing image, so
// this site does not use the phrase.
export const GAMUT_SET_CLASSES = 223;
export const GAMUT_ORDERINGS = 14262;
export const GAMUT_FIBERS = 216;
export const GAMUT_PAPER_VERSION = '1.2';

/** Spells a count the way running copy does ("eleven premises"). */
const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
export const spelled = (n: number) => COUNT_WORDS[n] ?? String(n);
export const Spelled = (n: number) => spelled(n).replace(/^./, (c) => c.toUpperCase());

export const SSRN_URL = 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5309953';

// One citation list for /about, /writing, /resume, and the scholarly JSON-LD.
// Verified against the hosted PDFs. /writing once carried invented titles and a
// wrong venue for both papers while /about had the corrected ones; rendering
// every surface from this list is what keeps that from recurring.
export const PUBLICATIONS = [
  {
    title:
      'Music Style Transformer: Music Generation via Raw Audio Transcription with Applications to Style-Transfer',
    shortTitle: 'Music Style Transformer',
    authors: 'St. George, J., Bischof, H.P.',
    venue: "International Conference on Artificial Intelligence (ICAI '19)",
    venueShort: 'ICAI/WorldComp (2019)',
    year: 2019,
    pages: 'pp. 22–33',
    pdf: '/papers/stgeorge-music-ml-icai-2019.pdf',
    proceedingsUrl: 'https://www.proquest.com/docview/2362906627',
  },
  {
    title: 'Sonification of Simulated Black Hole Merger Data',
    shortTitle: 'Sonification of Simulated Black Hole Merger Data',
    authors: 'St. George, J., Bischof, H.P., Kim, S.Y.',
    venue: "International Conference on Modeling, Simulation and Visualization Methods (MSV '18)",
    venueShort: 'MSV (2018)',
    year: 2018,
    pages: 'pp. 3–9',
    pdf: '/papers/stgeorge-sonification-msv-2018.pdf',
    proceedingsUrl: 'https://www.proquest.com/docview/2139493498',
  },
] as const;

// Shared by the contact form and /api/contact, which rejects anything else.
// The engagement types /engage publishes; the contact form's engagement select
// offers exactly these.
export const ENGAGEMENT_TYPES = [
  'Architecture & risk review',
  'AI systems de-risking sprint',
  'Fractional principal architecture',
  'Technical diligence (investment / acquisition)',
] as const;
// Every value the server accepts as `inquiry_type`.
export const INQUIRY_TYPES = [
  ...ENGAGEMENT_TYPES,
  'Introduction / referral',
  'Research / speaking',
  'Role inquiry',
  'Other',
] as const;

// Why someone is writing. `/contact?intent=<id>` preselects one; anything else
// falls back to engagement. Non-engagement intents store a fixed inquiry type and
// ask for one message, which is stored in the existing `problem` column.
export type ContactIntentId = 'engagement' | 'introduction' | 'research' | 'role' | 'other';
export const CONTACT_INTENTS: readonly {
  id: ContactIntentId;
  label: string;
  heading: string;
  inquiryType: (typeof INQUIRY_TYPES)[number] | null;
  prompt: string;
  placeholder: string;
}[] = [
  { id: 'engagement', label: 'Discuss a technical problem', heading: 'Discuss a technical problem', inquiryType: null, prompt: 'What problem are you trying to solve?', placeholder: 'What are you trying to solve?' },
  { id: 'introduction', label: 'Introduction or referral', heading: 'Make an introduction', inquiryType: 'Introduction / referral', prompt: 'Who or what would you like to introduce, and why might it be a fit?', placeholder: 'No need to share anyone else’s contact details yet.' },
  { id: 'research', label: 'Research conversation', heading: 'Start a research conversation', inquiryType: 'Research / speaking', prompt: 'What question or project would you like to explore?', placeholder: 'A link or a paragraph is enough.' },
  { id: 'role', label: 'Principal/Staff role', heading: 'Discuss a role', inquiryType: 'Role inquiry', prompt: 'Share the role, team, working arrangement, and what makes the problem interesting.', placeholder: 'A link to the role is welcome.' },
  { id: 'other', label: 'Other', heading: 'Send a message', inquiryType: 'Other', prompt: 'What would you like to talk about?', placeholder: '' },
];
export const contactIntent = (requested: string | null) =>
  CONTACT_INTENTS.find((intent) => intent.id === requested) ?? CONTACT_INTENTS[0];
export const DOI_URL = 'https://doi.org/10.5281/zenodo.18902696';
export const ALCHEMICALAI_URL = 'https://alchemicalai.com';
export const TURNKEYHQ_URL = '/turnkeyhq';
export const CAPABILITY_COMMONS_URL = '/capability-commons';
export const CAPABILITY_COMMONS_GITHUB = 'https://github.com/Granite-Labs-LLC/CapabilityCommons';
export const STRUCTURE_LAB_URL = '/work#structure-lab';
export const SWARMOS_URL = '/swarmos';
export const SWARMOS_GITHUB = 'https://github.com/ifrit98/swarmos';
export const AGENTICDATA_URL = '/agentic-data';
export const AGENTICDATA_GITHUB = 'https://github.com/ifrit98/AgenticData';

export const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Engage', href: '/engage' },
  { label: 'Research', href: '/research' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
] as const;

// The header carries only the assistant and the engagement CTA; GitHub and
// LinkedIn live in the footer. Contact is reached through the CTA, not the nav.
export const UTILITY_LINKS = [
  { label: 'Ask', href: '/chat' },
] as const;

