import React, { useState } from 'react';
import useArticulo from '../../hooks/useArticulo';
import ModalAlm from '../../Components/ModalAlm';
import AuxMaintenanceTable from '../../Components/AuxMaintenanceTable';

const ArticulosAlmacenamiento = () => {
  const { articulos, loading, error, reloadArticulos } = useArticulo();
  const [isModalOpen, setModalOpen] = useState(false);
  
  const headers = ['ID', 'Módulo', 'Estante', 'Cantidad', 'Producto/Detalle', 'Estado', 'Entrada', 'Salida', 'Restante'];

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleEdit = (row) => {
    console.log('Editar', row);
  };

  const handleDelete = (row) => {
    console.log('Eliminar', row);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-[#00A305] text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Agregar Artículo
      </button>
      
      <AuxMaintenanceTable
        headers={headers}
        rows={articulos.map((articulo) => [
          articulo.id,
          articulo.modulo,
          articulo.estante,
          articulo.cantidad,
          articulo.producto,
          articulo.estado,
          articulo.entrada,
          articulo.salida,
          articulo.restante,
        ])}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ModalAlm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={reloadArticulos}
      />
    </>
  );
};

export default ArticulosAlmacenamiento;