import globalEventEmitter from "../events/globalEventEmitter";

const cartRefetchMiddleware = store => next => action => {
    if (action.type === 'ADD_TO_CART_SUCCESS') {
        globalEventEmitter.emit('refetchCart');
    }
    return next(action);
};

export default cartRefetchMiddleware;
