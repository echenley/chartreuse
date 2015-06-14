'use strict';

import Scales from '../modules/Scales';
import Axes from '../modules/Axes';

import find from 'lodash/collection/find';

const GraphStateProto = {
    updateScales(domains) {
        this.scales = Scales.create(domains);
    },

    updateAxes(scales) {
        this.axes = Axes.create(scales);
    },

    selectFn(fnToSelect) {
        if (!fnToSelect.path) {
            // function is not rendered yet
            return;
        }

        // unselect other fns
        this.fns.forEach(fn => fn.path.classed('selected', false));

        // select new fn
        fnToSelect.path.classed('selected', true);
    },

    addFn(fnToAdd) {
        this.fns.push(fnToAdd);
    },

    removeFn(fnToRemove) {
        // remove fn elements from DOM
        fnToRemove.remove();
        // update state
        this.fns = this.fns.filter(fn => fn !== fnToRemove);
    }
};

export default GraphStateProto;
