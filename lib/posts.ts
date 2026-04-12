import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), '_posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  dateFormatted: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  content: string;
}

export interface PostWithHtml extends Post {
  html: string;
}

function slugFromFilename(filename: string): string {
  // "2024-01-13-os-clipboards.md" → "2024-01-13-os-clipboards"
  return filename.replace(/\.md$/, '');
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

/**
 * Strip Jekyll-specific markup that doesn't render in standard markdown:
 *   {: .notice--info}  {: .align-center}  etc.
 */
function stripJekyllMarkup(content: string): string {
  return content
    .replace(/\{:\s*\.[^}]+\}/g, '')      // block IAL like {: .notice--info}
    .replace(/^\[.*?\]\[.*?\]$/gm, '')     // orphaned reference-style links
    .trim();
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map(slugFromFilename);
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const rawDate: string = data.date
    ? typeof data.date === 'string'
      ? data.date
      : (data.date as Date).toISOString()
    : '';

  // First non-empty paragraph as excerpt
  const firstParagraph =
    content
      .split(/\n\n+/)
      .map((s) => s.trim())
      .find((s) => s.length > 0 && !s.startsWith('#') && !s.startsWith('---')) ?? '';

  const excerpt = stripJekyllMarkup(firstParagraph).slice(0, 240);

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: rawDate,
    dateFormatted: formatDate(rawDate),
    excerpt,
    categories: (data.categories as string[]) ?? [],
    tags: (data.tags as string[]) ?? [],
    content,
  };
}

export async function getPostWithHtml(slug: string): Promise<PostWithHtml> {
  const post = getPostBySlug(slug);
  const cleaned = stripJekyllMarkup(post.content);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(cleaned);

  return { ...post, html: processedContent.toString() };
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map(getPostBySlug)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
