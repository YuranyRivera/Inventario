import React, { useState, useEffect } from 'react';
import CategorySelect from './CategorySelect';

const ModalAdmin = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const headers = ['Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación', 'Acciones'];
  const [rows, setRows] = useState([
    { fecha: '2024-11-22', descripcion: 'Descripción del artículo', ubicacion: '', proveedor: '', observacion: '' },
  ]);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setErrors([]);
    }
  }, [isOpen]);

  const validateRow = (row, index) => {
    const rowErrors = {};

    // Validación de fecha
    if (!row.fecha) {
      rowErrors.fecha = 'La fecha es obligatoria';
    } else {
      const selectedDate = new Date(row.fecha);
      const today = new Date();
      if (selectedDate > today) {
        rowErrors.fecha = 'La fecha no puede ser futura';
      }
    }

    // Validación de descripción
    if (!row.descripcion.trim()) {
      rowErrors.descripcion = 'La descripción es obligatoria';
    } else if (row.descripcion.length < 3) {
      rowErrors.descripcion = 'La descripción debe tener al menos 3 caracteres';
    } else if (row.descripcion.length > 200) {
      rowErrors.descripcion = 'La descripción no puede exceder 200 caracteres';
    }

    // Validación de proveedor
    if (!row.proveedor.trim()) {
      rowErrors.proveedor = 'El proveedor es obligatorio';
    } else if (row.proveedor.length < 3) {
      rowErrors.proveedor = 'El proveedor debe tener al menos 3 caracteres';
    } else if (row.proveedor.length > 50) {
      rowErrors.proveedor = 'El proveedor no puede exceder 50 caracteres';
    } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(row.proveedor)) {
      rowErrors.proveedor = 'El proveedor solo puede contener letras y espacios';
    }

    // Validación de ubicación
    if (!row.ubicacion) {
      rowErrors.ubicacion = 'La ubicación es obligatoria';
    }

    // Validación de observación (opcional pero con restricciones si se llena)
    if (row.observacion.trim() && row.observacion.length > 500) {
      rowErrors.observacion = 'La observación no puede exceder 500 caracteres';
    }

    return rowErrors;
  };

  const handleAddRow = () => {
    setRows([...rows, { fecha: '', descripcion: '', ubicacion: '', proveedor: '', observacion: '' }]);
    setErrors([...errors, {}]);
  };

  const handleRowChange = (value, rowIndex, field) => {
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
    if (loading) return;

    // Validar todas las filas
    const newErrors = rows.map((row, index) => validateRow(row, index));
    setErrors(newErrors);

    // Verificar si hay errores
    if (newErrors.some(err => Object.keys(err).length > 0)) {
      return;
    }

    try {
      setLoading(true);
      console.log('Artículos guardados:', rows);
      onClose();
    } catch (error) {
      console.error('Error al guardar artículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (type, value, onChange, placeholder, error, disabled = false) => (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`border px-2 py-1 w-full rounded text-sm lg:text-base ${
          error ? 'border-red-500' : ''
        }`}
        placeholder={placeholder}
        disabled={disabled || loading}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl p-3 sm:p-4 md:p-6 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center flex-1">
            Agregar Artículos Administrativos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Vista desktop: Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
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
                <tr key={rowIndex} className="border-t">
                  <td className="px-4 py-2">
                    {renderInput(
                      "date",
                      row.fecha,
                      (e) => handleRowChange(e.target.value, rowIndex, 'fecha'),
                      "",
                      errors[rowIndex]?.fecha
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {renderInput(
                      "text",
                      row.descripcion,
                      (e) => handleRowChange(e.target.value, rowIndex, 'descripcion'),
                      "Descripción",
                      errors[rowIndex]?.descripcion
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {renderInput(
                      "text",
                      row.proveedor,
                      (e) => handleRowChange(e.target.value, rowIndex, 'proveedor'),
                      "Proveedor",
                      errors[rowIndex]?.proveedor
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <CategorySelect
                      value={row.ubicacion}
                      onChange={(value) => handleRowChange(value, rowIndex, 'ubicacion')}
                      error={errors[rowIndex]?.ubicacion}
                      disabled={loading}
                    />
                    {errors[rowIndex]?.ubicacion && (
                      <p className="text-red-500 text-xs mt-1">{errors[rowIndex].ubicacion}</p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {renderInput(
                      "text",
                      row.observacion,
                      (e) => handleRowChange(e.target.value, rowIndex, 'observacion'),
                      "Observación (opcional)",
                      errors[rowIndex]?.observacion
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {rowIndex === rows.length - 1 && (
                      <button
                        onClick={handleAddRow}
                        className="bg-[#00A305] text-white px-3 py-1 rounded hover:bg-green-700 text-sm lg:text-base"
                        disabled={loading}
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
            disabled={loading}
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

export default ModalAdmin;
