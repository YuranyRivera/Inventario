import { useState } from 'react';

const useArticulos = (refreshArticulos) => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addArticulos = async (articuloData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/articulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articuloData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const newArticulo = await response.json();
      
      // Añadir el nuevo artículo al estado local
      setArticulos((prevArticulos) => {
        // Verificar si el artículo ya existe para evitar duplicados
        const exists = prevArticulos.some(art => art.id === newArticulo.articulo.id);
        return exists ? prevArticulos : [...prevArticulos, newArticulo.articulo];
      });
  
      // Llama a refreshArticulos si es necesario
      if (typeof refreshArticulos === 'function') {
        refreshArticulos();
      }
    } catch (error) {
      console.error('Add article error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { articulos, loading, error, addArticulos };
};

export default useArticulos;