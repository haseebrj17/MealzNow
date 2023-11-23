// middleware/subLoadingMiddleware.js
import { SET_SUB_LOADING, UNSET_SUB_LOADING } from '../actions/CartAction';

let setLoadingTimestamp = null;
let wasUnsetDispatched = false;

export const subLoadingMiddleware = store => next => action => {
    console.log("Middleware received action:", action.type);

    if (action.type === SET_SUB_LOADING) {
        console.log("Detected SET_SUB_LOADING");
        setLoadingTimestamp = Date.now();
        wasUnsetDispatched = false;

        setTimeout(() => {
            if (!wasUnsetDispatched) {
                console.log("Timeout completed. Dispatching UNSET_SUB_LOADING");
                store.dispatch({ type: UNSET_SUB_LOADING });
            }
        }, 500);
    }

    if (action.type === UNSET_SUB_LOADING && setLoadingTimestamp) {
        wasUnsetDispatched = true;
        const timeElapsed = Date.now() - setLoadingTimestamp;

        if (timeElapsed < 500) {
            console.log(`Only ${timeElapsed}ms has passed. Adjusting timeout.`);
            setTimeout(() => {
                console.log("Adjusted timeout completed. Dispatching UNSET_SUB_LOADING");
                store.dispatch({ type: UNSET_SUB_LOADING });
            }, 500 - timeElapsed);
            return;
        }
    }

    return next(action);
};
