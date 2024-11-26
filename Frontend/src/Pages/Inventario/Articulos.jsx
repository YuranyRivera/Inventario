import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import CheckboxGroup from '../../Components/CheckboxGroup';
import ButtonGroup from '../../Components/ButtonGroup';
import ArticulosAdministrativos from '../Inventario/ArticulosAdministrativos.jsx';
import ArticulosAlmacenamiento from '../Inventario/ArticulosAlmacenamiento';

const Articulos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('administrativos'); // Por defecto, administrativos

  useEffect(() => {
    if (location.state?.selected) {
      setSelected(location.state.selected); // Cambiar según el estado recibido
    }
  }, [location.state]);

  const handleCheckboxChange = (e, category) => {
    setSelected(category);
  };

  const handleActionClick = () => {
    if (selected === 'almacenamiento') {
      navigate('/aux-mantenimiento', { state: { selected: 'almacenamiento' } });
    } else {
      navigate('/administrativos', { state: { selected: 'administrativos' } });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 m-5">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Artículos</h1>
        <div className="flex justify-between">
          <CheckboxGroup selected={selected} onChange={handleCheckboxChange} />
          <ButtonGroup isStorageSelected={selected === 'almacenamiento'} onActionClick={handleActionClick} />
        </div>
        {selected === 'almacenamiento' ? <ArticulosAlmacenamiento /> : <ArticulosAdministrativos />}
      </div>
    </DashboardLayout>
  );
};

export default Articulos;
