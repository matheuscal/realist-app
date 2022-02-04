import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOne, listUpdated, listRemoved, cardAdded, cardRemoved, listMoved } from '../reducers/listSlice';
import { selectTopics, addListIdToTopic, removeListIdFromTopic } from '../reducers/topicSlice';

import EditableTopic from './EditableTopic';
import ListItem from './ListItem';
import InputAutoComplete from './InputAutoComplete';
import ColorPicker from './ColorPicker';

import './list.scss';

export default function List({id, draggedItemState, draggedItemElem}){
    const dispatch = useDispatch();
    
    // Make thisList be a state too?
    const thisList = useSelector((state) => selectOne(state, id));
    const allTopics = useSelector(selectTopics);
    const listTopics = useMemo(()=> {
        let topics = allTopics.filter(topic => {
            if (topic.listIdsContaining.includes(id)) return true;
        })
        return topics;
    }, [allTopics]);

    // This state is responsible for making the list enter and leave the edit mode.
    const [editing, setEditing] = useState(true);
    const [listTitle, setListTitle] = useState(thisList.title);
    const [listId, setListId] = useState(thisList.listId);
    const [displayPlaceholderCard, setDisplayPlaceholderCard] = useState(false);
    const [displayAddTopicForm, setDisplayAddTopicForm] = useState(false);
    const [newTopicValue, setNewTopicValue] = useState("");
    const [displayTopicAutoComplete, setDisplayTopicAutoComplete] = useState(false);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [bgColor, setBgColor] = useState("");
    const [colorPickerClass, setColorPickerClass] = useState("color-picker-square--black"); // Sets the color for the color picker "button"

    useEffect(() => {
        setBgColor(thisList.bgColorClass)
    }, [thisList.bgColorClass])

    let listWrapperElem = useRef();

    function enterEditMode(e){
        setEditing(true);
    }
    function leaveEditMode(e){
        // Reset bg color to the saved bg color
        setBgColor(thisList.bgColorClass);
        setEditing(false);
    }
    function handleListTitleChange(e){
        setListTitle(e.currentTarget.value);
    }
    function handleListIdChange(e){
        // disallow the use of spaces for ids
        const idValue = e.currentTarget.value.trim();
        setListId(idValue);
    }
    function handleListSave(e){
        e.preventDefault();
        dispatch(listUpdated({ id, changes: {title: listTitle, listId, topics: listTopics, bgColorClass: bgColor} }));
        leaveEditMode();
    }
    function handleListRemove(e){
        dispatch(listRemoved({id}));
    }
    function handleAddCard(){
        dispatch(cardAdded({parentId: id, editing: true}));
    }
    function handleListContentDragEnter(e){
        console.log(draggedItemState);
        if (!thisList.cards.length && draggedItemState.current.type === 'card')
            setDisplayPlaceholderCard(true);
    }
    function handlePlaceholderCardDragLeave(e){
        setDisplayPlaceholderCard(false);
    }
    function handlePlaceholderCardDragOver(e){
        e.preventDefault();
    }
    function handlePlaceholderCardDrop(e){
        dispatch(cardRemoved({id: draggedItemState.current.id, parentId: draggedItemState.current.parentId}));
        dispatch(cardAdded({...draggedItemState.current, parentId: id, editing: false}));
        setDisplayPlaceholderCard(false);
    }
    function handleHeaderDragStart(e){
        draggedItemState.current = {...thisList};
        listWrapperElem.current.classList.add('dragging');
    }
    function handleHeaderDragEnd(e){
        listWrapperElem.current.classList.remove('dragging');
    }
    function handleHeaderDragLeave(e){
        listWrapperElem.current.classList.remove('list-wrapper--with-right-border');
        listWrapperElem.current.classList.remove('list-wrapper--with-left-border');
    }
    function handleHeaderDragOver(e) {
        e.preventDefault();
        const mouseAfterCenter = isMouseXAfterListXCenter(e);
        if (draggedItemState.current.id !== id){
            if (mouseAfterCenter){
                listWrapperElem.current.classList.add('list-wrapper--with-right-border');
                listWrapperElem.current.classList.remove('list-wrapper--with-left-border');
            }
            else {
                listWrapperElem.current.classList.add('list-wrapper--with-left-border');
                listWrapperElem.current.classList.remove('list-wrapper--with-right-border');
            }
        }
    }
    function handleHeaderDrop(e){
        const mouseX = e.clientX;
        const listRect = e.currentTarget.getBoundingClientRect();
        const listXCenter = listRect.x + (listRect.width/2);
        dispatch(listMoved({id, draggedItemState: draggedItemState.current, mouseX, listXCenter}));
        listWrapperElem.current.classList.remove('list-wrapper--with-right-border');
        listWrapperElem.current.classList.remove('list-wrapper--with-left-border');
    }
    function handleAddTopicClick(e){
        setDisplayAddTopicForm(true);
    }
    function handleAddTopicFormSubmit(e){
        let topicToChange = allTopics.filter(topic => {
            if (topic.value === newTopicValue) {
                return true;
            }
        });
        if (topicToChange.length) {
            dispatch(addListIdToTopic({listId: id, topicId: topicToChange[0].id}));
            setDisplayAddTopicForm(false);
            setNewTopicValue("");
        }
    }
    function handleAddTopicFormClose(){
        setDisplayAddTopicForm(false);
        setNewTopicValue("");
    }
    function handleAddTopicInputChange(e){
        setNewTopicValue(e.currentTarget.value);
    }
    function handleAddTopicFormFocus(){
        if (!displayTopicAutoComplete) setDisplayTopicAutoComplete(true);
    }
    function handleEditableTopicClick(topicId){
        dispatch(removeListIdFromTopic({listId: id, topicId}));
    }
    function handleColorPickerListClick(bgColorClass){
        setBgColor(bgColorClass)
    }
    // -------------- Render functions -------------- //
    function renderColorPickerList(){
        if (displayColorPicker) {
            let colorSquareClasses = ["color-picker-square--red", "color-picker-square--blue", "color-picker-square--green", "color-picker-square--black", "color-picker-square--purple"];
            // Removes the already selected color from the color picker dropdown
            let indexOfClassesToHide = colorSquareClasses.indexOf(colorPickerClass)
            return (
                < ColorPicker indexOfClassesToHide={indexOfClassesToHide} colorSquareClasses={colorSquareClasses} bgClasses={["list--bg-red", "list--bg-blue", "list--bg-green", "list--bg-black", "list--bg-purple"]} onSquareClick={handleColorPickerListClick} setColorPickerClass={setColorPickerClass}/>
            )
        }
    }
    function renderTopicAutoComplete(){
        if (displayTopicAutoComplete){
            let optionsList = allTopics.map(topic => topic.value);
            return(
                <InputAutoComplete optionsList={optionsList} setNewTopicValue={setNewTopicValue} newTopicValue={newTopicValue} />
            )
        }
    }
    function renderAddTopicForm(){
        if (displayAddTopicForm) {
            return (
                <div>
                <div className="new-topic-form">
                    <input autoFocus={true} type="text" autoCorrect="false" placeholder="Topic title" onChange={handleAddTopicInputChange} value={newTopicValue} onFocus={handleAddTopicFormFocus}/>
                    <div className="new-topic-form-controls">
                    <button type="button" className='new-topic-form-controls__submit' onClick={handleAddTopicFormSubmit}></button>
                    <button type="button" className='new-topic-form-controls__close' onClick={handleAddTopicFormClose}></button>
                    </div>
                {renderTopicAutoComplete()}
                </div>
                <div className="edit-cover" onClick={handleAddTopicFormClose}></div>
                </div>
            )
        }
    }
    function renderTopics(){
        let topicsComponents = null;
        if (listTopics.length) {
            topicsComponents = listTopics.map(topic => (<li className="list-topics__item" key={topic.id}>{topic.value}</li>))
        }
        return topicsComponents;
        
    }
    function renderEditableTopics(){
        let topicsComponents = null;
        console.log(listTopics);
        if (listTopics.length) {
            topicsComponents = listTopics.map(topic => <EditableTopic value={topic.value} key={topic.id} onClick={() => handleEditableTopicClick(topic.id)}/>)
        }
        return topicsComponents;
    }
    function renderListHeader(){
        if (!editing)
            return(
            <div className="list-header-wrapper" onClick={enterEditMode} draggable={true} onDragStart={handleHeaderDragStart} onDragOver={handleHeaderDragOver} onDrop={handleHeaderDrop} onDragLeave={handleHeaderDragLeave} onDragEnd={handleHeaderDragEnd}>
            <div className="list-header">
                <div>
                    <h2 className="list-header__title">{thisList.title}</h2>
                    <div className='list-id'>
                        <span className='list-id__label'>{thisList.listId ? `Alias: ` : null}</span>
                        <span className="list-id__value">{thisList.listId}</span>
                    </div>
                </div>
                <Link to='#' className="list-header__remove-btn" onClick={handleListRemove}></Link>
            </div>
                <ul className="list-topics">
                    {renderTopics()}
                </ul>
            </div>
            )

            return(
                <div>
                <form onSubmit={handleListSave} className="list-header-wrapper--edit-mode">
                <div className="list-header">
                    <div>
                        <div className='display-flex'>
                            <label className='list-header__title-label'>Title:</label>
                            <input type='text' className="list-header__title--edit-mode" placeholder='List title' onChange={handleListTitleChange} value={listTitle} autoFocus={true}/>
                        </div>
                        <div className='list-id--edit-mode'>
                            <label className='list-id__label--edit-mode'>Alias: </label>
                            <input className="list-id__value--edit-mode" placeholder="A list alternative title (no spaces)" onChange={handleListIdChange} value={listId}/>
                        </div>
                    </div>
                    <Link to='#' className="list-header__remove-btn display-block" onClick={leaveEditMode}></Link>
                </div>
                    <ul className="list-topics">
                        {renderEditableTopics()}
                        {renderAddTopicForm()}
                        <button type="button" className="add-topic-btn" onClick={handleAddTopicClick}>{listTopics.length ? null : "Add an already existing topic"}</button>
                    </ul>
                <div className="list-controls">
                    <button className="list-controls__save-list-btn" type='submit'>Save list</button>
                    <button className="list-controls__remove-list-btn" type='button' onClick={handleListRemove}>Remove</button>
                    <div className={`list-controls__color-picker ${colorPickerClass}`} onClick={() => displayColorPicker ? setDisplayColorPicker(false) : setDisplayColorPicker(true)}>
                        {renderColorPickerList()}
                    </div>
                </div>
                </form>
                <div className="edit-cover" onClick={leaveEditMode}></div>
                </div>
                )
            
    }
    function renderCards(){
        const thisListCards = [...thisList.cards];
        const cardsToRender = thisListCards.map(({cardId, id, parentId, content, topics, type, editing}, i) => <ListItem content={content} topics={topics} id={id} cardId={cardId} parentId={parentId} key={id} draggedItemState={draggedItemState} draggedItemElem={draggedItemElem} type={type} editing={editing} />)
        return cardsToRender;
    }
    function renderPlaceholderCard(){
        if (displayPlaceholderCard){
            return (
                <div className="card-list__placeholder-card" onDrop={handlePlaceholderCardDrop} onDragOver={handlePlaceholderCardDragOver} onDragLeave={handlePlaceholderCardDragLeave}></div>
            )
        }
        else return null;
    }
    return(
        <div className="list-wrapper" ref={listWrapperElem}>
        <div className={bgColor + " list"}>
            {renderListHeader()}
            <div className='list-content' onDragEnter={handleListContentDragEnter}>
                <div className="card-list">
                    {renderCards()}
                    {renderPlaceholderCard()}
                </div>
                <button className="list__add-card" type='button' onClick={handleAddCard}>Add a new card</button>
            </div>
        </div>
        </div>
    )
}

function isMouseXAfterListXCenter(e) {
    const mouseX = e.clientX;
    const listRect = e.currentTarget.getBoundingClientRect();
    const listXCenter = listRect.x + (listRect.width/2);
    if (mouseX < listXCenter){
        return false;
    }
    else {
        return true;
    }
}