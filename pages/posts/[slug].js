import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Layout from 'components/Layout/Layout';
import styles from 'styles/post.module.css';
import { postFilePaths, prepareMdx } from '../../utils/mdxUtils';

const url = 'https://www.nflvisuals.com/posts/';
const urlImgBase = 'https://www.nflvisuals.com';

const titleAppendix = ' - NFL Visuals';

export default function PostPage({ code, frontmatter, slug }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <>
      <Head>
        <title>{frontmatter.title + titleAppendix}</title>
        <meta name="keywords" content={frontmatter.keywords} />
        <link rel="canonical" href={url + slug} />
        <meta property="og:image" content={urlImgBase + frontmatter.imgDetails} />
        <meta property="og:description" content={frontmatter.description} />
        <meta property="og:title" content={frontmatter.title + titleAppendix} />
        <meta property="og:url" content={url + slug} />
        <meta name="description" content={frontmatter.description} />
      </Head>

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
            <h1>{frontmatter.title}</h1>
            <p>Published {frontmatter.date}</p>
            {frontmatter.description && <p className="description">{frontmatter.description}</p>}
            {frontmatter.img && (
              <div className={styles.imgWrap}>
                <Image
                  src={frontmatter.imgDetails}
                  layout="fill"
                  objectFit="cover"
                  alt="Carson Wentz not magic"
                />
              </div>
            )}
          </div>
          <main className={styles.body}>
            <Component />
          </main>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async ({ params }) => {
  const { code, frontmatter } = await prepareMdx(`${params.slug}.mdx`);
  return {
    props: {
      code,
      frontmatter,
      slug: params.slug,
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
