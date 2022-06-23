import Link from 'next/link';
import styles from './Post.module.css';

const Post = () => (
  <Link href="/post-blah">
    <a className={styles.wrap}>
      <article className={styles.article}>
        <div />
        {/* <Image src="http://placehold.jp/150x150.png" layout="fill" /> */}
        <div className={styles.root}>
          <p className={styles.title}>Blog title</p>
          <small className={styles.date}>July 7, 2022</small>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi consequatur, veniam non
            distinctio quibusdam tempora deleniti nobis sequi eaque architecto ipsa nemo ea, velit
            corporis libero est maiores! Quia, eaque?
          </p>
        </div>
      </article>
    </a>
  </Link>
);

export default Post;
