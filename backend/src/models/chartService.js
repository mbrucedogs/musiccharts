const axios = require('axios');
const cheerio = require('cheerio');

class ChartService {
  static baseUrl = 'https://musicchartsarchive.com';

  // Get available dates for a specific year by scraping the HTML
  static async getAvailableDates(year) {
    try {
      const url = `${this.baseUrl}/singles-charts/${year}`;
      console.log(`Scraping dates from: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      const dates = [];

      // Find all chart date links in the format: <a href="/singles-chart/2024-04-06">Apr 6, 2024</a>
      $('a[href^="/singles-chart/"]').each((index, element) => {
        const href = $(element).attr('href');
        const text = $(element).text().trim();
        
        // Extract date from href (e.g., "/singles-chart/2024-04-06" -> "2024-04-06")
        const dateMatch = href.match(/\/singles-chart\/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const date = dateMatch[1];
          dates.push({
            date: date,
            formattedDate: text
          });
        }
      });

      // Sort dates chronologically
      dates.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log(`Found ${dates.length} dates for year ${year}`);
      return dates;
    } catch (error) {
      console.error(`Error scraping dates for year ${year}:`, error.message);
      throw new Error(`Failed to fetch available dates for year ${year}: ${error.message}`);
    }
  }

  // Get chart data for a specific date by scraping the HTML
  static async getChartData(date) {
    try {
      const url = `${this.baseUrl}/singles-chart/${date}`;
      console.log(`Scraping chart data from: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      const songs = [];

      // Find all table rows in the chart table
      $('.chart-table tr').each((index, element) => {
        const $row = $(element);
        const $cells = $row.find('td');
        
        // Skip header rows or rows without enough cells
        if ($cells.length < 3) return;
        
        const order = $cells.eq(0).text().trim();
        const titleLink = $cells.eq(1).find('a');
        const artistLink = $cells.eq(2).find('a');
        
        // Skip if no order number (likely header row)
        if (!order || isNaN(parseInt(order))) return;
        
        const title = titleLink.text().trim();
        const artist = artistLink.text().trim();
        
        // Only add if we have valid data
        if (title && artist) {
          songs.push({
            order: parseInt(order),
            title: title,
            artist: artist
          });
        }
      });

      console.log(`Found ${songs.length} songs for date ${date}`);
      return songs;
    } catch (error) {
      console.error(`Error scraping chart data for date ${date}:`, error.message);
      throw new Error(`Failed to fetch chart data for date ${date}: ${error.message}`);
    }
  }

  // Get yearly top songs by analyzing all chart data for a year
  static async getYearlyTopSongs(year) {
    try {
      console.log(`Calculating yearly top songs for ${year}`);
      
      // Get all available dates for the year
      const dates = await this.getAvailableDates(year);
      
      if (dates.length === 0) {
        throw new Error(`No chart data available for year ${year}`);
      }

      const songFrequency = {};
      
      // Process each date to collect song data
      console.log(`Processing ${dates.length} dates for yearly calculation...`);
      for (let i = 0; i < dates.length; i++) {
        const dateObj = dates[i];
        console.log(`Processing date ${i + 1}/${dates.length}: ${dateObj.date}`);
        try {
          const songs = await this.getChartData(dateObj.date);
          
          songs.forEach(song => {
            const key = `${song.title}-${song.artist}`;
            
            if (!songFrequency[key]) {
              songFrequency[key] = {
                title: song.title,
                artist: song.artist,
                appearances: 0,
                highestPosition: 999,
                totalPoints: 0
              };
            }
            
            songFrequency[key].appearances++;
            songFrequency[key].highestPosition = Math.min(songFrequency[key].highestPosition, song.order);
            // Reverse scoring: 1st place = 50 points, 50th place = 1 point
            songFrequency[key].totalPoints += (51 - song.order);
          });
          
          // Add a small delay between requests to be respectful to the server
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`Skipping date ${dateObj.date} due to error: ${error.message}`);
          continue;
        }
      }

      // Convert to array and sort by total points (descending)
      const yearlySongs = Object.values(songFrequency)
        .sort((a, b) => {
          // Primary sort: total points
          if (b.totalPoints !== a.totalPoints) {
            return b.totalPoints - a.totalPoints;
          }
          // Secondary sort: highest position (lower is better)
          if (a.highestPosition !== b.highestPosition) {
            return a.highestPosition - b.highestPosition;
          }
          // Tertiary sort: number of appearances
          return b.appearances - a.appearances;
        })
        .slice(0, 50) // Get top 50
        .map((song, index) => ({
          order: index + 1,
          title: song.title,
          artist: song.artist,
          totalPoints: song.totalPoints,
          highestPosition: song.highestPosition,
          appearances: song.appearances
        }));

      console.log(`Calculated yearly top ${yearlySongs.length} songs for ${year}`);
      return yearlySongs;
    } catch (error) {
      console.error(`Error calculating yearly top songs for ${year}:`, error.message);
      throw new Error(`Failed to calculate yearly top songs for ${year}: ${error.message}`);
    }
  }

  // Validate date format (YYYY-MM-DD)
  static validateDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }
    
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    }
    
    return true;
  }

  // Validate year format
  static validateYear(year) {
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1970 || yearNum > new Date().getFullYear() + 1) {
      throw new Error('Invalid year. Must be between 1970 and current year + 1');
    }
    return yearNum;
  }
}

module.exports = ChartService; 