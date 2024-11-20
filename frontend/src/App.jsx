import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './Pages/Principal/Inicio'
import './App.css'

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Inicio/>} />
  


      </Routes>
    </Router>
  );
}

export default App;