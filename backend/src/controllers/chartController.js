const ChartService = require('../models/chartService');
const KworbService = require('../models/kworbService');
const ShazamService = require('../models/shazamService');

// Get available dates for a specific year
const getChartDates = async (req, res) => {
  try {
    const { year } = req.params;
    const source = req.query.source || 'musicchartsarchive';
    let dates;
    
    if (source === 'kworb') {
      dates = await KworbService.getAvailableDates(year);
    } else if (source === 'shazam') {
      dates = await ShazamService.getAvailableDates(year);
    } else {
      // Validate year parameter
      const validatedYear = ChartService.validateYear(year);
      dates = await ChartService.getAvailableDates(validatedYear);
    }
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
    const source = req.query.source || 'musicchartsarchive';
    const chartType = req.query.chartType || 'top-200'; // For Shazam
    
    if (!date) {
      return res.status(400).json({ 
        error: 'Invalid date parameter',
        message: 'Date parameter is required'
      });
    }
    
    let data;
    if (source === 'kworb') {
      data = await KworbService.getChartData(date);
    } else if (source === 'shazam') {
      data = await ShazamService.getChartData(chartType);
    } else {
      // Validate date format
      ChartService.validateDate(date);
      data = await ChartService.getChartData(date);
    }
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
    const source = req.query.source || 'musicchartsarchive';
    const chartType = req.query.chartType || 'top-200'; // For Shazam
    
    let yearlySongs;
    if (source === 'kworb') {
      yearlySongs = await KworbService.getYearlyTopSongs(year);
    } else if (source === 'shazam') {
      yearlySongs = await ShazamService.getYearlyTopSongs(year, chartType);
    } else {
      // Validate year parameter
      const validatedYear = ChartService.validateYear(year);
      yearlySongs = await ChartService.getYearlyTopSongs(validatedYear);
    }
    res.json(yearlySongs);
  } catch (error) {
    console.error('Error in getYearlyTopSongs:', error);
    res.status(400).json({ 
      error: 'Failed to fetch yearly top songs',
      message: error.message 
    });
  }
};

// Get available Shazam chart types
const getShazamChartTypes = async (req, res) => {
  try {
    const chartTypes = ShazamService.getAvailableCharts();
    res.json(chartTypes);
  } catch (error) {
    console.error('Error in getShazamChartTypes:', error);
    res.status(400).json({ 
      error: 'Failed to fetch Shazam chart types',
      message: error.message 
    });
  }
};

module.exports = {
  getChartDates,
  getChartData,
  getYearlyTopSongs,
  getShazamChartTypes
}; 