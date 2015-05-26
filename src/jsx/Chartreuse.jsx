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
            showFns: false,
            fns: [
                'sin(x)',
                'tan(x)',
                'log(tan(sqrt(x)))',
                'sqrt(sin(x))'
            ],
            currentFn: 0
        };
    }

    updateFn(i) {
        this.setState({
            currentFn: i
        });
    }

    addFn(fn) {
        let fns = this.state.fns;
        fns.push(fn);

        this.setState({
            fns: fns
        });
    }

    render() {
        let currentFn = this.state.currentFn;

        return (
            <div className="chartreuse">
                <NavBar
                    toggleFns={ this.setState.bind(this, { showFns: !this.state.showFns }) }
                    showFns={ this.state.showFns }
                    addFn={ this.addFn.bind(this) }
                />
                <Controls
                    showFns={ this.state.showFns }
                    toggleFns={ this.setState.bind(this, { showFns: !this.state.showFns }) }
                    fns={ this.state.fns }
                    addFn={ this.addFn.bind(this) }
                    updateFn={ this.updateFn.bind(this) }
                    currentFn={ currentFn }
                />
                <Graph
                    fn={ this.state.fns[currentFn] }
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
