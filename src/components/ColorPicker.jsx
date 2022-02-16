import React, { useState } from 'react';
import './colorpicker.scss';

// TODO? Color Picker should probably also include the original button which toggles the color dropdown, instead of
// only the dropdown itself
export default function ColorPicker({colorSquareClasses, bgClasses, onSquareClick, setColorPickerClass, indexOfClassesToHide}) {
    
    function onClick(ObjBgClass, eachColorSquareClass){
        onSquareClick(ObjBgClass);
        setColorPickerClass(eachColorSquareClass);
    }
    function renderColorSquares() {
        let colors = colorSquareClasses.map((eachColorSquareClass, index) => {
            if (index !== indexOfClassesToHide) {
                let key = Math.random() * 100;
                return (<div className={eachColorSquareClass} key={key} onClick={() => onClick(bgClasses[index], eachColorSquareClass)}></div>)
            }
        })
        return colors;
    }

    return (
        <div className='color-picker-list'>
            {renderColorSquares()}
        </div>
    )
}