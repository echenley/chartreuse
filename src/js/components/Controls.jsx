/* @flow */

'use strict';

import React from 'react/addons';
import Actions from '../actions/Actions';

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
            Actions.toggleControls();
        }
    }

    createButton(fn, i) {
        let buttonCx = cx('fn-button', {
            active: fn.isActive
        });

        return (
            <button className={ buttonCx } onClick={ () => Actions.toggleFn(fn) } key={ i }>
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
    fns: React.PropTypes.array
};

export default Controls;
