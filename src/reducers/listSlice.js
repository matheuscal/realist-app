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
            const list = selectById(state, payload.parentId);
            const cardList = [...list.cards];
            
            cardList.push({id: payload.id || nanoid(10), cardId: payload.cardId || "", parentId: payload.parentId, content: payload.content || ""});
            listAdapter.updateOne(state, { id: payload.parentId, changes: {cards: cardList} });
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
                    if (payload.content) newCard.content = payload.content;
                    if (payload.cardId) newCard.cardId = payload.cardId;
                    if (payload.newParentId) newCard.parentId = payload.newParentId; 
                }
                return newCard;
            })
            listAdapter.updateOne(state, {id: payload.parentId, changes: {cards: cardList}});
        },
        cardOrderChanged: (state, {payload}) => {
            let addBeforeThisCard = false;
            if (payload.mouseY < payload.thisCardYCenter) addBeforeThisCard = true;
            const list = selectById(state, payload.parentId);
            let newListCards = [...list.cards];
            let draggedCard = payload.draggedCardState;

            // First, if the card comes from another list we delete it from there 
            if (draggedCard.parentId !== list.id) {
                const oldParent = selectById(state, draggedCard.parentId);
                let oldParentCards = [...oldParent.cards];
                oldParentCards = oldParentCards.filter(card => card.id !== draggedCard.id);
                listAdapter.updateOne(state, { id: draggedCard.parentId, changes: {cards: [...oldParentCards]} });

                draggedCard.parentId = list.id;
            }
       
            // Secondly, remove the card from the current position in the array
            newListCards = newListCards.filter(card => card.id !== draggedCard.id);
            
            // Third step is to get the updated index of the card that dispatched this action
            let thisCardIndex;
            newListCards.forEach((card, i) => { if(card.id === payload.id) thisCardIndex = i; });

            // Lastly insert the removed card before or after the index of the card that dispatched this action
            newListCards.splice(addBeforeThisCard ? thisCardIndex : thisCardIndex + 1, 0, draggedCard);
 
            listAdapter.updateOne(state, {id: payload.parentId, changes: {cards: newListCards}});
        }
        }
})

// Export reducer
export default listSlice.reducer;

// Export action creators
export const {listAdded, listUpdated, listRemoved, 
                cardAdded, cardRemoved, cardUpdated, cardChangedList, cardOrderChanged} = listSlice.actions;

// Export selectors
const {selectAll, selectById} = listAdapter.getSelectors();

export const selectLists = state => selectAll(state.lists);
export const selectOne = (state, id) => selectById(state.lists, id);