import { combineReducers } from '@reduxjs/toolkit';
import flashMessageSlice from './flashMessages/flashMessageSlice';
import generalSlice from './general/generalSlice';
import franchiseSlice from './franchise/franchiseSlice';
import dashboardDataSlice from './restaurants/dashboardDataSlice';
import customerSlice from './customer/customerSlice';
import cartSlice from './cart/cartSlice';
import tempSlice from './temp/TempSlice';

const rootReducer = combineReducers({
    general: generalSlice,
    flashMessages: flashMessageSlice,
    franchise: franchiseSlice,
    dashboard: dashboardDataSlice,
    customer: customerSlice,
    cart: cartSlice,
    temp: tempSlice
});

export default rootReducer;
