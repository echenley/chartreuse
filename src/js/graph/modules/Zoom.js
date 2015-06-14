'use strict';

import d3 from 'd3';
import classes from './classes';

import GraphState from './GraphState';
import Tooltip from './Tooltip';
import Plot from './Plot';

let zoom = d3.behavior.zoom()
    .x(GraphState.scales.x)
    .y(GraphState.scales.y)
    .on('zoom', zoomed)
    .on('zoomstart', Tooltip.hide)
    .on('zoomend', updateGraph);

function updateGraph() {
    // remove transform
    d3.select('.' + classes.pathWrapper)
        .attr('transform', null);

    // set zoom bounds
    zoom.x(GraphState.scales.x)
        .y(GraphState.scales.y);

    d3.select('.' + classes.graphOuter).call(zoom);

    // plot new bounds
    Plot.updateFns();
}

function zoomed() {
    let translate = zoom.translate();
    let scale = zoom.scale();

    // redraw axes
    d3.select('.' + classes.xAxis).call(GraphState.axes.x);
    d3.select('.' + classes.yAxis).call(GraphState.axes.y);

    // scale/translate the map rather than redraw every frame
    d3.select('.' + classes.pathWrapper).attr(
        'transform',
        `translate(${translate[0]}, ${translate[1]}) scale(${scale})`
    );
}

export default zoom;
