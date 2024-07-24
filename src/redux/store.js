import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import scenarioReducer from "./slices/scenarioSlice";
import logger from "redux-logger";
import { thunk } from "redux-thunk";
// import userReducer from "./slices/userSlice";
// import pearsonReducer from "./slices/pearsonSlice";
// import collegeReducer from "./slices/collegeSlice";

/************************************************
 * Add reducer functions to store and export store
 *  https://www.dhiwise.com/post/how-to-use-redux-persist-in-react-applications
 *************************************************/

const persistConfig = {
  key: "root",
  storage,
  // Optionally, you can whitelist or blacklist specific reducers
  //   whitelist: ['navigation'],
//   whitelist: ["user", "college"],
  // blacklist: [""],
};

const rootReducer = combineReducers({
  scenarios: scenarioReducer,
//   navigation: navigationReducer,
//   pearson: pearsonReducer,
//   college: collegeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
// const middleware = [thunk, logger];

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  // middleware: [thunk, logger],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ['persist/PERSIST'],
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk, logger),
});

export const persistor = persistStore(store);

export { store };
