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
let tooltip, tooltipBg, xValue, yValue, circle;

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

function update(graphOuter, data, xScale, yScale) {
    // get mouse coordinates
    let mouseCoords = d3.mouse(graphOuter);

    // get scaled x-coordinate of mouse
    let mouseX = xScale.invert(mouseCoords[0]);

    // get nearest data point to mouseX
    let nearestDataPoint = getNearestDataPoint(data, mouseX);

    // get translate values for tooltip
    let translateX = xScale(nearestDataPoint.x);
    let translateY;

    if (isWithinBounds(nearestDataPoint.y, yScale.domain())) {
        // data point is on the chart
        // position tooltip at point
        circle.style('opacity', null);
        translateY = yScale(nearestDataPoint.y);
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
    tooltip.select(selectors.tooltipBg)
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

// function remove() {
    // TODO: remove tooltip
// }

function init(container) {
    tooltip = container.append('g')
        .attr('class', selectors.tooltip.slice(1))
        .style('display', 0);

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
}

export default {
    init: init,
    update: update,
    show: show,
    hide: hide,
    toggle: toggle
};
