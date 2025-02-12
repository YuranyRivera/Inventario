import React from 'react';

const CategorySelect = ({ value, onChange, error, disabled }) => {
  const ubicaciones = [
    { value: 'Recepción', label: 'Recepción' },
    { value: 'Tesorería', label: 'Tesorería' },
    { value: 'Coordinación convivencia', label: 'Coordinación convivencia' },
    { value: 'Rectoría', label: 'Rectoría' },
    { value: 'Secretaría académica', label: 'Secretaría académica' },
    { value: 'Coordinación académica', label: 'Coordinación académica' },
    { value: 'Sala de profesores', label: 'Sala de profesores' },
    { value: 'Aux contable y financiera', label: 'Aux contable y financiera' },
    { value: 'Aux administrativa y contable', label: 'Aux administrativa y contable' },
    { value: 'Contadora', label: 'Contadora' },
    { value: 'Cocina', label: 'Cocina' },
    { value: 'Almacén', label: 'Almacén' },
    { value: 'Espacio de servicios generales', label: 'Espacio de servicios generales' },
    { value: 'Sala audiovisuales', label: 'Sala audiovisuales' },
    { value: 'Sala lúdica', label: 'Sala lúdica' },
    { value: 'Capilla', label: 'Capilla' },
    // Salones y sus competencias
    { value: '104', label: '104 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos' },
    { value: '102', label: '102 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos' },
    { value: '103', label: '103 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos' },
    { value: '105', label: '105 - Curiosos-Pilosos-Ciudadanos-Comunicativos' },
    { value: '106', label: '106 - Curiosos-Pilosos-Ciudadanos-Comunicativos' },
    { value: '107', label: '107 - Ciudadanos-Comunicativos' },
    { value: '108', label: '108 - Curiosos-Pilosos/Pilosos' },
    { value: '301', label: '301 - Innovadores' },
    { value: '302', label: '302 - Fraternos-Espirituales/Ciudadanos' },
    { value: '303', label: '303 - Ciudadanos/Comunicativos' },
    { value: '304', label: '304 - Comunicativos' },
    { value: '305', label: '305 - Curiosos' },
    { value: '306', label: '306 - Pilosos/Curiosos' },
    { value: '201', label: '201 - Comunicativos' },
    { value: '311', label: '311 - Wac' },
    { value: '212', label: '212 - Indagación Biológica/Indagación Química' },
    { value: '312', label: '312 - Indagación Física' },
    { value: '202', label: '202 - Comunicativos' },
    { value: '207', label: '207 - Indagación Biológica/Indagación Química' },
    { value: '205', label: '205 - Ciudadanos' },
    { value: '206', label: '206 - Activos' },
    { value: '204', label: '204 - Pensamiento Matemático' },
    { value: '211', label: '211 - Indagación Biológica/Indagación Química' },
    { value: 'Sala 2 - 209', label: 'Sala 2 - 209 - Desarrollo Software/Diseño Gráfico' },
    { value: '109', label: '109 - Ciudadanos/Pensamiento Filosófico' },
    { value: '308', label: '308 - Comunicativos/Semillero de Lectura' },
    { value: 'Lab. Wac 309', label: 'Lab. Wac 309 - Wac' },
    { value: '206', label: '206 - Pensamiento Matemático' },
    { value: 'Sala 3 - 210', label: 'Sala 3 - 210 - Tecnología/Diseño Gráfico' },
    { value: 'Sala 1 - 208', label: 'Sala 1 - 208 - Tecnología/Desarrollo Software/Diseño Gráfico' },
    { value: '313 - 314', label: '313 - 314 - Pensamiento Matemático/Indagación Física' },
    { value: '307', label: '307 - Wac' },
    { value: '203', label: '203 - Fraternos y Espirituales' }
  ];
  

  return (
    <div>
      <select
        value={value}
        onChange={onChange}
        className={`border px-3 py-2.5 w-full rounded ${error ? 'border-red-500' : ''}`}
        disabled={disabled}
      >
        <option value="">Selecciona una categoría</option>
        {ubicaciones.map((ubicacion) => (
          <option key={ubicacion.value} value={ubicacion.value}>
            {ubicacion.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CategorySelect;
