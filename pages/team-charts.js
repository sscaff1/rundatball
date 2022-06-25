import TeamCharts from 'components/TeamCharts';
import TeamOverTimeChart from 'components/TeamSpecificOverTimeChart';
import Layout from 'components/Layout/Layout';
import styles from 'styles/charts.module.css';

export default function TeamChartsPage() {
  return (
    <Layout>
      <div className={styles.root}>
        <TeamCharts />
        <TeamOverTimeChart />
      </div>
    </Layout>
  );
}
