import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import List from '../components/List';
import './app.scss';

export default function App(){
    return (
        <div id='appView'>
            <div id="bg" className='bg-black'></div>
            <Header />
            <div id="dashboard">
                <div className="list-container">
                    <List />
                    <List />
                    <List />
                    <List />
                    <List />
                    <button type='button' className="list-container__new-list">Add a new list</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}
