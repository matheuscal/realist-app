import { configureStore } from "@reduxjs/toolkit";
import listSlice from "./reducers/listSlice";

const store = configureStore({reducer: {lists: listSlice}});

export default store;