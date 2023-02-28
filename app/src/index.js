import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AMMProvider } from './context/context';

ReactDOM.render(
  <React.StrictMode>
    <AMMProvider>
    <App />
    </AMMProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

