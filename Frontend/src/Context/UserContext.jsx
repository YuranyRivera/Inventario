import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('userData');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error al inicializar la autenticación:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    // Actualizar también en localStorage
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    const updatedUser = { ...storedUser, ...userData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.clear();
  
    // Reemplazamos la entrada actual del historial con la página de inicio
    window.history.replaceState(null, '', '/Inicio');
  
    // Agregamos una nueva entrada al historial para evitar que el usuario navegue hacia atrás
    window.history.pushState(null, '', '/Inicio');
  
    // Forzamos una recarga completa de la página para resetear el historial
    window.location.href = '/Inicio';
  
    // Prevenimos la navegación hacia atrás
    window.addEventListener('popstate', function (event) {
      // Reemplazamos cualquier intento de navegación hacia atrás con la página de inicio
      window.history.replaceState(null, '', '/Inicio');
    });
  };
  
  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);