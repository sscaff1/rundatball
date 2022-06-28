import { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import mvps from './mvp.json';
import playerPassing from './playerPassingStatsByYear.json';

const qbMvps = mvps.filter((m) => m.pos === 'QB');
const qbMvpsByear = qbMvps.reduce((obj, p) => ({ ...obj, [p.year_id]: p.player }), {});
const statsForMvps = Object.entries(playerPassing)
  .reduce((arr, [year, players]) => {
    const findCallback = (p) => p.player.replace(/[*+]/g, '') === qbMvpsByear[year];
    const mvpPlayerStats = players.find(findCallback);
    const eligiblePlayers = players.filter((p) => p.pass_att > 200);
    const passCompletionPlayers = eligiblePlayers.sort((a, b) =>
      d3.descending(a.pass_cmp_perc, b.pass_cmp_perc),
    );
    const passCompletionRank = passCompletionPlayers.findIndex(findCallback);
    const tdPercentagePlayers = eligiblePlayers.sort((a, b) =>
      d3.descending(a.pass_td_perc, b.pass_td_perc),
    );
    const tdPercentageRank = tdPercentagePlayers.findIndex(findCallback);
    if (mvpPlayerStats) {
      return [
        ...arr,
        {
          ...mvpPlayerStats,
          passCompletionRank: passCompletionRank + 1,
          tdPercentageRank: tdPercentageRank + 1,
          year,
        },
      ];
    }
    return arr;
  }, [])
  .concat({
    ...playerPassing['2017'].find((p) => p.player.includes('Wentz')),
    passCompletionRank: 25,
    tdPercentageRank: 1,
    year: '2017',
  });

export default function PassingCompletionTdPercentage() {
  const svgRef = useRef();

  useLayoutEffect(() => {
    const margin = { bottom: 10, left: 10, right: 10, top: 10 };
    const svgWidth = 600;
    const svgHeight = 600;
    const height = svgHeight - margin.top - margin.bottom;
    const width = svgWidth - margin.left - margin.right;

    const svg = d3.select(svgRef.current).attr('width', svgWidth).attr('height', svgHeight);
    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const [xScaleMin, xScaleMax] = d3.extent(statsForMvps, (d) => d.pass_cmp_perc);
    const xScale = d3
      .scaleLinear()
      .domain([xScaleMin * 0.9, xScaleMax * 1.05])
      .range([height, 0]);

    const [yScaleMin, yScaleMax] = d3.extent(statsForMvps, (d) => d.pass_td_perc);
    const yScale = d3
      .scaleLinear()
      .domain([yScaleMin * 0.9, yScaleMax * 1.05])
      .range([0, width]);

    const circlesGroup = chartGroup.append('g').attr('class', 'circles');

    circlesGroup
      .selectAll('.circle')
      .data(statsForMvps)
      .join('circle')
      .attr('class', 'circle')
      .attr('cx', (d) => xScale(d.pass_cmp_perc))
      .attr('cy', (d) => yScale(d.pass_td_perc))
      .attr('r', 5)
      .attr('fill', (d) => {
        switch (true) {
          case d.year > 2015:
            return 'green';
          case d.year > 2010:
            return 'red';
          case d.year > 2005:
            return 'purple';
          case d.year > 2000:
            return 'orange';
          default:
            return 'blue';
        }
      });

    circlesGroup
      .selectAll('.circle')
      .filter((d) => d.player.includes('Wentz'))
      .append('text')
      .html('Carson');
  }, []);

  console.log(statsForMvps);
  return (
    <div>
      <svg ref={svgRef} />
    </div>
  );
}
