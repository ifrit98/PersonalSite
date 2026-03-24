export const SITE = {
  name: 'Jason St George',
  title: 'Jason St George — Protocol, Infrastructure, Research, Writing',
  description:
    'Protocol and infrastructure work across distributed systems, proofs, real-time ML, research, and long-form writing.',
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

export const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'Research', href: '/research' },
  { label: 'Capability Commons', href: '/capability-commons' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
] as const;

export const ENDORSED_PROPERTIES = [
  {
    name: 'AfterFiat',
    tagline: 'Thesis / Blueprint',
    description:
      'A book-length thesis on verification, repression, synthetic media, and the infrastructure required for credible truth and value in the AI era.',
    url: AFTERFIAT_URL,
  },
  {
    name: 'Eschatology Report',
    tagline: 'Publication / Essays',
    description:
      'Long-form writing on AI acceleration, symbolic overload, civilizational drift, and the search for workable orientation.',
    url: ESCHATOLOGY_URL,
  },
  {
    name: 'GAMUT',
    tagline: 'Formal Research / Musical Geometry',
    description:
      'A formal mathematical framework for pitch-class space — cyclic autocorrelation, permutation fibers, and symplectic geometry — with interactive visualization, essays, and manuscripts.',
    url: GAMUT_URL,
    image: '/3d-GAMUT2.png',
  },
  {
    name: 'Capability Commons',
    tagline: 'Public Capability / Knowledge Infrastructure',
    description:
      'A Postgres-first knowledge platform for practical public capability literacy. 49 knowledge objects, 175 typed edges, 7 domains, 12-week curriculum. Built on the Agentic Data Lite architecture.',
    url: CAPABILITY_COMMONS_URL,
  },
  {
    name: 'AlchemicalAI',
    tagline: 'Applied Systems / Commercial',
    description:
      'Commercial product and applied-systems surface focused on operational AI and enterprise deployment.',
    url: ALCHEMICALAI_URL,
  },
] as const;
