'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';

// Fn Prototype
import FnProto from '../graph/prototypes/FnProto';

import extend from 'lodash/object/assign';

let fns = [];

const FnStore = Reflux.createStore({
    listenables: [Actions],

    onAddFn(fn) {
        // check that fn doesn't already exist...
        // if () { return; }

        fns.push(fn);
        this.trigger(fns);
    },

    // onRemoveFn() {

    // },

    onCompileFn(signature) {
        let newFn = Object.create(FnProto)
            .compile(signature);

        // unselect all functions
        fns.forEach(fn => fn.isSelected = false);

        newFn = extend(newFn, {
            isVisible: true,
            isSelected: true
        });

        fns.push(newFn);

        this.trigger(fns);
    },

    onSelectFn(selectedFn) {
        // unselect all then select
        fns.forEach(fn => fn.isSelected = false);
        selectedFn.isSelected = true;
        this.trigger(fns);
    },

    onToggleFn(fn) {
        fn.isVisible = !fn.isVisible;
        this.trigger(fns);
    },

    getInitialState() {
        return fns;
    }
});

export default FnStore;
