import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './list.scss';
import ListItem from './ListItem';
import EditableTopic from './EditableTopic';

export default function List(){
    const [editing, setEditing] = useState(false);
    
    function enterEditMode(e){
        setEditing(true);
    }
    function leaveEditMode(e){
        setEditing(false);
    }

    function renderListHeader(){
        if (!editing)
            return(
            <div className="list-header-wrapper" onClick={enterEditMode}>
            <div className="list-header">
                <div>
                    <h2 className="list-header__title">List name</h2>
                    <div className='list-id'>
                        <span className='list-id__label'>Id: </span>
                        <span className="list-id__value">#uniqueId</span>
                    </div>
                </div>
                <Link to='#' className="list-header__remove-btn"></Link>
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
            <div className="list-header-wrapper--edit-mode">
            <div className="list-header">
                <div>
                    <div className='display-flex'>
                        <label className='list-header__title-label'>Title:</label>
                        <input type='text' className="list-header__title--edit-mode" placeholder='List title' value="List name" autoFocus="true"/>
                    </div>
                    <div className='list-id--edit-mode'>
                        <label className='list-id__label--edit-mode'>Id: </label>
                        <input className="list-id__value--edit-mode" placeholder="Use list ids to reference them elsewhere" value="#uniqueId"/>
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
                <button className="list-controls__save-list-btn">Save list</button>
                <button className="list-controls__remove-list-btn">Remove</button>
                <div className="list-controls__color-picker"></div>
            </div>
            </div>
            <div className="edit-cover" onClick={leaveEditMode}></div>
            </div>
            )
        
    }
    return(
        <div className="list">
            {renderListHeader()}
            <div className="card-list">
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
                <button className="card-list__add-card" type='button'>Add a new card</button>
            </div>
        </div>
    )
}