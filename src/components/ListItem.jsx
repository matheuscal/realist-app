
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './listItem.scss';
import EditableTopic from './EditableTopic';

export default function ListItem(){
    const [editing, setEditing] = useState(false);

    function removeCard(e){
        e.stopPropagation();
    }
    function enterEditMode(e){
        setEditing(true);
    }
    function leaveEditMode(e){
        setEditing(false);
    }
    if (!editing){
        return (
            <div className="card" onClick={enterEditMode}>
                <div className='card-header'>
                    <div className="card-header-id">
                    <span className="card-header-id__label">Id:</span>
                    <span className="card-header-id__value">#uniqueId</span>
                    </div>
                    <Link to='#' className='card-header__remove-btn display-none' onClick={removeCard} />
                </div>
                <ul className="card-topics">
                        <li className="card-topics__item">Topic</li>
                        <li className="card-topics__item">Topic</li>
                </ul>
                <div className="card-content">
                    <p>List item</p>
                </div>
            </div>
        )
    }
    return (
        <div>
        <div className="card card--edit-mode">
            <div className='card-header'>
                <div className="card-header-id">
                    <label htmlFor='cardId' className="card-header-id__label--edit-mode">Id:</label>
                    <input type='text' className="card-header-id__value--edit-mode" value='#uniqueId'/>
                </div>
                <button className='card-header__remove-btn display-block' onClick={leaveEditMode} />
            </div>
            <ul className="card-topics">
                <EditableTopic />
                <EditableTopic />
                <button className='card-topics__add-topic' />
            </ul>
            <textarea className="card-content--edit-mode" value='List item' autoFocus="true"/>
            <div className="card-controls">
                <button className="card-controls__save-card-btn">Save card</button>
                <button className="card-controls__remove-card-btn">Remove</button>
            </div>
        </div>
        <div className="edit-cover" onClick={leaveEditMode}></div>
        </div>
    )
}