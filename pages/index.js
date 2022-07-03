import Head from 'next/head';
import Layout from 'components/Layout/Layout';
import Post from 'components/Post/Post';
import styles from 'styles/posts.module.css';
import { prepareMdx, postFilePaths } from '../utils/mdxUtils';

const title = 'NFL Visuals - Visualize NFL data';
const description =
  'NFL data visuals, interactive charts, and blogs with NFL content you cannot find anywhere else.';
const url = 'https://www.nflvisuals.com';

export default function Index({ posts }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="keywords"
          content="nfl charts, nfl visual data, nfl visualize data, nfl visual data blog"
        />
        <link rel="canonical" href={url} />
        <meta property="og:image" content="https://www.nflvisuals.com/logo.png" />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta name="description" content={description} />
      </Head>
      <Layout>
        <div className={styles.root}>
          {posts.map((post) => (
            <Post
              key={post.filePath}
              slug={post.filePath.replace(/\.mdx?$/, '')}
              title={post.data.title}
              description={post.data.description}
              date={post.data.date}
              img={post.data.img}
            />
          ))}
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const postPromises = postFilePaths.map(async (filePath) => {
    const allData = await prepareMdx(filePath);
    return {
      data: allData.frontmatter,
      filePath,
    };
  });

  const posts = await Promise.all(postPromises);

  return { props: { posts } };
};
