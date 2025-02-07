import { useState, useEffect, useCallback } from 'react';

// Custom hook for fetching and managing articles
export const useArticulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticulos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/articulos');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticulos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setArticulos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticulos();
  }, [fetchArticulos]);

  const updateArticulo = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/articulos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Error updating article');
      }

      fetchArticulos();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteArticulo = async (id, formData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/articulos-baja/${id}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error deleting article');
      }

      fetchArticulos();
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    articulos,
    loading,
    error,
    fetchArticulos,
    updateArticulo,
    deleteArticulo
  };
};

// Custom hook for search and filtering
export const useArticuloSearch = (articulos) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticulos = articulos.filter(articulo =>
    articulo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articulo.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articulo.estante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredArticulos
  };
};