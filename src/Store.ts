import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './features/RootState';
import Reactotron from '../ReactotronConfig';

export const store = configureStore({
  reducer: rootReducer,
  enhancers: (__DEV__ && Reactotron.createEnhancer) ? [Reactotron.createEnhancer()] : [],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types in the serializableCheck middleware
        // if you encounter actions that are non-serializable.
        ignoredActions: ['your_non_serializable_action_type'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;