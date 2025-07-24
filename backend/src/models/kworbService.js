const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://kworb.net/apple_songs/';

class KworbService {
  // Get available dates from the archive (2022 and forward)
  static async getAvailableDates(year) {
    if (parseInt(year) < 2022) return [];
    const archiveUrl = BASE_URL + 'archive/';
    console.log('[kworb] Fetching archive:', archiveUrl);
    const res = await axios.get(archiveUrl);
    const $ = cheerio.load(res.data);
    const dates = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      // kworb archive links are in the format YYYYMMDD.html
      const match = href && href.match(/(\d{8})\.html/);
      if (match) {
        // Convert to YYYY-MM-DD for API
        const date = match[1].replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        const y = parseInt(date.substring(0, 4));
        if (y >= 2022 && date.startsWith(year)) {
          dates.push({
            date,
            formattedDate: date // You can format as needed
          });
        }
      }
    });
    // Optionally add 'today' as the current chart if year is current year
    const now = new Date();
    if (parseInt(year) === now.getFullYear()) {
      dates.unshift({
        date: 'today',
        formattedDate: 'Today'
      });
    }
    // Sort dates ascending
    dates.sort((a, b) => a.date.localeCompare(b.date));
    console.log('[kworb] Available dates for', year, ':', dates.map(d => d.date));
    return dates;
  }

  // Get chart data for a specific date
  static async getChartData(date) {
    let url;
    if (date === 'today') {
      url = BASE_URL + 'index.html';
    } else {
      // kworb archive URLs use YYYYMMDD (no dashes)
      const dateNoDash = date.replace(/-/g, '');
      url = BASE_URL + 'archive/' + dateNoDash + '.html';
    }
    console.log('[kworb] Fetching chart data:', url);
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    let songs = [];
    $('table.sortable tbody tr').each((i, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 13) {
        const us = parseInt($(tds[9]).text().trim());
        if (isNaN(us)) return; // Only include songs with a valid US position
        const artistAndTitle = $(tds[2]).text().trim();
        // Split "Artist - Title"
        const [artist, ...titleParts] = artistAndTitle.split(' - ');
        const title = titleParts.join(' - ');
        if (artist && title) {
          songs.push({
            order: us, // Use US chart position as the order
            artist: artist.trim(),
            title: title.trim()
          });
        }
      }
    });
    // Sort by US ranking (ascending) and take top 50
    songs = songs.sort((a, b) => a.order - b.order).slice(0, 50);
    console.log('[kworb] Found', songs.length, 'songs with US ranking');
    return songs;
  }

  // Get yearly top songs for a year (sample charts throughout the year, aggregate by best US position)
  static async getYearlyTopSongs(year) {
    const dates = await this.getAvailableDates(year);
    if (dates.length === 0) return [];
    
    // Sample charts more frequently - every 3-4 days instead of weekly
    const sampledDates = [];
    const step = Math.max(1, Math.floor(dates.length / 52)); // Aim for ~52 samples per year
    
    for (let i = 0; i < dates.length; i += step) {
      sampledDates.push(dates[i].date);
    }
    
    // Also include the last date if not already included
    if (sampledDates.length > 0 && sampledDates[sampledDates.length - 1] !== dates[dates.length - 1].date) {
      sampledDates.push(dates[dates.length - 1].date);
    }
    
    console.log('[kworb] Sampled dates for yearly top:', sampledDates.length, 'charts');
    console.log('[kworb] Sample dates:', sampledDates.slice(0, 10), '...');
    // Aggregate songs by title+artist, track best US position and appearances
    const songMap = {};
    let totalSongsProcessed = 0;
    
    for (const date of sampledDates) {
      try {
        const chart = await this.getChartData(date);
        totalSongsProcessed += chart.length;
        
        chart.forEach(song => {
          if (!song.title || !song.artist) return;
          const key = song.title + '|' + song.artist;
          if (!songMap[key]) {
            songMap[key] = {
              title: song.title,
              artist: song.artist,
              bestUS: song.order,
              appearances: 0
            };
          }
          if (song.order < songMap[key].bestUS) {
            songMap[key].bestUS = song.order;
          }
          songMap[key].appearances++;
        });
      } catch (error) {
        console.log('[kworb] Error processing date', date, ':', error.message);
      }
    }
    
    console.log('[kworb] Processed', totalSongsProcessed, 'total songs across', sampledDates.length, 'charts');
    console.log('[kworb] Found', Object.keys(songMap).length, 'unique songs');
    // Sort by best US position (ascending), then appearances (descending), then title for consistency
    let topSongs = Object.values(songMap)
      .sort((a, b) => {
        if (a.bestUS !== b.bestUS) return a.bestUS - b.bestUS;
        if (a.appearances !== b.appearances) return b.appearances - a.appearances;
        return a.title.localeCompare(b.title); // Consistent tie-breaker
      })
      .slice(0, 50)
      .map((song, index) => ({
        order: index + 1, // Create new ranking based on aggregated performance
        title: song.title,
        artist: song.artist,
        appearances: song.appearances,
        bestUS: song.bestUS // Keep the best US position for reference
      }));
    console.log('[kworb] Yearly top songs:', topSongs.length, 'songs');
    console.log('[kworb] Sample of yearly data:', topSongs.slice(0, 5).map(s => `${s.order}. ${s.title} - ${s.artist} (appearances: ${s.appearances}, best US: ${s.bestUS})`));
    return topSongs;
  }
}

// Helper: get ISO week number from date string (YYYY-MM-DD)
function getWeekOfYear(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

module.exports = KworbService; 