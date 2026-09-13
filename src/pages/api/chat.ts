import type { APIRoute } from 'astro';
import { getSupabase } from '@/lib/supabase';
import { getOpenAI } from '@/lib/openai';
import { isRateLimited, rateLimitResponse } from '@/lib/rate-limit';
import { checkChatMessages, clientAddress, type ChatTurn } from '@/lib/request-guards';

export const prerender = false;

const SYSTEM_PROMPT = `You are an assistant embedded on Jason St George's personal site (jasonstgeorge.com). Jason is a principal systems architect, founder, and researcher. His work spans a multi-tenant vertical AI platform (TurnkeyHQ), secure and real-time ML systems, adversarial storage and verification protocols (DSN), agent and retrieval infrastructure (Agentic Data, SwarmOS), public knowledge infrastructure (Capability Commons), a monetary research thesis (AfterFiat), mathematical music theory (GAMUT), and options optimization tooling (Structure Lab / GEX). He takes a small number of architecture engagements, described on /engage. Your job is to answer questions about his work, research, projects, writing, and professional background using ONLY the retrieved context below.

Rules:
1. ONLY use information present in the CONTEXT section. Do not supplement with outside knowledge, training data, or speculation. If the context doesn't cover the question, say so plainly and suggest which project or page on the site might have the answer.
2. Format with clean markdown: ### headings, **bold** key terms (no space after opening **), - bullet lists. Never use raw asterisks as decoration — only for valid markdown bold or italic.
3. When the context contains mathematical content (equations, formulas, variables, operators), present them using LaTeX notation: $x$ for inline math and $$equation$$ for display math. Translate any plain-text math from the context into proper LaTeX (e.g. "sum_{n}" becomes $\\sum_{n}$, "A_S(tau)" becomes $A_S(\\tau)$). Always present equations when the user asks about math.
4. Match answer length to the question. Factual questions: 1-3 sentences. Deep dives ("explain", "show me the math"): thorough, structured, with all relevant equations and definitions from the context.
5. Reference sources naturally in prose (e.g. "the Part I essay describes..."). Do not use bracket citations — source pills are shown separately by the UI.
6. Each question may be about a different topic. Treat the retrieved context as ground truth for the current question regardless of prior conversation.
7. Tone: precise, direct, serious. No filler, hedging, or hype. Match the voice of the site.`;

// Per visitor, and a site-wide ceiling so a distributed burst still has a bounded
// cost. Set a monthly spend limit on the OpenAI project as the final backstop.
const PER_CLIENT_PER_MINUTE = 20;
const SITE_WIDE_PER_HOUR = 300;
// Room for low-effort reasoning plus a long, equation-heavy answer.
const MAX_COMPLETION_TOKENS = 4096;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const UNAVAILABLE = 'The assistant is unavailable right now. Please try again shortly.';

export const POST: APIRoute = async ({ request }) => {
  if (isRateLimited(`chat:${clientAddress(request.headers)}`, PER_CLIENT_PER_MINUTE)) return rateLimitResponse();

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const checked = checkChatMessages(body?.messages);
  if (!checked.ok) return json({ error: checked.error }, 400);
  if (isRateLimited('chat:site', SITE_WIDE_PER_HOUR, 60 * 60_000)) return rateLimitResponse();

  const messages: ChatTurn[] = checked.value;

  try {
    const ai = getOpenAI();
    const sb = getSupabase();

    const userMessages = messages.filter((m) => m.role === 'user');
    const latest = userMessages[userMessages.length - 1].content;
    const hasTopic = /[A-Z][a-z]{2,}/.test(latest) || /\b[A-Z]{2,}\b/.test(latest);
    const isTerseFollowup = latest.length < 30 && !hasTopic && userMessages.length > 1;
    const searchQuery = isTerseFollowup
      ? userMessages[userMessages.length - 2].content + '\n' + latest
      : latest;

    const embeddingRes = await ai.embeddings.create({
      model: 'text-embedding-3-small',
      input: searchQuery,
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    const { data: docs, error: matchError } = await sb.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.25,
      match_count: 8,
    });

    if (matchError) {
      console.error('Supabase match error:', matchError);
      return json({ error: UNAVAILABLE }, 500);
    }

    const contextBlock = (docs ?? [])
      .map(
        (d: { content: string; metadata: { source: string; title: string }; similarity: number }) =>
          `[Source: ${d.metadata.title} (${d.metadata.source}) — relevance ${d.similarity.toFixed(2)}]\n${d.content}`,
      )
      .join('\n\n---\n\n');

    const systemMessage = contextBlock
      ? `${SYSTEM_PROMPT}\n\n--- CONTEXT ---\n\n${contextBlock}\n\n--- END CONTEXT ---`
      : `${SYSTEM_PROMPT}\n\n(No matching documents found for this query.)`;

    const stream = await ai.chat.completions.create({
      model: process.env.CHAT_MODEL ?? 'gpt-5-nano',
      messages: [{ role: 'developer', content: systemMessage }, ...messages],
      stream: true,
      max_completion_tokens: MAX_COMPLETION_TOKENS,
      reasoning_effort: 'low',
    });

    const sources = (docs ?? []).map(
      (d: { metadata: { title: string; url?: string; source: string }; similarity: number }) => ({
        title: d.metadata.title,
        url: d.metadata.url,
        source: d.metadata.source,
        similarity: d.similarity,
      }),
    );

    const encoder = new TextEncoder();
    const send = (event: unknown) => encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
    const readable = new ReadableStream({
      async start(controller) {
        controller.enqueue(send({ type: 'sources', sources }));
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(send({ type: 'delta', content: delta }));
          }
        } catch (err) {
          console.error('Chat stream error:', err instanceof Error ? err.message : err);
        }
        controller.enqueue(send({ type: 'done' }));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    // Details stay in the server log; provider errors can name models, keys, or quotas.
    console.error('Chat API error:', err instanceof Error ? err.message : err);
    return json({ error: UNAVAILABLE }, 500);
  }
};
