import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  site: 'https://jasonstgeorge.com',
  integrations: [sitemap()],
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
