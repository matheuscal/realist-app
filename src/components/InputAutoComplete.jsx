import { nanoid } from '@reduxjs/toolkit';
import React, { useState } from 'react'
import { useEffect } from 'react';
import './inputAutoComplete.scss'

export default function InputAutoComplete({optionsList, newTopicValue, setNewTopicValue}){
    const [optionsObjects, setOptionsObjects] = useState([]);
    const [optionInFocus, setOptionInFocus] = useState(""); // Receives OptionObject.id

    useEffect(()=> {
        let newOptionsObjects = optionsList.map(optionVal => {
            return new OptionObject(optionVal, false, nanoid(10));    
        })
        setOptionsObjects(newOptionsObjects);
    }, [optionsList]);

    function onOptionMouseEnter(id){
        setOptionInFocus(id);
    }
    function onOptionMouseLeave(){
        setOptionInFocus("");
    }
    function onOptionClick() {
        let chosenOptionVal = optionsObjects.find(value => value.id === optionInFocus).value;
        setNewTopicValue(chosenOptionVal);
    }
    function renderOptionsList(){
        // Filter which topic options will be displayed based on the input value `newTopicValue`
        let filteredOptionsList = optionsObjects.filter(option => option.value.includes(newTopicValue));
        let optionsElems = filteredOptionsList.map(option => {
            let isThisOptionActive = optionInFocus === option.id ? true : false;
            return <InputAutoCompleteItem value={option.value} isActive={isThisOptionActive} id={option.id} key={option.id} 
                    handleOptionMouseEnter={onOptionMouseEnter} handleOptionClick={onOptionClick} handleOptionMouseLeave={onOptionMouseLeave}/>
        });

        if (optionsElems.length) return optionsElems;
        return <p>No item matching input.</p>
    }
    return(
        <div className='input-auto-complete'>
            <ul>
                {renderOptionsList()}
            </ul>
        </div>
    )
}

class OptionObject {
    constructor(value, isActive, optionId){
        this.value = value;
        this.isActive = isActive;
        this.id = optionId;
    }
}

function InputAutoCompleteItem({id, value, isActive, handleOptionMouseEnter, handleOptionMouseLeave, handleOptionClick}) {
    return (
        <li className={isActive ? "--active" : null} 
          onMouseEnter={()=>handleOptionMouseEnter(id)} onMouseLeave={()=>handleOptionMouseLeave()} onClick={handleOptionClick}>{value}</li>
    ) 
}