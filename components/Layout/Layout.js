import Header from '../Header/Header';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.root}>
      <Header />
      <div>{children}</div>
    </div>
  );
}
