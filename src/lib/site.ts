export const SITE = {
  name: 'Jason St George',
  title: 'Jason St George | Verification, Systems, and Capability',
  description:
    'Protocols, ML infrastructure, knowledge systems, writing, and research on verification, capability, and value under adversarial conditions.',
  url: 'https://jasonstgeorge.com',
  author: 'Jason St George',
  email: 'jason@jasonstgeorge.com',
  social: {
    github: 'https://github.com/ifrit98',
    linkedin: 'https://linkedin.com/in/stgeorgejas',
  },
} as const;

export const AFTERFIAT_URL = 'https://afterfiat.xyz';
export const ESCHATOLOGY_URL = 'https://eschatologyreport.substack.com';
export const GAMUT_URL = 'https://musicalgeometry.replit.app';
export const ALCHEMICALAI_URL = 'https://alchemicalai.com';
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
] as const;

export const ENDORSED_PROPERTIES = [
  {
    name: 'AfterFiat',
    tagline: 'Thesis / Blueprint',
    description:
      'A book-length thesis on privacy, proofs, and verified compute as monetary primitives for a dense digital civilization.',
    url: AFTERFIAT_URL,
  },
  {
    name: 'Eschatology Report',
    tagline: 'Publication / Essays',
    description:
      'Essays and dossiers on AI, culture, institutional drift, symbolic overload, and the search for workable orientation.',
    url: ESCHATOLOGY_URL,
  },
  {
    name: 'Capability Commons',
    tagline: 'Public Infrastructure / Knowledge Platform',
    description:
      'A structured knowledge platform for practical public capability across water, food, shelter, power, repair, and community.',
    url: CAPABILITY_COMMONS_URL,
  },
  {
    name: 'GAMUT',
    tagline: 'Research Program / Formal Mathematics',
    description:
      'A formal mathematical framework for the geometry of musical possibility and a research surface for structure across sound, symmetry, and form.',
    url: GAMUT_URL,
    image: '/3d-GAMUT2.png',
  },
  {
    name: 'AlchemicalAI',
    tagline: 'Applied Systems / Commercial',
    description:
      'The applied and commercial surface for selected architecture, infrastructure, and systems work.',
    url: ALCHEMICALAI_URL,
  },
  {
    name: 'Structure Lab',
    tagline: 'Quantitative Finance / Optimization',
    description:
      'An options payoff-engineering platform that uses MILP optimization to construct optimal multi-leg structures from user-defined intent.',
    url: STRUCTURE_LAB_URL,
  },
  {
    name: 'SwarmOS',
    tagline: 'Research Platform / Agent Infrastructure',
    description:
      'A collective intelligence research platform that coordinates specialized AI agents to perform continuous, audited scientific research with artifact-level provenance and reproducibility.',
    url: SWARMOS_URL,
  },
  {
    name: 'Agentic Data',
    tagline: 'Enterprise Infrastructure / Retrieval Engine',
    description:
      'An enterprise context graph and agentic retrieval planner that turns fragmented institutional knowledge into a temporal, permissioned evidence graph with budget-aware, iterative retrieval.',
    url: AGENTICDATA_URL,
  },
] as const;
