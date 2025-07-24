import { useState, useEffect } from 'react';
import { getChartData } from '../services/chartApi';

export const useChartData = (selectedDate, source, chartType = null) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedDate || !source) {
        setChartData([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getChartData(selectedDate, source, chartType);
        setChartData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch chart data');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedDate, source, chartType]);

  return { chartData, loading, error };
}; 