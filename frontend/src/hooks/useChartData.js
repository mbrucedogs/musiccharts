import { useState, useEffect } from 'react';
import { getChartData } from '../services/chartApi';

export const useChartData = (selectedDate) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedDate) {
        setChartData([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getChartData(selectedDate);
        setChartData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch chart data');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedDate]);

  return { chartData, loading, error };
}; 