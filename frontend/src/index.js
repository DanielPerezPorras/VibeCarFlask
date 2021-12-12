// Fichero src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import 'bootswatch/dist/flatly/bootstrap.min.css';
import App from './Components/App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
