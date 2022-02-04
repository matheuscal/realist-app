import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectTopics, addOne } from '../reducers/topicSlice';
import ColorPicker from './ColorPicker';
import Topic from './Topic'

import './header.scss';


export default function Header({setBgColor}){
    const dispatch = useDispatch();
    let topics = useSelector(selectTopics); 
    const [displayAddTopicForm, setDisplayAddTopicForm] = useState(false);
    const [newTopicValue, setNewTopicValue] = useState("");
    const [displayColorPickerList, setDisplayColorPickerList] = useState("");
    const [colorPickerClass, setColorPickerClass] = useState("color-picker-square--black");

    function handleAddTopicClick(){
        setDisplayAddTopicForm(true);
        setNewTopicValue("");
    }
    function handleAddTopicFormSubmit(e){
        e.preventDefault();
        if (newTopicValue.length){ 
            dispatch(addOne(newTopicValue));
            setDisplayAddTopicForm(false);
        }
    }
    function handleAddTopicInputChange(e){
        setNewTopicValue(e.currentTarget.value);
    }
    function handleAddTopicFormClose(e){
        setDisplayAddTopicForm(false);
    }
    function handleColorPickeClick(){
        if (displayColorPickerList) setDisplayColorPickerList(false);
        else setDisplayColorPickerList(true);
    }
    function handleColorPickerListClick(bgColorClass){
        setBgColor(bgColorClass);
    }

    // --------------- Render Functions ---------------- //
    function renderColorPickerList(){
        if (displayColorPickerList) {
            let colorSquareClasses = ["color-picker-square--red", "color-picker-square--blue", "color-picker-square--green", "color-picker-square--black", "color-picker-square--purple"];
            // Removes the already selected color from the color picker dropdown
            let indexOfClassesToHide = colorSquareClasses.indexOf(colorPickerClass)
            return (
                < ColorPicker colorSquareClasses={colorSquareClasses} bgClasses={["bg--red", "bg--blue", "bg--green", "bg--black", "bg--purple"]} onSquareClick={handleColorPickerListClick} setColorPickerClass={setColorPickerClass} indexOfClassesToHide={indexOfClassesToHide} />
            )
        }
    }
    function renderTopics(){
        if (topics.length) {
            const topicsList = topics.map(topic => <Topic id={topic.id} value={topic.value} key={topic.id} />)
            return topicsList;
        }
    }
    function renderAddTopicForm(){
        if (displayAddTopicForm) {
            return (
                <div>
                <form className="new-topic-form" onSubmit={handleAddTopicFormSubmit} value={newTopicValue}>
                    <input autoFocus={true} type="text" autoCorrect="false" placeholder="Topic title" onChange={handleAddTopicInputChange} />
                    <div className="new-topic-form-controls">
                    <button type='submit' className='new-topic-form-controls__submit'></button>
                    <button type='button' className='new-topic-form-controls__close' onClick={handleAddTopicFormClose}></button>
                    </div>
                </form>
                <div className="edit-cover" onClick={handleAddTopicFormClose}></div>
                </div>
            )
        }
    }
    return (
        <header>
            <Link id='logo' to='/'>ReaList</Link>
            <div className='display-flex'>
                <div className="filter">
                    <div>
                        <form action="" className='filter-search'>
                            <input className="filter-search__input" type="text" placeholder="Search names, texts, topics and aliases..."/>
                        </form>
                        <div className="filter-color">
                            <p className="filter-color__label">Color filter:</p>
                            <ul className="colors">
                                <li className="colors__green"></li>
                                <li className="colors__blue"></li>
                                <li className="colors__red"></li>
                                <li className="colors__black"></li>
                                <li className="colors__purple"></li>
                            </ul>
                        </div>
                    </div>
                    <div className="topics">
                        {renderTopics()}
                        {renderAddTopicForm()}
                        <button className="add-topic-btn" onClick={handleAddTopicClick}>{topics.length? null : "Create a new topic"}</button>
                    </div>
                </div>
                <div id='bgColorPicker' className={colorPickerClass} onClick={handleColorPickeClick}>
                    {renderColorPickerList()}
                </div>
            </div>
        </header>
    )
}