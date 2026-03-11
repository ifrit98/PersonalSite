export const SITE = {
  name: 'Jason St George',
  title: 'Jason St George — Protocol, Infrastructure, Research, Writing',
  description:
    'Protocol and infrastructure work across distributed systems, proofs, real-time ML, research, and long-form writing.',
  url: 'https://jasonstgeorge.com',
  author: 'Jason St George',
  email: 'jason@jasonstgeorge.com',
  social: {
    github: 'https://github.com/jasonstgeorge',
    linkedin: 'https://linkedin.com/in/jasonstgeorge',
  },
} as const;

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
    description:
      'A book-length thesis on verification, repression, synthetic media, and the infrastructure required for credible truth and value in the AI era.',
    url: '#',
  },
  {
    name: 'Eschatology Report',
    description:
      'Long-form writing on AI acceleration, symbolic overload, civilizational drift, and the search for workable orientation.',
    url: '#',
  },
  {
    name: 'AlchemicalAI',
    description:
      'Studio and consultancy focused on trustworthy systems in an increasingly synthetic world.',
    url: '#',
  },
] as const;
