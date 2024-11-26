// BotonSecundario.jsx
import React from 'react';

const BotonSecundario = ({ Text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white text-green-600  rounded-[15px] border-2 border-green-600 py-2 px-6  hover:bg-green-600 hover:text-white transition duration-300  mt-3  w-[180px] h-[50px]"
    >
      {Text}
    </button>
  );
};

export default BotonSecundario;
