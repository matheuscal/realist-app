import React, { useRef, useState, useEffect } from 'react';
import { selectLists, listAdded } from '../reducers/listSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilters } from '../reducers/filterSlice';
import { selectTopics } from '../reducers/topicSlice';

import Header from '../components/Header';
import Footer from '../components/Footer';
import List from '../components/List';
import './app.scss';

export default function App(){
    const dispatch = useDispatch();
    const allLists = useSelector(selectLists);
    const allTopics = useSelector(selectTopics);

    const draggedItemState = useRef(null);
    const draggedItemElem = useRef(null);
    const [bgColor, setBgColor] = useState("");
    const filters = useSelector(selectFilters);
    const [isFiltered, setIsFiltered] = useState(false); // A flag which is true when lists are being filtered inside renderLists()

    function addList(){
        dispatch(listAdded());
    }
    function renderLists(){
        let filteredLists = [...allLists];
        
        filteredLists = filteredLists.filter(list => {
            // This function's logic could be refactored in a cleaner way
            let queryMatch, colorMatch = undefined;
            // Filter based on search query
            if (filters.query.length){
                if (!isFiltered) setIsFiltered(true);
                queryMatch = false;
                // Filter list params
                if (list.title.toUpperCase().includes(filters.query)) queryMatch = true;
                for (let i = 0; i < list.cards.length; i++) {
                    // Filter card params
                    if (list.cards[i].cardId.toUpperCase().includes(filters.query) || list.cards[i].content.toUpperCase().includes(filters.query))
                    queryMatch = true;
                }
                // Filter topics
                for (let i = 0; i < allTopics.length; i++) {
                    if (allTopics[i].listIdsContaining.includes(list.id) && 
                        allTopics[i].value.toUpperCase().includes(filters.query))
                        queryMatch = true;
                }

            }
            // Filter based on colors
            if (filters.colors.length) {
                colorMatch = false;
                if (!isFiltered) setIsFiltered(true);
                for (let i = 0; i < filters.colors.length; i++){
                    console.log(filters.colors[i] );
                    if (list.bgColorClass === filters.colors[i])
                    colorMatch = true;
                }
            }
            if (colorMatch === undefined && queryMatch === undefined) if (isFiltered) setIsFiltered(false);
            if (isFiltered && (colorMatch === false || queryMatch === false)) { 
            return false;
            }

            return true;
        })

        const listComponents = filteredLists.map(({id}) => {
            return <List id={id} key={id} draggedItemState={draggedItemState} draggedItemElem={draggedItemElem} />
         });
         if(listComponents.length) return(listComponents);
         else if (isFiltered) return <h3>No search results.</h3>
    }
    return (
        <div id='appView'>
            <div id="bg" className={bgColor} ></div>
            <Header setBgColor={setBgColor} />
            <div id="dashboard">
                <div className="list-container">
                    {renderLists()}
                    {isFiltered ? null : <button type='button' className="list-container__new-list" onClick={addList}>Add a new list</button> }
                </div>
            </div>
            <Footer />
        </div>
    )
}
