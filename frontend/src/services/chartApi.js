import axios from 'axios';

// Configure base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for yearly calculations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get available dates for a specific year
export const getChartDates = async (year) => {
  try {
    const response = await api.get(`/chart/dates/${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chart dates:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch chart dates');
  }
};

// Get chart data for a specific date
export const getChartData = async (date) => {
  try {
    const response = await api.get(`/chart/data/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch chart data');
  }
};

// Get yearly top songs
export const getYearlyTopSongs = async (year) => {
  try {
    const response = await api.get(`/chart/yearly-top/${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly top songs:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch yearly top songs');
  }
};

// Export the api instance for potential future use
export default api; 