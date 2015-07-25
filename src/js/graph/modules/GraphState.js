'use strict';

import GraphStateProto from '../prototypes/GraphStateProto';

import Scales from './Scales';
import Axes from './Axes';

import extend from 'lodash/object/assign';

let scales = Scales.create({
    xDomain: [-15, 15],
    yDomain: [-5, 5]
});

let GraphState = extend(
    Object.create(GraphStateProto),
    {
        scales: scales,
        axes: Axes.create(scales),
        fns: []
    }
);

export default GraphState;
