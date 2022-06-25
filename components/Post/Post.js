import Link from 'next/link';
import styles from './Post.module.css';

const Post = ({ date, slug, summary, title }) => (
  <Link
    href={{
      pathname: '/posts/[slug]',
      query: { slug },
    }}
  >
    <a className={styles.wrap}>
      <article className={styles.article}>
        <div />
        {/* <Image src="http://placehold.jp/150x150.png" layout="fill" /> */}
        <div className={styles.root}>
          <p className={styles.title}>{title}</p>
          <small className={styles.date}>{date}</small>
          <p className={styles.description}>{summary}</p>
        </div>
      </article>
    </a>
  </Link>
);

export default Post;
