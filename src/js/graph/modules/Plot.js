'use strict';

import d3 from 'd3';

import Actions from '../../actions/Actions';
import Tooltip from './Tooltip';
import classes from './classes';

import extend from 'lodash/object/assign';

import GraphState from './GraphState';

function isReal(d) {
    return (
        !isNaN(d.x) &&
        !isNaN(d.y) &&
        isFinite(d.y) &&
        // e notation breaks <path d="">
        d.y <= 1e21
    );
}

let line = d3.svg.line()
    .x(d => GraphState.scales.x(d.x))
    .y(d => GraphState.scales.y(d.y))
    .defined(isReal);

// add customizable interpolation in UI
// .interpolate('basis-open');

function getDataPoints(func, xDomain) {
    // number of data samples
    let n = 1000;

    // create an array of points along x-axis
    let xPoints = d3.range(
        xDomain[0],
        xDomain[1],
        Math.abs(xDomain[1] - xDomain[0]) / n
    );

    // get y values and map results to object
    let dataArr = xPoints.map(x => ({
        x: x,
        y: func.eval({ x: x })
    }));

    // filter out NaN values here vs .defined()?
    // dataArr = dataArr.filter(d => !isNaN(d.y));

    return dataArr;
}

function plot(fn, draw?) {
    // draw is optional

    // get data from compiled fn
    fn.data = getDataPoints(fn.func, GraphState.scales.x.domain());

    // update path data and remove stroke attributes
    fn.update(line);

    if (draw) {
        fn.draw();
    }
}

function updateFns() {
    GraphState.fns.forEach(fn => plot(fn));
}

function render(fn) {
    let pathWrapper = d3.select('.' + classes.pathWrapper);

    // create wrapper for path
    let wrapper = pathWrapper.append('g');

    // create path for new function
    let fnPath = wrapper.append('path')
        .attr('class', 'path');

    // create wider invisible path for clickability
    let hitbox = wrapper.append('path')
        .attr('class', 'hitbox')
        .on('click', function() {
            Actions.selectFn(fn);
            Tooltip.show();
            Tooltip.update(fn);
        });

    fn = extend(fn, {
        wrapper: wrapper,
        path: fnPath,
        hitbox: hitbox
    });

    // update graph state
    GraphState.addFn(fn);
    GraphState.selectFn(fn);

    // plot the new function
    plot(fn, true);
}

function remove(fnToRemove) {
    GraphState.removeFn(fnToRemove);
}

function select(fnToSelect) {
    GraphState.selectFn(fnToSelect);
}

export default {
    select: select,
    remove: remove,
    render: render,
    updateFns: updateFns
};
