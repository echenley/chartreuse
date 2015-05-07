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

    render() {
        return (
            <div className="navbar">
                <button
                    className='controls-toggle'
                    onClick={ this.toggleControls.bind(this) }
                >
                    { this.props.controlsHidden ? 'Show' : 'Hide' } Controls
                </button>
            </div>
        );
    }
}

NavBar.propTypes = {
    controlsHidden: React.PropTypes.bool,
    toggleControls: React.PropTypes.func
};

export default NavBar;
