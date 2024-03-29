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
  { label: 'Rush yards per attempt', stat: 'rush_yds_per_att' },
  { label: 'Rush TDs', stat: 'rush_td' },
  { label: 'First downs', stat: 'first_down' },
  { label: 'Fumbles lost', stat: 'fumbles_lost' },
  { label: 'Penalties', stat: 'penalties' },
  { label: 'Points', stat: 'points' },
  { label: 'Total yards', stat: 'total_yards' },
  { label: 'Offensive plays', stat: 'plays_offense' },
  { label: 'Yards per play', stat: 'yds_per_play_offense' },
  { label: 'Turnovers', stat: 'turnovers' },
  { label: 'Net yards per attempt', stat: 'pass_net_yds_per_att' },
  { label: 'Passing first downs', stat: 'pass_fd' },
  { label: 'Rushing attempts', stat: 'rush_att' },
  { label: 'Rushing first downs', stat: 'rush_fd' },
  { label: 'Penalty yards', stat: 'penalties_yds' },
  { label: 'Penalty first downs', stat: 'pen_fd' },
  { label: 'Percent of drives ending in a TD', stat: 'score_pct' },
  { label: 'Percent of drives ending in a turnover', stat: 'turnover_pct' },
];
const years = Object.keys(jsonStats).reverse();

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
    let year = '2022';
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
        return `${d} ${team.conferencePlace ? `(${team.conferencePlace})` : ''}`;
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
      <div>
        <div className="teamChartTitle" />
        <small>
          Conference place finish is next to the team name. Whether or not they made the play-offs
          is indicated with the {`"Playoffs"`} text
        </small>
        <div className="selectControls">
          <label htmlFor="yearSelect">
            <p>Select a year</p>
            <select name="year" id="yearSelect">
              {years.map((year) => (
                <option key={`option-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="statSelect">
            <p>Select a stat</p>
            <select name="stat" id="statSelect">
              {optionStats.map((stat) => (
                <option key={`option-stat-${stat.stat}`} value={stat.stat}>
                  {stat.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <svg preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <svg ref={svgRef} />
        </svg>
      </div>
      <style jsx>{`
        select {
          padding: 8px 4px 8px 2px;
          min-width: 100px;
        }
        .selectControls {
          display: flex;
          align-items: center;
          margin: 20px 0;
        }
        .selectControls > label:first-child {
          margin-right: 20px;
        }
        .selectControls p {
          margin-bottom: 5px;
        }
        @media only screen and (max-width: 600px) {
          .selectControls {
            flex-direction: column;
            align-items: flex-start;
          }
          .selectControls > label:first-child {
            margin-right: 0;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default TeamCharts;
