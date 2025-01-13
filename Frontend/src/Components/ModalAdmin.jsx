import React, { useState, useEffect } from 'react';
import CategorySelect from './CategorySelect';
import useArticulosAdministrativos from '../hooks/useArticulosAdministrativos'; // Importar el hook

const ModalAdmin = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const headers = ['ID', 'Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación', 'Precio', 'Acciones'];
  const [rows, setRows] = useState([
    { id: null, fecha: '', descripcion: '', proveedor: '', ubicacion: '', observacion: '', precio: '', },
  ]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const { agregarArticulo } = useArticulosAdministrativos(); // Desestructurar el hook

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/articulos-administrativos/last-id');
        const data = await response.json();
        const newId = data.id ? data.id + 1 : 1;
        setRows([{ id: newId, fecha: '', descripcion: '', proveedor: '', ubicacion: '', observacion: '', precio: '', }]);
      } catch (error) {
        console.error('Error al obtener el último ID:', error);
      }
    };

    if (isOpen) {
      fetchLastId();
      setErrors([]);
    }
  }, [isOpen]);

  const validateRow = (row, index) => {
    const rowErrors = {};
    if (!row.fecha) rowErrors.fecha = 'La fecha es obligatoria';
    if (!row.precio) rowErrors.precio = 'El precio es obligatorio';
    if (!row.descripcion.trim()) rowErrors.descripcion = 'La descripción es obligatoria';
    if (!row.proveedor.trim()) rowErrors.proveedor = 'El proveedor es obligatorio';
    if (!row.ubicacion) rowErrors.ubicacion = 'La ubicación es obligatoria';
    if (row.observacion.trim() && row.observacion.length > 500) rowErrors.observacion = 'La observación no puede exceder 500 caracteres';
    return rowErrors;
  };

  const handleAddRow = () => {
    setRows([{ 
      id: newId, 
      fecha: '', 
      descripcion: '', 
      proveedor: '', 
      ubicacion: '', 
      observacion: '', 
      precio: '' // Asegúrate de que 'precio' esté aquí 
    }]);
    setErrors([...errors, {}]);
  };

  const handleRowChange = (value, rowIndex, field) => {
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  
    const updatedErrors = [...errors];
    if (!value) {
      updatedErrors[rowIndex] = { ...updatedErrors[rowIndex], [field]: `${field} es obligatorio` };
    } else {
      delete updatedErrors[rowIndex][field];
    }
    setErrors(updatedErrors);
  };

  const handleSave = async () => {
    if (loading) return;

    // Validar todas las filas
    const newErrors = rows.map((row, index) => validateRow(row, index));
    setErrors(newErrors);

    // Verificar si hay errores
    if (newErrors.some((err) => Object.keys(err).length > 0)) {
        alert('Revisa los errores en el formulario.');
        console.log('Errores de validación:', newErrors);
        return;
    }

    try {
        setLoading(true);
        for (const row of rows) {
            await agregarArticulo(row);
        }
        alert('Datos guardados exitosamente.');
        onClose();
    } catch (error) {
        console.error('Error al guardar artículos:', error);
        alert('Error al guardar los datos.');
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
        className={`border px-2 py-1 w-full rounded text-sm lg:text-base ${error ? 'border-red-500' : ''}`}
        placeholder={placeholder}
        disabled={disabled || loading}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-6xl p-3 sm:p-4 md:p-6 rounded-lg shadow-lg max-h-[95vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center flex-1">
            Agregar Artículos Administrativos
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={loading}>
            ✕
          </button>
        </div>

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
                  <td className="px-4 py-2">{row.id}</td>
                  <td className="px-4 py-2">
                    {renderInput("date", row.fecha, (e) => handleRowChange(e.target.value, rowIndex, 'fecha'), "", errors[rowIndex]?.fecha)}
                  </td>
                  <td className="px-4 py-2">
                    {renderInput("text", row.descripcion, (e) => handleRowChange(e.target.value, rowIndex, 'descripcion'), "Descripción", errors[rowIndex]?.descripcion)}
                  </td>
                  <td className="px-4 py-2">
                    {renderInput("text", row.proveedor, (e) => handleRowChange(e.target.value, rowIndex, 'proveedor'), "Proveedor", errors[rowIndex]?.proveedor)}
                  </td>
                  <td className="px-4 py-2">
                    <CategorySelect value={row.ubicacion} onChange={(value) => handleRowChange(value, rowIndex, 'ubicacion')} error={errors[rowIndex]?.ubicacion} disabled={loading} />
                    {errors[rowIndex]?.ubicacion && <p className="text-red-500 text-xs mt-1">{errors[rowIndex].ubicacion}</p>}
                  </td>
                  <td className="px-4 py-2">
                    {renderInput("text", row.observacion, (e) => handleRowChange(e.target.value, rowIndex, 'observacion'), "Observación (opcional)", errors[rowIndex]?.observacion)}
                  </td>
                  <td className="px-4 py-2">
  {renderInput(
    "number",
    row.precio,
    (e) => handleRowChange(e.target.value, rowIndex, "precio"),
    "Precio",
    errors[rowIndex]?.precio
  )}
</td>
                  <td className="px-4 py-2 text-center">
                    {rowIndex === rows.length - 1 && (
                      <button onClick={handleAddRow} className="bg-[#00A305] text-white px-3 py-1 rounded hover:bg-green-700 text-sm lg:text-base" disabled={loading}>
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
          <button onClick={onClose} className="bg-gray-500 text-white px-3 py-2 text-sm sm:px-4 rounded hover:bg-gray-700" disabled={loading}>Cancelar</button>
          <button onClick={handleSave} className="bg-[#00A305] text-white px-3 py-2 text-sm sm:px-4 rounded hover:bg-green-700" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdmin;
