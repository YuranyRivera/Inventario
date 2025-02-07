import React from 'react';
import AdminArticlesTable from '../../Components/AdminArticlesTable';

import DateInput from '../../Components/DateInput';
import { Search } from 'lucide-react';
import ButtonGroup from '../../Components/PDF';
import ExcelExportButton from '../../Components/Excel';
import ModalConfirmacion from '../../Components/ModalConf';
import ModalObservacion from '../../Components/ModalObs';
import Select from 'react-select';
import useArticulosAdministrativos from '../../hooks/useArticulosAdministracion';

const ArticulosAdministrativos = ({ articulos = [], reloadArticulos }) => {
  const headers = ['ID', 'Código', 'Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación', 'Precio'];

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
  ];

  const {
    searchTerm,
    setSearchTerm,
    selectedLocation,
    setSelectedLocation,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    editingRowIndex,
    editedRowData,
    isModalOpen,
    isObservacionModalOpen,
    articuloToDelete,
    errors,
    handleCancel,
    handleEdit,
    handleInputChange,
    handleSave,
    handleDelete,
    handleDeleteClick,
    handleObservacionSave,
    tableRows,
    filteredArticulos,
  } = useArticulosAdministrativos(articulos, reloadArticulos);

  return (
    <div className="space-y-4">
      <ModalObservacion
        isOpen={isObservacionModalOpen}
        onClose={() => setIsObservacionModalOpen(false)}
        onSave={handleObservacionSave}
      />

      <ModalConfirmacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleDelete(articuloToDelete?.observacion)}
        message="¿Está seguro de que desea dar de baja este artículo?"
      />

      <div className="flex flex-col md:flex-row items-stretch space-y-2 md:space-y-0 md:space-x-2">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por descripción, proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <ButtonGroup
            isStorageSelected={false}
            reloadArticulos={reloadArticulos}
            filteredData={filteredArticulos}
            allData={articulos}
          />
          <ExcelExportButton 
            filteredData={filteredArticulos}
            allData={articulos}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Ubicación</label>
          <Select
            options={ubicaciones}
            value={selectedLocation}
            onChange={setSelectedLocation}
            isClearable
            placeholder="Seleccionar ubicación..."
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Desde</label>
          <DateInput
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hasta</label>
          <DateInput
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <AdminArticlesTable
          headers={headers}
          rows={tableRows}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          editingRowIndex={editingRowIndex}
          editedRowData={editedRowData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          handleCancel={handleCancel}
          errors={errors}
          disableFields={['id']}
        />
      </div>
    </div>
  );
};

export default ArticulosAdministrativos;