'use strict';

// GRAPH DIMENSIONS
// viewbox/margin is arbitrary, scales with viewport
const viewbox = 1000;
const margin = {
    top: 80,
    right: 80,
    left: 80,
    bottom: 80
};

const dimensions = {
    viewbox: viewbox,
    margin: margin,
    width: viewbox - margin.left - margin.right,
    height: viewbox - margin.top - margin.bottom
};

export default dimensions;
