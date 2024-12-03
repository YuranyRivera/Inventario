import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import CheckboxGroup from '../../Components/CheckboxGroup';
import ButtonGroup from '../../Components/ButtonGroup';
import ArticulosAdministrativos from '../Inventario/ArticulosAdministrativos';
import ArticulosAlmacenamiento from '../Inventario/ArticulosAlmacenamiento';
import useArticulo from '../../hooks/useArticulo'; // Import the hook

const Articulos = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('administrativos');
  const { reloadArticulos } = useArticulo(); // Use the hook to get reloadArticulos

  // Sincroniza la categoría seleccionada si se pasa por la ubicación.
  useEffect(() => {
    if (location.state?.selected) {
      setSelected(location.state.selected);
    }
  }, [location.state]);

  // Maneja los cambios en la selección de categorías.
  const handleCheckboxChange = (e, category) => {
    setSelected(category);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 m-5">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Artículos</h1>
        <div className="flex justify-between">
          <CheckboxGroup selected={selected} onChange={handleCheckboxChange} />
          <ButtonGroup
            isStorageSelected={selected === 'almacenamiento'}
            onSave={reloadArticulos} // Pass reloadArticulos directly
          />
        </div>
        {selected === 'almacenamiento' ? (
          <ArticulosAlmacenamiento />
        ) : (
          <ArticulosAdministrativos />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Articulos;