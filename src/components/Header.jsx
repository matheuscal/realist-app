import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectTopics, addOne } from '../reducers/topicSlice';
import { selectFilters, queryUpdated, colorAdded, colorRemoved } from '../reducers/filterSlice';
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
    const [searchInputVal, setSearchInputVal] = useState("");

    useEffect(()=> {
        dispatch(queryUpdated(searchInputVal))
    },[searchInputVal]);
    
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
    function handleColorPickerClick(){
        if (displayColorPickerList) setDisplayColorPickerList(false);
        else setDisplayColorPickerList(true);
    }
    function handleColorPickerListClick(bgColorClass){
        setBgColor(bgColorClass);
    }
    function handleSearchInputChange(e){
        setSearchInputVal(e.currentTarget.value);
    }
    function handleColorFilterClick(e){
        if (!e.currentTarget.classList.contains("selected"))
        {
            e.currentTarget.classList.add('selected');
            dispatch(colorAdded(e.currentTarget.value));
        }
        else {
            e.currentTarget.classList.remove('selected');
            dispatch(colorRemoved(e.currentTarget.value));
        }
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
                            <input className="filter-search__input" type="text" placeholder="Search names, texts, topics and aliases..." val={searchInputVal} onChange={handleSearchInputChange}/>
                        </form>
                        <div className="filter-color">
                            <p className="filter-color__label">Color filter:</p>
                            <ul className="colors">
                                <li><button className="colors__green" value="list--bg-green" onClick={handleColorFilterClick}></button></li>
                                <li><button className="colors__blue" value="list--bg-blue" onClick={handleColorFilterClick}></button></li>
                                <li><button className="colors__red" value="list--bg-red" onClick={handleColorFilterClick}></button></li>
                                <li><button className="colors__black" value="list--bg-black" onClick={handleColorFilterClick}></button></li>
                                <li><button className="colors__purple" value="list--bg-purple" onClick={handleColorFilterClick}></button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="topics">
                        {renderTopics()}
                        {renderAddTopicForm()}
                        <button className="add-topic-btn" onClick={handleAddTopicClick}>{topics.length? null : "Create a new topic"}</button>
                    </div>
                </div>
                <div id='bgColorPicker' className={colorPickerClass} onClick={handleColorPickerClick}>
                    {renderColorPickerList()}
                </div>
            </div>
        </header>
    )
}