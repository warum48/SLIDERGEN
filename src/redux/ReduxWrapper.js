import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

//import rootReducer from './reducers';
import counterReducer from "./counterSlice";
import TagReducer from "./TagSlice";
import langReducer from "./langSlice";
//import store from './store';

//import App from './App';

//add persist https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist

const persistConfig = {
  key: "root",
  version: 1,
  storage
};

const reducers = combineReducers({
  counter: counterReducer,
  //mdicts: dictsReducer,
  tag: TagReducer,
  lang: langReducer
});

const persistedReducer = persistReducer(persistConfig, reducers);
//const persistedReducer = persistReducer(persistConfig, counterReducer); //this line throws error, use combineReducers to fix and mix more reducers if needed

const store_conf = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

let persistor = persistStore(store_conf);

export const ReduxWrapper = (props) => {
  /*ReactDOM.render(
  <Provider store={store_conf}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);*/

  return (
    <Provider store={store_conf}>
      <PersistGate loading={null} persistor={persistor}>
        {props.children}
      </PersistGate>
    </Provider>
  );
};
