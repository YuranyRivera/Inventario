// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Inventario/Dashboard';
import Inicio from './Pages/Principal/Inicio'
import AgregarAdmin from './Pages/Inventario/AgregarAdmin';
import Articulos from './Pages/Inventario/Articulos';
import AgregarAux from './Pages/Inventario/AgregarAux'

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/Articulos" element={<Articulos/>} />
        <Route path="/Inicio" element={<Inicio/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/AgregarAdmin" element={<AgregarAdmin/>} />
        <Route path="/AgregarAux" element={<AgregarAux/>} />
        {/* Aquí puedes agregar más rutas para otras páginas */}
      </Routes>
    </Router>
  );
};

export default App;
