import { combineReducers } from '@reduxjs/toolkit';
import flashMessageSlice from './flashMessages/flashMessageSlice';
import generalSlice from './general/generalSlice';
import franchiseSlice from './franchise/franchiseSlice';
import dashboardDataSlice from './restaurants/dashboardDataSlice';

const rootReducer = combineReducers({
    general: generalSlice,
    flashMessages: flashMessageSlice,
    franchise: franchiseSlice,
    dashboard: dashboardDataSlice,
});

export default rootReducer;
