import React from 'react';

const CategorySelect = ({ selectedCategory, onChange }) => {
  return (

      <select
        value={selectedCategory}
        onChange={onChange}
        className="border p-2 rounded w-full"
      >
        <option value="">Selecciona una categoría</option>
        <option value="oficina">Oficina</option>
        <option value="almacen">Almacén</option>
        <option value="disponible">Disponible</option>
        <option value="noDisponible">No Disponible</option>
      </select>

  );
};

export default CategorySelect;
