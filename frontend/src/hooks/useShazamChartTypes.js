import { useState, useEffect } from 'react';
import { getShazamChartTypes } from '../services/chartApi';

export const useShazamChartTypes = () => {
  const [chartTypes, setChartTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartTypes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getShazamChartTypes();
        setChartTypes(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch Shazam chart types');
        setChartTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartTypes();
  }, []);

  return { chartTypes, loading, error };
}; 