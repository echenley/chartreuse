'use strict';

import d3 from 'd3';
import dimensions from './dimensions';

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

function create(scales) {
    return {
        x: makeAxis(scales.x, 'bottom', -dimensions.width),
        y: makeAxis(scales.y, 'left', -dimensions.height)
    };
}

export default {
    create: create
};
