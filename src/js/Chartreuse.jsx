/* @flow */

'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import FnStore from './stores/FnStore';
import Actions from './actions/Actions';

import NavBar from './components/NavBar.jsx';
import Controls from './components/Controls.jsx';
import Graph from './components/Graph.jsx';

import cx from 'classnames';

// import Router from 'react-router';
// let RouteHandler = Router.RouteHandler;
// let Route = Router.Route;
// let NotFoundRoute = Router.NotFoundRoute;
// let DefaultRoute  = Router.DefaultRoute;
// let Link          = Router.Link;

const Chartreuse = React.createClass({
    mixins: [
        Reflux.connect(FnStore, 'fns'),
        Reflux.listenTo(Actions.toggleControls, 'toggleControls')
    ],

    getInitialState() {
        return {
            controlsActive: false
        };
    },

    toggleControls() {
        this.setState({
            controlsActive: !this.state.controlsActive
        });
    },

    render() {
        let fns = this.state.fns;

        let chartreuseCx = cx('chartreuse', {
            'controls-active': this.state.controlsActive
        });

        return (
            <div className={ chartreuseCx }>
                <NavBar />
                <Controls fns={ fns } />
                <Graph activeFns={ fns.filter(fn => fn.isActive) } />
                {/* <RouteHandler /> */}
            </div>
        );
    }
});

// let routes = (
//     <Route handler={ Chartreuse }>
//         <Route name="controls" handler={Controls} />
//     </Route>
// );

// Router.run(routes, Router.HistoryLocation, function(Handler, state) {
//     console.log(state);
//     React.render(<Handler params={ state.params } />, document.getElementById('container'));
// });

React.render(<Chartreuse />, document.getElementById('container'));
