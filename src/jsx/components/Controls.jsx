/* @flow */

'use strict';

import React from 'react/addons';
import FnButton from './FnButton.jsx';
import cx from 'classnames';

class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.state = props;
    }

    toggleFns(e) {
        if (e.target === this.refs.overlay.getDOMNode()) {
            this.props.toggleFns();
        }
    }

    render() {
        let currentFn = this.props.currentFn;

        let buttons = this.props.fns.map((fn, i) => (
            <FnButton
                active={ currentFn === i }
                updateFn={ this.props.updateFn }
                id={ i }
                fn={ fn }
                key={ i }
            />
        ));

        let fnCx = cx(
            'controls',
            {
                'active': this.props.showFns
            }
        );

        return (
            <div ref="overlay" className={ fnCx } onClick={ this.toggleFns.bind(this) }>
                { buttons }
            </div>
        );
    }
}

Controls.propTypes = {
    showFns: React.PropTypes.bool,
    toggleFns: React.PropTypes.func,
    fns: React.PropTypes.array,
    addFn: React.PropTypes.func,
    updateFn: React.PropTypes.func,
    currentFn: React.PropTypes.number
};

export default Controls;
