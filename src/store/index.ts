/* eslint-disable import/no-extraneous-dependencies */
// https://redux-toolkit.js.org/rtk-query/overview
import { configureStore } from '@reduxjs/toolkit';
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import blocksSlice from './slices/blocks-slice';
import bookSlice from './slices/book-slice';
import bookidSlice from './slices/book-current-slice';
import booksSlice from './slices/books-slice';
import historySlice from './slices/history-slice';
import itemSlice from './slices/item-slice';
import itemTypesSlice from './slices/item-type-slice';
import itemPopupSlice from './slices/item-popup-slice';
import modulesSlice from './slices/modules-slice';
import notificationSlice from './slices/notification-slice';
import userSlice from './slices/user-slice';

import {
  authApiEndpoints as authApi,
  blocksApiEndpoints as blocksApi,
  bookApiEndpoints as bookApi,
  projectApiEndpoints as projectApi,
  notificationApi,
  userApiEndpoints as userApi,
  itemsApiEndpoints as itemsApi,
  itemTypesApiEndpoints as itemTypesApi,
  fieldApiEndpoints as fieldApi,
} from './api';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const enhancer = composeEnhancers(applyMiddleware(thunk));

export const store = configureStore({
  reducer: {
    blocks: blocksSlice,
    book: bookSlice,
    books: booksSlice,
    bookid: bookidSlice,
    history: historySlice,
    item: itemSlice,
    itemTypes: itemTypesSlice,
    itempopup: itemPopupSlice,
    modules: modulesSlice,
    notification: notificationSlice,
    user: userSlice,
    // Add the generated reducer as a specific top-level slice
    [authApi.reducerPath]: authApi.reducer,
    [blocksApi.reducerPath]: blocksApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [itemTypesApi.reducerPath]: itemTypesApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [fieldApi.reducerPath]: fieldApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
      authApi.middleware,
      blocksApi.middleware,
      itemsApi.middleware,
      itemTypesApi.middleware,
      bookApi.middleware,
      projectApi.middleware,
      notificationApi.middleware,
      userApi.middleware,
      fieldApi.middleware,
    ),
  devTools: true,
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
