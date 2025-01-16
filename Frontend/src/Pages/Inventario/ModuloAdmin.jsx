import React, { useState, useEffect } from 'react';
import AuxMaintenanceTable from '../../Components/Moduloadmin';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Search } from 'lucide-react';
import CategorySelect from '../../Components/CategorySelect';
import DateInput from '../../Components/DateInput';
import ButtonGroup from '../../Components/PDFadmin';
import ExcelExportButton from '../../Components/Exceladmin';

const Moduloadmin = () => {
  const headers = ['ID', 'Fecha', 'Ubicación Inicial', 'Producto', 'Ubicación Final', 'Responsable'];

  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocationInitial, setSelectedLocationInitial] = useState('');
  const [selectedLocationFinal, setSelectedLocationFinal] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchTraslados = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/traslados');
        const data = await response.json();

        const formattedRows = data.map((traslado) => {
          return {
            id: traslado.id,
            fecha: formatDate(traslado.fecha),
            ubicacion_inicial: traslado.ubicacion_inicial,
            producto: traslado.nombre_articulo,
            ubicacion_final: traslado.ubicacion_final,
            responsable: traslado.responsable,
          };
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error al obtener los traslados', error);
      }
    };

    fetchTraslados();
  }, []);

  const handleSave = async () => {
    try {
      const formattedDate = formatDate(editedRowData.fecha);
      const formattedData = { ...editedRowData, fecha: formattedDate };

      const response = await fetch(`http://localhost:4000/api/traslados/${formattedData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Error al editar el traslado');
      }

      const updatedTraslado = await response.json();
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === updatedTraslado.id ? updatedTraslado : row))
      );
    } catch (error) {
      console.error('Error al editar:', error);
    }
  };

  const handleDelete = async (row) => {
    const id = row.id;

    try {
      const response = await fetch(`http://localhost:4000/api/traslados/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el traslado');
      }

      const result = await response.json();
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      console.log(result.message);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      throw new Error('Fecha inválida');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filtrar filas por término de búsqueda, ubicaciones seleccionadas y rango de fechas
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      (row.producto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.responsable || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.ubicacion_inicial || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.ubicacion_final || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocationInitial = !selectedLocationInitial || row.ubicacion_inicial === selectedLocationInitial;
    const matchesLocationFinal = !selectedLocationFinal || row.ubicacion_final === selectedLocationFinal;

    let fechaTraslado = row.fecha ? new Date(row.fecha) : null;
    let cumpleFechaInicio = true;
    let cumpleFechaFin = true;

    if (fromDate) {
      const from = new Date(fromDate);
      cumpleFechaInicio = fechaTraslado >= from;
    }

    if (toDate) {
      const to = new Date(toDate);
      cumpleFechaFin = fechaTraslado <= to;
    }

    return (
      matchesSearch &&
      matchesLocationInitial &&
      matchesLocationFinal &&
      cumpleFechaInicio &&
      cumpleFechaFin
    );
  });

  return (
    <>
      <DashboardLayout>
      <div className="mb-6 m-5">
        <h1 className="text-3xl font-bold text-center text-black mb-10">Traslados</h1>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative flex-1 max-w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por descripción, responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <ButtonGroup filteredData={filteredRows} allData={rows} />
              <ExcelExportButton filteredData={filteredRows} allData={rows} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación Inicial</label>
              <CategorySelect
                value={selectedLocationInitial}
                onChange={(e) => setSelectedLocationInitial(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación Final</label>
              <CategorySelect
                value={selectedLocationFinal}
                onChange={(e) => setSelectedLocationFinal(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Desde</label>
              <DateInput value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hasta</label>
              <DateInput value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <AuxMaintenanceTable
              headers={headers}
              rows={filteredRows} // Usamos filteredRows en lugar de rows
              onDelete={handleDelete}
              disableFields={['id']} // Deshabilitar el campo 'id'
            />
          </div>
        </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Moduloadmin;
