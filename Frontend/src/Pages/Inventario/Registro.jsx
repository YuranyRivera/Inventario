import React, { useEffect, useState } from 'react';
import TableEntrada from '../../Components/TableEntrada';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import '@dotlottie/player-component';
const Example = () => {
  const headers = ['ID', 'Fecha', 'Cantidad de productos', 'Tipo de Registro'];
  const [rows, setRows] = useState([]);
  const [selectedOption, setSelectedOption] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReporteGeneral = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const response = await fetch('http://localhost:4000/api/reporte-general');
        if (!response.ok) {
          throw new Error('Error al obtener el reporte general');
        }
        const data = await response.json();
        const mappedRows = data.map((item) => [
          item.id,
          item.fechaEntrada,
          item.cantidadProductos,
          item.estado,
        ]);
        setRows(mappedRows);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener el reporte general:', error);
      }
    };

    fetchReporteGeneral();
  }, []);

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    
    switch(value) {
      case 'traslados':
        navigate('/moduloadmin');
        break;
      case 'bajas':
        navigate('/articulosbaja');
        break;
      default:
        // Stay on current page
        break;
    }
  };

  const reloadArticulos = () => {
    // Reload data from API or refresh page
    window.location.reload(); // Or you can call the fetch function again to reload data
  };

  return (
    <DashboardLayout>

  {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <dotlottie-player
            src="https://lottie.host/0aca447b-d3c9-46ed-beeb-d4481815915a/qvvqgKAKQU.lottie"
            background="transparent"
            speed="1"
            style={{ width: '300px', height: '300px' }}
            loop
            autoplay
          />
        </div>
      ) : (
      <div className="mb-6 m-5">
        <h1 className="text-3xl font-bold text-center text-black mb-10">
          Registro General
        </h1>

        <div className="flex gap-6 mt-4 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="navigation"
              value="general"
              checked={selectedOption === 'general'}
              onChange={handleOptionChange}
              className="appearance-none h-5 w-5 border border-green-600 rounded-full checked:bg-[#00A305] checked:border-[#00A305] focus:outline-none transition duration-200 mr-2 cursor-pointer"
            />
            <span className="text-gray-700">General</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="navigation"
              value="traslados"
              checked={selectedOption === 'traslados'}
              onChange={handleOptionChange}
              className="appearance-none h-5 w-5 border border-green-600 rounded-full checked:bg-[#00A305] checked:border-[#00A305] focus:outline-none transition duration-200 mr-2 cursor-pointer"
            />
            <span className="text-gray-700">Traslados</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="navigation"
              value="bajas"
              checked={selectedOption === 'bajas'}
              onChange={handleOptionChange}
              className="appearance-none h-5 w-5 border border-green-600 rounded-full checked:bg-[#00A305] checked:border-[#00A305] focus:outline-none transition duration-200 mr-2 cursor-pointer"
            />
            <span className="text-gray-700">Dados de baja</span>
          </label>
        </div>

        <TableEntrada headers={headers} rows={rows} setRows={setRows} reloadArticulos={reloadArticulos} />
      </div>
          )}
    </DashboardLayout>
  );
};

export default Example;
