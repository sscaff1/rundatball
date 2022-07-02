import Head from 'next/head';
import Layout from 'components/Layout/Layout';
import styles from 'styles/charts.module.css';

export default function PlayerChartsPage() {
  return (
    <>
      <Head>
        <title>Team Charts - NFL Visuals</title>
        <meta
          name="keywords"
          content="nfl team statistic charts, nfl regular season stats, nfl team graphs, nfl team charts"
        />
      </Head>
      <Layout>
        <div className={styles.coming}>
          <h2>Coming Soon</h2>
        </div>
      </Layout>
    </>
  );
}
