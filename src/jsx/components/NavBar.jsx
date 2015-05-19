/* @flow */

'use strict';

import React from 'react/addons';

class NavBar extends React.Component {

    constructor(props) {
        super(props);
    }

    toggleControls() {
        this.props.toggleControls();
    }

    addFn() {
        let expression = this.refs.expression.getDOMNode().value;
        this.props.addFn(expression);
    }

    render() {
        return (
            <div className="navbar">
                <a className="btn controls-toggle" onClick={ this.toggleControls.bind(this) }>
                    { (this.props.controlsHidden ? 'Show' : 'Hide') + ' Controls' }
                </a>

                <input ref="expression" className="add-fn-input" placeholder="Enter new function" />
                <a className="btn dadd-fn-submit" onClick={ this.addFn.bind(this) }>Add</a>
            </div>
        );
    }
}

NavBar.propTypes = {
    controlsHidden: React.PropTypes.bool,
    toggleControls: React.PropTypes.func
};

export default NavBar;
