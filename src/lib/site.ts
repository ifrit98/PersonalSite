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

export const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'Projects & Labs', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
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
] as const;
