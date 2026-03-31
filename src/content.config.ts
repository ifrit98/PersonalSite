import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    status: z.enum(['public', 'selective', 'active']).default('public'),
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    year: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    authors: z.string().optional(),
    venue: z.string().optional(),
    year: z.string().optional(),
    summary: z.string(),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { work, research };
