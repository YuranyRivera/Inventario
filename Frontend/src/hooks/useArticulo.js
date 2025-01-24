import { useState, useEffect } from 'react';

const useArticulo = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggerReload, setTriggerReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(true);
        const response = await fetch('http://localhost:4000/api/articulos');
        console.log('Fetch response:', response); // Debugging log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched articles:', data); // Debugging log

        setArticulos(data);
      } catch (error) {
        console.error('Fetch error:', error); // Detailed error logging
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticulos();
  }, [triggerReload]);

  const reloadArticulos = () => {
    console.log('Reloading articles...'); // Debugging log
    setTriggerReload(prev => prev + 1);
  };

  return { articulos, loading, error, reloadArticulos, isLoading };
};

export default useArticulo;
