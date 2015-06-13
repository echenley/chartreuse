/* @flow */

'use strict';

import React from 'react/addons';

import Actions from '../actions/Actions';

import Isvg from 'react-inlinesvg';
// import cx from 'classnames';

class NavBar extends React.Component {

    constructor(props) {
        super(props);
    }

    addFn() {
        let expression = this.refs.expression.getDOMNode().value;
        Actions.addFn(expression);
    }

    render() {

        return (
            <div className="navbar">
                <a className="controls-toggle menu-icon" onClick={ Actions.toggleControls }>
                    <Isvg src="svg/stats.svg"></Isvg>
                </a>

                <span>y =</span>
                <input className="input" ref="expression" placeholder="..." />
                <a className="btn add-fn-submit" onClick={ this.addFn.bind(this) }>Add</a>

                <a className='settings-toggle menu-icon' onClick={ () => {} }>
                    <Isvg src="svg/cog.svg"></Isvg>
                </a>
            </div>
        );
    }
}

NavBar.propTypes = {};

export default NavBar;
