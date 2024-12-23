import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { ReducerValue } from '../redux/reducer'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, ReducerValue)

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
