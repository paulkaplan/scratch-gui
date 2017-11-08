const ACTIVATE_CUSTOM_PROCEDURES = 'scratch-gui/custom-procedures/ACTIVATE_CUSTOM_PROCEDURES';
const DEACTIVATE_CUSTOM_PROCEDURES = 'scratch-gui/custom-procedures/DEACTIVATE_CUSTOM_PROCEDURES';
const SET_CALLBACK = 'scratch-gui/custom-procedures/SET_CALLBACK';

const initialState = {
    active: false,
    callback: () => {
        throw new Error('Color picker callback not initialized');
    }
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case ACTIVATE_CUSTOM_PROCEDURES:
        console.log(state, Object.assign({}, state, {active: action.mutator ? action.mutator : true, callback: action.callback}));
        return Object.assign({}, state, {active: action.mutator ? action.mutator : true, callback: action.callback});
    case DEACTIVATE_CUSTOM_PROCEDURES:
        // Can be called without a string to deactivate without setting color
        // i.e. when clicking on the modal background
        if (action.color) {
            state.callback(action.color);
        }
        return Object.assign({}, state, {active: false});
    case SET_CALLBACK:
        return Object.assign({}, state, {callback: action.callback});
    default:
        return state;
    }
};

const activateCustomProcedures = (mutator, callback) => ({type: ACTIVATE_CUSTOM_PROCEDURES, mutator: mutator, callback: callback});
const deactivateCustomProcedures = color => ({type: DEACTIVATE_CUSTOM_PROCEDURES, color: color});
const setCallback = callback => ({type: SET_CALLBACK, callback: callback});

export {
    reducer as default,
    activateCustomProcedures,
    deactivateCustomProcedures,
    setCallback
};
