import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Projects',
};

const PROJECTS = [
  {
    name: 'shallow-backup',
    url: 'https://github.com/alichtman/shallow-backup',
    description: 'Git-integrated backup tool for dotfiles, packages, fonts, and screenshots.',
    tags: ['python', 'cli'],
  },
  {
    name: 'stronghold',
    url: 'https://github.com/alichtman/stronghold',
    description: 'The easiest way to configure macOS security settings from the terminal.',
    tags: ['python', 'cli', 'security', 'macos'],
  },
  {
    name: 'fzf-marks',
    url: 'https://github.com/alichtman/fzf-marks',
    description: 'Plugin to create, navigate, and delete bookmarks in bash and zsh with fzf.',
    tags: ['shell', 'zsh', 'fzf'],
  },
  {
    name: 'deadbolt',
    url: 'https://github.com/alichtman/deadbolt',
    description: 'The simplest way to encrypt and decrypt files from the macOS context menu.',
    tags: ['swift', 'macos', 'security'],
  },
  {
    name: 'honest-bash',
    url: 'https://github.com/alichtman/honest-bash',
    description: 'Shell scripting patterns and anti-patterns.',
    tags: ['bash', 'docs'],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <main className="site-wrapper">
        <div className={styles.layout}>

          <Card title="open source projects">
            <table className={styles.projectTable}>
              <thead>
                <tr>
                  <th>project</th>
                  <th>description</th>
                  <th className={styles.hideMobile}>tags</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((project) => (
                  <tr key={project.name}>
                    <td className={styles.nameCell}>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.name}
                      </a>
                    </td>
                    <td className={styles.descCell}>{project.description}</td>
                    <td className={styles.hideMobile}>
                      <span className="text-subdued">
                        {project.tags.join(', ')}
                      </span>
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
