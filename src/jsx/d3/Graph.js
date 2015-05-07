'use strict';

import d3 from 'd3';

// main svg element
let svg;

// size is arbitrary, scales with viewport
let viewbox = 1000;
let defaultMargin = { top: 40, right: 40, left: 40, bottom: 40 };

let defaults = {
    xDomain: [0, 10],
    yDomain: [0, 10],
    margin: defaultMargin,
    outerWidth: viewbox,
    outerHeight: viewbox,
    innerWidth: viewbox - defaultMargin.left - defaultMargin.right,
    innerHeight: viewbox - defaultMargin.top - defaultMargin.bottom
};

let line = d3.svg.line()
    .defined(d => !isNaN(d.x) && !isNaN(d.y))
    .x(d => d.x)
    .y(d => d.y)
    .interpolate('basis');

function setAxes(xDomain, yDomain) {
    // inner width/height
    let width = defaults.innerWidth;
    let height = defaults.innerHeight;

    let x = d3.scale.linear()
        .domain(xDomain)
        .range([0, width]);

    let y = d3.scale.linear()
        .domain(yDomain)
        .range([height, 0]);

    let xAxis = d3.svg.axis()
        .scale(x)
        .tickPadding(12)
        .orient('bottom');

    let yAxis = d3.svg.axis()
        .scale(y)
        .tickPadding(12)
        .orient('left');

    svg.select('.x-axis')
        .call(xAxis);

    svg.select('.y-axis')
        .call(yAxis);
}

function getDataPoints(fn) {
    let xDomain = defaults.xDomain;
    let yDomain = defaults.yDomain;

    let width = defaults.innerWidth;
    let height = defaults.innerHeight;

    // number of data samples
    let n = 200;

    let xScale = d3.scale.linear()
        .domain(xDomain)
        .range([0, width]);

    let yScale = d3.scale.linear()
        .domain(yDomain)
        .range([height, 0]);

    // create an array of points along x-axis
    let xPoints = d3.range(xDomain[0], xDomain[1], xDomain[1] / n);

    return xPoints.map(x => {
        let scaledX = xScale(x);
        let scaledY = yScale(fn(x));

        return {
            x: scaledX,
            y: scaledY
        };
    }).filter(x => !!x);
}

function plot(fn) {
    let transition = svg.transition();
    let data = getDataPoints(fn);

    setAxes(defaults.xDomain, defaults.yDomain);

    transition.select('.line')
        .duration(400)
        .attr('d', line(data));
}

function init(selector) {
    let margin = defaults.margin;

    svg = d3.select(selector).append('svg')
        .attr('viewBox', '0 0 ' + defaults.outerHeight + ' ' + defaults.outerWidth)
        .append('g')
            .attr('class', 'graph-inner')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // append x-axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + defaults.innerHeight + ')');

    // append y-axis
    svg.append('g')
        .attr('class', 'y-axis');

    // append function path
    svg.append('path')
        .attr('class', 'line');

    // svg.append('g')
    //     .attr('class', 'grid')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call()
}


export default {
    init: init,
    plot: plot
};