import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import ResumeClient from './ResumeClient';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Résumé',
};

export default function ResumePage() {
  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>
          <Card title="résumé">
            <ResumeClient />
          </Card>
        </div>
      </main>
    </>
  );
}
