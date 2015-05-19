/* @flow */

'use strict';

import React from 'react/addons';
import FnButton from './FnButton.jsx';

class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.state = props;
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

        return (
            <div className="controls">
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
