'use strict';

import d3 from 'd3';
import dimensions from './dimensions';

function makeScale(domain, range) {
    return d3.scale.linear()
        .domain(domain)
        .range(range);
}

function create(domains) {
    return {
        x: makeScale(domains.xDomain, [0, dimensions.width]),
        y: makeScale(domains.yDomain, [dimensions.height, 0])
    };
}

export default {
    create: create
};
