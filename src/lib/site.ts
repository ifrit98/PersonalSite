export const SITE = {
  name: 'Jason St George',
  title: 'Jason St George | Founder, Principal Engineer & Systems Builder',
  description:
    'Founder-operator and principal engineer building production AI products, secure infrastructure, and systems that remain credible under pressure.',
  url: 'https://jasonstgeorge.com',
  author: 'Jason St George',
  email: 'jason@jasonstgeorge.com',
  social: {
    github: 'https://github.com/ifrit98',
    linkedin: 'https://linkedin.com/in/stgeorgejas',
    twitter: 'https://x.com/jasonstgeorge_',
  },
} as const;

export const CONTACT_URL = '/contact#engagement';

export const AFTERFIAT_URL = 'https://afterfiat.xyz';
export const AFTERFIAT_PROFILE_URL = '/afterfiat';
export const AFTERFIAT_READ_URL = 'https://afterfiat.xyz/v/1.9/read/';
export const AFTERFIAT_PDF_URL = 'https://afterfiat.xyz/pdf/next-gen-sov-v1.9.pdf';
export const AFTERFIAT_ARGUMENT_URL = 'https://afterfiat.xyz/argument/';
export const AFTERFIAT_MARKET_URL = 'https://afterfiat.xyz/market-realization/';
export const AFTERFIAT_UPDATES_URL = 'https://afterfiat.xyz/updates/';
export const AFTERFIAT_CITE_URL = 'https://afterfiat.xyz/cite/';
export const ESCHATOLOGY_URL = 'https://eschatologyreport.substack.com';
export const GAMUT_URL = 'https://musicalgeometry.replit.app';
export const SSRN_URL = 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5309953';
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
  { label: 'Writing', href: '/writing' },
  { label: 'Projects & Labs', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Ask', href: '/chat' },
] as const;

export const UTILITY_LINKS = [
  { label: 'Resume', href: '/resume' },
  { label: 'GitHub', href: 'https://github.com/ifrit98' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/stgeorgejas' },
  { label: 'X', href: 'https://x.com/jasonstgeorge_' },
] as const;

export const ENDORSED_PROPERTIES = [
  {
    name: 'AfterFiat',
    tagline: 'Thesis / Blueprint',
    description:
      'A versioned, falsifiable thesis testing whether Privacy, Proofs, and Compute can support store-of-value premium under sustained repression — without confusing utility, value capture, or price action for moneyness.',
    url: AFTERFIAT_PROFILE_URL,
    external: false,
  },
  {
    name: 'Eschatology Report',
    tagline: 'Publication / Essays',
    description:
      'Essays and dossiers on AI, culture, institutional drift, symbolic overload, and the search for workable orientation.',
    url: ESCHATOLOGY_URL,
    external: true,
  },
  {
    name: 'GAMUT',
    tagline: 'Research Program / Formal Mathematics',
    description:
      'A formal mathematical framework for the geometry of musical possibility and a research surface for structure across sound, symmetry, and form.',
    url: GAMUT_URL,
    image: '/3d-GAMUT2.png',
    external: true,
  },
  {
    name: 'Capability Commons',
    tagline: 'Public Infrastructure / Knowledge Platform',
    description:
      'A structured knowledge platform for practical public capability across water, food, shelter, power, repair, and community.',
    url: CAPABILITY_COMMONS_URL,
    external: false,
  },
  {
    name: 'SwarmOS',
    tagline: 'Research Platform / Agent Infrastructure',
    description:
      'A collective intelligence research platform that coordinates specialized AI agents to perform continuous, audited scientific research with artifact-level provenance and reproducibility.',
    url: SWARMOS_URL,
    external: false,
  },
  {
    name: 'Agentic Data',
    tagline: 'Enterprise Infrastructure / Retrieval Engine',
    description:
      'An enterprise context graph and agentic retrieval planner that turns fragmented institutional knowledge into a temporal, permissioned evidence graph with budget-aware, iterative retrieval.',
    url: AGENTICDATA_URL,
    external: false,
  },
  {
    name: 'Structure Lab',
    tagline: 'Quantitative Finance / Optimization',
    description:
      'An options payoff-engineering platform that uses MILP optimization to construct optimal multi-leg structures from user-defined intent.',
    url: STRUCTURE_LAB_URL,
    external: false,
  },
  {
    name: 'TurnkeyHQ',
    tagline: 'Flagship Product / Vertical AI',
    description:
      'The vertical AI operating system I co-founded and built through product architecture, engineering, release infrastructure, tenant operations, and commercial lifecycle.',
    url: TURNKEYHQ_URL,
    external: false,
  },
] as const;
