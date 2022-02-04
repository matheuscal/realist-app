import { configureStore } from "@reduxjs/toolkit";
import listSlice from "./reducers/listSlice";
import topicSlice from "./reducers/topicSlice";

const store = configureStore({reducer: {lists: listSlice, topics: topicSlice}});

export default store;