import fs from 'fs';
import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import Link from 'next/link';
import path from 'path';
import Layout from '../../components/Layout';
import { postFilePaths, POSTS_PATH, prepareMdx } from '../../utils/mdxUtils';

export default function PostPage({ code, frontmatter }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <Layout>
      <header>
        <nav>
          <Link href="/">
            <a>👈 Go back home</a>
          </Link>
        </nav>
      </header>
      <div className="post-header">
        <h1>{frontmatter.title}</h1>
        {frontmatter.description && <p className="description">{frontmatter.description}</p>}
      </div>
      <main>
        <Component />
      </main>
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { code, frontmatter } = await prepareMdx(source);
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
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }));

  return {
    fallback: false,
    paths,
  };
};
