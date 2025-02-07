import { useState, useEffect } from 'react';

const useArticulosAdministrativos = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggerReload, setTriggerReload] = useState(0);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://inventarioschool-v1.onrender.com/api/articulos-administrativos');
        console.log('Fetch response:', response); // Debugging log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched administrative articles:', data); // Debugging log

        setArticulos(data);
      } catch (error) {
        console.error('Fetch error:', error); // Detailed error logging
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticulos();
  }, [triggerReload]);

  const reloadArticulos = () => {
    console.log('Reloading administrative articles...'); // Debugging log
    setTriggerReload(prev => prev + 1);
  };

  return { articulos, loading, error, reloadArticulos };
};

export default useArticulosAdministrativos;
