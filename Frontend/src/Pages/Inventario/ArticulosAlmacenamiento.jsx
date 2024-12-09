import React, { useState } from 'react';
import AuxMaintenanceTable from '../../Components/AuxMaintenanceTable';

const ArticulosAlmacenamiento = ({ articulos, reloadArticulos }) => {
  const headers = ['ID', 'Producto/Detalle', 'Cantidad', 'Módulo', 'Estante', 'Estado', 'Entrada', 'Salida', 'Restante'];

  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});

  // Actualiza el estado cuando se edita un campo
  const handleInputChange = (e, field) => {
    setEditedRowData({
      ...editedRowData,
      [field]: e.target.value,
    });
  };

  // Maneja la edición de una fila
  const handleEdit = (row, index) => {
    setEditingRowIndex(index);
    setEditedRowData({ ...row });
  };

  // Guardar la fila editada
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/articulos/${editedRowData.id}`, {
        method: 'PUT',
        body: JSON.stringify(editedRowData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al editar el artículo');
      }

      const updatedArticulo = await response.json();
      console.log('Artículo actualizado:', updatedArticulo);
      reloadArticulos(); // Recargar los artículos después de la edición
      setEditingRowIndex(null); // Terminar la edición
    } catch (error) {
      console.error('Error al editar:', error);
    }
  };

  // Cancelar la edición
  const handleCancel = () => {
    setEditingRowIndex(null);
  };

  // Maneja la eliminación de una fila
  const handleDelete = async (row) => {
    const id = row[0]; // Suponiendo que el primer campo es el ID

    try {
      const response = await fetch(`http://localhost:4000/api/articulos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el artículo');
      }

      const result = await response.json();
      console.log(result.message);
      reloadArticulos(); // Recargar los artículos después de la eliminación
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <>
      <AuxMaintenanceTable
        headers={headers}
        rows={articulos.map((articulo, index) => [
          articulo.id,
          articulo.producto,
          articulo.cantidad,
          articulo.modulo,
          articulo.estante,
          articulo.estado,
          articulo.entrada,
          articulo.salida,
          articulo.restante,
        ])}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editingRowIndex={editingRowIndex}
        editedRowData={editedRowData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default ArticulosAlmacenamiento;
