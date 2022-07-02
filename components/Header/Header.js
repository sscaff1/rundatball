import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => (
  <div className={styles.root}>
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image height={75} width={75} src="/logo.svg" alt="NFL Visuals logo" />
          <p>NFL Visuals</p>
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
