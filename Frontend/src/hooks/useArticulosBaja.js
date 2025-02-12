import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const useArticulosBaja = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocationInitial, setSelectedLocationInitial] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
  
    // Definir las cabeceras para la exportación a Excel
    const headers = ['ID', 'Código', 'Fecha', 'Descripción', 'Proveedor', 'Ubicación', 'Observación'];
  
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
      { value: '102 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos', label: '102 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos' },
    { value: '103 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos', label: '103 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos' },
    { value: '104 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos', label: '104 - Pilosos-Curiosos-Comunicativos-Ciudadanos-Amorosos-Expresivos' },
    { value: '105 - Curiosos-Pilosos-Ciudadanos-Comunicativos', label: '105 - Curiosos-Pilosos-Ciudadanos-Comunicativos' },
    { value: '106 - Curiosos-Pilosos-Ciudadanos-Comunicativos', label: '106 - Curiosos-Pilosos-Ciudadanos-Comunicativos' },
    { value: '107 - Ciudadanos-Comunicativos', label: '107 - Ciudadanos-Comunicativos' },
    { value: '108 - Curiosos-Pilosos/Pilosos', label: '108 - Curiosos-Pilosos/Pilosos' },
    { value: '109 - Ciudadanos/Pensamiento Filosófico', label: '109 - Ciudadanos/Pensamiento Filosófico' },
    { value: '201 - Comunicativos', label: '201 - Comunicativos' },
    { value: '202 - Comunicativos', label: '202 - Comunicativos' },
    { value: '203 - Fraternos y Espirituales', label: '203 - Fraternos y Espirituales' },
    { value: '204 - Pensamiento Matemático', label: '204 - Pensamiento Matemático' },
    { value: '205 - Ciudadanos', label: '205 - Ciudadanos' },
    { value: '206 - Activos', label: '206 - Activos' },
    { value: '206 - Pensamiento Matemático', label: '206 - Pensamiento Matemático' },
    { value: '207 - Indagación Biológica/Indagación Química', label: '207 - Indagación Biológica/Indagación Química' },
    { value: '211 - Indagación Biológica/Indagación Química', label: '211 - Indagación Biológica/Indagación Química' },
    { value: '212 - Indagación Biológica/Indagación Química', label: '212 - Indagación Biológica/Indagación Química' },
    { value: '301 - Innovadores', label: '301 - Innovadores' },
    { value: '302 - Fraternos-Espirituales/Ciudadanos', label: '302 - Fraternos-Espirituales/Ciudadanos' },
    { value: '303 - Ciudadanos/Comunicativos', label: '303 - Ciudadanos/Comunicativos' },
    { value: '304 - Comunicativos', label: '304 - Comunicativos' },
    { value: '305 - Curiosos', label: '305 - Curiosos' },
    { value: '306 - Pilosos/Curiosos', label: '306 - Pilosos/Curiosos' },
    { value: '307 - Wac', label: '307 - Wac' },
    { value: '308 - Comunicativos/Semillero de Lectura', label: '308 - Comunicativos/Semillero de Lectura' },
    { value: '311 - Wac', label: '311 - Wac' },
    { value: '312 - Indagación Física', label: '312 - Indagación Física' },
    { value: '313 - Pensamiento Matemático/Indagación Física', label: '313 - Pensamiento Matemático/Indagación Física' },
    { value: '314 - Pensamiento Matemático/Indagación Física', label: '314 - Pensamiento Matemático/Indagación Física' },
    { value: 'Sala 1 - 208 - Tecnología/Desarrollo Software/Diseño Gráfico', label: 'Sala 1 - 208 - Tecnología/Desarrollo Software/Diseño Gráfico' },
    { value: 'Sala 2 - 209 - Desarrollo Software/Diseño Gráfico', label: 'Sala 2 - 209 - Desarrollo Software/Diseño Gráfico' },
    { value: 'Sala 3 - 210 - Tecnología/Diseño Gráfico', label: 'Sala 3 - 210 - Tecnología/Diseño Gráfico' },
    { value: 'Lab. Wac 309 - Wac', label: 'Lab. Wac 309 - Wac' }
    ];
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    const fetchArticulosBaja = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://inventarioschool-v1.onrender.com/api/articulos_baja');
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        const mappedRows = data.map((item) => [
          item.id,
          item.codigo,
          formatDate(item.fecha_baja),
          item.descripcion,
          item.proveedor,
          item.ubicacion,
          item.observacion,
        ]);
        setRows(mappedRows);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchArticulosBaja();
    }, []);
  
    const handleDelete = async (id) => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://inventarioschool-v1.onrender.com/api/articulos_baja/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar el artículo');
        setRows((prevRows) => prevRows.filter((row) => row[0] !== id));
      } catch (error) {
        console.error('Error al eliminar:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const exportToPDF = () => {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const columns = [
        { header: 'ID', dataKey: 0 },
        { header: 'Código', dataKey: 1 },
        { header: 'Fecha', dataKey: 2 },
        { header: 'Descripción', dataKey: 3 },
        { header: 'Proveedor', dataKey: 4 },
        { header: 'Ubicación', dataKey: 5 },
        { header: 'Observación', dataKey: 6 },
      ];
      const imagePath = '/Img/encabezado.png';
      const img = new Image();
      img.src = imagePath;
      img.onload = () => {
        const imgWidth = 190;
        const imgHeight = (img.height * imgWidth) / img.width;
        const x = (doc.internal.pageSize.width - imgWidth) / 2;
        const y = 10;
  
        doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
        const titleY = y + imgHeight + 10;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Reporte de artículos dados de baja', doc.internal.pageSize.width / 2, titleY, { align: 'center' });
  
        doc.autoTable({
          startY: titleY + 15,
          head: [columns.map((col) => col.header)],
          body: rows.map((row) => columns.map((col) => row[col.dataKey])),
          theme: 'striped',
          headStyles: {
            fillColor: [0, 163, 5],
            textColor: [255, 255, 255],
          },
          styles: {
            fontSize: 9,
            cellPadding: 3,
            halign: 'center',
            valign: 'middle',
          },
        });
        doc.save('articulos_dados_de_baja.pdf');
      };
    };
  
    const exportToExcel = () => {
      // Crear una hoja de cálculo con los datos
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Artículos');
      // Guardar el archivo
      XLSX.writeFile(workbook, 'articulos_dados_de_baja.xlsx');
    };
  
    const filteredRows = rows.filter((row) => {
      const searchFields = [
        row[1] || '', // Descripción
        row[3] || '', // Descripción
        row[4] || '', // Proveedor
        row[5] || '', // Ubicación
        row[6] || '', // Observación
      ];
      const matchesSearch = searchTerm === '' || searchFields.some((field) =>
        field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesLocationInitial = !selectedLocationInitial ||
        row[5]?.toString().toLowerCase() === selectedLocationInitial.value.toLowerCase();
      const rowDate = row[2] ? new Date(row[2].split('/').reverse().join('-')) : null;
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;
      const matchesFromDate = !fromDateObj || (rowDate && rowDate >= fromDateObj);
      const matchesToDate = !toDateObj || (rowDate && rowDate <= toDateObj);
      return matchesSearch && matchesLocationInitial && matchesFromDate && matchesToDate;
    });
  
    return {
      isLoading,
      rows: filteredRows,
      searchTerm,
      setSearchTerm,
      selectedLocationInitial,
      setSelectedLocationInitial,
      fromDate,
      setFromDate,
      toDate,
      setToDate,
      ubicaciones,
      handleDelete,
      exportToPDF,
      exportToExcel,
    };
  };
  
  export default useArticulosBaja;