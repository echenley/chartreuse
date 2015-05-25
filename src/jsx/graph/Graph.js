/* @flow */
'use strict';

import d3 from 'd3';
import math from 'mathjs';
// import _ from 'lodash';

// graph modules
import Tooltip from './modules/Tooltip';
import Scale from './modules/Scale';
import Axes from './modules/Axes';

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
    path: '.path'
};

// main svg elements
let graphInner, graphOuter;
let xAxisEl, yAxisEl, pathEl;

let data;

let scales = Scale.create({
    width: width,
    height: height,
    xDomain: [0, 30],
    yDomain: [-5, 5]
});

let axes = Axes.create({
    width: width,
    height: height,
    scales: scales
});

let line = d3.svg.line()
    .x(d => scales.x(d.x))
    .y(d => scales.y(d.y))
    .defined(d => !isNaN(d.x) && !isNaN(d.y) && isFinite(d.y));
    // .interpolate('basis-open');

let zoom = (function() {

    function updateGraph() {
        // remove transform
        pathEl.attr('transform', null);

        // set zoom bounds
        zoom.x(scales.x)
            .y(scales.y);

        graphOuter.call(zoom);

        // plot new bounds
        plot();
    }

    function zoomed() {
        let translate = zoom.translate();
        let scale = zoom.scale();

        // redraw axes
        xAxisEl.call(axes.x);
        yAxisEl.call(axes.y);

        // scale/translate the map rather than redraw every frame
        pathEl.attr(
            'transform',
            `translate(${translate[0]}, ${translate[1]}) scale(${scale})`
        );
    }

    return d3.behavior.zoom()
        .x(scales.x)
        .y(scales.y)
        .on('zoom', zoomed)
        .on('zoomstart', Tooltip.hide)
        .on('zoomend', updateGraph);
})();

let plot = (function() {

    let compiledExp;

    function getDataPoints(exp, xDomain) {
        // number of data samples
        let n = 1500;

        // create an array of points along x-axis
        let xPoints = d3.range(
            xDomain[0],
            xDomain[1],
            Math.abs(xDomain[1] - xDomain[0]) / n
        );

        // get y values and map results to object
        let dataArr = xPoints.map(x => ({
            x: x,
            y: exp.eval({ x: x })
        }));

        // filter out NaN values
        dataArr.filter(d => !isNaN(d.y));

        return dataArr;
    }

    return function plot(newExp) {
        // newExp is optional
        // compile new expression or use previous
        compiledExp = newExp ? math.compile(newExp) : compiledExp;

        // get data from compiled expression
        data = getDataPoints(compiledExp, scales.x.domain());

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
                .ease(d3.ease('linear'))
                .duration(1500)
                .attr('stroke-dashoffset', 0);
        }
    };
})();

function init(selector) {

    // create main svg element and .graph-outer <g>
    graphOuter = d3.select(selector).append('svg')
        .attr('viewBox', `0 0 ${viewbox} ${viewbox}`)
      .append('g')
        .attr('class', 'graph-outer')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .on('mouseover', Tooltip.show)
        .on('mouseout', Tooltip.hide)
        .on('mousemove', function() {
            // d3's magic this binding:
            // this === g.graphOuter DOM node
            Tooltip.update(this, data, scales.x, scales.y);
        })
        .on('click', function() {
            Tooltip.show();
            Tooltip.update(this, data, scales.x, scales.y);
        })
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
        .call(axes.x);

    // append y-axis
    yAxisEl = graphOuter.append('g')
        .attr('class', selectors.yAxis.slice(1))
        .call(axes.y);

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
    Tooltip.init(graphInner);
}

export default {
    init: init,
    plot: plot
};
