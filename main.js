import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './src/utils/layout.scss';

import App from './src/containers/App';

ReactDOM.render(
<BrowserRouter>
<Routes>
    <Route path="/" element={<App />} />
</Routes>
</BrowserRouter>, document.getElementById('app'));