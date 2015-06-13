'use strict';

import d3 from 'd3';

const selectors = {
    tooltip: '.tooltip',
    tooltipBg: '.tooltip-bg'
};

let circleRadius = 5;
let offset = circleRadius * 2;
let padding = { x: 8, y: 5 };

let bisectX = d3.bisector(d => d.x).left;

// svg elements
let container, tooltip, tooltipBg, circle, xValue, yValue;
// let tooltips = [];

let hidden = true;

function isWithinBounds(y, domain) {
    return !isNaN(y) && y > domain[0] && y < domain[1];
}

function getNearestDataPoint(data, x) {
    // get index within data array
    let i = bisectX(data, x);

    // get data values to the left and right of cursor position
    let left = data[i - 1];
    let right = data[i];

    if (left && right) {
        // both exist, choose nearest
        return x - left.x > right.x - x ? right : left;
    }

    // one or the other doesn't exist
    return left || right;
}

function update(data, scales) {
    // get mouse coordinates
    let mouseCoords = d3.mouse(container[0][0]);

    // get scaled x-coordinate of mouse
    let mouseX = scales.x.invert(mouseCoords[0]);

    // get nearest data point to mouseX
    let nearestDataPoint = getNearestDataPoint(data, mouseX);

    // get translate values for tooltip
    let translateX = scales.x(nearestDataPoint.x);
    let translateY;

    if (isWithinBounds(nearestDataPoint.y, scales.y.domain())) {
        // data point is on the chart
        // position tooltip at point
        circle.style('opacity', null);
        translateY = scales.y(nearestDataPoint.y);
    } else {
        // if data point isNaN or is off the chart
        // hide the circle
        // position tooltip at cursor
        circle.style('opacity', 0);
        translateY = mouseCoords[1];
    }

    // position tooltip and set text
    tooltip.attr(
        'transform',
        `translate(${translateX}, ${translateY})`
    );

    xValue.text(`x: ${nearestDataPoint.x}`);
    yValue.text(`y: ${nearestDataPoint.y}`);

    // reset bg dimensions so previous styles don't interfere with .getBBox()
    tooltipBg.attr('width', 0).attr('height', 0);

    // get bounds of tooltip
    let tooltipRect = tooltip[0][0].getBBox();

    // position bg
    tooltipBg
        .attr('x', tooltipRect.x + offset)
        .attr('y', tooltipRect.y + offset)
        .attr('width', tooltipRect.width - offset + padding.x * 2)
        .attr('height', tooltipRect.height - offset + padding.y * 2);
}

function toggle() {
    hidden = !hidden;
    tooltip.style('display', hidden ? 'none' : null);
}

function show() {
    return hidden && toggle();
}

function hide() {
    return hidden || toggle();
}

function add() {

    // tooltips.push({
    //     tooltip: tooltip,
    //     box: box,
    //     circle: circle,
    //     data: data
    // });
}

// function remove() {
    // TODO: remove tooltip
// }

function init(c) {
    container = c;

    tooltip = container.append('g')
        .attr('class', selectors.tooltip.slice(1))
        .style('display', 'none');

    // tooltip background
    tooltipBg = tooltip.append('svg:rect')
        .attr('class', selectors.tooltipBg.slice(1));

    // tooltip circle
    circle = tooltip.append('circle')
        .attr('r', circleRadius);

    // tooltip x value
    xValue = tooltip.append('text')
        .attr('class', 'x-value')
        .attr('x', offset + padding.x)
        .attr('y', offset + padding.y)
        .attr('dy', '0.9em');

    // tooltip y value
    yValue = tooltip.append('text')
        .attr('class', 'y-value')
        .attr('transform', 'translate(0, 24)')
        .attr('x', offset + padding.x)
        .attr('y', offset + padding.y)
        .attr('dy', '0.9em');

    // add();
}

export default {
    init: init,
    update: update,
    show: show,
    hide: hide,
    // add: add,
    toggle: toggle
};
