/* @flow */

'use strict';

import React from 'react/addons';
import Graph from '../graph/Graph';
import difference from 'lodash/array/difference';

class GraphComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        // props are immutable, so can do === to find which ones changed
        let prevFns = this.props.activeFns;
        let nextFns = nextProps.activeFns;

        let toSelect = nextFns.filter(fn => fn.isSelected);
        let toRemove = prevFns.filter(fn => nextFns.indexOf(fn) === -1);
        let toRender = nextFns.filter(fn => prevFns.indexOf(fn) === -1);

        toSelect.forEach(Graph.selectFn);
        toRemove.forEach(Graph.removeFn);
        toRender.forEach(Graph.renderFn);
    }

    componentDidMount() {
        Graph.init('#graph');
        // this.props.activeFns.filter(fn => fn.func).forEach(addFn);
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
