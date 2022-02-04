import React, {useState} from 'react';
import './topic.scss';

export default function EditableTopic({value, onClick}){
    const [displayText, setDisplayText] = useState(value);
    function handleMouseEnter(e){
        setDisplayText(`${value} (Remove)`);
    }
    function handleMouseLeave(e){
        setDisplayText(value);
    }
    return(
        <li className="editable-topic" onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{displayText}</li>
    )
}