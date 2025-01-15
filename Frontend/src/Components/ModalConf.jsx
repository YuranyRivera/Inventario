import React from 'react';

const ModalConfirmacion = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg relative">
        {/* Mensaje */}
        <div className="text-center mt-4">
          <p className="text-xl text-gray-700">{message}</p>
        </div>

        {/* Botones */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={onConfirm}
            className="bg-[#00A305] text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Aceptar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
