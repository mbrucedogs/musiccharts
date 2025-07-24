import { useState, useEffect } from 'react';
import { getYearlyTopSongs } from '../services/chartApi';

export const useYearlyTopSongs = (year, source, chartType = null) => {
  const [yearlySongs, setYearlySongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYearlyTopSongs = async () => {
      if (!year || !source) {
        setYearlySongs([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getYearlyTopSongs(year, source, chartType);
        setYearlySongs(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch yearly top songs');
        setYearlySongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyTopSongs();
  }, [year, source, chartType]);

  return { yearlySongs, loading, error };
}; 