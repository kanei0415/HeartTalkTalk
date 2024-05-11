import { configureStore, createSelector } from '@reduxjs/toolkit';
import admin from './admin/slice';
import user from './user/slice';
import backdrop from './backdrop/slice';

const store = configureStore({
  reducer: {
    admin,
    user,
    backdrop,
  },
});

export const selector = createSelector(
  (state: RootStoreStateType) => state,
  (state: RootStoreStateType) => state,
);

export type RootStoreStateType = ReturnType<typeof store.getState>;

export type AppDispatchType = ReturnType<typeof store.dispatch>;

export default store;
