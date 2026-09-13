// Input guards for the two public endpoints. Everything here runs before a
// request can reach OpenAI or Supabase, so abuse is refused for free.

// Proxies whose X-Forwarded-For entries describe themselves rather than the
// visitor: loopback, private ranges, and Google's front-end/load-balancer ranges
// that sit in front of the deployment.
const TRUSTED_PROXY = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^::1$/,
  /^f[cd][0-9a-f]{2}:/i,
  /^35\.191\./,
  /^130\.211\.[0-3]\./,
];

/**
 * The visitor's address as seen by the nearest untrusted hop.
 *
 * The first X-Forwarded-For entry is whatever the client chose to send, so
 * keying a rate limit on it lets anyone reset their limit per request. Walk from
 * the right instead, skipping proxies we know, and take the first address a
 * trusted proxy actually observed.
 */
export function clientAddress(headers: Headers): string {
  const hops = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((hop) => hop.trim())
    .filter(Boolean);
  for (let i = hops.length - 1; i >= 0; i -= 1) {
    if (!TRUSTED_PROXY.some((range) => range.test(hops[i]))) return hops[i];
  }
  return hops[0] ?? 'unknown';
}

export type ChatTurn = { role: 'user' | 'assistant'; content: string };
type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

export const CHAT_LIMITS = {
  maxTurns: 8,
  maxQuestionChars: 2000,
  // Earlier assistant answers are only context; long ones are clipped, not refused.
  maxAnswerChars: 4000,
} as const;

/**
 * Accepts only the conversation a visitor can actually produce in the UI:
 * alternating user/assistant turns of bounded length, ending on a question.
 * System and developer messages are server-authored and never taken from a client.
 */
export function checkChatMessages(input: unknown): Checked<ChatTurn[]> {
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: 'Ask a question to start.' };

  const turns: ChatTurn[] = [];
  for (const message of input.slice(-CHAT_LIMITS.maxTurns)) {
    const { role, content } = (message ?? {}) as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return { ok: false, error: 'Unsupported message format.' };
    }
    turns.push({ role, content: role === 'assistant' ? content.slice(0, CHAT_LIMITS.maxAnswerChars) : content });
  }

  const latest = turns[turns.length - 1];
  if (latest.role !== 'user' || !latest.content.trim()) {
    return { ok: false, error: 'Ask a question to start.' };
  }
  if (turns.some((t) => t.role === 'user' && t.content.length > CHAT_LIMITS.maxQuestionChars)) {
    return {
      ok: false,
      error: `Questions are limited to ${CHAT_LIMITS.maxQuestionChars.toLocaleString('en-US')} characters.`,
    };
  }
  return { ok: true, value: turns };
}

export const CONTACT_LIMITS = {
  name: 200,
  email: 320,
  organization: 200,
  inquiry_type: 100,
  problem: 5000,
  constraints: 3000,
  desired_outcome: 3000,
  timeline: 200,
  budget_range: 200,
  message: 3000,
} as const;

export type ContactField = keyof typeof CONTACT_LIMITS;
export type ContactSubmission = {
  name: string;
  email: string;
  organization: string | null;
  inquiry_type: string;
  problem: string;
  constraints: string | null;
  desired_outcome: string | null;
  timeline: string | null;
  budget_range: string | null;
  message: string | null;
};

const REQUIRED: ContactField[] = ['name', 'email', 'inquiry_type', 'problem'];
const LABELS: Record<ContactField, string> = {
  name: 'Name',
  email: 'Email',
  organization: 'Organization',
  inquiry_type: 'Problem type',
  problem: 'Problem description',
  constraints: 'Known constraints',
  desired_outcome: 'Desired outcome',
  timeline: 'Timeline',
  budget_range: 'Budget',
  message: 'Anything else',
};

// Anyone who fills a form this fast did not read it.
export const MIN_FILL_MS = 3000;

export type ContactCheck =
  | { ok: true; spam: false; value: ContactSubmission }
  | { ok: true; spam: true }
  | { ok: false; error: string };

/**
 * Validates an inquiry. Bot-shaped submissions (the hidden `website` field
 * filled in, or the form sent within MIN_FILL_MS of loading) come back as
 * `spam: true` so the endpoint can answer success without storing or
 * notifying — a bot learns nothing from the response.
 */
export function checkContact(
  body: unknown,
  inquiryTypes: readonly string[],
  now = Date.now(),
): ContactCheck {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' };
  const raw = body as Record<string, unknown>;

  const honeypot = typeof raw.website === 'string' && raw.website.trim() !== '';
  const startedAt = Number(raw.started_at);
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && now - startedAt < MIN_FILL_MS;
  if (honeypot || tooFast) return { ok: true, spam: true };

  const text = (field: ContactField) => (typeof raw[field] === 'string' ? (raw[field] as string).trim() : '');

  const missing = REQUIRED.filter((field) => !text(field));
  if (missing.length) {
    return { ok: false, error: `Missing required fields: ${missing.map((f) => LABELS[f]).join(', ')}.` };
  }
  for (const field of Object.keys(CONTACT_LIMITS) as ContactField[]) {
    if (text(field).length > CONTACT_LIMITS[field]) {
      return {
        ok: false,
        error: `${LABELS[field]} is limited to ${CONTACT_LIMITS[field].toLocaleString('en-US')} characters.`,
      };
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('email'))) return { ok: false, error: 'Invalid email address.' };
  if (!inquiryTypes.includes(text('inquiry_type'))) {
    return { ok: false, error: 'Choose a problem type from the list.' };
  }

  const optional = (field: ContactField) => text(field) || null;
  return {
    ok: true,
    spam: false,
    value: {
      name: text('name'),
      email: text('email'),
      organization: optional('organization'),
      inquiry_type: text('inquiry_type'),
      problem: text('problem'),
      constraints: optional('constraints'),
      desired_outcome: optional('desired_outcome'),
      timeline: optional('timeline'),
      budget_range: optional('budget_range'),
      message: optional('message'),
    },
  };
}
