export default function Layout({ children }) {
  return (
    <>
      <header>
        <h1>Run That Ball</h1>
        <p>A football blog about the run game</p>
        <a href=""></a>
      </header>
      <div className="wrapper">{children}</div>
      <style jsx>{` 
        .wrapper {
          max-width: 620px;
          margin: 0 auto;
          padding: 10px;
        }
      `}</style>
    </>
  );
}
