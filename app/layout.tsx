import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s — Bits and Pieces',
    default: 'Bits and Pieces',
  },
  description: 'Software / security engineering blog. Also some discussion about rocks.',
  metadataBase: new URL('https://alichtman.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-us">
      <body className="theme-dark">{children}</body>
    </html>
  );
}
