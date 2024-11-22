import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';  // Layout envolvente
import CheckboxGroup from '../../Components/CheckboxGroup'; // Componente para los checkboxes
import ButtonGroup from '../../Components/ButtonGroup';     // Componente para los botones
import TableWithActions from '../../Components/TableWithActions'; // Componente con tabla y acciones

const Articulos = () => {
  const [selected, setSelected] = useState(''); // Se mantiene solo un valor, ya que es un radio button

  // Función para manejar el cambio de selección de los checkboxes
  const handleCheckboxChange = (e, category) => {
    const isChecked = e.target.checked;
    setSelected(isChecked ? category : ''); // Actualiza el estado dependiendo de la selección
  };

  // Datos de la tabla para Artículos Administrativos
  const headersArticulos = ['Item', 'Fecha', 'Descripción', 'Ubicación', 'Estado', 'Acciones'];
  const rowsArticulos = [
    ['Articulo 1', '2024-11-22', 'Descripción del artículo', 'Almacén Principal', 'Disponible'],
  ];

  // Datos de la tabla para Artículos de Almacenamiento
  const headersAlmacenamiento = ['Módulo', 'Estante', 'Cantidad', 'Producto/Detalle', 'Estado', 'Entrada', 'Salida', 'Restante', 'Acciones'];
  const rowsAlmacenamiento = [
    ['Módulo 1', 'Estante A', '100', 'Producto A', 'Disponible', '10', '5', '90'],
  ];

  const handleEdit = (row) => {
    console.log("Editar", row);
  };

  const handleDelete = (row) => {
    console.log("Eliminar", row);
  };

  // Determinar si el checkbox de "Artículos de Almacenamiento" está seleccionado
  const isStorageSelected = selected === 'almacenamiento';

  return (
    <DashboardLayout>
      <div className="mb-6">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-black mb-6">Artículos</h1>

        {/* Contenedor con flexbox */}
        <div className="flex justify-between mb-4">
          {/* Checkbox Group alineado a la izquierda */}
          <CheckboxGroup onChange={handleCheckboxChange} />

          {/* Button Group alineado a la derecha */}
          <ButtonGroup 
            isStorageSelected={isStorageSelected} 
          />
        </div>

        {/* Tabla */}
        {isStorageSelected ? (
          <TableWithActions 
            title="Artículos de Almacenamiento" 
            headers={headersAlmacenamiento} 
            rows={rowsAlmacenamiento} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        ) : (
          <TableWithActions 
            title="Lista de Artículos Administrativos" 
            headers={headersArticulos} 
            rows={rowsArticulos} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Articulos;
