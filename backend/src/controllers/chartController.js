const ChartService = require('../models/chartService');

// Get available dates for a specific year
const getChartDates = async (req, res) => {
  try {
    const { year } = req.params;
    
    // Validate year parameter
    const validatedYear = ChartService.validateYear(year);
    
    const dates = await ChartService.getAvailableDates(validatedYear);
    res.json(dates);
  } catch (error) {
    console.error('Error in getChartDates:', error);
    res.status(400).json({ 
      error: 'Failed to fetch chart dates',
      message: error.message 
    });
  }
};

// Get chart data for a specific date
const getChartData = async (req, res) => {
  try {
    const { date } = req.params;
    
    if (!date) {
      return res.status(400).json({ 
        error: 'Invalid date parameter',
        message: 'Date parameter is required'
      });
    }

    // Validate date format
    ChartService.validateDate(date);

    const data = await ChartService.getChartData(date);
    res.json(data);
  } catch (error) {
    console.error('Error in getChartData:', error);
    res.status(400).json({ 
      error: 'Failed to fetch chart data',
      message: error.message 
    });
  }
};

// Get yearly top songs
const getYearlyTopSongs = async (req, res) => {
  try {
    const { year } = req.params;
    
    // Validate year parameter
    const validatedYear = ChartService.validateYear(year);
    
    const yearlySongs = await ChartService.getYearlyTopSongs(validatedYear);
    res.json(yearlySongs);
  } catch (error) {
    console.error('Error in getYearlyTopSongs:', error);
    res.status(400).json({ 
      error: 'Failed to fetch yearly top songs',
      message: error.message 
    });
  }
};

module.exports = {
  getChartDates,
  getChartData,
  getYearlyTopSongs
}; 