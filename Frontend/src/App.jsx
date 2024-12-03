// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Inventario/Dashboard';
import Inicio from './Pages/Principal/Inicio'
import Entrada from './Pages/Inventario/Registro'
import Articulos from './Pages/Inventario/Articulos';


import RegSalida from './Pages/Inventario/RegSalida'

import './App.css';
import Contactos from './Pages/Inventario/Contacto';
import EditarPerfil from './Pages/Inventario/EditarPerfil';

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/Articulos" element={<Articulos/>} />
        <Route path="/Inicio" element={<Inicio/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/Entrada" element={<Entrada/>} />

       
        <Route path="/Contacto" element={<Contactos/>} />
        <Route path="/RegSalida" element={<RegSalida/>} />
    
        <Route path="/EditarPerfil" element={<EditarPerfil/>} />
        {/* Aquí puedes agregar más rutas para otras páginas */}
      </Routes>
    </Router>
  );
};

export default App;
