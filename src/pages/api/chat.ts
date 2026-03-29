import type { APIRoute } from 'astro';
import { getSupabase } from '@/lib/supabase';
import { getOpenAI } from '@/lib/openai';

export const prerender = false;

const SYSTEM_PROMPT = `You are an assistant embedded on Jason St George's personal site (jasonstgeorge.com). Jason is an independent builder and researcher whose projects span public knowledge infrastructure (Capability Commons), geometric music theory (GAMUT), quantitative finance tooling (Structure Lab / GEX), digital monetary systems (AfterFiat), and decentralized storage (DSN). Your job is to answer questions about his work, research, projects, writing, and professional background using ONLY the retrieved context below.

Rules:
1. ONLY use information present in the CONTEXT section. Do not supplement with outside knowledge, training data, or speculation. If the context doesn't cover the question, say so plainly and suggest which project or page on the site might have the answer.
2. Use markdown formatting: headings (###), bullet lists, bold for key terms, and code blocks or LaTeX-style notation when presenting math or technical content. Structure longer answers with clear sections.
3. Match the length of your answer to the question. Short factual questions get 1-3 sentences. "Explain the math" or "tell me about X" gets a thorough, structured response using everything relevant in the context.
4. When citing sources, reference the document naturally in prose (e.g. "the Part I essay describes..." or "according to the Architecture document..."). Do not use bracket citation syntax — source pills are displayed separately by the UI.
5. Each question may be about a different topic than the previous one. Treat the retrieved context as the ground truth for the current question, even if the conversation previously discussed something else.
6. Tone: precise, direct, serious. No filler, hedging, or hype. Match the voice of the site itself.`;

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
    const SHORT_FOLLOWUP = 40;
    const searchQuery =
      latest.length < SHORT_FOLLOWUP && userMessages.length > 1
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
