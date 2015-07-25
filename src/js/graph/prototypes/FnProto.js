'use strict';

import d3 from 'd3';
import math from 'mathjs';

const FnProto = {
    isVisible: true,
    isSelected: true,
    wrapper: null,
    path: null,
    hitbox: null,

    remove() {
        this.wrapper.remove();
        // this.path.remove();
        // this.hitbox.remove();
    },

    update(line) {
        this.path
            .attr('stroke-dasharray', null)
            .attr('stroke-dashoffset', null);

        // node/hitbox are d3 selections
        this.hitbox.attr('d', line(this.data));
        this.path.attr('d', line(this.data));
    },

    compile(signature) {
        this.signature = signature;
        this.func = math.compile(signature);
        return this;
    },

    draw() {
        let pathLength = this.path.node().getTotalLength();

        this.path.attr('stroke-dasharray', `${pathLength} ${pathLength}`)
            .attr('stroke-dashoffset', pathLength)
            .transition()
            .ease(d3.ease('linear'))
            .duration(1200)
            .attr('stroke-dashoffset', 0);
    }
};

export default FnProto;
