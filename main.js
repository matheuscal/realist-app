import React from "react";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './src/utils/layout.scss';

import store from "./src/store";
import App from './src/containers/App';

ReactDOM.render(
<BrowserRouter>
<Provider store={store}>
    <Routes>
        <Route path="*" element={<App />} />
    </Routes>
</Provider>
</BrowserRouter>, document.getElementById('app'));