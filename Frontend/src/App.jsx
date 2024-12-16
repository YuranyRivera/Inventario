

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute'; // Importa el nuevo componente
import Dashboard from './Pages/Inventario/Dashboard';
import Inicio from './Pages/Principal/Inicio';
import Entrada from './Pages/Inventario/Registro';
import Articulos from './Pages/Inventario/Articulos';
import RegSalida from './Pages/Inventario/RegSalida';
import Contactos from './Pages/Inventario/Contacto';
import EditarPerfil from './Pages/Inventario/EditarPerfil';
import OlvidarContraseña from './Pages/Principal/OlvidarContraseña';
import ActualizarContrasena from './Pages/Principal/ActualizarContrasena';
import { UserProvider } from './Context/UserContext';


import './App.css';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
      
          <Route path="/Inicio" element={<Inicio />} />
          
          {/* Rutas protegidas */}
          <Route 
  path="/Dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
          <Route 
            path="/Articulos" 
            element={
              <ProtectedRoute>
                <Articulos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Entrada" 
            element={
              <ProtectedRoute>
                <Entrada />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Contacto" 
            element={
              <ProtectedRoute>
                <Contactos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/RegSalida" 
            element={
              <ProtectedRoute>
                <RegSalida />
              </ProtectedRoute>
            } 
          />
        <Route 
  path="/EditarPerfil" 
  element={
    
    <ProtectedRoute>
      <EditarPerfil />
    </ProtectedRoute>
  } 
/>

       <Route path="/OlvidarContraseña" element={<OlvidarContraseña />} />
          <Route path="/ActualizarContrasena" element={  <ActualizarContrasena/>  } 
          />


          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/Inicio" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;