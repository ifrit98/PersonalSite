import { defineMiddleware } from 'astro:middleware';

// Every page here renders on request, so this applies site-wide. Files under
// public/ and /_astro/ are served by the Node adapter before middleware runs;
// fingerprinted assets already get `immutable` caching there.
//
// script-src and style-src allow 'unsafe-inline' because Astro inlines small
// bundles and styles; the policy still blocks framing, plugins, <base> hijacking,
// cross-origin form posts, and requests to any other origin.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;

  // One URL per page: canonical tags and the sitemap omit the trailing slash, so
  // the slashed form redirects instead of serving a duplicate.
  if (pathname.length > 1 && pathname.endsWith('/') && !pathname.startsWith('/api/')) {
    return context.redirect(pathname.replace(/\/+$/, '') + search, 301);
  }

  const response = await next();
  try {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (!response.headers.has(name)) response.headers.set(name, value);
    }
    if (!response.headers.has('Cache-Control')) {
      response.headers.set('Cache-Control', pathname.startsWith('/api/') ? 'no-store' : 'no-cache');
    }
  } catch {
    // Some responses (e.g. redirects built from fetch) carry immutable headers.
  }
  return response;
});
