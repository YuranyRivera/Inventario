import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Table from '../../Components/Table';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '@dotlottie/player-component';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [totalArticulosActivos, setTotalArticulosActivos] = useState(0);
  const [totalArticulosInactivos, setTotalArticulosInactivos] = useState(0);
  const [totalArticulosAlmacenamiento, setTotalArticulosAlmacenamiento] = useState(0);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchData = async () => {
      try {
        const [
          activosResponse,
          inactivosResponse,
          almacenamientoResponse,
          actividadResponse,
        ] = await Promise.all([
          fetch('http://localhost:4000/api/total-activos'),
          fetch('http://localhost:4000/api/total-inactivos'),
          fetch('http://localhost:4000/api/total-articulos-almacenamiento'),
          fetch('http://localhost:4000/api/ultimo-registro'),
        ]);

        const activosData = await activosResponse.json();
        const inactivosData = await inactivosResponse.json();
        const almacenamientoData = await almacenamientoResponse.json();
        const actividadData = await actividadResponse.json();

        setTotalArticulosActivos(activosData.total_activos);
        setTotalArticulosInactivos(inactivosData.total_inactivos);
        setTotalArticulosAlmacenamiento(almacenamientoData.total_registros);

        if (actividadData) {
          const fechaFormateada = new Date(actividadData.fecha).toLocaleDateString();
          setActividadReciente([
            [fechaFormateada, actividadData.tipo_tabla, actividadData.descripcion],
          ]);
        }

        setIsLoading(false); // Una vez que todos los datos están cargados, ocultar el loader
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setIsLoading(false); // Incluso en caso de error, ocultar el loader
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <dotlottie-player
            src="https://lottie.host/0aca447b-d3c9-46ed-beeb-d4481815915a/qvvqgKAKQU.lottie"
            background="transparent"
            speed="1"
            style={{ width: '300px', height: '300px' }}
            loop
            autoplay
          />
        </div>
      ) : (
        <>
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
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
