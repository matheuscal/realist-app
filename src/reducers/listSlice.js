import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";

const listAdapter = createEntityAdapter({ sortComparer: (a,b) => a.index < b.index ? -1 : 1 });

const listSlice = createSlice({
    name: 'list',
    initialState: listAdapter.getInitialState(),
    reducers: {
        listAdded: (state, action) => {
            let newListIndex = 0;
            const lists = selectAll(state);
            lists.forEach((list, i) => i >= newListIndex ? newListIndex = i + 1 : null);

            const newId = nanoid(10);
            listAdapter.addOne(state, {id: newId, title: "Click to edit.", listId: "", bgColorClass: "list--bg-black", cards: [], type: 'list', index: newListIndex});   
        },
        listUpdated: listAdapter.updateOne,
        listRemoved: (state, {payload}) => {
            let allLists = selectAll(state);
            
            // Adjust the new index value for all lists after removing the specified item
            allLists = allLists.filter(list => list.id !== payload.id).map((list, i) => {
                return {...list, index: i}
            });
            listAdapter.removeOne(state, payload.id);
            listAdapter.upsertMany(state, allLists);
        },
        cardAdded: (state, {payload}) => {
            const list = selectById(state, payload.parentId);
            const cardList = [...list.cards];
            cardList.push({id: payload.id || nanoid(10), cardId: payload.cardId || "", parentId: payload.parentId, content: payload.content || "", type: "card", editing: typeof payload.editing !== "null" ? payload.editing : true});
            console.log(cardList);
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
        // Triggered when the card changed position
        cardMoved: (state, {payload}) => {
            if (payload.draggedItemState.type !== 'card') return;
            // Add the moved card before the card that dispatched to this reducer?
            let addBeforeThisCard = false;
            if (payload.mouseY < payload.thisCardYCenter) addBeforeThisCard = true;
            const list = selectById(state, payload.parentId);
            let newListCards = [...list.cards];
            let draggedCard = payload.draggedItemState;
            
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
            console.log(newListCards);
            listAdapter.updateOne(state, {id: payload.parentId, changes: {cards: newListCards}});
        },
        listMoved: (state, {payload}) => {
            console.log(payload.draggedItemState);
            if (payload.draggedItemState.type !== 'list') return;
            if (payload.id === payload.draggedItemState.id) return;
            let addBeforeThisList = false;
            if (payload.mouseX < payload.listXCenter) addBeforeThisList = true;
            let allLists = selectAll(state);

            // Remove the list that dispatched this action from it's current position
            allLists = allLists.filter(list => list.id !== payload.draggedItemState.id);
            
            let thisListIndex = 0;
            allLists.forEach((list, i) => list.id === payload.id ? thisListIndex = i : null);

            allLists.splice(addBeforeThisList ? thisListIndex : thisListIndex + 1, 0, payload.draggedItemState);
            console.log(allLists, addBeforeThisList);
            allLists = allLists.map((list, i) => {
                return {...list, index: i}
            });
            listAdapter.upsertMany(state, allLists);
        }
        }
})

// Export reducer
export default listSlice.reducer;

// Export action creators
export const {listAdded, listUpdated, listRemoved, 
                cardAdded, cardRemoved, cardUpdated, cardChangedList, cardMoved, listMoved} = listSlice.actions;

// Export selectors
const {selectAll, selectById} = listAdapter.getSelectors();

export const selectLists = state => selectAll(state.lists);
export const selectOne = (state, id) => selectById(state.lists, id);