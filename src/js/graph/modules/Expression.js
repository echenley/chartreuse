'use strict';

import d3 from 'd3';

const Expression = {
    remove() {
        // node/hitbox are d3 selections
        this.node.remove();
        this.hitbox.remove();
    },

    update(line) {
        this.hitbox.attr('d', line(this.data));
        this.node.attr('d', line(this.data));
    },

    draw() {
        let pathLength = this.node.node().getTotalLength();

        this.node
            .attr('stroke-dasharray', null)
            .attr('stroke-dashoffset', null);

        this.node.attr('stroke-dasharray', `${pathLength} ${pathLength}`)
            .attr('stroke-dashoffset', pathLength)
            .transition()
            .ease(d3.ease('linear'))
            .duration(1200)
            .attr('stroke-dashoffset', 0);
    }
};

export default Expression;
