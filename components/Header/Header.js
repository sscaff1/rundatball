import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => (
  <div className={styles.root}>
    <header className={styles.header}>
      <Link href="/">
        <a>
          <h1>NFL Visuals</h1>
        </a>
      </Link>
    </header>
    <nav className={styles.nav}>
      <Link href="/team-charts">
        <a>Team Charts</a>
      </Link>
      <Link href="/player-charts">
        <a>Player Charts</a>
      </Link>
    </nav>
  </div>
);

export default Header;
