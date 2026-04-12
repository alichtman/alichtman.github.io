'use client';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <p style={{ color: 'var(--theme-text-subdued)', padding: '2ch' }}>loading…</p>
  ),
});

const RESUME_URL = 'https://cdn.jsdelivr.net/gh/alichtman/resume@master/resume/resume.pdf';

export default function ResumeClient() {
  return <PdfViewer url={RESUME_URL} downloadUrl={RESUME_URL} />;
}
