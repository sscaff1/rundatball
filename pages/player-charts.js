import TeamCharts from 'components/TeamCharts';
import TeamOverTimeChart from 'components/TeamSpecificOverTimeChart';
import Layout from 'components/Layout/Layout';

export default function PlayerChartsPage() {
  return (
    <Layout>
      <TeamCharts />
      <TeamOverTimeChart />
    </Layout>
  );
}
