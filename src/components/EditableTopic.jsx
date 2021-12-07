import React from 'react';
import './editableTopic.scss';

export default function EditableTopic(props){
    function handleMouseEnter(e){
        e.target.innerText = "Remove";
    }
    function handleMouseLeave(e){
        e.target.innerText = "Topic";
    }
    return(
        <li className="editable-topic" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Topic</li>
    )
}