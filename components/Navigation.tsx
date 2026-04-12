'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const NAV_LINKS = [
  { href: '/', label: 'home' },
  { href: '/posts/', label: 'posts' },
  { href: '/projects/', label: 'projects' },
  { href: '/resume/', label: 'résumé' },
  { href: '/about/', label: 'about' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          alichtman.com<span className={styles.brandSep}>|</span><span className={styles.brandTitle}>Bits &amp; Pieces</span>
        </Link>
        <ul className={styles.links}>
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              pathname === href ||
              (href !== '/' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link href={href} className={isActive ? styles.active : undefined}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
