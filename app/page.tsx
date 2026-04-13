import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import ASCIICanvas from '@/components/ASCIICanvas';
import { getAllPosts } from '@/lib/posts';
import styles from './page.module.css';

export default function HomePage() {
  const posts = getAllPosts();
  const recent = posts.slice(0, 8);

  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <aside className={styles.sidebar}>
            <Card title="Aaron Lichtman">
              <div className={styles.profile}>
                <Image
                  src="/assets/images/bio.jpg"
                  alt="Aaron and his dog on a hike"
                  width={600}
                  height={600}
                  className={styles.bioPhoto}
                  loading="eager"
                />
                <p>
                  SWE / SecEng. Strong passion for working on too many projects
                  at the same time. Not a bug I plan on fixing.
                </p>
                <p className={styles.location}>
                  <span className={styles.prompt}>{'>'}</span>
                  <code>echo $HOME</code>
                  <span className={styles.locationValue}>Seattle, WA</span>
                </p>
                <div className={styles.profileLinks}>
                  <a href="https://github.com/alichtman" target="_blank" rel="noopener noreferrer">
                    ⭢ github
                  </a>
                  <a href="https://twitter.com/aaronlichtman" target="_blank" rel="noopener noreferrer">
                    ⭢ twitter
                  </a>
                  <a href="https://www.linkedin.com/in/aaron-lichtman/" target="_blank" rel="noopener noreferrer">
                    ⭢ linkedin
                  </a>
                  <a href="https://cdn.jsdelivr.net/gh/alichtman/resume@master/resume/resume.pdf" target="_blank" rel="noopener noreferrer">
                    ⭢ résumé
                  </a>
                  <a href="/feed.xml">
                    ⭢ rss
                  </a>
                </div>
              </div>
            </Card>

            <Card title="contact">
              <ul className={styles.contactList}>
                <li><code>aaronlichtman@gmail.com</code></li>
                <li><code>alichtman@protonmail.com</code></li>
                <li>Carrier pigeon, aimed loosely at Seattle</li>
              </ul>
            </Card>
          </aside>

          {/* ── Main ──────────────────────────────────────────────── */}
          <div className={styles.main}>
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
                        <time dateTime={post.date}>{post.dateShort}</time>
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
              {posts.length > 8 && (
                <p className={styles.allPostsLink}>
                  <Link href="/posts/">⭢ all {posts.length} posts</Link>
                </p>
              )}
            </Card>
            <Card title="ascii canvas" className={styles.hideMobile}>
              <ASCIICanvas rows={12} />
            </Card>
          </div>

        </div>
      </main>
    </>
  );
}
