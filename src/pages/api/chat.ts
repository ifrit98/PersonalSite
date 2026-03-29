import type { APIRoute } from 'astro';
import { getSupabase } from '@/lib/supabase';
import { getOpenAI } from '@/lib/openai';

export const prerender = false;

const SYSTEM_PROMPT = `You are a knowledgeable assistant embedded on Jason St George's personal site (jasonstgeorge.com). You answer questions about his work, research, projects, writing, and professional background using the context provided below.

Guidelines:
- Ground every answer in the provided context. Cite the source document when relevant (e.g. "[from Resume]" or "[from Capability Commons]").
- If the context doesn't contain enough information to answer confidently, say so honestly rather than speculating.
- Be concise, precise, and authoritative — match the tone of the site (serious, no hype, no filler).
- You may synthesize across multiple context chunks when a question spans topics.
- Do not fabricate facts, URLs, or credentials not present in the context.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
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

    const userMessage = messages.filter((m) => m.role === 'user').pop();
    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = getOpenAI();
    const sb = getSupabase();

    const embeddingRes = await ai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userMessage.content,
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    const { data: docs, error: matchError } = await sb.rpc(
      'match_documents',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 6,
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
      { role: 'system', content: systemMessage },
      ...messages.slice(-10),
    ];

    const stream = await ai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: chatMessages,
      stream: true,
      max_completion_tokens: 1024,
      temperature: 0.4,
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
