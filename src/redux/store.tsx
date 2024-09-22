import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {PersistConfig} from 'redux-persist/es/types';
import shoppingListReducer from './shoppingListSlice';

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  shoppingList: persistReducer(persistConfig, shoppingListReducer),
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;