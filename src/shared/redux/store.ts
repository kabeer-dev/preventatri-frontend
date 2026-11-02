import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';

import {rootPersistConfig, rootReducer} from './rootReducer';

// ----------------------------------------------------------------------

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(),
});

const persistor = persistStore(store);

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

const dispatch: AppDispatch = store.dispatch;

export {store, persistor, dispatch};

export type {RootState, AppDispatch};
