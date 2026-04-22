import type { APIRoute } from 'astro';
import { getSupabase } from '@/lib/supabase';
import { isRateLimited, rateLimitResponse } from '@/lib/rate-limit';

export const prerender = false;

const REQUIRED_FIELDS = ['name', 'email', 'inquiry_type', 'problem'] as const;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(`contact:${ip}`, 5)) return rateLimitResponse();

  try {
    const body = await request.json();

    const missing = REQUIRED_FIELDS.filter((f) => !body[f]?.trim());
    if (missing.length) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missing.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!isValidEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const supabase = getSupabase();

    const { error } = await supabase.from('contact_submissions').insert({
      name: body.name.trim(),
      email: body.email.trim(),
      organization: body.organization?.trim() || null,
      inquiry_type: body.inquiry_type.trim(),
      problem: body.problem.trim(),
      constraints: body.constraints?.trim() || null,
      desired_outcome: body.desired_outcome?.trim() || null,
      timeline: body.timeline?.trim() || null,
      budget_range: body.budget_range?.trim() || null,
      message: body.message?.trim() || null,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit inquiry. Please try email instead.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Contact API error:', err);
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
