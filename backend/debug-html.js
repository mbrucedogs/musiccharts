const axios = require('axios');
const cheerio = require('cheerio');

async function debugHTML() {
  try {
    console.log('Fetching Shazam Country Chart HTML...');
    
    const response = await axios.get('https://www.shazam.com/charts/genre/united-states/country', {
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
    const $ = cheerio.load(html);
    
    console.log('HTML length:', html.length);
    
    // Look for list elements
    const ulElements = $('ul');
    console.log('Found', ulElements.length, 'ul elements');
    
    ulElements.each((i, ul) => {
      const $ul = $(ul);
      const liElements = $ul.find('li');
      console.log(`UL ${i + 1}: Found ${liElements.length} li elements`);
      
      if (liElements.length > 0) {
        liElements.each((j, li) => {
          const $li = $(li);
          const text = $li.text().trim();
          if (text.length > 0) {
            console.log(`  LI ${j + 1}: "${text}"`);
          }
        });
      }
    });
    
    // Look for elements with numbers
    console.log('\nLooking for elements with numbers...');
    $('*').each((i, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      
      // Look for text that starts with a number and contains song-like content
      if (text.match(/^\d+/) && text.length > 10 && text.length < 200) {
        console.log(`Element ${i}: "${text}"`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugHTML(); 