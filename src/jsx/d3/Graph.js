'use strict';

import d3 from 'd3';
import math from 'mathjs';
import _ from 'lodash';

// main svg elements
let graphInner, graphOuter;

// size/margin is arbitrary, scales with viewport
let viewbox = 1000;
let margin = { top: 80, right: 80, left: 80, bottom: 80 };
let width = viewbox - margin.left - margin.right;
let height = viewbox - margin.top - margin.bottom;
let expression;

let xScale = makeScale([0, 30], [0, width]);
let yScale = makeScale([0, 5], [height, 0]);

let xAxis = makeAxis(xScale, 'bottom', -width);
let yAxis = makeAxis(yScale, 'left', -height);

let selectors = {
    graphInner: '.graph-inner',
    xAxis: '.x-axis',
    yAxis: '.y-axis',
    path: '.path'
};

let zoom = (function() {

    function updateGraph() {
        // remove transform
        graphInner.select(selectors.path)
            .attr('transform', null);

        zoom.x(xScale)
            .y(yScale);
        graphOuter.call(zoom);

        // plot new bounds
        plot(true);
    }

    let zoomed = _.throttle(function zoomed() {
        let translate = zoom.translate();
        let scale = zoom.scale();

        graphOuter.select(selectors.xAxis).call(xAxis);
        graphOuter.select(selectors.yAxis).call(yAxis);
        graphInner.select(selectors.path)
            .attr('transform', 'translate(' +
                translate[0] + ',' +
                translate[1] +
            ') scale(' + scale + ')');
    }, 16);

    return d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .on('zoom', zoomed)
        .on('zoomend', updateGraph);
})();

let path = d3.svg.line()
    .x(d => d.x)
    .y(d => d.y)
    .defined(d => !isNaN(d.x) && !isNaN(d.y));
    // .interpolate('basis');

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

function getDataPoints() {
    let xDomain = xScale.domain();

    // number of data samples
    let n = 1000;

    // create an array of points along x-axis
    let xPoints = d3.range(xDomain[0], xDomain[1], Math.abs(xDomain[1]) / n);

    // get y values and map results to object
    return xPoints.map(x => ({
        x: xScale(x),
        y: yScale(expression.eval({ x: x }))
    }));
}

function plot(noAnimate) {
    let data = getDataPoints();

    if (noAnimate) {
        graphInner.select(selectors.path)
            .attr('d', path(data));
    } else {
        let transition = graphInner.transition();

        transition.select(selectors.path)
            .duration(400)
            .attr('d', path(data));
    }
}

function init(selector) {

    graphOuter = d3.select(selector).append('svg')
        .attr('viewBox', '0 0 ' + viewbox + ' ' + viewbox)
      .append('g')
        .attr('class', 'graph-outer')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);

    // append background (this is necessary for the drag/zoom mechanic?)
    // http://stackoverflow.com/a/17198478/3648823
    graphOuter.append('rect')
        .attr('width', width)
        .attr('height', height);

    // append x-axis
    graphOuter.append('g')
        .attr('class', selectors.xAxis.slice(1))
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    // append y-axis
    graphOuter.append('g')
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
    graphInner.append('svg:path')
        .attr('class', selectors.path.slice(1));
}

export default {
    init: init,
    plot: function methodName(exp) {
        expression = math.compile(exp);
        plot();
    }
};
