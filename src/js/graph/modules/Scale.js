'use strict';

import d3 from 'd3';

function makeScale(domain, range) {
    return d3.scale.linear()
        .domain(domain)
        .range(range);
}

function create(config) {
    return {
        x: makeScale(config.xDomain, [0, config.width]),
        y: makeScale(config.yDomain, [config.height, 0])
    };
}

export default {
    create: create
};
