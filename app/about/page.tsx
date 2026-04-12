import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>

          <Card title="about">
            <div className="prose">
              <p>
                Hey! My name is Aaron.
              </p>
              <p>
                I graduated from UIUC with a degree in CS + Linguistics.
              </p>
              <p>
                I&apos;ve been a software / security engineer at Facebook since Sept 2020.
              </p>
              <p>
                I&apos;ve contributed a bunch of open-source software, command line
                tooling, etc that you can check out on my{' '}
                <a href="https://github.com/alichtman" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>.
              </p>
            </div>
          </Card>

          <Card title="subscribe">
            <div className="prose">
              <p>
                Subscribe to this blog via the{' '}
                <a href="/feed.xml">RSS feed</a>. I use{' '}
                <a href="https://newsboat.org/" target="_blank" rel="noopener noreferrer">
                  <code>newsboat</code>
                </a>{' '}
                on the command line, and{' '}
                <a href="https://feedly.com" target="_blank" rel="noopener noreferrer">
                  Feedly
                </a>{' '}
                for a non-CLI option.
              </p>
            </div>
          </Card>

          <Card title="site design">
            <div className="prose">
              <p>
                Built with{' '}
                <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
                {' '}using the{' '}
                <a href="https://www.sacred.computer/" target="_blank" rel="noopener noreferrer">SRCL</a>
                {' '}design system from{' '}
                <a href="https://github.com/internet-development/www-sacred" target="_blank" rel="noopener noreferrer">
                  internet-development/www-sacred
                </a>. Typography in{' '}
                <a href="https://fonts.google.com/specimen/Space+Mono" target="_blank" rel="noopener noreferrer">
                  Space Mono
                </a>.
              </p>
              <p>
                Previously I borrowed many ideas from{' '}
                <a href="https://fabiensanglard.net/" target="_blank" rel="noopener noreferrer">
                  Fabien Sanglard&apos;s website
                </a>
                . It&apos;s still one of the best-designed minimal static blogs around.
              </p>
            </div>
          </Card>

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
