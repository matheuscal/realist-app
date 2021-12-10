import React, { useRef, useState } from 'react';
import { listAdded, selectLists } from '../reducers/listSlice';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../components/Header';
import Footer from '../components/Footer';
import List from '../components/List';
import './app.scss';

export default function App(){
    const dispatch = useDispatch();
    const allLists = useSelector(selectLists);
    const draggedCard = useRef(null);
    const draggedCardState = useRef(null);

    function addList(){
        dispatch(listAdded());
    }
    function renderLists(){
        const listComponents = allLists.map(({id}) => {
            return <List id={id} key={id} draggedCard={draggedCard} draggedCardState={draggedCardState} />
         });
        return(listComponents || null);
    }
    return (
        <div id='appView'>
            <div id="bg" className='bg-black'></div>
            <Header />
            <div id="dashboard">
                <div className="list-container">
                    {renderLists()}
                    <button type='button' className="list-container__new-list" onClick={addList}>Add a new list</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}
