const hits = new Map<string, number[]>();

const DEFAULT_WINDOW_MS = 60_000;
// The longest window any caller uses; keys idle longer than this are dropped so
// the map cannot grow with every address that ever visited.
const MAX_WINDOW_MS = 60 * 60_000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < DEFAULT_WINDOW_MS) return;
  lastSweep = now;
  for (const [key, timestamps] of hits) {
    if (now - timestamps[timestamps.length - 1] >= MAX_WINDOW_MS) hits.delete(key);
  }
}

export function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number = DEFAULT_WINDOW_MS,
  now: number = Date.now(),
): boolean {
  sweep(now);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < Math.min(windowMs, MAX_WINDOW_MS));
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
