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

const TeamCharts = () => {
  const svgRef = useRef();
  const isMobile = useMobileSize();
  const svgWidth = isMobile ? svgWidthSm : svgWidthBig;
  const svgHeight = isMobile ? svgHeightSm : svgHeightBig;
  useEffect(() => {
    const margin = { bottom: 20, left: 5, right: 10, top: 20 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    const g = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleBand().range([0, height]).padding(0.1);

    const xAxis = d3.axisTop(xScale).tickSizeOuter(0);
    const yAxis = d3.axisRight(yScale).tickSize(0);
    const bars = g.append('g').attr('class', 'bars');
    const xAxisDraw = g.append('g').attr('class', 'x axis');
    const yAxisDraw = g.append('g').attr('class', 'y axis');
    let metric = 'pass_yds';
    let year = '2021';
    const updateChart = () => {
      // scales
      const stats = jsonStats[year].sort((a, b) => d3.descending(a[metric], b[metric]));
      const [min, max] = d3.extent(stats, (d) => d[metric]);
      xScale.domain([min * 0.6, max * 1.1]);
      yScale.domain(stats.map((d) => d.currentTeamName));

      bars
        .selectAll('.bar')
        .data(stats, (d) => d.currentTeamName)
        .join(
          (enter) => {
            enter
              .append('rect')
              .attr('class', 'bar')
              .style('fill', (d) => teamColors[d.currentTeamName][0])
              .attr('height', yScale.bandwidth())
              .attr('x', 0)
              .attr('y', (d) => yScale(d.currentTeamName))
              .transition()
              .duration(500)
              .attr('width', (d) => xScale(d[metric]));
          },
          (update) =>
            update
              .transition()
              .duration(500)
              .attr('y', (d) => yScale(d.currentTeamName))
              .attr('width', (d) => xScale(d[metric])),
          (exit) => exit.remove(),
        )
        .attr('class', 'bar')
        .style('fill', (d) => teamColors[d.currentTeamName][0])
        .attr('height', yScale.bandwidth())
        .attr('x', 0)
        .transition()
        .duration(500)
        .attr('y', (d) => yScale(d.currentTeamName))
        .attr('width', (d) => xScale(d[metric]));
      bars
        .selectAll('.playoff')
        .data(
          stats.filter((t) => !!t.playoffFinish),
          (d) => d.currentTeamName,
        )
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('class', 'playoff')
              .html('Playoffs')
              .attr('dominant-baseline', 'middle')
              .style('font-size', `${yScale.bandwidth() / 2}px`)
              .transition()
              .duration(500)
              .attr('x', (d) => xScale(d[metric]) + 5)
              .attr(
                'y',
                (d) =>
                  yScale(d.currentTeamName) + yScale.bandwidth() / 2 + yScale(yScale.domain()[0]),
              ),
          (update) =>
            update
              .transition()
              .duration(500)
              .attr('x', (d) => xScale(d[metric]) + 5)
              .attr(
                'y',
                (d) => yScale(d.currentTeamName) + yScale.bandwidth() / 2 + yScale.paddingOuter(),
              ),
          (exit) => exit.remove(),
        );
      yAxis.tickFormat((d) => {
        const team = stats.find((t) => t.currentTeamName === d);
        return `${d} (${team.conferencePlace})`;
      });
      xAxisDraw.transition().duration(500).call(xAxis.scale(xScale));
      yAxisDraw
        .transition()
        .duration(500)
        .call(yAxis.scale(yScale))
        .selectAll('text')
        .each((name, i, arrText) => {
          const bgColor = teamColors[name][0];
          const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
          const red = parseInt(color.substring(0, 2), 16); // hexToR
          const green = parseInt(color.substring(2, 4), 16); // hexToG
          const blue = parseInt(color.substring(4, 6), 16); // hexToB
          const fillColor = red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? '#000' : '#fff';

          d3.select(arrText[i]).attr('fill', fillColor);
        });
      const statSelected = optionStats.find((o) => o.stat === metric);
      d3.select('.teamChartTitle').html(`
        <h2>${statSelected.label} by team for ${year}</h2>
      `);
    };
    updateChart(year, metric);
    d3.select('#statSelect').on('change', (e) => {
      metric = e.target.value;
      updateChart(year, metric);
    });
    d3.select('#yearSelect').on('change', (e) => {
      year = e.target.value;
      updateChart(year, metric);
    });
    return () => {
      bars.remove();
      xAxisDraw.remove();
      yAxisDraw.remove();
    };
  }, [svgHeight, svgWidth]);
  return (
    <div>
      <select name="year" id="yearSelect">
        {years.map((year) => (
          <option key={`option-${year}`} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select name="stat" id="statSelect">
        {optionStats.map((stat) => (
          <option key={`option-${stat.stat}`} value={stat.stat}>
            {stat.label}
          </option>
        ))}
      </select>
      <div>
        <div className="teamChartTitle" />
        <svg preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <svg ref={svgRef} />
        </svg>
      </div>
    </div>
  );
};

export default TeamCharts;
