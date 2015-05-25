'use strict';

import d3 from 'd3';

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

function create(config) {
    return {
        x: makeAxis(config.scales.x, 'bottom', -config.width),
        y: makeAxis(config.scales.y, 'left', -config.height)
    };
}

export default {
    create: create
};
