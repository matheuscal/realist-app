import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";

const listAdapter = createEntityAdapter();

const listSlice = createSlice({
    name: 'list',
    initialState: listAdapter.getInitialState(),
    reducers: {
        listAdded: (state, action) => {
            const newId = nanoid(10);
            listAdapter.addOne(state, {id: newId, title: "", listId: "", bgColor: "", cards: []})
        },
        listUpdated: listAdapter.updateOne,
        listRemoved: listAdapter.removeOne,
        cardAdded: (state, {payload}) => {
            const list = selectById(state, payload.id);
            const cardList = [...list.cards];

            cardList.push({id: nanoid(10), cardId: "", parentId: payload.id, content: ""});
            listAdapter.updateOne(state, { id: payload.id, changes: {cards: cardList} });
        },
        cardRemoved: (state, {payload}) => {
            const list = selectById(state, payload.parentId);
            const cardList = list.cards.filter(card => card.id !== payload.id);
            
            listAdapter.updateOne(state, {id: payload.parentId, changes: {cards: cardList}});
        },
        cardUpdated: (state, {payload}) => {
            const list = selectById(state, payload.parentId);

            const cardList = list.cards.map(card => {
                let newCard = {...card};
                if (card.id === payload.id){
                    newCard.content = payload.content;
                    newCard.cardId = payload.cardId;
                }
                return newCard;
            })
            listAdapter.updateOne(state, {id: payload.parentId, changes: {cards: cardList}});
        }
        }    
})

// Export reducer
export default listSlice.reducer;

// Export action creators
export const {listAdded, listUpdated, listRemoved, cardAdded, cardRemoved, cardUpdated} = listSlice.actions;

// Export selectors
const {selectAll, selectById} = listAdapter.getSelectors();

export const selectLists = state => selectAll(state.lists);
export const selectOne = (state, id) => selectById(state.lists, id);