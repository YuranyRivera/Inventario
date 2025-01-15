import React from 'react';

const CategorySelect = ({ value, onChange, error, disabled }) => (
  <div>
      <select
          value={value}
          onChange={onChange} // Cambiado aquí - pasar el evento directamente
          className={`border px-3 py-2.5 w-full rounded ${error ? 'border-red-500' : ''}`}
          disabled={disabled}
      >
        <option value="">Selecciona una categoría</option>
        <option value="Sala Estudiantes">Sala Estudiantes</option>
        <option value="Sala profesores">Sala profesores</option>
        <option value="disponible">Disponible</option>
        <option value="noDisponible">No Disponible</option>
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default CategorySelect;