import path from 'path';
import Layout from 'components/Layout/Layout';
import Post from 'components/Post/Post';
import styles from 'styles/posts.module.css';
import { prepareMdx, postFilePaths, POSTS_PATH } from '../utils/mdxUtils';

export default function Index({ posts }) {
  return (
    <Layout>
      <div className={styles.root}>
        {posts.map((post) => (
          <Post
            key={post.filePath}
            slug={post.filePath.replace(/\.mdx?$/, '')}
            title={post.data.title}
            summary={post.data.summary}
            date={post.data.date}
          />
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const postPromises = postFilePaths.map(async (filePath) => {
    const allData = await prepareMdx(path.join(POSTS_PATH, filePath));
    return {
      data: allData.frontmatter,
      filePath,
    };
  });

  const posts = await Promise.all(postPromises);

  return { props: { posts } };
};
