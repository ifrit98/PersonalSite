import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_SIZE = 1500;      // chars (~375 tokens)
const CHUNK_OVERLAP = 200;    // chars overlap between chunks
const BATCH_SIZE = 20;        // embeddings per API call

const ROOT = path.resolve(import.meta.dirname, '..');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DocChunk {
  content: string;
  metadata: {
    source: string;
    title: string;
    url?: string;
    chunkIndex: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Text extraction helpers                                            */
/* ------------------------------------------------------------------ */

function stripAstro(raw: string): string {
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---/, '');
  return withoutFrontmatter
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')               // HTML tags
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
    .replace(/export\s+(const|let|var|function)\s+.*?[;=]/g, '')
    .replace(/[{}]/g, ' ')                  // remaining braces
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdown(raw: string): string {
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---/, '');
  return withoutFrontmatter
    .replace(/!\[.*?\]\(.*?\)/g, '')        // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')  // links -> text
    .replace(/#{1,6}\s+/g, '')              // headings
    .replace(/[*_~`]/g, '')                 // emphasis
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeUnicode(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\uD800-\uDFFF]/g, '');
}

async function extractPdf(filePath: string): Promise<string> {
  const { PDFParse } = await import('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse(new Uint8Array(buffer));
  await parser.load();
  const result = await parser.getText();
  return sanitizeUnicode(
    (result as { pages: { text: string }[] }).pages
      .map((p) => p.text)
      .join('\n')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

/* ------------------------------------------------------------------ */
/*  Chunking                                                           */
/* ------------------------------------------------------------------ */

function chunkText(text: string, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  if (text.length <= size) {
    chunks.push(text);
    return chunks;
  }

  let start = 0;
  while (start < text.length) {
    let end = start + size;
    if (end < text.length) {
      const slice = text.slice(start, end);
      const lastParagraph = slice.lastIndexOf('\n\n');
      const lastSentence = slice.lastIndexOf('. ');
      const breakPoint =
        lastParagraph > size * 0.3
          ? lastParagraph
          : lastSentence > size * 0.3
            ? lastSentence + 1
            : size;
      end = start + breakPoint;
    }
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 20) chunks.push(chunk);
    start = end - overlap;
    if (start < 0) start = 0;
    if (end >= text.length) break;
  }
  return chunks;
}

/* ------------------------------------------------------------------ */
/*  Content collectors                                                 */
/* ------------------------------------------------------------------ */

function titleFromFilename(filePath: string): string {
  return path
    .basename(filePath, path.extname(filePath))
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const PAGE_URL_MAP: Record<string, string> = {
  'index.astro': '/',
  'about.astro': '/about',
  'work.astro': '/work',
  'writing.astro': '/writing',
  'projects.astro': '/projects',
  'contact.astro': '/contact',
  'resume.astro': '/resume',
  'research.astro': '/research',
  'capability-commons.astro': '/capability-commons',
};

function collectAstroPages(): DocChunk[] {
  const dir = path.join(ROOT, 'src/pages');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.astro'));
  const chunks: DocChunk[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const text = stripAstro(raw);
    if (text.length < 50) continue;

    const title = titleFromFilename(file);
    const url = PAGE_URL_MAP[file];
    const textChunks = chunkText(text);

    for (let i = 0; i < textChunks.length; i++) {
      chunks.push({
        content: textChunks[i],
        metadata: { source: `src/pages/${file}`, title, url, chunkIndex: i },
      });
    }
  }
  return chunks;
}

function collectMarkdown(dir: string, urlPrefix?: string): DocChunk[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const chunks: DocChunk[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const text = stripMarkdown(raw);
    if (text.length < 50) continue;

    const title = titleFromFilename(file);
    const slug = path.basename(file, '.md');
    const url = urlPrefix ? `${urlPrefix}/${slug}` : undefined;
    const textChunks = chunkText(text);

    for (let i = 0; i < textChunks.length; i++) {
      chunks.push({
        content: textChunks[i],
        metadata: {
          source: path.relative(ROOT, path.join(dir, file)),
          title,
          url,
          chunkIndex: i,
        },
      });
    }
  }
  return chunks;
}

async function collectPdfs(dir: string): Promise<DocChunk[]> {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.pdf'));
  const chunks: DocChunk[] = [];

  for (const file of files) {
    const text = await extractPdf(path.join(dir, file));
    if (text.length < 50) continue;

    const title = titleFromFilename(file);
    const textChunks = chunkText(text);

    for (let i = 0; i < textChunks.length; i++) {
      chunks.push({
        content: textChunks[i],
        metadata: {
          source: path.relative(ROOT, path.join(dir, file)),
          title,
          url: `/papers/${file}`,
          chunkIndex: i,
        },
      });
    }
  }
  return chunks;
}

function humanizeDirName(dirName: string): string {
  return dirName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const VECTOR_DIR_ALIASES: Record<string, string> = {
  GeometricAlgebraicMusicTheory: 'GAMUT (Geometric Algebraic Music Theory)',
  GEX: 'Structure Lab (GEX)',
  CapabilityCommons: 'Capability Commons',
  AfterFiat: 'AfterFiat',
  DecentralizedStorageNetwork: 'Decentralized Storage Network (DSN)',
  EschatologyReport: 'Eschatology Report',
};

function vectorProjectLabel(rel: string): string {
  const topDir = rel.split(path.sep)[0];
  return VECTOR_DIR_ALIASES[topDir] ?? humanizeDirName(topDir);
}

function collectVectorDir(): DocChunk[] {
  const dir = path.join(ROOT, 'vector');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  const chunks: DocChunk[] = [];

  for (const rel of files) {
    const full = path.join(dir, rel);
    if (fs.statSync(full).isDirectory()) continue;
    const ext = path.extname(rel).toLowerCase();
    let text = '';

    if (ext === '.md') {
      text = stripMarkdown(fs.readFileSync(full, 'utf-8'));
    } else if (ext === '.txt') {
      text = fs.readFileSync(full, 'utf-8').replace(/\s+/g, ' ').trim();
    } else {
      continue;
    }

    if (text.length < 50) continue;
    const project = vectorProjectLabel(rel);
    const fileTitle = titleFromFilename(rel);
    const title = `${project} — ${fileTitle}`;
    const contextPrefix = `[Project: ${project}] `;
    const textChunks = chunkText(text);

    for (let i = 0; i < textChunks.length; i++) {
      chunks.push({
        content: contextPrefix + textChunks[i],
        metadata: { source: `vector/${rel}`, title, chunkIndex: i },
      });
    }
  }
  return chunks;
}

async function collectVectorPdfs(): Promise<DocChunk[]> {
  const dir = path.join(ROOT, 'vector');
  if (!fs.existsSync(dir)) return [];
  const files = (fs.readdirSync(dir, { recursive: true }) as string[]).filter(
    (f) => f.toLowerCase().endsWith('.pdf'),
  );
  const chunks: DocChunk[] = [];

  for (const rel of files) {
    const full = path.join(dir, rel);
    if (fs.statSync(full).isDirectory()) continue;
    const text = await extractPdf(full);
    if (text.length < 50) continue;

    const project = vectorProjectLabel(rel);
    const fileTitle = titleFromFilename(rel);
    const title = `${project} — ${fileTitle}`;
    const contextPrefix = `[Project: ${project}] `;
    const textChunks = chunkText(text);
    for (let i = 0; i < textChunks.length; i++) {
      chunks.push({
        content: contextPrefix + textChunks[i],
        metadata: { source: `vector/${rel}`, title, chunkIndex: i },
      });
    }
  }
  return chunks;
}

/* ------------------------------------------------------------------ */
/*  Embedding                                                          */
/* ------------------------------------------------------------------ */

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

/* ------------------------------------------------------------------ */
/*  Upsert                                                             */
/* ------------------------------------------------------------------ */

async function upsertChunks(chunks: DocChunk[]) {
  const fresh = process.argv.includes('--fresh');
  if (fresh) {
    console.log('  Clearing existing documents...');
    const { error } = await supabase.from('documents').delete().gte('id', 0);
    if (error) throw error;
  }

  console.log(`  Embedding ${chunks.length} chunks in batches of ${BATCH_SIZE}...`);
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const embeddings = await embedBatch(batch.map((c) => c.content));

    const rows = batch.map((chunk, j) => ({
      content: sanitizeUnicode(chunk.content),
      metadata: chunk.metadata,
      embedding: embeddings[j],
    }));

    const { error } = await supabase.from('documents').insert(rows);
    if (error) throw error;

    console.log(
      `  [${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}] embedded`,
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('Collecting content...\n');

  const astro = collectAstroPages();
  console.log(`  Astro pages: ${astro.length} chunks`);

  const workMd = collectMarkdown(path.join(ROOT, 'src/content/work'), '/work');
  console.log(`  Work collection: ${workMd.length} chunks`);

  const researchMd = collectMarkdown(path.join(ROOT, 'src/content/research'));
  console.log(`  Research collection: ${researchMd.length} chunks`);

  const launchPack = collectMarkdown(
    path.join(ROOT, 'capability_commons_launch_pack'),
  );
  console.log(`  Capability Commons launch pack: ${launchPack.length} chunks`);

  const pdfs = await collectPdfs(path.join(ROOT, 'public/papers'));
  console.log(`  PDFs (public/papers): ${pdfs.length} chunks`);

  const vectorText = collectVectorDir();
  console.log(`  vector/ text files: ${vectorText.length} chunks`);

  const vectorPdfs = await collectVectorPdfs();
  console.log(`  vector/ PDFs: ${vectorPdfs.length} chunks`);

  const all = [
    ...astro,
    ...workMd,
    ...researchMd,
    ...launchPack,
    ...pdfs,
    ...vectorText,
    ...vectorPdfs,
  ];
  console.log(`\nTotal: ${all.length} chunks\n`);

  if (all.length === 0) {
    console.log('Nothing to ingest.');
    return;
  }

  await upsertChunks(all);
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
