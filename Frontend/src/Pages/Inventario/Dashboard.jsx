import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Table from '../../Components/Table';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [totalArticulosActivos, setTotalArticulosActivos] = useState(0);
  const [totalArticulosInactivos, setTotalArticulosInactivos] = useState(0);
  const [totalArticulosAlmacenamiento, setTotalArticulosAlmacenamiento] = useState(0);
  const [actividadReciente, setActividadReciente] = useState([]);

  const resumenHeaders = ['Artículos Totales', 'Artículos Administrativos', 'Artículos Aux. Mantenimiento'];
  const actividadHeaders = ['Fecha ', 'Tipo de reporte', 'Descripcion'];

  const pieData = {
    labels: ['Artículos Activos', 'Artículos Inactivos'],
    datasets: [
      {
        label: 'Distribución de Artículos',
        data: [totalArticulosActivos, totalArticulosInactivos],
        backgroundColor: ['#00A305', '#FF5733'],
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Artículos Administrativos', 'Artículos Aux. Mantenimiento'],
    datasets: [
      {
        label: 'Cantidad',
        data: [totalArticulosActivos, totalArticulosAlmacenamiento],
        backgroundColor: ['#00A305', '#fef200'],
        borderColor: ['#00A305', '#FFEB50'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Artículos',
      },
    },
  };

  useEffect(() => {
    const fetchTotalArticulosActivos = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/total-activos');
        const data = await response.json();
        setTotalArticulosActivos(data.total_activos);
      } catch (error) {
        console.error('Error al obtener los artículos activos:', error);
      }
    };

    const fetchTotalArticulosInactivos = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/total-inactivos');
        const data = await response.json();
        setTotalArticulosInactivos(data.total_inactivos);
      } catch (error) {
        console.error('Error al obtener los artículos inactivos:', error);
      }
    };

    const fetchTotalArticulosAlmacenamiento = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/total-articulos-almacenamiento');
        const data = await response.json();
        setTotalArticulosAlmacenamiento(data.total_registros);
      } catch (error) {
        console.error('Error al obtener los artículos en almacenamiento:', error);
      }
    };

    const fetchActividadReciente = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ultimo-registro');
        const data = await response.json();
    
        if (data) {
          // Formatear la fecha para mostrar solo la parte de la fecha (sin hora)
          const fechaFormateada = new Date(data.fecha).toLocaleDateString();
    
          setActividadReciente([
            [fechaFormateada, data.tipo_tabla, data.descripcion],
          ]);
        }
      } catch (error) {
        console.error('Error al obtener la actividad reciente:', error);
      }
    };

    fetchTotalArticulosActivos();
    fetchTotalArticulosInactivos();
    fetchTotalArticulosAlmacenamiento();
    fetchActividadReciente();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-black mt-20">Tablero</h1>
        <Table
          title="Resumen de Inventario"
          headers={resumenHeaders}
          rows={[
            [
              parseInt(totalArticulosActivos) + parseInt(totalArticulosAlmacenamiento),
              totalArticulosActivos,
              totalArticulosAlmacenamiento,
            ],
          ]}
        />
      </div>

      <div className="mt-6">
        <Table title="Actividad Reciente" headers={actividadHeaders} rows={actividadReciente} />
      </div>

      <div className="mt-6">
        <div className="flex justify-between">
          <div className="w-1/2">
            <div className="bg-white h-64 rounded-lg p-4">
              <Pie data={pieData} options={{ responsive: true }} />
            </div>
          </div>
          <div className="w-1/2">
            <div className="bg-white h-64 rounded-lg p-4">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
