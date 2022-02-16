import { configureStore } from "@reduxjs/toolkit";
import listSlice from "./reducers/listSlice";
import topicSlice from "./reducers/topicSlice";
import filterSlice from "./reducers/filterSlice";

const store = configureStore({reducer: {lists: listSlice, topics: topicSlice, filters: filterSlice}});

export default store;