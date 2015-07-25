'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';

// Fn Prototype
import FnProto from '../graph/prototypes/FnProto';

import extend from 'lodash/object/assign';

let defaultFn = Object.create(FnProto)
    .compile('(x-1)/(x^3-2x+1)');

defaultFn = extend(defaultFn, {
    isVisible: true,
    isSelected: true
});

let fns = [defaultFn];

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

        // unselect all other functions
        fns.forEach(fn => fn.isSelected = false);

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
