import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className }: CardProps) {
  return (
    <article className={`${styles.card}${className ? ` ${className}` : ''}`}>
      {title ? (
        <div className={styles.header}>
          <div className={styles.headerLeft} aria-hidden="true" />
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.headerRight} aria-hidden="true" />
        </div>
      ) : (
        <div className={styles.headerPlain} aria-hidden="true" />
      )}
      <div className={styles.children}>{children}</div>
    </article>
  );
}
