'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const NAV_LINKS = [
  { href: '/posts/', label: 'posts' },
  { href: '/about/', label: 'about' },
  { href: '/projects/', label: 'projects' },
  { href: 'https://github.com/alichtman', label: 'github', external: true },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          alichtman<span className={styles.sep}>/</span>bits&amp;pieces
        </Link>
        <ul className={styles.links}>
          {NAV_LINKS.map(({ href, label, external }) => {
            const isActive = !external && (
              pathname === href ||
              (href !== '/' && pathname.startsWith(href))
            );
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={isActive ? styles.active : undefined}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
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
