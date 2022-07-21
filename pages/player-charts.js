import Head from 'next/head';
import Layout from 'components/Layout/Layout';
import styles from 'styles/charts.module.css';

const title = 'Player charts coming soon - NFL Visuals';
const description =
  'Coming soon. NFL player stats in charts. Visually see individual player statistics.';
const url = 'https://www.nflvisuals.com/player-charts';

export default function PlayerChartsPage() {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content="nfl team stat charts, nfl visuals team charts" />
        <link rel="canonical" href={url} />
        <meta property="og:image" content="https://www.nflvisuals.com/logo.png" />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta name="description" content={description} />
      </Head>
      <Layout>
        <div className={styles.coming}>
          <h2>Coming Soon</h2>
        </div>
      </Layout>
    </>
  );
}
