import styles from './Header.module.css';

const Header = () => (
  <div className="container">
    <header className={styles.header}>
      <h1>NFL Visuals</h1>
      <p>Visualize NFL data</p>
    </header>
  </div>
);

export default Header;
