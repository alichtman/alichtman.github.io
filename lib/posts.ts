import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), '_posts');
const POST_FILENAME_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

export interface Post {
  slug: string;
  title: string;
  date: string;
  dateFormatted: string;
  dateShort: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  content: string;
  hidden?: boolean;
}

export interface PostWithHtml extends Post {
  html: string;
}

function routeSlugFromFilename(filename: string): string {
  // "2024-01-13-os-clipboards.md" → "os-clipboards"
  return filename.replace(POST_FILENAME_PREFIX, '').replace(/\.md$/, '');
}

function filenameFromRouteSlug(slug: string): string {
  const matchingFilename = fs
    .readdirSync(postsDirectory)
    .find((filename) => filename.endsWith('.md') && routeSlugFromFilename(filename) === slug);

  if (!matchingFilename) {
    throw new Error(`No post found for slug: ${slug}`);
  }

  return matchingFilename;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return dateStr;
  }
}

function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).toUpperCase();
  } catch {
    return dateStr;
  }
}

/**
 * Strip markdown syntax from a string to produce plain text suitable for
 * use as an excerpt or description.
 */
function stripMarkdownSyntax(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')          // images: ![alt](url)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')        // links: [text](url) → text
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')       // ref links: [text][ref] → text
    .replace(/`[^`]+`/g, '')                         // inline code
    .replace(/(\*\*|__)([^*_]+)\1/g, '$2')           // bold
    .replace(/(\*|_)([^*_]+)\1/g, '$2')              // italic
    .replace(/<[^>]+>/g, '')                          // HTML tags (e.g. <cite>)
    .replace(/^>\s*/gm, '')                           // blockquote markers
    .replace(/\s+/g, ' ')
    .trim();
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map(routeSlugFromFilename);
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, filenameFromRouteSlug(slug));
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const rawDate: string = data.date
    ? typeof data.date === 'string'
      ? data.date
      : (data.date as Date).toISOString()
    : '';

  // Find the first paragraph that contains meaningful prose (not headings,
  // images, code fences, or legacy template blocks).
  const paragraphs = content.split(/\n\n+/).map((s) => s.trim());
  const firstProse = paragraphs.find((s) => {
    if (!s || s.startsWith('#') || s.startsWith('---')) return false;
    if (s.startsWith('![]') || s.startsWith('![')) return false;  // pure image
    if (s.startsWith('```') || s.startsWith('~~~')) return false;  // code fence
    const plain = stripMarkdownSyntax(s);
    return plain.length > 20;  // skip near-empty paragraphs after stripping
  }) ?? '';

  const excerpt = stripMarkdownSyntax(firstProse).slice(0, 400);

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: rawDate,
    dateFormatted: formatDate(rawDate),
    dateShort: formatDateShort(rawDate),
    excerpt,
    categories: (data.categories as string[]) ?? [],
    tags: (data.tags as string[]) ?? [],
    content,
    hidden: Boolean(data.hidden),
  };
}

export async function getPostWithHtml(slug: string): Promise<PostWithHtml> {
  const post = getPostBySlug(slug);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrettyCode, {
      theme: {
        dark: 'gruvbox-dark-hard',
      },
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(post.content);

  return { ...post, html: processedContent.toString() };
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map(getPostBySlug)
    .filter((post) => !post.hidden)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
