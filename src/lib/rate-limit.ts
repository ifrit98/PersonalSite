const hits = new Map<string, number[]>();

const WINDOW_MS = 60_000;

export function isRateLimited(
  key: string,
  maxRequests: number,
): boolean {
  const now = Date.now();
  const timestamps = hits.get(key) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > maxRequests;
}

export function rateLimitResponse() {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    { status: 429, headers: { 'Content-Type': 'application/json' } },
  );
}
