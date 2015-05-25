/* @flow */
'use strict';

import d3 from 'd3';
import math from 'mathjs';
// import _ from 'lodash';

// import zoom from 'modules/zoom';

// GRAPH DIMENSIONS
// size/margin is arbitrary, scales with viewport
const viewbox = 1000;
const margin = { top: 80, right: 80, left: 80, bottom: 80 };
const width = viewbox - margin.left - margin.right;
const height = viewbox - margin.top - margin.bottom;

const selectors = {
    graphContainer: '.graph',
    graphInner: '.graph-inner',
    xAxis: '.x-axis',
    yAxis: '.y-axis',
    path: '.path',
    tooltip: '.tooltip',
    tooltipBg: '.tooltip-bg'
};

// main svg elements
let graphInner, graphOuter;
let xAxisEl, yAxisEl, pathEl;
let tooltip;

let data;

let xScale = makeScale([0, 30], [0, width]);
let yScale = makeScale([0, 5], [height, 0]);

let xAxis = makeAxis(xScale, 'bottom', -width);
let yAxis = makeAxis(yScale, 'left', -height);

let bisectX = d3.bisector(d => d.x).left;

let line = d3.svg.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .defined(d => !isNaN(d.x) && !isNaN(d.y));
    // .interpolate('basis-open');

let zoom = (function() {

    function updateGraph() {
        // remove transform
        pathEl.attr('transform', null);

        // set zoom bounds
        zoom.x(xScale)
            .y(yScale);

        graphOuter.call(zoom);

        // plot new bounds
        plot();
    }

    function zoomed() {
        let translate = zoom.translate();
        let scale = zoom.scale();

        // redraw axes
        xAxisEl.call(xAxis);
        yAxisEl.call(yAxis);

        // scale/translate the map rather than redraw every frame
        pathEl.attr('transform', `translate(${translate[0]}, ${translate[1]}) scale(${scale})`);
    }

    return d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .on('zoom', zoomed)
        .on('zoomend', updateGraph);
})();

let plot = (function() {

    let compiledExp;

    function getDataPoints(exp, xDomain) {
        // number of data samples
        let n = 1500;

        // create an array of points along x-axis
        let xPoints = d3.range(xDomain[0], xDomain[1], Math.abs(xDomain[1] - xDomain[0]) / n);

        // get y values and map results to object
        return xPoints.map(x => ({
            x: x,
            y: exp.eval({ x: x })
        })).filter(d => !isNaN(d.y));
    }

    return function plot(newExp) {
        // newExp is optional
        // compile new expression or use previous
        compiledExp = newExp ? math.compile(newExp) : compiledExp;

        // get data from compiled expression
        data = getDataPoints(compiledExp, xScale.domain());

        // update pathEl and remove stroke attributes
        pathEl.attr('d', line(data))
            .attr('stroke-dasharray', null)
            .attr('stroke-dashoffset', null);

        if (newExp) {
            // if a new expression is passed, animate it in

            // get length
            let pathLength = pathEl.node().getTotalLength();

            // draw line
            pathEl.attr('stroke-dasharray', `${pathLength} ${pathLength}`)
                .attr('stroke-dashoffset', pathLength)
                .transition()
                .duration(2000)
                .attr('stroke-dashoffset', 0);
        }
    };
})();

function makeScale(domain, range) {
    return d3.scale.linear()
        .domain(domain)
        .range(range);
}

function makeAxis(scale, orient, tickSize) {
    return d3.svg.axis()
        .scale(scale)
        .orient(orient)
        .tickPadding(12)
        .tickFormat(function(d) {
            var prefix = d3.formatPrefix(d);
            // limit numbers to 4 decimal places
            return Number(prefix.scale(d).toFixed(4)).toString() + prefix.symbol;
        })
        .tickSize(tickSize);
}

function setTooltip() {
    let nearestDataPoint;

    // get x-coordinate
    let x = xScale.invert(d3.mouse(this)[0]);

    // get index within data array
    let i = bisectX(data, x);

    // get data values to the left and right of cursor position
    let left = data[i - 1];
    let right = data[i];

    if (left && right) {
        nearestDataPoint = x - left.date > right.date - x ? right : left;
    } else {
        // one or the other doesn't exist
        nearestDataPoint = left || right;
    }

    // position tooltip and set text
    tooltip.attr('transform', `translate(${xScale(nearestDataPoint.x)}, ${yScale(nearestDataPoint.y)})`);
    tooltip.select('.x-value').text(`x: ${nearestDataPoint.x}`);
    tooltip.select('.y-value').text(`y: ${nearestDataPoint.y}`);

    // reset bg so previous styles don't interfere with .getBBox()
    tooltip.select(selectors.tooltipBg)
        .attr('width', 0)
        .attr('height', 0);

    // get bounds of tooltip
    let tooltipRect = tooltip[0][0].getBBox();

    // set bg
    // 5px padding is where the 10s come from
    tooltip.select(selectors.tooltipBg)
        .attr('x', tooltipRect.x + 10)
        .attr('y', tooltipRect.y + 10)
        .attr('width', tooltipRect.width)
        .attr('height', tooltipRect.height);
}

function init(selector) {

    // create main svg element and .graph-outer <g>
    graphOuter = d3.select(selector).append('svg')
        .attr('viewBox', `0 0 ${viewbox} ${viewbox}`)
      .append('g')
        .attr('class', 'graph-outer')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .on('mouseover', () => tooltip.style('display', null))
        .on('mouseout', () => tooltip.style('display', 'none'))
        .on('mousemove', setTooltip)
        .call(zoom);

    // append underlay
    graphOuter.append('svg:rect')
        .attr('class', 'underlay')
        .attr('width', width)
        .attr('height', height);

    // append x-axis
    xAxisEl = graphOuter.append('g')
        .attr('class', selectors.xAxis.slice(1))
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    // append y-axis
    yAxisEl = graphOuter.append('g')
        .attr('class', selectors.yAxis.slice(1))
        .call(yAxis);

    // set clip
    graphOuter.append('defs').append('svg:clipPath')
        .attr('id', 'clip')
      .append('svg:rect')
        .attr('id', 'clip-rect')
        .attr('x', '0')
        .attr('y', '0')
        .attr('width', width)
        .attr('height', height);

    graphInner = graphOuter.append('g')
        .attr('class', selectors.graphInner.slice(1))
        .attr('clip-path', 'url(#clip)');

    // append function path
    pathEl = graphInner.append('svg:path')
        .attr('class', selectors.path.slice(1));

    // append tooltip
    tooltip = graphInner.append('g')
        .attr('class', selectors.tooltip.slice(1))
        .style('display', 'none');

    // tooltip background
    tooltip.append('svg:rect')
        .attr('class', selectors.tooltipBg.slice(1));

    // tooltip circle
    tooltip.append('circle')
        .attr('r', 5);

    // tooltip x value
    tooltip.append('text')
        .attr('class', 'x-value')
        .attr('x', 15)
        .attr('y', 25)
        .attr('dy', '0.35em');

    // tooltip y value
    tooltip.append('text')
        .attr('class', 'y-value')
        .attr('transform', 'translate(0, 24)')
        .attr('x', 15)
        .attr('y', 25)
        .attr('dy', '0.35em');
}

export default {
    init: init,
    plot: plot
};
