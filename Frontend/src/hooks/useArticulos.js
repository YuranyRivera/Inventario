import { useState } from 'react';

const useArticulos = (refreshArticulos) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addArticulos = async (articuloData) => {
    setLoading(true);
    try {
      console.log('Sending article data:', articuloData); // Debugging log

      const response = await fetch('http://localhost:4000/api/articulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articuloData),
      });

      console.log('Add article response:', response); // Debugging log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newArticulo = await response.json();
      console.log('Artículo agregado:', newArticulo);

      // Ensure refreshArticulos is a function before calling
      if (typeof refreshArticulos === 'function') {
        refreshArticulos();
      } else {
        console.warn('refreshArticulos is not a function');
      }

    } catch (error) {
      console.error('Add article error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addArticulos };
};

export default useArticulos;