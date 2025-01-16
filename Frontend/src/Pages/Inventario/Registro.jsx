import React, { useEffect, useState } from 'react';
import TableEntrada from '../../Components/TableEntrada';
import DashboardLayout from '../../layouts/DashboardLayout';
import BotonPrincipal from '../../Components/Boton';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const Example = () => {
  const headers = ['ID', 'Fecha', 'Cantidad de productos', 'Tipo de Registro', 'Estado'];
  const [rows, setRows] = useState([]); // Estado para las filas de la tabla
  const navigate = useNavigate(); // Inicializar la navegación

  // Obtener datos del reporte general
  useEffect(() => {
    const fetchReporteGeneral = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/reporte-general');
        if (!response.ok) {
          throw new Error('Error al obtener el reporte general');
        }
        const data = await response.json();
        // Mapear datos al formato de la tabla
        const mappedRows = data.map((item) => [
          item.id,
          item.fechaEntrada,  // Solo la fecha
          item.cantidadProductos,
          item.tipoRegistro,
          item.estado,
        ]);
        setRows(mappedRows);
      } catch (error) {
        console.error('Error al obtener el reporte general:', error);
      }
    };

    fetchReporteGeneral();
  }, []);

  // Función para manejar la navegación
  const handleNavigation = () => {
    navigate('/moduloadmin'); // Navegar a la página Moduloadmin
  };

  return (
    <DashboardLayout>
      
      <div className="mb-6 m-5">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Registro general</h1>
             <div className="mt-4">
          <BotonPrincipal onClick={handleNavigation}Text="Ir a ModuloAdmin"></BotonPrincipal>
        </div>
        <TableEntrada headers={headers} rows={rows} />
        
        {/* Botón para navegar al ModuloAdmin */}
   
      </div>
    </DashboardLayout>
  );
};

export default Example;
