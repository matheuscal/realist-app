import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { cardRemoved, cardUpdated } from '../reducers/listSlice';
import { Link } from 'react-router-dom';


import EditableTopic from './EditableTopic';

import './listItem.scss';

export default function ListItem(props){
    const dispatch = useDispatch();
    // This state is responsible for making the card enter and leave the edit mode.
    const [editing, setEditing] = useState(false);
    const [cardId, setCardId] = useState(props.cardId);
    const [content, setContent] = useState(props.content);

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
    function handleRemoveCard(e){
        e.stopPropagation();
        dispatch(cardRemoved({parentId: props.parentId, id: props.id}));
    }
    function handleCardSave(e){
        e.preventDefault();
        dispatch(cardUpdated({parentId: props.parentId, id: props.id, content, cardId}));
        leaveEditMode();
    }
    function handleDragStart(e){
        e.currentTarget.classList.add('dragging');
        props.draggedCard.current = e.currentTarget;
        props.draggedCardState.current = {id: props.id, parentId: props.parentId, content: props.content};
    }
    function handleDragEnd(e){
        e.target.classList.remove('dragging');
        
    }
    if (!editing){
        return (
            <div className="card" onClick={enterEditMode} draggable={true} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className='card-header'>
                    <div className="card-header-id">
                    <span className="card-header-id__label">Id:</span>
                    <span className="card-header-id__value">{props.cardId}</span>
                    </div>
                    <Link to='#' className='card-header__remove-btn display-none' onClick={handleRemoveCard} />
                </div>
                <ul className="card-topics">
                        <li className="card-topics__item">Topic</li>
                        <li className="card-topics__item">Topic</li>
                </ul>
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
                    <label htmlFor='cardId' className="card-header-id__label--edit-mode">Id:</label>
                    <input type='text' className="card-header-id__value--edit-mode" value={cardId} onChange={handleCardIdChange} placeholder="Unique card identifier"/>
                </div>
                <button className='card-header__remove-btn display-block' onClick={leaveEditMode} />
            </div>
            <ul className="card-topics">
                <EditableTopic />
                <EditableTopic />
                <button className='card-topics__add-topic' />
            </ul>
            <textarea className="card-content--edit-mode" value={content} onChange={handleCardContentChange} autoFocus={true} placeholder='Card content. Example: Do the dishes'/>
            <div className="card-controls">
                <button type='submit' className="card-controls__save-card-btn">Save card</button>
                <button type='button' className="card-controls__remove-card-btn" onClick={handleRemoveCard}>Remove</button>
            </div>
        </form>
        <div className="edit-cover" onClick={leaveEditMode}></div>
        </div>
    )
}