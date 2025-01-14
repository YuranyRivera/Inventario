import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import CheckboxGroup from '../../Components/CheckboxGroup';
import ButtonGroup from '../../Components/ButtonGroup';
import ArticulosAdministrativos from '../Inventario/ArticulosAdministrativos';
import ArticulosAlmacenamiento from '../Inventario/ArticulosAlmacenamiento';
import useArticulo from '../../hooks/useArticulo'; // Hook para manejar artículos de almacenamiento
import useArticulosAdministrativos from '../../hooks/useArticulosAdministrativos'; // Hook para manejar artículos administrativos

const Articulos = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('administrativos'); // Corregir valor inicial a 'administrativos'

  const { articulos: articulosAlmacenamiento, reloadArticulos: reloadArticulosAlmacenamiento } = useArticulo();
  const { articulos: articulosAdministrativos, reloadArticulos: reloadArticulosAdministrativos } = useArticulosAdministrativos();

  useEffect(() => {
    const storedSelected = localStorage.getItem('selectedCategory');
    if (storedSelected) {
      setSelected(storedSelected);
    } else if (location.state?.selected) {
      setSelected(location.state.selected);
    }
  }, [location.state]);

  const handleCheckboxChange = (e, category) => {
    setSelected(category);
    localStorage.setItem('selectedCategory', category);
    console.log('Categoría seleccionada y guardada:', category);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-black mb-4 md:mb-6 mt-10">
          Artículos
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <CheckboxGroup selected={selected} onChange={handleCheckboxChange} />
          <ButtonGroup
            isStorageSelected={selected === 'almacenamiento'}
            onSave={() => {
              console.log('Estado actual guardado:', selected);
              localStorage.setItem('selectedCategory', selected);
              if (selected === 'almacenamiento') {
                reloadArticulosAlmacenamiento();
              } else {
                reloadArticulosAdministrativos();
              }
            }}
            reloadArticulos={selected === 'almacenamiento' ? reloadArticulosAlmacenamiento : reloadArticulosAdministrativos}
          />
        </div>
        {selected === 'almacenamiento' ? (
          <ArticulosAlmacenamiento articulos={articulosAlmacenamiento} reloadArticulos={reloadArticulosAlmacenamiento} />
        ) : (
          <ArticulosAdministrativos articulos={articulosAdministrativos} reloadArticulos={reloadArticulosAdministrativos} />
        )}
      </div>
    </DashboardLayout>
  );
};
export default Articulos; 