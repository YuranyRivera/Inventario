import React, { useState } from 'react';
import AuxMaintenanceTable from '../../Components/AuxMaintenanceTable';

const ArticulosAlmacenamiento = ({ articulos, reloadArticulos }) => {
  const headers = ['ID', 'Producto/Detalle', 'Cantidad', 'Módulo', 'Estante', 'Estado', 'Entrada', 'Salida', 'Restante'];

  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});

  // Actualiza el estado cuando se edita un campo
  const handleInputChange = (e, field) => {
    setEditedRowData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRowData), // Envía los datos editados
      });

      if (!response.ok) {
        throw new Error('Error al editar el artículo');
      }

      const updatedArticulo = await response.json();
      reloadArticulos(); // Recargar los artículos después de la edición
      setEditingRowIndex(null); // Finalizar la edición
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
    const id = row.id; // Usamos el ID directamente

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
        rows={articulos.map((articulo) => ({
          id: articulo.id,
          producto: articulo.producto,
          cantidad: articulo.cantidad,
          modulo: articulo.modulo,
          estante: articulo.estante,
          estado: articulo.estado,
          entrada: articulo.entrada,
          salida: articulo.salida,
          restante: articulo.restante,
        }))}
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
