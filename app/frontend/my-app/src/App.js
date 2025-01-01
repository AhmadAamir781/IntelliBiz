import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './compoents/Home';
import './App.css';
import Login from './compoents/Login';
import Register from './compoents/Register';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Home />} />
          
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
