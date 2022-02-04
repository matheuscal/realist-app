import React, { useRef, useState } from 'react';
import { selectLists, listAdded } from '../reducers/listSlice';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../components/Header';
import Footer from '../components/Footer';
import List from '../components/List';
import './app.scss';

export default function App(){
    const dispatch = useDispatch();
    const allLists = useSelector(selectLists);
    const draggedItemState = useRef(null);
    const draggedItemElem = useRef(null);
    const [bgColor, setBgColor] = useState("");

    function addList(){
        dispatch(listAdded());
    }
    function renderLists(){
        const listComponents = allLists.map(({id}) => {
            return <List id={id} key={id} draggedItemState={draggedItemState} draggedItemElem={draggedItemElem} />
         });
        return(listComponents || null);
    }
    return (
        <div id='appView'>
            <div id="bg" className={bgColor} ></div>
            <Header setBgColor={setBgColor} />
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
