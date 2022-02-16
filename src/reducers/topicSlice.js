import { createSlice, createEntityAdapter, nanoid } from "@reduxjs/toolkit";

const topicsAdapter = createEntityAdapter();

const topicSlice = createSlice({
    name: "topic",
    initialState: topicsAdapter.getInitialState(),
    reducers: {
        addOne: (state, action) => {
            const newId = nanoid(5);
            topicsAdapter.addOne(state, {id: newId, value: action.payload, listIdsContaining: []});
        },
        removeOne: topicsAdapter.removeOne,
        addListIdToTopic: (state, action) => {
            let thisTopic = selectTopic(state, action.payload.topicId);
            if (thisTopic){
                let newListIdsContaining = [...thisTopic.listIdsContaining];
                newListIdsContaining.push(action.payload.listId);
                
                topicsAdapter.updateOne(state, {id: thisTopic.id, changes: {listIdsContaining: newListIdsContaining}})
            }
        },
        removeListIdFromTopic: (state, action) => {
            const thisTopic = selectTopic(state, action.payload.topicId);
            let newListIdsContaining = [...thisTopic.listIdsContaining];
            newListIdsContaining = newListIdsContaining.filter(listIds => listIds !== action.payload.listId);

            topicsAdapter.updateOne(state, {id: action.payload.topicId, changes: {listIdsContaining: newListIdsContaining}});
        }
    } 
});

export default topicSlice.reducer;
export const { addOne, removeOne, addListIdToTopic, removeListIdFromTopic } = topicSlice.actions;

const {selectAll, selectById} = topicsAdapter.getSelectors();

export const selectTopics = (state) => selectAll(state.topics);
export const selectTopic = (state, id) => selectById(state, id); 