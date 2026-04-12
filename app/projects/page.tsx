import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Projects',
};

type ProjectType = 'owner' | 'contributor';

interface Project {
  name: string;
  url: string;
  description: string;
  type: ProjectType;
  stars: number;
  displayName?: string;
}

const PROJECTS: Project[] = [
  {
    name: 'shallow-backup',
    url: 'https://github.com/alichtman/shallow-backup',
    description: 'Git-integrated backup tool for macOS and Linux devs.',
    type: 'owner',
    stars: 1320,
  },
  {
    name: 'stronghold',
    url: 'https://github.com/alichtman/stronghold',
    description: 'Easily configure macOS security settings from the terminal.',
    type: 'owner',
    stars: 1176,
  },
  {
    name: 'deadbolt',
    url: 'https://github.com/alichtman/deadbolt',
    description: 'Dead-simple file encryption for any OS.',
    type: 'owner',
    stars: 406,
  },
  {
    name: 'jrnl',
    url: 'https://github.com/jrnl-org/jrnl',
    description: 'Collect your thoughts and notes without leaving the command line.',
    type: 'contributor',
    stars: 7199,
    displayName: 'jrnl-org/jrnl',
  },
  {
    name: 'bunnylol.rs',
    url: 'https://github.com/facebook/bunnylol.rs',
    description: 'A tool for writing smart bookmarks in your browser.',
    type: 'owner',
    stars: 125,
    displayName: 'facebook/bunnylol.rs',
  },
  {
    name: 'gopro-chaptered-video-assembler',
    url: 'https://github.com/alichtman/gopro-chaptered-video-assembler',
    description: 'Stitches GoPro chaptered video files back together.',
    type: 'owner',
    stars: 12,
  },
  {
    name: 'dotfiles',
    url: 'https://github.com/alichtman/dotfiles',
    description: "Aaron's dotfiles for macOS and Linux.",
    type: 'owner',
    stars: 37,
  },
  {
    name: 'i-made-this',
    url: 'https://github.com/alichtman/i-made-this',
    description: 'A joke CLI for shipping a project while doing none of the work.',
    type: 'owner',
    stars: 55,
  },
  {
    name: 'malware-techniques',
    url: 'https://github.com/alichtman/malware-techniques',
    description: 'A collection of techniques commonly used in malware to accomplish core tasks.',
    type: 'owner',
    stars: 83,
  },
  {
    name: 'fzf-notes',
    url: 'https://github.com/alichtman/fzf-notes',
    description: 'Quick note editing with fzf and vim.',
    type: 'owner',
    stars: 30,
  },
  {
    name: 'open_tab_tracker',
    url: 'https://github.com/alichtman/open_tab_tracker',
    description: 'Tracks open Firefox tabs and plots them on a graph.',
    type: 'owner',
    stars: 3,
  },
  {
    name: 'rofi-insect',
    url: 'https://github.com/alichtman/rofi-insect',
    description: 'Imitation macOS Spotlight calculator for Linux.',
    type: 'owner',
    stars: 2,
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>
          <Card title="open source projects">
            <p className={styles.intro}>
              A curated list of projects I care about, plus a few upstream repos where I contributed meaningful work.
            </p>

            <table className={styles.projectTable}>
              <thead>
                <tr>
                  <th className={styles.projectHeader}>project</th>
                  <th className={styles.descriptionHeader}>description</th>
                  <th className={styles.starsHeader}>stars</th>
                  <th className={`${styles.roleHeader} ${styles.hideMobile}`}>role</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((project) => (
                  <tr key={project.name}>
                    <td className={`${styles.nameCell} ${styles.projectHeader}`}>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        {project.displayName ?? project.name}
                      </a>
                    </td>
                    <td className={`${styles.descCell} ${styles.descriptionHeader}`}>{project.description}</td>
                    <td className={`${styles.starsCell} ${styles.starsHeader}`}>
                      <span className="text-subdued">{project.stars.toLocaleString('en-US')}</span>
                    </td>
                    <td className={`${styles.roleCell} ${styles.roleHeader} ${styles.hideMobile}`}>
                      <span className={styles.kind}>{project.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className={styles.moreLink}>
              More on{' '}
              <a href="https://github.com/alichtman" target="_blank" rel="noopener noreferrer">
                github.com/alichtman
              </a>
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
