import { useState, useEffect } from 'react';
import { getYearlyTopSongs } from '../services/chartApi';

export const useYearlyTopSongs = (year) => {
  const [yearlySongs, setYearlySongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYearlyTopSongs = async () => {
      if (!year) {
        setYearlySongs([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getYearlyTopSongs(year);
        setYearlySongs(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch yearly top songs');
        setYearlySongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyTopSongs();
  }, [year]);

  return { yearlySongs, loading, error };
}; 