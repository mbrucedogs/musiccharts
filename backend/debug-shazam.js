const ShazamService = require('./src/models/shazamService');

async function debugShazam() {
  try {
    console.log('Testing Shazam Country Chart...');
    const data = await ShazamService.getChartData('country');
    console.log('Found', data.length, 'songs:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugShazam(); 