import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import styles from './Post.module.css';

const Post = ({ date, description, img, slug, title }) => (
  <Link
    href={{
      pathname: '/posts/[slug]',
      query: { slug },
    }}
  >
    <a className={styles.wrap}>
      <article className={styles.article}>
        {img ? (
          <div className={styles.imgWrap}>
            <Image src={img} layout="fill" alt="Carson Wentz Eagles" objectFit="cover" />
          </div>
        ) : null}
        <div className={cn(styles.root, { [styles.withImg]: !!img })}>
          <p className={styles.title}>{title}</p>
          <small className={styles.date}>{date}</small>
          <p className={styles.description}>{description}</p>
        </div>
      </article>
    </a>
  </Link>
);

export default Post;
