// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Inventario/Dashboard';
import Inicio from './Pages/Principal/Inicio'
import AgregarAdmin from './Pages/Inventario/AgregarAdmin';
import Articulos from './Pages/Inventario/Articulos';
import AgregarAux from './Pages/Inventario/AgregarAux'
import Tiquete from './Pages/Inventario/Tiquete'
import TiqueteInd from './Pages/Inventario/TiqueteInd'
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
        <Route path="/AgregarAdmin" element={<AgregarAdmin/>} />
        <Route path="/AgregarAux" element={<AgregarAux/>} />
        <Route path="/Tiquete" element={<Tiquete/>} />
        <Route path="/Contacto" element={<Contactos/>} />
        <Route path="/TiqueteInd" element={<TiqueteInd/>} />
        <Route path="/EditarPerfil" element={<EditarPerfil/>} />
        {/* Aquí puedes agregar más rutas para otras páginas */}
      </Routes>
    </Router>
  );
};

export default App;
