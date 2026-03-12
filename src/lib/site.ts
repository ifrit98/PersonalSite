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
export const ALCHEMICALAI_URL = 'https://alchemicalai.com';

export const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'Research', href: '/research' },
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
    name: 'AlchemicalAI',
    tagline: 'Applied Systems / Commercial',
    description:
      'Commercial product and applied-systems surface focused on operational AI and enterprise deployment.',
    url: ALCHEMICALAI_URL,
  },
] as const;
