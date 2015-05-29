/* @flow */

'use strict';

import React from 'react/addons';
// import FnButton from './FnButton.jsx';
import cx from 'classnames';

class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeFns: []
        };
    }

    hideControls(e) {
        if (e.target === this.refs.overlay.getDOMNode()) {
            this.props.hideControls();
        }
    }

    createButton(fn, i) {
        // let toggleFn = ;
        let buttonCx = cx({
            'fn-button': true,
            'active': fn.isActive
        });
        return (
            <button className={ buttonCx } onClick={ () => this.props.toggleFn(fn) } key={ i }>
                { 'y = ' + fn.signature }
            </button>
        );
    }

    render() {
        let buttons = this.props.fns.map(this.createButton.bind(this));

        return (
            <div className="controls">
                <a className="overlay" ref="overlay" onClick={ this.hideControls.bind(this) }></a>
                { buttons }
            </div>
        );
    }
}

Controls.propTypes = {
    hideControls: React.PropTypes.func,
    fns: React.PropTypes.array,
    addFn: React.PropTypes.func,
    toggleFn: React.PropTypes.func,
    activeFns: React.PropTypes.array
};

export default Controls;
