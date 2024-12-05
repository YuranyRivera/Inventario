import React, { useState, useEffect } from 'react';
import useArticulos from '../hooks/useArticulos';

const ModalAlm = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const { addArticulos, loading, error } = useArticulos(onSave);

  const headers = ['ID', 'Producto/Detalle', 'Cantidad', 'Módulo', 'Estante', 'Estado', 'Acciones'];
  const [rows, setRows] = useState([
    { id: null, modulo: '', estante: '', cantidad: '', producto: '', estado: '' },
  ]);

  useEffect(() => {
    // Supongamos que el último ID en la base de datos es el máximo
    const fetchLastId = async () => {
      const response = await fetch('http://localhost:4000/api/articulos/last-id'); // Asegúrate de tener esta ruta en tu backend
      const data = await response.json();
      const lastId = data.id; // Suponiendo que el backend devuelve el último ID
      setRows([{ id: lastId + 1, modulo: '', estante: '', cantidad: '', producto: '', estado: '' }]);
    };

    if (isOpen) {
      fetchLastId();
    }
  }, [isOpen]);

  const handleAddRow = () => {
    const lastId = rows[rows.length - 1]?.id || 1;
    setRows([...rows, { id: lastId + 1, modulo: '', estante: '', cantidad: '', producto: '', estado: '' }]);
  };

  const handleRowChange = (e, rowIndex, field) => {
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [field]: e.target.value } : row
    );
    setRows(updatedRows);
  };

  const handleSave = async () => {
    try {
      // Enviar los artículos EN EL ORDEN EXACTO que fueron creados
      for (const row of rows) {
        await addArticulos({
          id: row.id,
          modulo: row.modulo,
          estante: row.estante,
          producto: row.producto,
          cantidad: row.cantidad,
          estado: row.estado
        });
      }
      
      onSave();  // Actualizar la lista de artículos
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error al guardar artículos:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[80%] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar Artículos de Almacenamiento</h2>
        <div className="bg-white p-4 rounded-lg">
          <table className="min-w-full table-auto rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-[#00A305] text-white">
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-2 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2">{row.id}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.producto}
                      onChange={(e) => handleRowChange(e, rowIndex, 'producto')}
                      className="border px-2 py-1 w-full"
                      placeholder="Producto/Detalle"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={row.cantidad}
                      onChange={(e) => handleRowChange(e, rowIndex, 'cantidad')}
                      className="border px-2 py-1 w-full"
                      placeholder="Cantidad"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.modulo}
                      onChange={(e) => handleRowChange(e, rowIndex, 'modulo')}
                      className="border px-2 py-1 w-full"
                      placeholder="Módulo"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.estante}
                      onChange={(e) => handleRowChange(e, rowIndex, 'estante')}
                      className="border px-2 py-1 w-full"
                      placeholder="Estante"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.estado}
                      onChange={(e) => handleRowChange(e, rowIndex, 'estado')}
                      className="border px-2 py-1 w-full"
                      placeholder="Estado"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    {rowIndex === rows.length - 1 && (
                      <button
                        onClick={handleAddRow}
                        className="bg-[#00A305] text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        <i className="fas fa-plus"></i> Agregar Fila
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-[#00A305] text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlm;
