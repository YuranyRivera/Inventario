// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Inventario/Dashboard';
import Inicio from './Pages/Principal/Inicio'
import AgregarArticulo from './Pages/Inventario/AgregarArticulo';
import Articulos from './Pages/Inventario/ArtAdmin';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Articulos/>} />
        <Route path="//AgregarArticulo" element={<AgregarArticulo/>} />
        {/* Aquí puedes agregar más rutas para otras páginas */}
      </Routes>
    </Router>
  );
};

export default App;
