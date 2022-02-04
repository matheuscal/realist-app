import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { cardRemoved, cardUpdated, cardMoved } from '../reducers/listSlice';

import './listItem.scss';

export default function ListItem(props){
    const dispatch = useDispatch();
    // This state is responsible for making the card enter and leave the edit mode.
    const [editing, setEditing] = useState(props.editing);
    const [cardId, setCardId] = useState(props.cardId);
    const [content, setContent] = useState(props.content);
    const thisCardElem = useRef();
    function enterEditMode(e){
        setEditing(true);
    }
    function leaveEditMode(e){
        setEditing(false);
    }
    function handleCardIdChange(e){
        // disallow the use of spaces for ids
        const newCardId = e.currentTarget.value.trim();
        setCardId(newCardId);
    }
    function handleCardContentChange(e){
        setContent(e.currentTarget.value);
    }
    function removeCard(e){
        dispatch(cardRemoved({parentId: props.parentId, id: props.id}));
    }
    function handleCardSave(e){
        e.preventDefault();
        dispatch(cardUpdated({parentId: props.parentId, id: props.id, content, cardId}));
        leaveEditMode();
    }
    function handleDragStart(e){
        e.stopPropagation();
        e.currentTarget.classList.add('dragging');
        console.log(props.cardId);
        props.draggedItemState.current = {id: props.id, parentId: props.parentId, cardId: props.cardId, content: props.content, type: props.type};
        props.draggedItemElem.current = e.currentTarget;
    }
    function handleDragEnd(e){
        e.target.classList.remove('dragging');
        
    }
    function handleDragOver(e){
        e.preventDefault();
        e.stopPropagation();
        if (props.draggedItemState.current.type === 'card')
            e.currentTarget.classList.add('card--with-border');
    }
    function handleDragLeave(e){
        e.currentTarget.classList.remove('card--with-border');
    }
    function handleDrop(e){
        e.stopPropagation();
        const boundaries = e.currentTarget.getBoundingClientRect();
        const mouseY = e.clientY;
        const cardYCenter = boundaries.y + (boundaries.height/2);
        dispatch(cardMoved({id: props.id, parentId: props.parentId, mouseY, thisCardYCenter: cardYCenter, thisCardIndex: props.cardIndex, draggedItemState: props.draggedItemState.current}));
        e.currentTarget.classList.remove('card--with-border');
    }

    if (!editing){
        return (
            <div className="card" ref={thisCardElem} onClick={enterEditMode} draggable={true} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave}>
                <div className='card-header'>
                    <div className="card-header-id">
                    <span className="card-header-id__label">{props.cardId ? 'Alias: ' : null}</span>
                    <span className="card-header-id__value">{props.cardId}</span>
                    </div>
                    <button type="button" className='card-header__remove-btn display-none' onClick={removeCard} />
                </div>
                <div className="card-content">
                    <p>{props.content}</p>
                </div>
            </div>
        )
    }
    return (
        <div>
        <form className="card card--edit-mode" onSubmit={handleCardSave}>
            <div className='card-header'>
                <div className="card-header-id">
                    <label htmlFor='cardId' className="card-header-id__label--edit-mode">Alias:</label>
                    <input type='text' className="card-header-id__value--edit-mode" value={cardId} onChange={handleCardIdChange} placeholder="Card alternative name (no spaces)"/>
                </div>
                <button className='card-header__remove-btn display-block' onClick={leaveEditMode} />
            </div>
            <textarea className="card-content--edit-mode" value={content} onChange={handleCardContentChange} autoFocus={true} placeholder='Card content. Example: Do the dishes'/>
            <div className="card-controls">
                <button type='submit' className="card-controls__save-card-btn">Save card</button>
                <button type='button' className="card-controls__remove-card-btn" onClick={removeCard}>Remove</button>
            </div>
        </form>
        <div className="edit-cover" onClick={leaveEditMode}></div>
        </div>
    )
}