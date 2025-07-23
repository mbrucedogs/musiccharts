import { useState, useEffect } from 'react';
import { getChartDates } from '../services/chartApi';

export const useChartDates = (year) => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      if (!year) return;

      setLoading(true);
      setError(null);

      try {
        const datesData = await getChartDates(year);
        setDates(datesData);
      } catch (err) {
        setError(err.message || 'Failed to fetch dates');
        setDates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [year]);

  return { dates, loading, error };
}; 