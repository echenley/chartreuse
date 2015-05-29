/* @flow */

'use strict';

// var Router        = require('react-router');
// var RouteHandler  = Router.RouteHandler;
// var Route         = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
// var DefaultRoute  = Router.DefaultRoute;
// var Link          = Router.Link;

import React from 'react/addons';

import NavBar from './components/NavBar.jsx';
import Controls from './components/Controls.jsx';
import Graph from './components/Graph.jsx';

import cx from 'classnames';

class Chartreuse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            controlsActive: false,
            fns: [
                { signature: 'sin(x)', isActive: true },
                { signature: 'tan(x)', isActive: false }
            ]
        };
    }

    toggleFn(fn) {
        // toggle .isActive
        fn.isActive = !fn.isActive;

        this.setState({
            fns: this.state.fns
        });
    }

    addFn(signature) {
        let fns = this.state.fns;
        fns.push({
            signature: signature,
            isActive: true
        });

        this.setState({
            fns: fns
        });
    }

    toggleControls() {
        this.setState({
            controlsActive: !this.state.controlsActive
        });
    }

    render() {
        let fns = this.state.fns;
        let toggleControls = this.toggleControls.bind(this);

        let chartreuseCx = cx('chartreuse', {
            'controls-active': this.state.controlsActive
        });

        return (
            <div className={ chartreuseCx }>
                <NavBar
                    toggleControls={ toggleControls }
                    controlsActive={ this.state.controlsActive }
                    addFn={ this.addFn.bind(this) }
                />
                <Controls
                    hideControls={ toggleControls }
                    fns={ fns }
                    addFn={ this.addFn.bind(this) }
                    toggleFn={ this.toggleFn.bind(this) }
                />
                <Graph
                    activeFns={ fns.filter(fn => fn.isActive) }
                />
            </div>
        );
    }
}

// var routes = (
//     <Route handler={ Chartreuse }></Route>
// );

// Router.run(routes, function(Handler, state) {
//     React.render(<Handler params={ state.params } />, document.getElementById('container'));
// });

React.render(<Chartreuse />, document.getElementById('container'));
