import { combineReducers } from '@reduxjs/toolkit';
import flashMessageSlice from './flashMessages/flashMessageSlice';
import generalSlice from './general/generalSlice';

const rootReducer = combineReducers({
    general: generalSlice,
    flashMessages: flashMessageSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
