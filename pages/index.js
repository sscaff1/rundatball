import Head from 'next/head';
import Layout from 'components/Layout/Layout';
import Post from 'components/Post/Post';
import styles from 'styles/posts.module.css';
import { prepareMdx, postFilePaths } from '../utils/mdxUtils';

export default function Index({ posts }) {
  return (
    <>
      <Head>
        <title>NFL Visuals - Visualize NFL data</title>
        <meta
          name="keywords"
          content="nfl charts, nfl visual data, nfl visualize data, nfl visual data blog"
        />
      </Head>
      <Layout>
        <div className={styles.root}>
          {posts.map((post) => (
            <Post
              key={post.filePath}
              slug={post.filePath.replace(/\.mdx?$/, '')}
              title={post.data.title}
              summary={post.data.summary}
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
