import type { APIRoute } from 'astro';

// Retired page; old links land on the contact page.
export const GET: APIRoute = ({ redirect }) => redirect('/contact', 301);
