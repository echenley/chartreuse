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
        if (this.props.fn === nextProps.fn) {
            return;
        }
        Graph.plot(nextProps.fn);
    }

    componentDidMount() {
        Graph.init('#graph');
        Graph.plot(this.props.fn);
    }

    render() {
        return (
            <div className="graph" id="graph"></div>
        );
    }
}

GraphComponent.propTypes = {
    fn: React.PropTypes.string
};

export default GraphComponent;
