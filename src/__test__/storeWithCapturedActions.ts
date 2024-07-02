import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../redux/reducers/rootReducer';
// Adjust the path to your rootReducer

export const createTestStore = () => {
  const actions: any[] = [];
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(() => (next) => (action) => {
        actions.push(action);
        return next(action);
      })
  });

  return { store, actions };
};
