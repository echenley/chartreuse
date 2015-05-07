/* @flow */

'use strict';

import React from 'react/addons';

function getFnBody(fn) {
    return fn.toString().match(/function[^{]+\{[\s\S]*return([\s\S]*)\}$/)[1];
}

class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.state = props;
    }

    updateFn(i) {
        this.props.updateFn(i);
    }

    render() {
        let currentFn = this.props.currentFn;

        let buttons = this.props.fns.map((fn, i) => (
            <button
                className={ currentFn === i ? 'active' : '' }
                onClick={ this.updateFn.bind(this, i) }
                key={ i }
            >
                { 'y = ' + getFnBody(fn) }
            </button>
        ));

        return (
            <div className="controls">
                <h1>Control Panel</h1>
                { buttons }
            </div>
        );
    }
}

Controls.propTypes = {
    fns: React.PropTypes.array,
    addFn: React.PropTypes.func,
    updateFn: React.PropTypes.func,
    currentFn: React.PropTypes.number
};

export default Controls;
