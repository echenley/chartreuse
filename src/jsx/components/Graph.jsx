/* @flow */

'use strict';

import React from 'react/addons';
import Graph from '../graph/Graph';

class GraphComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        let prevFns = this.props.activeFns;
        let nextFns = nextProps.activeFns;

        let toRemove = prevFns.filter(fn => nextFns.indexOf(fn) === -1);
        let toAdd = nextFns.filter(fn => prevFns.indexOf(fn) === -1);

        // call Graph.remove() on any functions that have toggled off
        toRemove.forEach(Graph.remove);

        // call Graph.plot() on new functions
        toAdd.forEach(Graph.plot);
    }

    componentDidMount() {
        Graph.init('#graph');
        this.props.activeFns.forEach(Graph.plot);
    }

    render() {
        return (
            <div className="graph" id="graph"></div>
        );
    }
}

GraphComponent.propTypes = {
    fns: React.PropTypes.array
};

export default GraphComponent;
