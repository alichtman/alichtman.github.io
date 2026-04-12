'use client';

import styles from './PdfViewer.module.css';

interface Props {
  url: string;
  downloadUrl?: string;
}

export default function PdfViewer({ url, downloadUrl }: Props) {
  const viewerUrl = `${url}#zoom=page-width`;

  return (
    <div className={styles.viewer}>
      <div className={styles.actionBar}>
        <span className={styles.pageLabel}>embedded PDF</span>
        <div className={styles.links}>
          <a href={viewerUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>
            ⭢ open in new tab
          </a>
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadLink}
            >
              ⭢ download PDF
            </a>
          )}
        </div>
      </div>

      <div className={styles.pageWrapper}>
        <object
          data={viewerUrl}
          type="application/pdf"
          className={styles.embed}
          aria-label="Resume PDF"
        >
          <div className={styles.loading}>
            <p>This browser could not embed the PDF.</p>
            <p>
              <a href={viewerUrl} target="_blank" rel="noopener noreferrer">
                Open the resume in a new tab
              </a>
            </p>
          </div>
        </object>
      </div>
    </div>
  );
}
