import Head from 'next/head';
import TeamCharts from 'components/TeamCharts';
import TeamOverTimeChart from 'components/TeamSpecificOverTimeChart';
import Layout from 'components/Layout/Layout';
import styles from 'styles/charts.module.css';

const title = 'Team charts - NFL Visuals';
const description =
  'Visualize NFL team stats. Select by year, team, and stat with the playoff context';
const url = 'https://www.nflvisuals.com/team-charts';

export default function TeamChartsPage() {
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
        <div className={styles.root}>
          <TeamCharts />
          <TeamOverTimeChart />
        </div>
      </Layout>
    </>
  );
}
