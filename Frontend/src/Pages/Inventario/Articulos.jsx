import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import CheckboxGroup from '../../Components/CheckboxGroup';
import ButtonGroup from '../../Components/ButtonGroup';
import ArticulosAdministrativos from '../Inventario/ArticulosAdministrativos';
import ArticulosAlmacenamiento from '../Inventario/ArticulosAlmacenamiento';
import useArticulo from '../../hooks/useArticulo'; // Hook para manejar lógica

const Articulos = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('administrativo');
  const { articulos, reloadArticulos } = useArticulo(); // Hook para manejar los artículos

  useEffect(() => {
    // Al cargar, recuperamos el valor de 'selected' desde el localStorage (si existe)
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
      <div className="mb-6 m-5">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Artículos</h1>
        <div className="flex justify-between">
          <CheckboxGroup selected={selected} onChange={handleCheckboxChange} />
          <ButtonGroup
            isStorageSelected={selected === 'almacenamiento'}
            onSave={() => {
              console.log('Estado actual guardado:', selected); // Muestra el estado en la consola
              localStorage.setItem('selectedCategory', selected); // Guardamos el estado en localStorage
              reloadArticulos(); // Recarga los artículos
            }}
            reloadArticulos={reloadArticulos}  // Pasar reloadArticulos a ButtonGroup
          />
        </div>
        {selected === 'almacenamiento' ? (
          <ArticulosAlmacenamiento articulos={articulos} reloadArticulos={reloadArticulos} />
        ) : (
          <ArticulosAdministrativos />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Articulos;
