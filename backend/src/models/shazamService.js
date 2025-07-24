const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.shazam.com/charts';

class ShazamService {
  // Get available chart types
  static getAvailableCharts() {
    return [
      { id: 'top-200', name: 'Top 200', url: `${BASE_URL}/top-200/united-states` },
      { id: 'pop', name: 'Pop', url: `${BASE_URL}/genre/united-states/pop` },
      { id: 'hip-hop-rap', name: 'Hip-Hop/Rap', url: `${BASE_URL}/genre/united-states/hip-hop-rap` },
      { id: 'country', name: 'Country', url: `${BASE_URL}/genre/united-states/country` }
    ];
  }

  // Get chart data for a specific chart type
  static async getChartData(chartType = 'top-200') {
    const charts = this.getAvailableCharts();
    const chart = charts.find(c => c.id === chartType);
    
    if (!chart) {
      throw new Error(`Invalid chart type: ${chartType}. Available: ${charts.map(c => c.id).join(', ')}`);
    }

    console.log('[shazam] Fetching chart data from:', chart.url);
    return await this.scrapeHTMLData(chart.url);
  }

  // Scrape HTML data from Shazam
  static async scrapeHTMLData(url) {
    console.log('[shazam] Scraping HTML from:', url);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 30000
    });

    const html = response.data;
    return this.parseHTML(html);
  }

  // Parse HTML data based on Shazam's structure
  static parseHTML(html) {
    const songs = [];
    const $ = cheerio.load(html);
    
    console.log('[shazam] Parsing HTML content...');
    console.log('[shazam] HTML length:', html.length);
    
    // Save raw HTML for debugging (first 5000 chars)
    console.log('[shazam] Raw HTML preview:', html.substring(0, 5000));
    
    // First, try the new Shazam-specific parsing method
    console.log('[shazam] Trying Shazam-specific structure parsing...');
    this.extractSongsFromShazamStructure($, songs);
    
    // Also try the exact structure from the provided HTML
    console.log('[shazam] Trying exact HTML structure parsing...');
    this.extractSongsFromExactStructure($, songs);
    
    // If no songs found, try the existing methods
    if (songs.length === 0) {
      console.log('[shazam] No songs found with Shazam structure, trying alternative methods...');
      
      // Look for the specific chart list container class
      const chartContainer = $('.ListShowMoreLess_container__t4TNB.page_chartList__aBclW');
      console.log('[shazam] Chart container found:', chartContainer.length);
      
      if (chartContainer.length === 0) {
        console.log('[shazam] Chart container not found, trying alternative selectors...');
        
        // Try alternative selectors
        const alternativeSelectors = [
          '.page_chartList__aBclW',
          '.ListShowMoreLess_container__t4TNB',
          '[class*="chartList"]',
          '[class*="ListShowMoreLess"]',
          '[class*="chart"]',
          '[class*="list"]'
        ];
        
        for (const selector of alternativeSelectors) {
          const container = $(selector);
          console.log('[shazam] Selector', selector, 'found:', container.length, 'elements');
          if (container.length > 0) {
            console.log('[shazam] Found container with selector:', selector);
            this.extractSongsFromContainer(container, songs);
            break;
          }
        }
      } else {
        console.log('[shazam] Found chart container with specific class');
        this.extractSongsFromContainer(chartContainer, songs);
      }

      // If still no songs, try extracting from image alt text
      if (songs.length === 0) {
        console.log('[shazam] No songs found in containers, trying image alt text...');
        this.extractSongsFromImages($, songs);
      }

      // If still no songs, try extracting from JSON-LD structured data
      if (songs.length === 0) {
        console.log('[shazam] No songs found in images, trying JSON-LD data...');
        this.extractSongsFromJSONLD($, songs);
      }

      // If still no songs, try extracting from list elements (ul/li)
      if (songs.length === 0) {
        console.log('[shazam] No songs found in JSON-LD, trying list elements...');
        this.extractSongsFromListElements($, songs);
      }

      // If still no songs, try looking for Shazam-specific elements
      if (songs.length === 0) {
        console.log('[shazam] No songs found in list elements, trying Shazam-specific elements...');
        this.extractSongsFromShazamElements($, songs);
      }

      // If still no songs, try a more generic approach
      if (songs.length === 0) {
        console.log('[shazam] No songs found in Shazam elements, trying generic approach...');
        this.extractSongsGeneric($, songs);
      }
    }

    // Sort by order and take top 50
    songs.sort((a, b) => a.order - b.order);
    const topSongs = songs.slice(0, 50);
    
    console.log('[shazam] Final result:', topSongs.length, 'songs');
    
    // Log some examples for debugging
    if (topSongs.length > 0) {
      console.log('[shazam] Sample songs:', topSongs.slice(0, 3));
    } else {
      console.log('[shazam] No songs found. Checking for any numbers in text...');
      const textContent = $.text();
      const numberMatches = textContent.match(/\d+/g);
      console.log('[shazam] Numbers found in text:', numberMatches ? numberMatches.slice(0, 10) : 'none');
      
      // Look for any text that might contain song data
      const lines = textContent.split('\n');
      console.log('[shazam] Text lines (first 20):', lines.slice(0, 20));
    }
    
    return topSongs;
  }

  // Extract songs from a specific container
  static extractSongsFromContainer(container, songs) {
    console.log('[shazam] Extracting songs from container...');
    
    // First, try to find chart items with more specific selectors
    const chartItems = container.find('[class*="chart-item"], [class*="track-item"], [class*="song-item"], [class*="list-item"]');
    console.log('[shazam] Found chart items:', chartItems.length);
    
    if (chartItems.length > 0) {
      chartItems.each((i, el) => {
        const $el = cheerio.load(el);
        const text = $el.text().trim();
        console.log('[shazam] Chart item text:', text.substring(0, 100));
        
        // Try different patterns for song data
        const patterns = [
          /^(\d+)\.?\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist"
          /^(\d+)\s+(.+?)\s+[-–]\s+(.+)$/, // "1 Song Title - Artist" (no period)
          /^(\d+)\.\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist" (with period)
          /^(\d+)\s*[-–]\s*(.+?)\s*[-–]\s*(.+)$/, // "1 - Song Title - Artist"
          /^(\d+)\s+(.+?)\s+by\s+(.+)$/i, // "1 Song Title by Artist"
          /^(\d+)\.\s*(.+?)\s+by\s+(.+)$/i // "1. Song Title by Artist"
        ];
        
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match) {
            const order = parseInt(match[1]);
            const title = match[2].trim();
            const artist = match[3].trim();
            
            if (!isNaN(order) && title && artist && order <= 200) {
              // Check if we already have this song
              const exists = songs.some(s => s.order === order && s.title === title && s.artist === artist);
              if (!exists) {
                songs.push({ order, title, artist });
                console.log('[shazam] Found song:', order, title, '-', artist);
              }
            }
            break; // Found a match, no need to try other patterns
          }
        }
      });
    }
    
    // If no chart items found, try looking for any elements with numbers and text
    if (songs.length === 0) {
      console.log('[shazam] No chart items found, trying generic elements...');
      
      container.find('*').each((i, el) => {
        const $el = cheerio.load(el);
        const text = $el.text().trim();
        
        // Only process elements with substantial text
        if (text.length > 10 && text.length < 200) {
          const patterns = [
            /^(\d+)\.?\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist"
            /^(\d+)\s+(.+?)\s+(.+)$/, // "1 Song Title Artist" (no dash)
            /^(\d+)\.\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist" (with period)
            /^(\d+)\s*[-–]\s*(.+?)\s*[-–]\s*(.+)$/ // "1 - Song Title - Artist"
          ];
          
          for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
              const order = parseInt(match[1]);
              const title = match[2].trim();
              const artist = match[3].trim();
              
              if (!isNaN(order) && title && artist && order <= 200) {
                // Check if we already have this song
                const exists = songs.some(s => s.order === order && s.title === title && s.artist === artist);
                if (!exists) {
                  songs.push({ order, title, artist });
                  console.log('[shazam] Found song (generic):', order, title, '-', artist);
                }
              }
              break; // Found a match, no need to try other patterns
            }
          }
        }
      });
    }
  }

  // Extract songs from image alt text (Shazam uses this for song info)
  static extractSongsFromImages($, songs) {
    let songCount = 0;
    
    // Look for images with alt text containing song information
    $('img[alt*="by"]').each((i, el) => {
      const alt = $(el).attr('alt');
      if (alt) {
        // Pattern: "Album artwork for album titled Song Title by Artist"
        // or "Listen to Song Title by Artist"
        const patterns = [
          /album titled (.+?) by (.+)/i,
          /Listen to (.+?) by (.+)/i,
          /(.+?) by (.+)/i
        ];
        
        for (const pattern of patterns) {
          const match = alt.match(pattern);
          if (match) {
            const title = match[1].trim();
            const artist = match[2].trim();
            
            // Check if we already have this song
            const exists = songs.some(s => s.title === title && s.artist === artist);
            if (!exists) {
              songCount++;
              songs.push({ order: songCount, title, artist });
              console.log('[shazam] Found song from image:', songCount, title, '-', artist);
            }
            break; // Found a match, no need to try other patterns
          }
        }
      }
    });
  }

  // Extract songs from JSON-LD structured data
  static extractSongsFromJSONLD($, songs) {
    try {
      // Look for JSON-LD script tags
      $('script[type="application/ld+json"]').each((i, el) => {
        const scriptContent = $(el).html();
        if (scriptContent) {
          try {
            const jsonData = JSON.parse(scriptContent);
            console.log('[shazam] Found JSON-LD data:', typeof jsonData);
            
            // Handle different JSON-LD structures
            if (jsonData['@graph'] && Array.isArray(jsonData['@graph'])) {
              // Schema.org MusicPlaylist structure
              jsonData['@graph'].forEach(item => {
                if (item['@type'] === 'MusicRecording' && item.name && item.byArtist) {
                  const title = item.name;
                  const artist = typeof item.byArtist === 'object' ? item.byArtist.name : item.byArtist;
                  const position = item.position || songs.length + 1;
                  
                  const exists = songs.some(s => s.title === title && s.artist === artist);
                  if (!exists) {
                    songs.push({ order: position, title, artist });
                    console.log('[shazam] Found song from JSON-LD:', position, title, '-', artist);
                  }
                }
              });
            } else if (jsonData['@type'] === 'MusicPlaylist' && jsonData.track) {
              // Direct playlist structure
              jsonData.track.forEach((track, index) => {
                if (track.name && track.byArtist) {
                  const title = track.name;
                  const artist = typeof track.byArtist === 'object' ? track.byArtist.name : track.byArtist;
                  const position = track.position || index + 1;
                  
                  const exists = songs.some(s => s.title === title && s.artist === artist);
                  if (!exists) {
                    songs.push({ order: position, title, artist });
                    console.log('[shazam] Found song from JSON-LD playlist:', position, title, '-', artist);
                  }
                }
              });
            }
          } catch (parseError) {
            console.log('[shazam] Failed to parse JSON-LD:', parseError.message);
          }
        }
      });
    } catch (error) {
      console.log('[shazam] Error extracting from JSON-LD:', error.message);
    }
  }

  // Extract songs from list elements (ul/li structure)
  static extractSongsFromListElements($, songs) {
    console.log('[shazam] Looking for list elements (ul/li)...');
    
    // Look for all ul elements
    $('ul').each((ulIndex, ul) => {
      const $ul = $(ul);
      const liElements = $ul.find('li');
      console.log('[shazam] Found ul with', liElements.length, 'li elements');
      
      if (liElements.length > 0) {
        liElements.each((liIndex, li) => {
          const $li = $(li);
          const text = $li.text().trim();
          console.log('[shazam] Li text:', text);
          
          // Try different patterns for song data in list items
          const patterns = [
            /^(\d+)\.?\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist"
            /^(\d+)\s+(.+?)\s+[-–]\s+(.+)$/, // "1 Song Title - Artist" (no period)
            /^(\d+)\.\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist" (with period)
            /^(\d+)\s*[-–]\s*(.+?)\s*[-–]\s*(.+)$/, // "1 - Song Title - Artist"
            /^(\d+)\s+(.+?)\s+by\s+(.+)$/i, // "1 Song Title by Artist"
            /^(\d+)\.\s*(.+?)\s+by\s+(.+)$/i, // "1. Song Title by Artist"
            /^(\d+)\s+(.+?)\s*[-–]\s*(.+)$/ // "1 Song Title - Artist" (flexible spacing)
          ];
          
          for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
              const order = parseInt(match[1]);
              const title = match[2].trim();
              const artist = match[3].trim();
              
              if (!isNaN(order) && title && artist && order <= 200) {
                // Check if we already have this song
                const exists = songs.some(s => s.order === order && s.title === title && s.artist === artist);
                if (!exists) {
                  songs.push({ order, title, artist });
                  console.log('[shazam] Found song from list:', order, title, '-', artist);
                }
              }
              break; // Found a match, no need to try other patterns
            }
          }
        });
      }
    });
  }

  // Extract songs from Shazam-specific elements
  static extractSongsFromShazamElements($, songs) {
    console.log('[shazam] Looking for Shazam-specific elements...');
    
    // Look for elements with Shazam-specific classes or attributes
    const shazamSelectors = [
      '[class*="track"]',
      '[class*="song"]',
      '[class*="chart-item"]',
      '[class*="music"]',
      '[data-testid*="track"]',
      '[data-testid*="song"]'
    ];
    
    for (const selector of shazamSelectors) {
      const elements = $(selector);
      console.log('[shazam] Selector', selector, 'found:', elements.length, 'elements');
      
      elements.each((i, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        
        if (text.length > 5) {
          console.log('[shazam] Shazam element text:', text.substring(0, 100));
          
          // Try different patterns for song data
          const patterns = [
            /^(\d+)\.?\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist"
            /^(\d+)\s+(.+?)\s+[-–]\s+(.+)$/, // "1 Song Title - Artist" (no period)
            /^(\d+)\.\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist" (with period)
            /^(\d+)\s*[-–]\s*(.+?)\s*[-–]\s*(.+)$/, // "1 - Song Title - Artist"
            /^(\d+)\s+(.+?)\s+by\s+(.+)$/i, // "1 Song Title by Artist"
            /^(\d+)\.\s*(.+?)\s+by\s+(.+)$/i // "1. Song Title by Artist"
          ];
          
          for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
              const order = parseInt(match[1]);
              const title = match[2].trim();
              const artist = match[3].trim();
              
              if (!isNaN(order) && title && artist && order <= 200) {
                // Check if we already have this song
                const exists = songs.some(s => s.order === order && s.title === title && s.artist === artist);
                if (!exists) {
                  songs.push({ order, title, artist });
                  console.log('[shazam] Found song from Shazam element:', order, title, '-', artist);
                }
              }
              break; // Found a match, no need to try other patterns
            }
          }
        }
      });
    }
  }

  // Generic song extraction as fallback
  static extractSongsGeneric($, songs) {
    const textContent = $.text();
    const lines = textContent.split('\n');
    
    console.log('[shazam] Text content length:', textContent.length);
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Try different patterns for song data
      const patterns = [
        /^(\d+)\.?\s*(.+?)\s*[-–]\s*(.+)$/, // "1. Song Title - Artist"
        /^(\d+)\s+(.+?)\s+(.+)$/, // "1 Song Title Artist" (no dash)
        /^(\d+)\.\s*(.+?)\s*[-–]\s*(.+)$/ // "1. Song Title - Artist" (with period)
      ];
      
      for (const pattern of patterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          const order = parseInt(match[1]);
          const title = match[2].trim();
          const artist = match[3].trim();
          
          if (!isNaN(order) && title && artist && order <= 200) {
            // Check if we already have this song
            const exists = songs.some(s => s.order === order && s.title === title && s.artist === artist);
            if (!exists) {
              songs.push({ order, title, artist });
              console.log('[shazam] Found song (generic):', order, title, '-', artist);
            }
          }
          break; // Found a match, no need to try other patterns
        }
      }
    }
  }

  // Extract songs from the specific Shazam HTML structure
  static extractSongsFromShazamStructure($, songs) {
    console.log('[shazam] Extracting songs from Shazam structure...');
    
    // Look for the specific ul structure with li elements containing song data
    $('ul').each((ulIndex, ul) => {
      const $ul = $(ul);
      const liElements = $ul.find('li');
      console.log('[shazam] Found ul with', liElements.length, 'li elements');
      
      if (liElements.length > 0) {
        liElements.each((liIndex, li) => {
          const $li = $(li);
          
          // Look for the specific Shazam structure based on the provided HTML
          const rankingNumber = $li.find('.SongItem-module_rankingNumber__3oDWK').text().trim();
          
          // Find song title - try multiple approaches
          let songTitle = '';
          const songTitleLink = $li.find('a[data-test-id="charts_userevent_list_songTitle"]');
          if (songTitleLink.length > 0) {
            songTitle = songTitleLink.text().trim() || songTitleLink.attr('aria-label') || '';
          }
          
          // If no song title found, try alternative selectors
          if (!songTitle) {
            const titleSelectors = [
              'a[aria-label]',
              '.SongItem-module_ellipisLink__DsCMc a',
              'a.common_link__7If7r'
            ];
            
            for (const selector of titleSelectors) {
              const titleElement = $li.find(selector);
              if (titleElement.length > 0) {
                const ariaLabel = titleElement.attr('aria-label');
                if (ariaLabel && ariaLabel !== rankingNumber) {
                  songTitle = ariaLabel;
                  break;
                }
              }
            }
          }
          
          // Find artist information - try multiple approaches
          let artist = '';
          
          // Method 1: Look for artist link with specific data-test-id
          const artistLink = $li.find('a[data-test-id="charts_userevent_list_artistName"]');
          if (artistLink.length > 0) {
            artist = artistLink.text().trim() || artistLink.attr('aria-label') || '';
          }
          
          // Method 2: Look for artist in the metadata line
          if (!artist) {
            const metadataLine = $li.find('.SongItem-module_metadataLine__7Mm6B');
            if (metadataLine.length > 0) {
              // Look for any text that's not the song title
              const metadataText = metadataLine.text().trim();
              if (metadataText && metadataText !== songTitle) {
                artist = metadataText;
              }
            }
          }
          
          // Method 3: Look for artist in the main items container
          if (!artist) {
            const mainContainer = $li.find('.SongItem-module_mainItemsContainer__9MRor');
            if (mainContainer.length > 0) {
              // Find all text elements and look for artist
              const textElements = mainContainer.find('a, span');
              for (let i = 0; i < textElements.length; i++) {
                const element = $(textElements[i]);
                const text = element.text().trim();
                if (text && text !== songTitle && text !== rankingNumber && !text.match(/^\d+$/)) {
                  artist = text;
                  break;
                }
              }
            }
          }
          
          // Method 4: Extract from image alt text
          if (!artist) {
            const img = $li.find('img');
            if (img.length > 0) {
              const altText = img.attr('alt') || '';
              // Extract artist from alt text like "Listen to Song Title by Artist"
              const altMatch = altText.match(/by (.+)$/);
              if (altMatch) {
                artist = altMatch[1].trim();
              }
            }
          }
          
          // Method 5: Extract from any text content as fallback
          if (!artist) {
            const liText = $li.text().trim();
            // Try to find artist after the song title
            if (songTitle && liText.includes(songTitle)) {
              const afterTitle = liText.substring(liText.indexOf(songTitle) + songTitle.length).trim();
              if (afterTitle) {
                // Remove common prefixes and clean up
                artist = afterTitle.replace(/^[-–\s]+/, '').trim();
                // Remove any remaining numbers or ranking info
                artist = artist.replace(/\d+$/, '').trim();
              }
            }
          }
          
          console.log('[shazam] Parsed song data:', {
            rankingNumber,
            songTitle,
            artist,
            liText: $li.text().trim().substring(0, 100)
          });
          
          // Validate and add the song
          if (rankingNumber && songTitle && artist) {
            const order = parseInt(rankingNumber);
            if (!isNaN(order) && order <= 200) {
              // Clean up artist name (remove any remaining ranking numbers)
              artist = artist.replace(/\d+$/, '').trim();
              
              // Check if we already have this song
              const exists = songs.some(s => s.order === order && s.title === songTitle && s.artist === artist);
              if (!exists) {
                songs.push({ order, title: songTitle, artist });
                console.log('[shazam] Found song from Shazam structure:', order, songTitle, '-', artist);
              }
            }
          }
        });
      }
    });
    
    console.log('[shazam] Extracted', songs.length, 'songs from Shazam structure');
  }

  // Extract songs from the exact HTML structure provided
  static extractSongsFromExactStructure($, songs) {
    console.log('[shazam] Extracting songs from exact HTML structure...');
    
    // Look for li elements with the specific class structure
    $('li').each((liIndex, li) => {
      const $li = $(li);
      
      // Check if this li contains the song item structure
      const songItem = $li.find('.page_songItem__lAdHy');
      if (songItem.length === 0) return;
      
      // Extract ranking number from the specific class
      const rankingElement = $li.find('.SongItem-module_rankingNumber__3oDWK');
      const rankingNumber = rankingElement.text().trim();
      
      // Extract song title from the aria-label attribute
      const songTitleElement = $li.find('a[data-test-id="charts_userevent_list_songTitle"]');
      let songTitle = '';
      if (songTitleElement.length > 0) {
        songTitle = songTitleElement.attr('aria-label') || songTitleElement.text().trim();
      }
      
      // Extract artist from the artist link
      const artistElement = $li.find('a[data-test-id="charts_userevent_list_artistName"]');
      let artist = '';
      if (artistElement.length > 0) {
        artist = artistElement.attr('aria-label') || artistElement.text().trim();
      }
      
      // If we have all the data, add the song
      if (rankingNumber && songTitle && artist) {
        const order = parseInt(rankingNumber);
        if (!isNaN(order) && order <= 200) {
          // Check if we already have this song
          const exists = songs.some(s => s.order === order && s.title === songTitle && s.artist === artist);
          if (!exists) {
            songs.push({ order, title: songTitle, artist });
            console.log('[shazam] Found song from exact structure:', order, songTitle, '-', artist);
          }
        }
      }
    });
    
    console.log('[shazam] Extracted', songs.length, 'songs from exact structure');
  }

  // Get yearly top songs (for now, just return current chart data)
  static async getYearlyTopSongs(year, chartType = 'top-200') {
    console.log('[shazam] Getting yearly top songs for', year, 'chart type:', chartType);
    
    // For now, return current chart data since Shazam doesn't provide historical data
    const currentData = await this.getChartData(chartType);
    
    // Add appearances count (all set to 1 for current data)
    return currentData.map(song => ({
      ...song,
      appearances: 1
    }));
  }

  // Get available chart types for the API
  static async getAvailableDates(year) {
    // Shazam doesn't provide historical date lists
    // Return current date as "today"
    return [{
      date: 'today',
      formattedDate: 'Today'
    }];
  }
}

module.exports = ShazamService; 