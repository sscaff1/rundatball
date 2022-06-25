import Header from '../Header/Header';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.wrap}>
      <Header />
      <main className={styles.root}>{children}</main>
      <footer className={styles.footer}>
        <p>
          Contact: <a href="mailto:steven@nflvisuals.com">steven@nflvisuals.com</a>
        </p>
        <p>NFL Visuals &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
