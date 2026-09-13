import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  site: 'https://jasonstgeorge.com',
  integrations: [
    sitemap({
      // Utility and redirecting routes are not pages worth indexing.
      filter: (page) => !/\/(projects|chat)\/?$/.test(page),
      // Match the canonical tags, which omit the trailing slash (root excepted).
      serialize: (item) => ({ ...item, url: item.url.replace(/(?<=[^/])\/$/, '').replace(/(\.com)$/, '$1/') }),
    }),
  ],
  redirects: {
    // The sonification paper appeared at MSV '18, not Bridges 2019; the file was
    // renamed to match. Keep old links (and anything that indexed them) working.
    '/papers/stgeorge-sonification-bridges-2019.pdf': '/papers/stgeorge-sonification-msv-2018.pdf',
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
