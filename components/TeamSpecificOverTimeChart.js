import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import teamColors from 'colors/teamColors';
import jsonStats from 'stats/byYearStats.json';
import useMobileSize from 'hooks/useMobileSize';

const optionStats = [
  { label: 'Pass yards', stat: 'pass_yds' },
  { label: 'Pass completions', stat: 'pass_cmp' },
  { label: 'Interceptions', stat: 'pass_int' },
  { label: 'Pass attempts', stat: 'pass_att' },
  { label: 'Pass TDs', stat: 'pass_td' },
  { label: 'Rush yards', stat: 'rush_yds' },
  { label: 'Rush yards / attempt', stat: 'rush_yds_per_att' },
  { label: 'Rush TDs', stat: 'rush_td' },
  { label: 'First downs', stat: 'first_down' },
  { label: 'Fumbles lost', stat: 'fumbles_lost' },
  { label: 'Penalties', stat: 'penalties' },
];

const teams = Object.keys(teamColors);
const statsByTeam = teams.reduce((obj, name) => {
  const teamStatsByYear = Object.entries(jsonStats).reduce(
    (teamArr, [year, arr]) => [
      ...teamArr,
      { ...arr.find((a) => a.currentTeamName === name), year: new Date(year, 0) },
    ],
    [],
  );
  return { ...obj, [name]: teamStatsByYear };
}, {});

const allMetricsAcrossAllYears = Object.values(jsonStats).reduce((arr, t) => [...arr, ...t], []);

const years = [
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
  '2011',
  '2010',
];

const svgWidthBig = 800;
const svgHeightBig = 600;

const svgWidthSm = 420;
const svgHeightSm = 600;

const TeamOverTimeChart = () => {
  const svgRef = useRef();
  const isMobile = useMobileSize();
  const svgWidth = isMobile ? svgWidthSm : svgWidthBig;
  const svgHeight = isMobile ? svgHeightSm : svgHeightBig;

  useEffect(() => {
    const margin = { bottom: 20, left: 50, right: 40, top: 20 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    const g = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain([new Date(d3.min(years), 0), new Date(d3.max(years), 0)])
      .range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
    const xAxisDraw = g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);
    const gradient = g
      .append('defs')
      .append('linearGradient')
      .attr('id', 'teamGradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    const yAxisDraw = g.append('g').attr('class', 'y axis');
    const areaGen = d3
      .area()
      .x((d) => xScale(d.year))
      .y0(height)
      .curve(d3.curveNatural);
    const lineGen = d3
      .line()
      .x((d) => xScale(d.year))
      .curve(d3.curveNatural);

    let metric = 'pass_yds';
    let team = teams[0];
    const updateChart = () => {
      // scales
      const stats = statsByTeam[team];
      const [min, max] = d3.extent(allMetricsAcrossAllYears, (d) => d[metric]);

      yScale.domain([min * 0.7, max * 1.15]);
      gradient
        .selectAll('stop')
        .data([teamColors[team][0], teamColors[team][1]])
        .join('stop')
        .style('stop-color', (d) => d)
        .attr('offset', (d, i) => `${100 * (i / (2 - 1))}%`);

      g.selectAll('.area')
        .data([stats], (d) => d.year)
        .join(
          (enter) => {
            enter
              .append('path')
              .style('opacity', 0.8)
              .attr('class', 'area')
              .style('fill', `url(#teamGradient)`)
              .attr(
                'd',
                areaGen.y1((d) => yScale(d[metric])),
              );
          },
          (update) =>
            update
              .transition()
              .duration(500)
              .style('fill', `url(#teamGradient)`)
              .attr(
                'd',
                areaGen.y1((d) => yScale(d[metric])),
              ),
          (exit) => exit.remove(),
        );
      g.selectAll('.topLine')
        .data([stats], (d) => d.year)
        .join(
          (enter) => {
            enter
              .append('path')
              .attr('class', 'topLine')
              .style('stroke', teamColors[team][0])
              .style('stroke-width', 5)
              .style('fill', 'none')
              .attr(
                'd',
                lineGen.y((d) => yScale(d[metric])),
              );
          },
          (update) =>
            update
              .transition()
              .duration(500)
              .style('stroke', teamColors[team][0])
              .attr(
                'd',
                lineGen.y((d) => yScale(d[metric])),
              ),
          (exit) => exit.remove(),
        );
      g.selectAll('.circle')
        .data(stats, (d) => d.year)
        .join(
          (enter) => {
            enter
              .append('circle')
              .attr('class', 'circle')
              .attr('cx', (d) => xScale(d.year))
              .attr('cy', (d) => yScale(d[metric]))
              .attr('r', 5)
              .style('stroke-width', 2)
              .style('stroke', teamColors[team][0])
              .style('fill', teamColors[team][1]);
          },
          (update) =>
            update
              .transition()
              .duration(500)
              .attr('cx', (d) => xScale(d.year))
              .attr('cy', (d) => yScale(d[metric]))
              .style('stroke', teamColors[team][0])
              .style('fill', teamColors[team][1]),
          (exit) => exit.remove(),
        );

      g.selectAll('.playoffText')
        .data(
          stats.filter((d) => !!d.playoffFinish),
          (d) => d.year,
        )
        .join(
          (enter) => {
            enter
              .append('text')
              .attr('class', 'playoffText')
              .attr('x', (d) => xScale(d.year))
              .attr('y', (d) => yScale(d[metric]) - 15)
              .style('text-anchor', 'middle')
              .html('Playoff');
          },
          (update) =>
            update
              .transition()
              .duration(500)
              .attr('x', (d) => xScale(d.year))
              .attr('y', (d) => yScale(d[metric])),
          (exit) => exit.remove(),
        );

      xAxisDraw.transition().duration(500).call(xAxis.scale(xScale));
      yAxisDraw.transition().duration(500).call(yAxis.scale(yScale));

      const statSelected = optionStats.find((o) => o.stat === metric);
      d3.select('#byTeamChartTitle').html(`
        <h2>${statSelected.label} over time for ${team}</h2>
      `);
    };
    updateChart(team, metric);
    d3.select('#statSelectByTeam').on('change', (e) => {
      metric = e.target.value;
      updateChart(team, metric);
    });
    d3.select('#teamSelectByTeam').on('change', (e) => {
      team = e.target.value;
      updateChart(team, metric);
    });
    return () => {
      g.remove();
    };
  }, [svgHeight, svgWidth]);
  return (
    <div>
      <select name="team" id="teamSelectByTeam">
        {teams.map((team) => (
          <option key={`option-${team}`} value={team}>
            {team}
          </option>
        ))}
      </select>
      <select name="stat" id="statSelectByTeam">
        {optionStats.map((stat) => (
          <option key={`option-${stat.stat}`} value={stat.stat}>
            {stat.label}
          </option>
        ))}
      </select>
      <div>
        <div id="byTeamChartTitle" />
        <svg preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <svg ref={svgRef} />
        </svg>
      </div>
    </div>
  );
};

export default TeamOverTimeChart;
