import React from 'react';

const CategorySelect = ({ value, onChange, error, disabled }) => (
  <div>
      <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`border px-3 py-2.5 w-full rounded ${error ? 'border-red-500' : ''}`}
          disabled={disabled}
      >
        <option value="">Selecciona una categoría</option>
        <option value="oficina">Oficina</option>
        <option value="almacen">Almacén</option>
        <option value="disponible">Disponible</option>
        <option value="noDisponible">No Disponible</option>
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default CategorySelect;
