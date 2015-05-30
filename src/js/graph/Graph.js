/* @flow */
'use strict';

import d3 from 'd3';
import math from 'mathjs';
import find from 'lodash/collection/find';

// graph modules
import Tooltip from './modules/Tooltip';
import Scale from './modules/Scale';
import Axes from './modules/Axes';

// GRAPH DIMENSIONS
// size/margin is arbitrary, scales with viewport
const viewbox = 1000;
const margin = { top: 80, right: 80, left: 80, bottom: 80 };
const width = viewbox - margin.left - margin.right;
const height = viewbox - margin.top - margin.bottom;

const classes = {
    graphContainer: 'graph',
    graphInner: 'graph-inner',
    xAxis: 'x-axis',
    yAxis: 'y-axis'
};

// main svg elements
let graphOuter, graphInner, pathWrap;
let xAxisEl, yAxisEl;

// [{ signature, func, node }]
let expressions = [];

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

let zoom = (function() {

    function updateGraph() {
        // remove transform
        pathWrap.attr('transform', null);

        // set zoom bounds
        zoom.x(scales.x)
            .y(scales.y);

        graphOuter.call(zoom);

        // plot new bounds
        Plot.update();
    }

    function zoomed() {
        let translate = zoom.translate();
        let scale = zoom.scale();

        // redraw axes
        xAxisEl.call(axes.x);
        yAxisEl.call(axes.y);

        // scale/translate the map rather than redraw every frame
        pathWrap.attr(
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

let Plot = (function Plot() {

    let line = d3.svg.line()
        .x(d => scales.x(d.x))
        .y(d => scales.y(d.y))
        .defined(isReal);

    // TODO: add customizable interpolation in UI
    // .interpolate('basis-open');

    function isReal(d) {
        return !isNaN(d.x) && !isNaN(d.y) && isFinite(d.y) &&
            // e notation breaks <path d="">
            d.y <= 1e21;
    }

    function getDataPoints(func, xDomain) {
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
            y: func.eval({ x: x })
        }));

        // filter out NaN values here vs .defined()?
        // dataArr.filter(d => !isNaN(d.y));

        return dataArr;
    }

    function plot(exp, draw?) {
        // draw is optional

        // get data from compiled expression
        exp.data = getDataPoints(exp.func, scales.x.domain());

        // update path data and remove stroke attributes
        exp.node.attr('d', line(exp.data))
            .attr('stroke-dasharray', null)
            .attr('stroke-dashoffset', null);

        if (draw) {
            // get length
            let pathLength = exp.node.node().getTotalLength();

            // draw line
            exp.node.attr('stroke-dasharray', `${pathLength} ${pathLength}`)
                .attr('stroke-dashoffset', pathLength)
                .transition()
                .ease(d3.ease('linear'))
                .duration(1500)
                .attr('stroke-dashoffset', 0);
        }
    }

    function update() {
        expressions.forEach(x => plot(x));
    }

    function remove(signature) {
        let oldExp = find(expressions, exp => signature === exp.signature);

        // remove fn from expressions
        expressions = expressions.filter(exp => signature !== exp.signature);

        // remove node
        oldExp.node.remove();
    }

    function add(signature) {

        // create path for new function
        let node = pathWrap.append('svg:path')
            .attr('class', 'path');

        let exp = {
            signature: signature,
            func: math.compile(signature),
            node: node
        };

        expressions.push(exp);

        // render expressions
        plot(exp, true);
    }

    return {
        add: add,
        remove: remove,
        update: update
    };
})();

function init(selector) {

    // create main svg element and .graph-outer <g>
    graphOuter = d3.select(selector).append('svg')
        .attr('viewBox', `0 0 ${viewbox} ${viewbox}`)
      .append('g')
        .attr('class', 'graph-outer')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        // .on('mouseover', Tooltip.show)
        // .on('mouseout', Tooltip.hide)
        // .on('mousemove', function() {
        //     // d3's magic this binding:
        //     // this === g.graphOuter DOM node
        //     Tooltip.update(this, data, scales.x, scales.y);
        // })
        // .on('click', function() {
        //     Tooltip.show();
        //     Tooltip.update(this, data, scales.x, scales.y);
        // })
        .call(zoom);

    // append underlay
    graphOuter.append('svg:rect')
        .attr('class', 'underlay')
        .attr('width', width)
        .attr('height', height);

    // append x-axis
    xAxisEl = graphOuter.append('g')
        .attr('class', classes.xAxis)
        .attr('transform', `translate(0, ${height})`)
        .call(axes.x);

    // append y-axis
    yAxisEl = graphOuter.append('g')
        .attr('class', classes.yAxis)
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
        .attr('class', classes.graphInner)
        .attr('clip-path', 'url(#clip)');

    pathWrap = graphInner.append('g');

    // append tooltip
    Tooltip.init(graphInner);
}

export default {
    init: init,
    plot: Plot.add,
    remove: Plot.remove
};
