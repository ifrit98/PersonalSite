import type { APIRoute } from 'astro';
import { SITE } from '@/lib/site';

// Generated at build from SITE, so contact and social links can't drift from the
// rest of the site the way the hand-edited public/humans.txt did.
export const prerender = true;

export const GET: APIRoute = () => {
  const body = `/* TEAM */
Name: ${SITE.name}
Role: Principal Systems Architect
Site: ${SITE.url}
Contact: ${SITE.email}
GitHub: ${SITE.social.github}
LinkedIn: ${SITE.social.linkedin}
X: ${SITE.social.twitter}
Location: United States
Education: B.M. University of North Texas; M.S. Computer Science, Rochester Institute of Technology

/* SITE */
Last updated: ${new Date().toISOString().slice(0, 10)}
Stack: Astro, Node.js, Supabase
Hosting: Replit
Standards: HTML5, CSS3, ES2022
Accessibility: WCAG 2.1 AA target
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
