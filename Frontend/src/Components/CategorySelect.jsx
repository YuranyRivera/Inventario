import React from 'react';

const CategorySelect = ({ selectedCategory, onChange }) => {
  return (
    <div className="w-1/4">
      <label className="block text-lg mb-2">Categoría</label>
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
    </div>
  );
};

export default CategorySelect;
