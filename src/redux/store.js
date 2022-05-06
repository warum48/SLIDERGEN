import { configureStore } from "@reduxjs/toolkit";
//import counterReducer from "./counterSlice";
import langReducer from "./langSlice";
import TagReducer from "./TagSlice";
export default configureStore({
  reducer: {
    lang: langReducer,
    //counter: counterReducer,
    tag: TagReducer
  }
});
