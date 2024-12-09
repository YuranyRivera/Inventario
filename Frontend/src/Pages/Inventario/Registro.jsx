import React, { useEffect, useState } from 'react';
import TableEntrada from '../../Components/TableEntrada';
import DashboardLayout from '../../layouts/DashboardLayout';

const Example = () => {
  const headers = ['ID', 'Fecha de entrada', 'Cantidad de productos', 'Tipo de Registro', 'Estado'];
  const [rows, setRows] = useState([]); // Estado para las filas de la tabla

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
          item.fechaEntrada,
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

  return (
    <DashboardLayout>
      <div className="mb-6 m-5">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Registro general</h1>
        <TableEntrada headers={headers} rows={rows} />
      </div>
    </DashboardLayout>
  );
};

export default Example;
