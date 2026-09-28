// The four signature systems, each described by its operating envelope: the
// constraints it had to survive. The homepage envelope and the selected-systems
// table both render from here, so a fact changes in one place.
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
  /** One line for the systems table: the envelope compressed. */
  summary: string;
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
    summary: '<50 ms · Jetson · DSP + ML',
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
      { label: 'result', value: 'fine-tuning cost ≈ −65%' },
    ],
    flow: ['data pipeline', 'fine-tuning', 'deployment', 'operator'],
    summary: 'air-gapped · Multi-GPU · LLM fine-tuning',
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
    summary: 'Ciphertext-only · adversarial peers',
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
    summary: '14 services · 244 routes · tenant-isolated',
    outcome: 'Multi-tenant AI platform in private beta',
  },
];
