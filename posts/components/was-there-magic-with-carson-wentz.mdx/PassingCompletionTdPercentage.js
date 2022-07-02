import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import useMobileSize from './useMobileSize';
import statsForMvpsRaw from './statsForMvps.json';

const statsForMvps = statsForMvpsRaw.map((d) => ({ ...d, id: d.player + d.year }));

const colors = {
  1950: '#ffa600',
  1960: '#ff7c43',
  1970: '#f95d6a',
  1980: '#d45087',
  1990: '#a05195',
  2000: '#665191',
  2010: '#2f4b7c',
  2020: '#003f5c',
};

export default function PassingCompletionTdPercentage() {
  const svgRef = useRef();
  const isMobile = useMobileSize();

  const svgWidth = 600;
  const svgHeight = 600;

  useEffect(() => {
    if (isMobile === undefined) return;
    const margin = { bottom: 40, left: 40, right: 10, top: 10 };
    const height = svgHeight - margin.top - margin.bottom;
    const width = svgWidth - margin.left - margin.right;

    const svg = d3.select(svgRef.current);
    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().domain([33, 0]).range([0, width]);

    const yScale = d3.scaleLinear().domain([33, 0]).range([height, 0]);

    const circlesGroup = chartGroup.append('g').attr('class', 'circles');

    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickValues([1, 6, 11, 16, 21, 26, 31])
      .tickSizeOuter(0);
    const xAxisDraw = chartGroup
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);
    /** y-axis label */
    chartGroup
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left)
      .attr('dy', 12)
      .style('text-anchor', 'middle')
      .text('Rank of touchdowns per pass attempt');
    /** x-axis label */
    chartGroup
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.top})`)
      .attr('dy', 25)
      .style('text-anchor', 'middle')
      .text('Rank of completion percentage');

    const yAxis = d3
      .axisLeft()
      .scale(yScale)
      .tickValues([1, 6, 11, 16, 21, 26, 31])
      .tickSizeOuter(0);
    const yAxisDraw = chartGroup.append('g').attr('class', 'y axis');

    xAxisDraw.call(xAxis);
    yAxisDraw.call(yAxis);

    const gridLineX = d3
      .axisBottom()
      .scale(xScale)
      .tickValues([16])
      .tickSize(height)
      .tickFormat('')
      .tickSizeOuter(0);
    const gridLineY = d3
      .axisLeft()
      .scale(yScale)
      .tickValues([16])
      .tickSize(width)
      .tickFormat('')
      .tickSizeOuter(0);
    const gridLineXDraw = chartGroup.append('g').attr('class', 'x gridlines');
    const gridLineYDraw = chartGroup
      .append('g')
      .attr('class', 'y gridlines')
      .attr('transform', `translate(${width}, 0)`);
    gridLineXDraw.call(gridLineX);
    gridLineYDraw.call(gridLineY);
    const selectedDiv = d3.select('.selected');
    const infoDiv = d3.select('.info');
    if (!isMobile) {
      infoDiv
        .style('top', `${yScale(16) + margin.top}px`)
        .style('left', `${margin.left + xScale(16)}px`)
        .style('width', `${xScale(17) - 1}px`)
        .style('height', `${yScale(17) - 1}px`);
      selectedDiv
        .style('top', `${yScale(16) + margin.top}px`)
        .style('left', `${margin.left + 1}px`)
        .style('width', `${xScale(16) - 1}px`)
        .style('height', `${yScale(17) - 1}px`);
    }
    infoDiv
      .select('.legend')
      .data([colors])
      .join('div')
      .html((d) =>
        Object.entries(d)
          .map(([year, color], i, arr) => {
            const isLast = i === arr.length - 1;
            return `<span style="color: ${color}">${year} - ${
              isLast ? 'Today' : arr[i + 1][0]
            }</span>`;
          })
          .join(''),
      );
    function mouseover() {
      const { id } = d3.select(this).data()[0];
      circlesGroup
        .selectAll('.circle')
        .filter((d) => d.id === id)
        .transition()
        .attr('r', 10);
    }

    function mouseout() {
      const { id } = d3.select(this).data()[0];
      circlesGroup
        .selectAll('.circle')
        .filter((d) => d.id === id)
        .transition()
        .attr('r', 5);
    }

    const updatedSelectionBox = (data) => {
      selectedDiv
        .selectAll('.player')
        .data(data, (d) => d.id)
        .join(
          (enter) =>
            enter
              .append('div')
              .attr('class', 'player')
              .html(
                (d) => `
                  <p>${d.player.replace(/[+*]/g, '')} ${d.year} - Season Ranks:</p>
                  <p>Comp/Att: ${d.passCompletionRank}</p>
                  <p>TD/Att: ${d.tdPercentageRank}</p>

          `,
              )
              .on('mouseover', mouseover)
              .on('mouseout', mouseout),
          (update) => update,
          (exit) => exit.remove(),
        );
    };
    const updateDots = (data) => {
      const selectedPlayers = data.map((d) => d.id);
      circlesGroup.selectAll('.circle').attr('fill-opacity', (d) => {
        const isSelected = selectedPlayers.includes(d.player + d.year);

        return isSelected ? 1 : 0.2;
      });
    };

    const brushed = ({ selection }) => {
      if (selection) {
        const [[x0, y0], [x1, y1]] = selection;
        const selectedPoints = statsForMvps
          .sort((a, b) => d3.ascending(a.tdPercentageRank, b.tdPercentageRank))
          .sort((a, b) => d3.descending(a.passCompletionRank, b.passCompletionRank))
          .filter(
            (d) =>
              x0 <= xScale(d.passCompletionRank) &&
              x1 >= xScale(d.passCompletionRank) &&
              y0 <= yScale(d.tdPercentageRank) &&
              y1 >= yScale(d.tdPercentageRank),
          );
        updatedSelectionBox(selectedPoints);
        updateDots(selectedPoints);
      } else {
        updatedSelectionBox([]);
        circlesGroup.selectAll('.circle').attr('fill-opacity', 1);
      }
    };

    circlesGroup
      .selectAll('.circle')
      .data(statsForMvps)
      .join('circle')
      .attr('class', 'circle')
      .attr('cx', (d) => xScale(d.passCompletionRank))
      .attr('cy', (d) => yScale(d.tdPercentageRank))
      .attr('r', 5)
      .attr('fill', (d) => {
        switch (true) {
          case d.year >= 2020:
            return colors[2020];
          case d.year >= 2010:
            return colors[2010];
          case d.year >= 2000:
            return colors[2000];
          case d.year >= 1990:
            return colors[1990];
          case d.year >= 1980:
            return colors[1980];
          case d.year >= 1970:
            return colors[1970];
          case d.year >= 1960:
            return colors[1960];
          default:
            return colors[1950];
        }
      });

    const brush = d3
      .brush()
      .extent([
        [1, 1],
        [width - 1, yScale(16) - 1],
      ])
      .on('brush end', brushed);

    chartGroup
      .append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, [
        [xScale(28), yScale(0) + 1],
        [xScale(24), yScale(2)],
      ]);
  }, [svgHeight, svgWidth, isMobile]);

  return (
    <div>
      <div className="title">
        <p>Touchdown per attempt vs Completions percentage for all QB MVPs</p>
        <small>Carson Wentz also included</small>
      </div>
      <div className="svg-wrap">
        <svg preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <svg ref={svgRef} />
        </svg>
        <div className="selected">
          <p>Selected Players</p>
        </div>
        <div className="info">
          <p>Chart Information</p>
          <p>No QB MVP has ever ranked below 15 in TD per attempt (Rich Gannon 2002)</p>
          <p>
            <strong>How to use:</strong>
          </p>
          <ul>
            <li>Brush the chart to select players</li>
            <li>
              Hovering/Selecting over the info on the left will increase the size of the
              corresponding circle
            </li>
            <li>The select players section is scrollable</li>
            <li>By default, Wentz and Newton are selected</li>
            <li>Some dots are on top of one another</li>
          </ul>
          <p>Chart colors are by decade:</p>
          <div className="legend" />
        </div>
      </div>
      <style jsx>{`
        .title {
          font-size: 20px;
          text-align: center;
        }
        .title p,
        small {
          margin: 0;
        }
        .svg-wrap {
          position: relative;
        }
        .gridlines .tick line {
          stroke: #ccc;
        }
        .selected,
        .info {
          position: absolute;
          background: #fafafa;
          overflow-y: auto;
          padding: 5px;
          font-size: 12px;
        }

        @media screen and (max-width: 600px) {
          .selected,
          .info {
            position: relative;
            background: #fafafa;
            overflow-y: auto;
            padding: 5px;
            font-size: 12px;
          }
        }

        .legend span {
          margin-right: 10px;
          whitespace: nowrap;
          display: inline-block;
        }
        .selected .player {
          padding: 5px;
          border: 1px solid #333;
          border-radius: 5;
          margin-bottom: 10px;
        }
        .selected p,
        .info p,
        .info ul {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
