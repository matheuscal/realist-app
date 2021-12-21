import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOne, listUpdated, listRemoved, cardAdded, cardChangedList, cardRemoved, cardUpdated } from '../reducers/listSlice';

import EditableTopic from './EditableTopic';
import ListItem from './ListItem';

import './list.scss';

export default function List({id, draggedCardState, draggedCardElem}){
    const thisList = useSelector((state) => selectOne(state, id));
    const dispatch = useDispatch();

    // This state is responsible for making the list enter and leave the edit mode.
    const [editing, setEditing] = useState(true);
    const [listTitle, setListTitle] = useState(thisList.title);
    const [listId, setListId] = useState(thisList.listId);
    const [displayPlaceholderCard, setDisplayPlaceholderCard] = useState(false);
    const cardListElement = useRef();

    function enterEditMode(e){
        setEditing(true);
    }
    function leaveEditMode(e){
        setEditing(false);
    }
    function handleListTitleChange(e){
        setListTitle(e.currentTarget.value);
    }
    function handleListIdChange(e){
        // disallow the use of spaces for ids
        const idValue = e.currentTarget.value.trim();
        setListId(idValue);
    }
    function handleListSave(e){
        e.preventDefault();
        dispatch(listUpdated({ id, changes: {title: listTitle, listId} }));
        leaveEditMode();
    }
    function handleListRemove(e){
        dispatch(listRemoved(id));
    }
    function handleAddCard(){
        dispatch(cardAdded({parentId: id}));
    }
    function handleDragEnter(e){
        if (!thisList.cards.length)
            setDisplayPlaceholderCard(true);
    }
    function handlePlaceholderCardDragLeave(e){
        setDisplayPlaceholderCard(false);
    }
    function handlePlaceholderCardDragOver(e){
        e.preventDefault();
    }
    function handlePlaceholderCardDrop(e){
        dispatch(cardRemoved({id: draggedCardState.current.id, parentId: draggedCardState.current.parentId}));
        dispatch(cardAdded({...draggedCardState.current, parentId: id}));
        setDisplayPlaceholderCard(false);
    }

    function renderListHeader(){
        if (!editing)
            return(
            <div className="list-header-wrapper" onClick={enterEditMode}>
            <div className="list-header">
                <div>
                    <h2 className="list-header__title">{thisList.title}</h2>
                    <div className='list-id'>
                        <span className='list-id__label'>Id: </span>
                        <span className="list-id__value">{thisList.listId}</span>
                    </div>
                </div>
                <Link to='#' className="list-header__remove-btn" onClick={handleListRemove}></Link>
            </div>
            <div className="list__color-picker display-none"></div>
                <ul className="list-topics">
                    <li className="list-topics__item">Topic</li>
                    <li className="list-topics__item">Topic</li>
                    <li className="list-topics__item">Topic</li>
                    <li className="list-topics__item">Topic</li>
                </ul>
            </div>
            )

            return(
                <div>
                <form onSubmit={handleListSave} className="list-header-wrapper--edit-mode">
                <div className="list-header">
                    <div>
                        <div className='display-flex'>
                            <label className='list-header__title-label'>Title:</label>
                            <input type='text' className="list-header__title--edit-mode" placeholder='List title' onChange={handleListTitleChange} value={listTitle} autoFocus={true}/>
                        </div>
                        <div className='list-id--edit-mode'>
                            <label className='list-id__label--edit-mode'>Id: </label>
                            <input className="list-id__value--edit-mode" placeholder="List unique identifier" onChange={handleListIdChange} value={listId}/>
                        </div>
                    </div>
                    <Link to='#' className="list-header__remove-btn display-block" onClick={leaveEditMode}></Link>
                </div>
                    <ul className="list-topics">
                        <EditableTopic />
                        <EditableTopic />
                        <EditableTopic />
                        <EditableTopic />
                    </ul>
                <div className="list-controls">
                    <button className="list-controls__save-list-btn" type='submit'>Save list</button>
                    <button className="list-controls__remove-list-btn" type='button' onClick={handleListRemove}>Remove</button>
                    <div className="list-controls__color-picker"></div>
                </div>
                </form>
                <div className="edit-cover" onClick={leaveEditMode}></div>
                </div>
                )
            
    }
    function renderCards(){
        const thisListCards = [...thisList.cards];
        const cardsToRender = thisListCards.map(({cardId, id, parentId, content, topics}, i) => <ListItem content={content} topics={topics} id={id} cardId={cardId} parentId={parentId} key={id} draggedCardState={draggedCardState} draggedCardElem={draggedCardElem} />)
        return cardsToRender;
    }
    function renderPlaceholderCard(){
        if (displayPlaceholderCard){
            return (
                <div className="card-list__placeholder-card" onDrop={handlePlaceholderCardDrop} onDragOver={handlePlaceholderCardDragOver} onDragLeave={handlePlaceholderCardDragLeave}></div>
            )
        }
        else return null;
    }
    return(
        <div className="list">
            {renderListHeader()}
            <div className='list-content' onDragEnter={handleDragEnter}>
                <div className="card-list" ref={cardListElement} >
                    {renderCards()}
                    {renderPlaceholderCard()}
                </div>
                <button className="list__add-card" type='button' onClick={handleAddCard}>Add a new card</button>
            </div>
        </div>
    )
}