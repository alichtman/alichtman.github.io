import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>
          <Card title="404 not found">
            <p>
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <p>
              <Link href="/">← go home</Link>
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
