const express = require('express');
const chartController = require('../controllers/chartController');

const router = express.Router();

// Get available dates for a specific year
router.get('/dates/:year', chartController.getChartDates);

// Get chart data for a specific date
router.get('/data/:date', chartController.getChartData);

// Get yearly top songs
router.get('/yearly-top/:year', chartController.getYearlyTopSongs);

// Get available Shazam chart types
router.get('/shazam/chart-types', chartController.getShazamChartTypes);

module.exports = router; 