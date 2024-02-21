// store.ts
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './features/RootState';
// import reactotron from '../ReactotronConfig'; // Make sure the path is correct

export const store = configureStore({
    reducer: rootReducer,
    // enhancers: (__DEV__ && reactotron?.createEnhancer) ? [reactotron.createEnhancer()] : [],
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['your_non_serializable_action_type'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
