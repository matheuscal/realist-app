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
            // Payload is a card object: {parentId, id}
            const list = selectById(state, payload.parentId);
            const cardList = list.cards.filter(card => card.id !== payload.id);
            
            listAdapter.updateOne(state, {id: payload.parentId, changes: {cards: cardList}});
        },
        cardUpdated: (state, {payload}) => {
            // Payload is a card object: {id: Card's entity id, parentId: List's id, cardId?: Card nominal id, content?}
            const list = selectById(state, payload.parentId);

            const cardList = list.cards.map(card => {
                let newCard = {...card};
                if (card.id === payload.id){
                    // Updates card information
                    newCard.content = payload.content || card.content;
                    newCard.cardId = payload.cardId || card.cardId;
                }
                return newCard;
            })
            listAdapter.updateOne(state, {id: payload.parentId, changes: {cards: cardList}});
        },
        cardMoved: (state, {payload}) => {
            // Payload receives: {id: Card's entity id, parentId: List's id, newParentId}
            if (payload.newParentId !== payload.parentId) {
                console.log(payload.parentId, payload.newParentId);

                const oldParent = selectById(state, payload.parentId);
                const oldParentCards = oldParent.cards.filter(card => card.id !== payload.id);
                let movedCard = oldParent.cards.find(card => card.id === payload.id);
                
                const newParent = selectById(state, payload.newParentId);
                const newParentCards = [...newParent.cards];
                newParentCards.push({...movedCard, parentId: payload.newParentId});
                listAdapter.updateOne(state, {id: payload.newParentId, changes: {cards: newParentCards}});
                listAdapter.updateOne(state, {id: payload.parentId, changes: {cards: oldParentCards}});
            }
        }
        }
})

// Export reducer
export default listSlice.reducer;

// Export action creators
export const {listAdded, listUpdated, listRemoved, 
                cardAdded, cardRemoved, cardUpdated, cardMoved} = listSlice.actions;

// Export selectors
const {selectAll, selectById} = listAdapter.getSelectors();

export const selectLists = state => selectAll(state.lists);
export const selectOne = (state, id) => selectById(state.lists, id);