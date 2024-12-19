import React, { useState, useEffect } from 'react';
import useArticulos from '../hooks/useArticulos';

const ModalAlm = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const { addArticulos, loading, error } = useArticulos(onSave);

  const headers = ['ID', 'Producto/Detalle', 'Cantidad', 'Módulo', 'Estante', 'Estado', 'Acciones'];
  const [rows, setRows] = useState([
    { id: null, modulo: '', estante: '', cantidad: '', producto: '', estado: '' },
  ]);

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/articulos/last-id');
        const data = await response.json();
        setRows([{ id: data.id + 1, modulo: '', estante: '', cantidad: '', producto: '', estado: '' }]);
      } catch (error) {
        console.error('Error al obtener último ID:', error);
      }
    };

    if (isOpen) {
      fetchLastId();
      setErrors([]);
    }
  }, [isOpen]);

  const validateRow = (row, index) => {
    const rowErrors = {};

    // Validación del producto
    if (!row.producto.trim()) {
      rowErrors.producto = 'El producto es obligatorio';
    } else if (row.producto.length < 3) {
      rowErrors.producto = 'El producto debe tener al menos 3 caracteres';
    } else if (row.producto.length > 100) {
      rowErrors.producto = 'El producto no puede exceder 100 caracteres';
    }

    // Validación de cantidad
    if (!row.cantidad) {
      rowErrors.cantidad = 'La cantidad es obligatoria';
    } else {
      const cantidadNum = Number(row.cantidad);
      if (isNaN(cantidadNum) || cantidadNum <= 0) {
        rowErrors.cantidad = 'La cantidad debe ser un número positivo';
      } else if (cantidadNum > 99999) {
        rowErrors.cantidad = 'La cantidad no puede exceder 99,999';
      } else if (!Number.isInteger(cantidadNum)) {
        rowErrors.cantidad = 'La cantidad debe ser un número entero';
      }
    }

    // Validación del módulo
    if (!row.modulo.trim()) {
      rowErrors.modulo = 'El módulo es obligatorio';
    } else if (!/^[A-Za-z0-9]+$/.test(row.modulo)) {
      rowErrors.modulo = 'El módulo solo puede contener letras y números';
    }

    // Validación del estante
    if (!row.estante.trim()) {
      rowErrors.estante = 'El estante es obligatorio';
    } else if (!/^[A-Za-z0-9]+$/.test(row.estante)) {
      rowErrors.estante = 'El estante solo puede contener letras y números';
    }

    // Validación del estado
    if (!row.estado.trim()) {
      rowErrors.estado = 'El estado es obligatorio';
    }

    return rowErrors;
  };

  const handleAddRow = () => {
    const lastId = rows[rows.length - 1]?.id || 1;
    setRows([...rows, { id: lastId + 1, modulo: '', estante: '', cantidad: '', producto: '', estado: '' }]);
    setErrors([...errors, {}]);
  };

  const handleRowChange = (e, rowIndex, field) => {
    const { value } = e.target;
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);

    // Limpiar error del campo específico
    const updatedErrors = [...errors];
    if (updatedErrors[rowIndex]) {
      delete updatedErrors[rowIndex][field];
      setErrors(updatedErrors);
    }
  };

  const handleSave = async () => {
    // Validar todas las filas
    const newErrors = rows.map((row, index) => validateRow(row, index));
    setErrors(newErrors);

    // Verificar si hay errores
    if (newErrors.some(err => Object.keys(err).length > 0)) {
      return;
    }

    try {
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
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar artículos:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="modal z-50 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-7xl p-3 sm:p-4 md:p-6 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
          Agregar Artículos de Almacenamiento
        </h2>

        {/* Vista móvil: Cards */}
        <div className="md:hidden space-y-4">
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="grid gap-3">
                <div className="font-semibold">ID: {row.id}</div>
                
                {/* Campos del formulario en vista móvil */}
                {[
                  { label: 'Producto/Detalle', field: 'producto', type: 'text' },
                  { label: 'Cantidad', field: 'cantidad', type: 'number' },
                  { label: 'Módulo', field: 'modulo', type: 'text' },
                  { label: 'Estante', field: 'estante', type: 'text' },
                  { label: 'Estado', field: 'estado', type: 'text' },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={row[field]}
                      onChange={(e) => handleRowChange(e, rowIndex, field)}
                      className={`border px-2 py-1 w-full rounded ${
                        errors[rowIndex]?.[field] ? 'border-red-500' : ''
                      }`}
                      placeholder={label}
                    />
                    {errors[rowIndex]?.[field] && (
                      <p className="text-red-500 text-xs mt-1">{errors[rowIndex][field]}</p>
                    )}
                  </div>
                ))}

                {rowIndex === rows.length - 1 && (
                  <button
                    onClick={handleAddRow}
                    className="w-full bg-[#00A305] text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                  >
                    <i className="fas fa-plus mr-1"></i> Agregar Fila
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vista desktop: Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#00A305] text-white">
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-2 text-left text-sm lg:text-base">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2">{row.id}</td>
                  {[
                    { field: 'producto', type: 'text' },
                    { field: 'cantidad', type: 'number' },
                    { field: 'modulo', type: 'text' },
                    { field: 'estante', type: 'text' },
                    { field: 'estado', type: 'text' },
                  ].map(({ field, type }) => (
                    <td key={field} className="px-4 py-2">
                      <div>
                        <input
                          type={type}
                          value={row[field]}
                          onChange={(e) => handleRowChange(e, rowIndex, field)}
                          className={`border px-2 py-1 w-full rounded ${
                            errors[rowIndex]?.[field] ? 'border-red-500' : ''
                          }`}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        />
                        {errors[rowIndex]?.[field] && (
                          <p className="text-red-500 text-xs mt-1">{errors[rowIndex][field]}</p>
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center">
                    {rowIndex === rows.length - 1 && (
                      <button
                        onClick={handleAddRow}
                        className="bg-[#00A305] text-white px-3 py-1 rounded hover:bg-green-700 text-sm lg:text-base"
                      >
                        <i className="fas fa-plus mr-1"></i> Agregar
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
            className="bg-gray-500 text-white px-3 py-2 text-sm sm:px-4 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-[#00A305] text-white px-3 py-2 text-sm sm:px-4 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlm;