import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import { getAllPosts } from '@/lib/posts';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Posts',
};

export default function PostsPage() {
  const posts = getAllPosts();

  // Group by year
  const byYear: Record<string, typeof posts> = {};
  for (const post of posts) {
    const year = post.date ? new Date(post.date).getUTCFullYear().toString() : 'unknown';
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(post);
  }
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>
          {years.map((year) => (
            <Card key={year} title={year}>
              <table className={styles.postTable}>
                <tbody>
                  {byYear[year].map((post) => (
                    <tr key={post.slug}>
                      <td className={styles.dateCell}>
                        <time dateTime={post.date}>{post.dateShort}</time>
                      </td>
                      <td className={styles.titleCell}>
                        <Link href={`/posts/${post.slug}/`} className={styles.title}>{post.title}</Link>
                        {post.excerpt && (
                          <span className={styles.excerpt}>{post.excerpt}</span>
                        )}
                      </td>
                      <td className={styles.tagCell}>
                        {post.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
