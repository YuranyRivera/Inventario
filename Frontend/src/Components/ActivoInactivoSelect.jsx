import React, { useState } from 'react';

// Componente para el menú desplegable de Activo/Inactivo
const ActivoInactivoSelect = ({ onChange, currentStatus }) => {
  const [selectedValue, setSelectedValue] = useState(currentStatus || 'activo'); // Estado local para la opción seleccionada

  const handleChange = (event) => {
    const selected = event.target.value;  // Obtén el valor seleccionado
    setSelectedValue(selected);  // Actualiza el estado local
    onChange(selected);  // Llama la función onChange pasada desde el componente padre para actualizar el estado en la base de datos
  };

  return (
    <div className="w-56">
      <label htmlFor="estadoActivo" className="block text-sm font-medium text-gray-700">Activo / Inactivo</label>
      <select
        id="estadoActivo"
        name="estadoActivo"
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        value={selectedValue}
        onChange={handleChange}
      >
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </div>
  );
};

export default ActivoInactivoSelect;
