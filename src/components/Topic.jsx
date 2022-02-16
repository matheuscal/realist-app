import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { removeOne } from '../reducers/topicSlice';

function Topic({id, value}){
    const [displayText, setDisplayText] = useState(value)
    const dispatch = useDispatch();

    function handleMouseEnter(){
        setDisplayText(`${value} (Remove)`);
    }
    function handleMouseLeave(){
        setDisplayText(value);
    }
    function handleClick(){
        dispatch(removeOne(id));
    }
    return (
        <button className='topic' onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{displayText}</button>
    )
}

export default Topic;