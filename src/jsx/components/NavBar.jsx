/* @flow */

'use strict';

import React from 'react/addons';
import Isvg from 'react-inlinesvg';
import cx from 'classnames';

class NavBar extends React.Component {

    constructor(props) {
        super(props);
    }

    toggleFns() {
        this.props.toggleFns();
    }

    addFn() {
        let expression = this.refs.expression.getDOMNode().value;
        this.props.addFn(expression);
    }

    render() {

        let fnToggleCx = cx(
            'fns-toggle',
            {
            'active': this.props.showFns
        });

        return (
            <div className="navbar">
                <a className={ fnToggleCx } onClick={ this.toggleFns.bind(this) }>
                    <Isvg src="svg/stats.svg"></Isvg>
                </a>

                <input className="input" ref="expression" placeholder="Enter new function" />
                <a className="btn add-fn-submit" onClick={ this.addFn.bind(this) }>Add</a>
            </div>
        );
    }
}

NavBar.propTypes = {
    showFns: React.PropTypes.bool,
    toggleFns: React.PropTypes.func
};

export default NavBar;
