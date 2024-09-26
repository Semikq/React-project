import authReducer from "./reducers/authReducer.js"
import feedReducer from "./reducers/feedSlice.js"
import storage from 'redux-persist/lib/storage'
import { api } from "./api.js"
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

export const store = configureStore({
  reducer: {
    auth: persistReducer({key: 'auth', storage}, authReducer),
    feed: feedReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({serializableCheck: {ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]}}),
        api.middleware],
})
const persistor = persistStore(store)

store.subscribe(() => console.log(store.getState()))