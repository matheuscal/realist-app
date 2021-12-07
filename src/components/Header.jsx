import React from 'react';
import { Link } from 'react-router-dom';

import './header.scss';

export default function Header(){
    return (
        <header>
            <Link id='logo' to='/'>ReaList</Link>
            <div className='display-flex'>
                <div className="filter">
                    <div>
                        <form action="" className='filter-search'>
                            <input className="filter-search__input" type="text" placeholder="Search names, texts and #ids..."/>
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
                        <button className="topics__add-topic-btn">Add a new topic</button>
                    </div>
                </div>
                <div id='bgColorPicker'></div>
            </div>
        </header>
    )
}