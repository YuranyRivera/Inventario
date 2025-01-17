import React, { useState } from 'react';

const ModalObservacion = ({ isOpen, onClose, onSave }) => {
  const [observacion, setObservacion] = useState('');

  const handleInputChange = (e) => {
    setObservacion(e.target.value);
  };

  const handleSave = () => {
    if (observacion.trim() === '') {
      alert('Por favor, ingresa una observación.');
      return;
    }

    // Llamada a la función onSave para guardar la observación
    onSave(observacion);
    onClose(); // Cierra el modal después de guardar
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3 relative">
        <h2 className="text-xl text-gray-700 text-center mb-4">Ingresa una Observación</h2>

        {/* Campo de texto para la observación */}
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-lg"
          placeholder="Escribe la observación..."
          value={observacion}
          onChange={handleInputChange}
        />

        <div className="flex justify-between items-center mt-4">
          {/* Botón para guardar la observación */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSave}
          >
            Guardar
          </button>

          {/* Botón para cerrar el modal */}
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalObservacion;
