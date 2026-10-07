import { getCollection } from 'astro:content';

// Engineering notes are the `essays` collection. Drafts never leave this
// function, so no page can render an empty or placeholder notes section.
export async function publishedNotes() {
  return (await getCollection('essays', (e) => e.data.status === 'published')).sort((a, b) =>
    (b.data.publishedAt ?? '').localeCompare(a.data.publishedAt ?? ''),
  );
}
