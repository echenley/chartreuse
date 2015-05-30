/* @flow */

'use strict';

import React from 'react/addons';
import Graph from '../graph/Graph';

function removeFn(fn) {
    Graph.remove(fn.signature);
}

function addFn(fn) {
    Graph.plot(fn.signature);
}

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

        toRemove.forEach(removeFn);
        toAdd.forEach(addFn);
    }

    componentDidMount() {
        Graph.init('#graph');
        this.props.activeFns.forEach(addFn);
    }

    render() {
        return (
            <div className="graph" id="graph" />
        );
    }
}

GraphComponent.propTypes = {
    activeFns: React.PropTypes.array
};

export default GraphComponent;
