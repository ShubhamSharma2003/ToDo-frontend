// main.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './AppRouter'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
