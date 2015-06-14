/* @flow */
'use strict';

import d3 from 'd3';

// utility functions
import find from 'lodash/collection/find';

// graph modules
import dimensions from './modules/dimensions';
import GraphState from './modules/GraphState';
import Tooltip from './modules/Tooltip';
import Zoom from './modules/Zoom';
import Plot from './modules/Plot';

// css classes used in graph
import classes from './modules/classes';

function init(selector) {

    // create main svg element and .graph-outer <g>
    let graphOuter = d3.select(selector).append('svg')
        .attr('viewBox', `0 0 ${dimensions.viewbox} ${dimensions.viewbox}`)
      .append('g')
        .attr('class', 'graph-outer')
        .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)
        .on('mouseover', Tooltip.show)
        .on('mouseout', Tooltip.hide)
        .on('mousemove', function() {
            Tooltip.update(find(GraphState.fns, fn => fn.isSelected));
        })
        .call(Zoom);

    // append underlay
    graphOuter.append('rect')
        .attr('class', 'underlay')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    // append x-axis
    graphOuter.append('g')
        .attr('class', classes.xAxis)
        .attr('transform', `translate(0, ${dimensions.height})`)
        .call(GraphState.axes.x);

    // append y-axis
    graphOuter.append('g')
        .attr('class', classes.yAxis)
        .call(GraphState.axes.y);

    // set clip
    graphOuter.append('defs').append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('id', 'clip-rect')
        .attr('x', '0')
        .attr('y', '0')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    let graphInner = graphOuter.append('g')
        .attr('class', classes.graphInner)
        .attr('clip-path', 'url(#clip)');

    graphInner.append('g')
        .attr('class', 'path-wrapper');

    // append tooltip
    Tooltip.init(graphOuter);

    // listen to changes to FnStore
    // FnStore.listen(updateFns);

    // listen to compileFn action
    // Actions.compileFn.listen(Plot.compile);
}

export default {
    init: init,
    selectFn: Plot.select,
    renderFn: Plot.render,
    removeFn: Plot.remove
};
