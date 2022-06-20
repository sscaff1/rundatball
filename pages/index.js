import Link from 'next/link';
import path from 'path';
import TeamCharts from 'components/TeamCharts';
import TeamOverTimeChart from 'components/TeamSpecificOverTimeChart';
import Layout from '../components/Layout';
import { prepareMdx, postFilePaths, POSTS_PATH } from '../utils/mdxUtils';

export default function Index({ posts }) {
  return (
    <Layout>
      <TeamCharts />
      <TeamOverTimeChart />
      <ul>
        {posts.map((post) => (
          <li key={post.filePath}>
            <Link as={`/posts/${post.filePath.replace(/\.mdx?$/, '')}`} href="/posts/[slug]">
              <a>{post.data.title}</a>
            </Link>
          </li>
        ))}
      </ul>
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
