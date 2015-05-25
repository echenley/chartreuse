'use strict';

import d3 from 'd3';

const selectors = {
    tooltip: '.tooltip',
    tooltipBg: '.tooltip-bg'
};

let bisectX = d3.bisector(d => d.x).left;
let tooltip, tooltipBg, xValue, yValue;

function update(graphOuter, data, xScale, yScale) {
    let nearestDataPoint;

    // get x-coordinate
    let x = xScale.invert(d3.mouse(graphOuter)[0]);

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
    xValue.text(`x: ${nearestDataPoint.x}`);
    yValue.text(`y: ${nearestDataPoint.y}`);

    // reset bg so previous styles don't interfere with .getBBox()
    tooltipBg
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

function show() {
    tooltip.style('display', null);
}

function hide() {
    tooltip.style('display', 'none');
}

function init(container) {
    tooltip = container.append('g')
        .attr('class', selectors.tooltip.slice(1))
        .style('display', 'none');

    // tooltip background
    tooltipBg = tooltip.append('svg:rect')
        .attr('class', selectors.tooltipBg.slice(1));

    // tooltip circle
    tooltip.append('circle')
        .attr('r', 5);

    // tooltip x value
    xValue = tooltip.append('text')
        .attr('class', 'x-value')
        .attr('x', 15)
        .attr('y', 25)
        .attr('dy', '0.35em');

    // tooltip y value
    yValue = tooltip.append('text')
        .attr('class', 'y-value')
        .attr('transform', 'translate(0, 24)')
        .attr('x', 15)
        .attr('y', 25)
        .attr('dy', '0.35em');
}

export default {
    init: init,
    update: update,
    show: show,
    hide: hide
};
