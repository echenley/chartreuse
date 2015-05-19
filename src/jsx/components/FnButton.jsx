/* @flow */

'use strict';

import React from 'react/addons';
import cx from 'classnames';

class FnButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = props;
    }

    updateFn(i) {
        this.props.updateFn(i);
    }

    render() {
        let buttonCx = cx(
            'fn-button',
            {
                'active': this.props.active
            }
        );

        return (
            <button
                className={ buttonCx }
                onClick={ this.updateFn.bind(this, this.props.id)}
            >
                { 'y = ' + this.props.fn }
            </button>
        );
    }
}

FnButton.propTypes = {
    id: React.PropTypes.number,
    fn: React.PropTypes.string,
    updateFn: React.PropTypes.func,
    active: React.PropTypes.bool
};

export default FnButton;
