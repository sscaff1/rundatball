import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import Link from 'next/link';
import path from 'path';
import Layout from 'components/Layout/Layout';
import styles from 'styles/post.module.css';
import { postFilePaths, POSTS_PATH, prepareMdx } from '../../utils/mdxUtils';

export default function PostPage({ code, frontmatter }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <Layout>
      <div className={styles.root}>
        <header className={styles.header}>
          <nav>
            <Link href="/">
              <a>Go back home</a>
            </Link>
          </nav>
        </header>
        <div className={styles.title}>
          <h2>{frontmatter.title}</h2>
          {frontmatter.description && <p className="description">{frontmatter.description}</p>}
        </div>
        <main className={styles.body}>
          <Component />
        </main>
      </div>
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const { code, frontmatter } = await prepareMdx(path.join(POSTS_PATH, `${params.slug}.mdx`));
  return {
    props: {
      code,
      frontmatter,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((filepath) => filepath.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }));

  return {
    fallback: false,
    paths,
  };
};
