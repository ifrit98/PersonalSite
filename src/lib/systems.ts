// The four signature systems, each described by its operating envelope: the
// constraints it had to survive. The homepage envelope and the problems table
// both render from here, so a fact changes in one place.
//
// Every value restates something the case studies already say (src/content/work,
// /turnkeyhq, the résumé). Nothing new is claimed here.

export interface EnvelopeRow {
  label: string;
  value: string;
  /** The binding constraint: the one the architecture was built around. Drawn in redline. */
  binding?: boolean;
}

export interface SignatureSystem {
  /** The system's anchor on /work. */
  id: string;
  name: string;
  href: string;
  envelope: EnvelopeRow[];
  /** The critical path, left to right. */
  flow: string[];
  /** The problem, in the words of someone who has it. Homepage row and /work case lead. */
  problem: string;
  outcome: string;
}

export const SIGNATURE_SYSTEMS: SignatureSystem[] = [
  {
    id: 'real-time-underwater-detection',
    name: 'Real-time underwater detection',
    href: '/work#real-time-underwater-detection',
    envelope: [
      { label: 'latency', value: '<50 ms end to end', binding: true },
      { label: 'hardware', value: 'Jetson, embedded' },
      { label: 'input', value: 'operational noise' },
      { label: 'training', value: 'simulation to real' },
      { label: 'tuned for', value: 'Pd against Pfa' },
    ],
    flow: ['DSP features', 'Deep CNN', 'operator'],
    problem: 'Inference has to fit a hardware and latency budget',
    outcome: 'Sustained sub-50 ms inference on embedded hardware',
  },
  {
    id: 'secure-distributed-ml',
    name: 'Secure distributed ML',
    href: '/work/secure-ml-architecture',
    envelope: [
      { label: 'network', value: 'air-gapped', binding: true },
      { label: 'handling', value: 'classified, approval-gated' },
      { label: 'compute', value: 'Multi-GPU cluster' },
      { label: 'method', value: 'quantized adapters' },
      { label: 'span', value: 'data prep to operator' },
    ],
    flow: ['data pipeline', 'fine-tuning', 'deployment', 'operator'],
    problem: 'Your AI has to run privately or offline',
    outcome: 'Adopted for ongoing production use',
  },
  {
    id: 'adversarial-storage-incentives',
    name: 'Adversarial storage',
    href: '/work/adversarial-storage-protocol',
    envelope: [
      { label: 'data', value: 'Ciphertext-only', binding: true },
      { label: 'peers', value: 'adversarial' },
      { label: 'challenges', value: 'seed-chained, unpredictable' },
      { label: 'commitments', value: 'Pedersen, per chunk' },
      { label: 'incentives', value: 'sliding window' },
    ],
    flow: ['challenge', 'proof', 'verification', 'incentive'],
    problem: 'Participants have a reason to game the system',
    outcome: 'Operated in production under continuous integrity proofs',
  },
  {
    id: 'turnkeyhq',
    name: 'TurnkeyHQ',
    href: '/turnkeyhq',
    envelope: [
      { label: 'tenancy', value: 'isolated per tenant', binding: true },
      { label: 'services', value: '14' },
      { label: 'API routes', value: '244' },
      { label: 'agent skills', value: '75' },
      { label: 'stage', value: 'private beta' },
    ],
    flow: ['channels', 'deterministic plane', 'bounded agent plane'],
    problem: 'Your agent workflow has to behave, across many customers',
    outcome: 'Multi-tenant AI platform in private beta',
  },
];
