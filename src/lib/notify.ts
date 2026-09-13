import type { ContactSubmission } from './request-guards';

export type NotifyResult = 'sent' | 'not-configured' | 'failed';

type Env = Record<string, string | undefined>;

/**
 * Emails a new inquiry to the site owner through Resend's HTTP API.
 *
 * Configuration (all server-side environment variables):
 *   RESEND_API_KEY        API key from resend.com
 *   CONTACT_NOTIFY_TO     where inquiries go
 *   CONTACT_NOTIFY_FROM   a sender on a domain verified in Resend,
 *                         e.g. "jasonstgeorge.com <inquiries@jasonstgeorge.com>"
 *
 * The body is plain text only, so nothing a visitor types is ever rendered as
 * HTML in a mail client. Reply-To is the visitor, so replying answers them.
 */
export async function notifyInquiry(
  inquiry: ContactSubmission,
  { env = process.env as Env, fetchImpl = fetch }: { env?: Env; fetchImpl?: typeof fetch } = {},
): Promise<NotifyResult> {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_NOTIFY_TO;
  const from = env.CONTACT_NOTIFY_FROM;
  if (!apiKey || !to || !from) return 'not-configured';

  const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').slice(0, 120);
  const subject = oneLine(
    `Inquiry: ${inquiry.inquiry_type} — ${inquiry.name}${inquiry.organization ? ` (${inquiry.organization})` : ''}`,
  );

  const sections: [string, string | null][] = [
    ['From', `${inquiry.name} <${inquiry.email}>`],
    ['Organization', inquiry.organization],
    ['Problem type', inquiry.inquiry_type],
    ['Problem', inquiry.problem],
    ['Known constraints', inquiry.constraints],
    ['Desired outcome', inquiry.desired_outcome],
    ['Timeline', inquiry.timeline],
    ['Budget', inquiry.budget_range],
    ['Anything else', inquiry.message],
  ];
  const text = sections
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}\n${value}`)
    .join('\n\n');

  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: inquiry.email, subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error('Inquiry notification rejected:', res.status, await res.text().catch(() => ''));
      return 'failed';
    }
    return 'sent';
  } catch (err) {
    console.error('Inquiry notification failed:', err instanceof Error ? err.message : err);
    return 'failed';
  }
}
