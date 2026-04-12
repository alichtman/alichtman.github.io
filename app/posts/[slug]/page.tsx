import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import { getAllPostSlugs, getPostWithHtml } from '@/lib/posts';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostWithHtml(slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostWithHtml(slug);

  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>

          {/* ── Post header card ────────────────────────────────── */}
          <Card title={post.title}>
            <div className={styles.meta}>
              <time dateTime={post.date}>{post.dateFormatted}</time>
              {post.tags.length > 0 && (
                <>
                  <span className={styles.metaSep}>·</span>
                  <span className="text-subdued">{post.tags.join(', ')}</span>
                </>
              )}
            </div>
          </Card>

          {/* ── Post body ──────────────────────────────────────── */}
          <Card>
            <article
              className={`prose ${styles.postBody}`}
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </Card>

          {/* ── Navigation footer ──────────────────────────────── */}
          <div className={styles.postNav}>
            <Link href="/posts/">← all posts</Link>
          </div>

        </div>
      </main>
    </>
  );
}
