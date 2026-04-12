import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import { getAllPosts } from '@/lib/posts';
import styles from './page.module.css';

export default function HomePage() {
  const posts = getAllPosts();
  const recent = posts.slice(0, 5);

  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>

          {/* ── Profile card ──────────────────────────────────────── */}
          <Card title="Aaron Lichtman">
            <div className={styles.profile}>
              <p>
                SWE / SecEng with a strong passion for working on too many
                projects at the same time. Not a bug I plan on fixing.
              </p>
              <p>
                Location: <code>$HOME</code>
              </p>
              <div className={styles.profileLinks}>
                <a href="https://github.com/alichtman" target="_blank" rel="noopener noreferrer">github</a>
                <span className={styles.dot}>·</span>
                <a href="https://twitter.com/aaronlichtman" target="_blank" rel="noopener noreferrer">twitter</a>
                <span className={styles.dot}>·</span>
                <a href="https://www.linkedin.com/in/aaron-lichtman/" target="_blank" rel="noopener noreferrer">linkedin</a>
                <span className={styles.dot}>·</span>
                <a href="https://cdn.jsdelivr.net/gh/alichtman/resume@master/resume/resume.pdf" target="_blank" rel="noopener noreferrer">résumé</a>
                <span className={styles.dot}>·</span>
                <a href="/feed.xml">rss</a>
              </div>
            </div>
          </Card>

          {/* ── Recent posts ──────────────────────────────────────── */}
          <Card title="recent posts">
            <table className={styles.postTable}>
              <thead>
                <tr>
                  <th>date</th>
                  <th>title</th>
                  <th className={styles.hideMobile}>tags</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((post) => (
                  <tr key={post.slug}>
                    <td className={styles.dateCell}>
                      <time dateTime={post.date}>{post.dateFormatted}</time>
                    </td>
                    <td>
                      <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
                    </td>
                    <td className={styles.hideMobile}>
                      <span className="text-subdued">
                        {post.tags.join(', ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length > 5 && (
              <p className={styles.allPostsLink}>
                <Link href="/posts/">→ all {posts.length} posts</Link>
              </p>
            )}
          </Card>

          {/* ── Contact ───────────────────────────────────────────── */}
          <Card title="contact">
            <ul className={styles.contactList}>
              <li><code>aaronlichtman@gmail.com</code></li>
              <li><code>alichtman@protonmail.com</code></li>
              <li>Carrier pigeon, aimed loosely at Seattle</li>
            </ul>
          </Card>

        </div>
      </main>
    </>
  );
}
