import { useState } from 'react';

const useArticulosAdministrativos = () => {
  const agregarArticulo = async (articulo) => {
    try {
      const response = await fetch('http://localhost:4000/api/articulos-administrativos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articulo),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el artículo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en agregarArticulo:', error);
      throw error;
    }
  };

  return { agregarArticulo };
};

export default useArticulosAdministrativos;
