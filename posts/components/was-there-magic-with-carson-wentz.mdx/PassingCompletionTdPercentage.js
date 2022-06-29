import { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import statsForMvps from './statsForMvps.json';

export default function PassingCompletionTdPercentage() {
  const svgRef = useRef();

  useLayoutEffect(() => {
    const margin = { bottom: 30, left: 20, right: 10, top: 10 };
    const svgWidth = 600;
    const svgHeight = 600;
    const height = svgHeight - margin.top - margin.bottom;
    const width = svgWidth - margin.left - margin.right;

    const svg = d3.select(svgRef.current).attr('width', svgWidth).attr('height', svgHeight);
    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().domain([32, 1]).range([0, width]);

    const yScale = d3.scaleLinear().domain([32, 1]).range([height, 0]);

    const circlesGroup = chartGroup.append('g').attr('class', 'circles');
    const labelGroup = chartGroup.append('g').attr('class', 'labels');

    const xAxis = d3.axisBottom().scale(xScale).tickValues([1, 6, 11, 16, 21, 26, 31]);
    const xAxisDraw = chartGroup
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);

    const yAxis = d3.axisLeft().scale(yScale).tickValues([1, 6, 11, 16, 21, 26, 31]);
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
    labelGroup
      .selectAll('text')
      .data(statsForMvps.filter((d) => d.passCompletionRank >= 16 || d.tdPercentageRank >= 16))
      .join('text')
      .attr('x', (d) => xScale(d.passCompletionRank))
      .attr('y', (d) => yScale(d.tdPercentageRank) + 20)
      .html((d) => `${d.player.replace(/[*+]/g, '')} ${d.year}`);
  }, []);

  console.log(statsForMvps);
  return (
    <div>
      <svg ref={svgRef} />
    </div>
  );
}
