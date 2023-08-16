// AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; 
import ToDoApp from './ToDoApp'; 
import Login from './Login'
import Register from './Register'


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<ToDoApp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

    </Routes>
    </Router>
  );
}

export default AppRouter;
