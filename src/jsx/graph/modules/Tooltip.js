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

function update(graphOuter, data, xScale, yScale) {
    let nearestDataPoint;

    let mouseCoords = d3.mouse(graphOuter);

    // get x-coordinate
    let x = xScale.invert(mouseCoords[0]);

    // get index within data array
    let i = bisectX(data, x);

    // get data values to the left and right of cursor position
    let left = data[i - 1];
    let right = data[i];

    if (left && right) {
        nearestDataPoint = x - left.x > right.x - x ? right : left;
    } else {
        // one or the other doesn't exist
        nearestDataPoint = left || right;
    }

    let translateX = xScale(nearestDataPoint.x);
    let translateY;

    if (isNaN(nearestDataPoint.y)) {
        // don't show the circle if data point isNaN
        circle.style('opacity', 0);
        translateY = mouseCoords[1];
    } else {
        circle.style('opacity', null);
        translateY = yScale(nearestDataPoint.y);
    }

    // position tooltip and set text
    tooltip.attr(
        'transform',
        `translate(${translateX}, ${translateY})`
    );

    xValue.text(`x: ${nearestDataPoint.x}`);
    yValue.text(`y: ${nearestDataPoint.y}`);

    // reset bg so previous styles don't interfere with .getBBox()
    tooltipBg
        .attr('width', 0)
        .attr('height', 0);

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
