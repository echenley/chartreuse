'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';

let defaultFns = [
    { signature: 'sin(x)', isActive: true },
    { signature: 'tan(x)', isActive: false }
];

const FnStore = Reflux.createStore({
    listenables: [Actions],

    init() {
        this.fns = defaultFns;
    },

    onAddFn(signature) {
        // check that fn doesn't already exist...
        // if () { return; }

        this.fns.push({
            signature: signature,
            isActive: true
        });

        this.trigger(this.fns);
    },

    // onRemoveFn() {

    // },

    onToggleFn(fn) {
        fn.isActive = !fn.isActive;
        this.trigger(this.fns);
    },

    getInitialState() {
        return defaultFns;
    }
});

export default FnStore;
