import type { APIRoute } from 'astro';
import { getSupabase } from '@/lib/supabase';
import { getOpenAI } from '@/lib/openai';

export const prerender = false;

const SYSTEM_PROMPT = `You are an assistant embedded on Jason St George's personal site (jasonstgeorge.com). Jason is an independent builder and researcher whose projects span public knowledge infrastructure (Capability Commons), geometric music theory (GAMUT), quantitative finance tooling (Structure Lab / GEX), digital monetary systems (AfterFiat), and decentralized storage (DSN). Your job is to answer questions about his work, research, projects, writing, and professional background using ONLY the retrieved context below.

Rules:
1. ONLY use information present in the CONTEXT section. Do not supplement with outside knowledge, training data, or speculation. If the context doesn't cover the question, say so plainly and suggest which project or page on the site might have the answer.
2. Format with clean markdown: ### headings, **bold** key terms (no space after opening **), - bullet lists. Never use raw asterisks as decoration — only for valid markdown bold or italic.
3. When the context contains mathematical content (equations, formulas, variables, operators), present them using LaTeX notation: $x$ for inline math and $$equation$$ for display math. Translate any plain-text math from the context into proper LaTeX (e.g. "sum_{n}" becomes $\\sum_{n}$, "A_S(tau)" becomes $A_S(\\tau)$). Always present equations when the user asks about math.
4. Match answer length to the question. Factual questions: 1-3 sentences. Deep dives ("explain", "show me the math"): thorough, structured, with all relevant equations and definitions from the context.
5. Reference sources naturally in prose (e.g. "the Part I essay describes..."). Do not use bracket citations — source pills are shown separately by the UI.
6. Each question may be about a different topic. Treat the retrieved context as ground truth for the current question regardless of prior conversation.
7. Tone: precise, direct, serious. No filler, hedging, or hype. Match the voice of the site.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'developer';
  content: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!messages.length) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userMessages = messages.filter((m) => m.role === 'user');
    if (!userMessages.length) {
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = getOpenAI();
    const sb = getSupabase();

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

    const { data: docs, error: matchError } = await sb.rpc(
      'match_documents',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.25,
        match_count: 8,
      },
    );

    if (matchError) {
      console.error('Supabase match error:', matchError);
      return new Response(
        JSON.stringify({ error: 'Failed to search documents' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
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

    const chatMessages: ChatMessage[] = [
      { role: 'developer', content: systemMessage },
      ...messages.slice(-10),
    ];

    const stream = await ai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: chatMessages,
      stream: true,
      max_completion_tokens: 16384,
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
    const readable = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`),
        );

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`),
            );
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
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
    const message = err instanceof Error ? err.message : String(err);
    console.error('Chat API error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
