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

// Architecture notes: native commercial essays (advisory package RB-22).
// `status: 'draft'` keeps an entry out of the build, the sitemap, and the feed —
// exclusion from the public build, not noindex, is what keeps a draft private.
const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    author: z.string().default('Jason St George'),
    kind: z.literal('architecture-note').default('architecture-note'),
    status: z.enum(['draft', 'published']).default('draft'),
    excerpt: z.string(),
    publishedAt: z.string().optional(),
    updatedAt: z.string().optional(),
    relatedWork: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    sources: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  }),
});

export const collections = { work, research, essays };
