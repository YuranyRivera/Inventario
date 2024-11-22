import React, { useState } from 'react';

const CheckboxGroup = ({ onChange }) => {
  const [selected, setSelected] = useState('');

  const handleChange = (e, category) => {
    const isChecked = e.target.checked;

    // Actualizar el estado seleccionado
    setSelected(isChecked ? category : '');
    onChange(e, category);
  };

  return (
    <div className="flex space-x-6 mb-4">
      <div className="flex items-center">
        <input 
          type="radio" 
          id="administrativos" 
          name="category" 
          checked={selected === 'administrativos'} 
          onChange={(e) => handleChange(e, 'administrativos')} 
          className="hidden peer" 
        />
        <label
          htmlFor="administrativos"
          className="flex items-center justify-center w-6 h-6 border-2 border-gray-400 rounded-full peer-checked:border-[#00A305] peer-checked:bg-[#00A305] cursor-pointer transition-colors"
        ></label>
        <span className="ml-2 text-lg">Artículos Administrativos</span>
      </div>

      <div className="flex items-center">
        <input 
          type="radio" 
          id="almacenamiento" 
          name="category" 
          checked={selected === 'almacenamiento'} 
          onChange={(e) => handleChange(e, 'almacenamiento')} 
          className="hidden peer" 
        />
        <label
          htmlFor="almacenamiento"
          className="flex items-center justify-center w-6 h-6 border-2 border-gray-400 rounded-full peer-checked:border-[#00A305] peer-checked:bg-[#00A305] cursor-pointer transition-colors"
        ></label>
        <span className="ml-2 text-lg">Artículos de Almacenamiento</span>
      </div>
    </div>
  );
};

export default CheckboxGroup;
