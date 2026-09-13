import type { APIRoute } from 'astro';
import { getSupabase } from '@/lib/supabase';
import { notifyInquiry } from '@/lib/notify';
import { isRateLimited, rateLimitResponse } from '@/lib/rate-limit';
import { checkContact, clientAddress } from '@/lib/request-guards';
import { INQUIRY_TYPES } from '@/lib/site';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  if (isRateLimited(`contact:${clientAddress(request.headers)}`, 5)) return rateLimitResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const checked = checkContact(body, INQUIRY_TYPES);
  if (!checked.ok) return json({ error: checked.error }, 400);
  // Bot-shaped submissions get the same answer as real ones and go nowhere.
  if (checked.spam) return json({ success: true });

  const inquiry = checked.value;

  let stored = false;
  try {
    const { error } = await getSupabase().from('contact_submissions').insert(inquiry);
    if (error) console.error('Supabase insert error:', error);
    else stored = true;
  } catch (err) {
    console.error('Contact storage unavailable:', err instanceof Error ? err.message : err);
  }

  // Notify even when storage failed: an emailed inquiry is not lost.
  const notified = await notifyInquiry(inquiry);
  if (notified === 'not-configured') {
    console.warn(
      `Inquiry ${stored ? 'stored' : 'NOT stored'} and no notification sent: set RESEND_API_KEY, CONTACT_NOTIFY_TO, CONTACT_NOTIFY_FROM.`,
    );
  }

  if (!stored && notified !== 'sent') {
    return json({ error: 'Failed to submit inquiry. Please try email instead.' }, 500);
  }
  return json({ success: true });
};
