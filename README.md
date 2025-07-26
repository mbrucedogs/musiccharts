# Multi-Source Music Charts Analytics Platform

A full-stack React application for scraping and visualizing music chart data from multiple sources including Music Charts Archive, Kworb, and Shazam.

## Project Structure

```
MusicCharts/
├── docs/  
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app component
│   │   ├── index.js       # Entry point
│   │   └── styles.css     # Global styles
│   ├── public/
│   └── package.json
└── backend/           # Node.js/Express backend API
    ├── src/
    │   ├── routes/        # API routes
    │   ├── controllers/   # Route controllers
    │   ├── models/        # Data models & scraping logic
    │   │   ├── chartService.js      # Music Charts Archive
    │   │   ├── kworbService.js      # Kworb integration
    │   │   └── shazamService.js     # Shazam integration
    │   ├── middleware/    # Express middleware
    │   └── server.js      # Main server file
    └── package.json
```

## Features

### **Multi-Source Data Integration**
- **Music Charts Archive**: Historical Billboard charts with weekly and yearly data
- **Kworb**: Real-time chart data with current trending information
- **Shazam**: Current trending songs with multiple chart types (no historical data)
- **Source Switching**: Seamless switching between data sources via tab interface
- **Chart Type Selection**: Multiple chart types for Shazam integration

### **Core Functionality**
- **Year Selection**: Choose different years to view available chart dates (Music Charts Archive & Kworb)
- **Date Selection**: Browse and select specific chart dates for detailed song data
- **Music Chart Display**: View ranked songs with title and artist information
- **Yearly Analytics**: Calculate and display top songs of the year using multi-factor ranking algorithm
- **Enhanced Data Export**: Export chart data in JSON format with customizable properties
- **JSON Viewer**: Interactive JSON data inspection with copy/download functionality
- **Property Selection**: Choose which data properties to include in exports
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error states and loading indicators
- **Web Scraping**: Real-time data scraping from multiple sources

## Frontend Components

- `SourceSelector`: Tab-based interface for switching between data sources
- `YearSelector`: Dropdown for year selection (conditional based on source)
- `DateList`: Grid of available chart dates for selected year (conditional)
- `ChartTable`: Music chart data table with rankings
- `YearlyTopSongs`: Enhanced yearly analytics display with calculation metrics
- `JsonViewer`: Interactive JSON data viewer with property selection
- `DownloadButton`: JSON export functionality for weekly charts
- `YearlyDownloadButton`: JSON export functionality for yearly charts
- `Layout`: Main layout wrapper

## Backend API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/chart/dates/:year` - Get available chart dates for a year (with source query param)
- `GET /api/chart/data/:date` - Get chart data for a specific date (with source and chartType query params)
- `GET /api/chart/yearly-top/:year` - Get yearly top songs ranking with calculation metrics (with source and chartType query params)
- `GET /api/chart/shazam/chart-types` - Get available Shazam chart types

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   SHAZAM_API_KEY=your_shazam_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Documentation

### Get Available Chart Dates
```
GET /api/chart/dates/:year?source=musicchartsarchive
```

**Parameters:**
- `year` (number): The year to get chart dates for (1970-present)
- `source` (query): Data source - 'musicchartsarchive', 'kworb', or 'shazam'

**Response:**
```json
[
  {
    "date": "2024-01-06",
    "formattedDate": "Jan 6, 2024"
  },
  {
    "date": "2024-01-13", 
    "formattedDate": "Jan 13, 2024"
  }
]
```

### Get Chart Data
```
GET /api/chart/data/:date?source=musicchartsarchive&chartType=top-200
```

**Parameters:**
- `date` (string): Date in YYYY-MM-DD format (or 'today' for Shazam)
- `source` (query): Data source - 'musicchartsarchive', 'kworb', or 'shazam'
- `chartType` (query): Chart type for Shazam (e.g., 'top-200', 'top-100')

**Response:**
```json
[
  {
    "order": 1,
    "title": "Lovin On Me",
    "artist": "Jack Harlow"
  },
  {
    "order": 2,
    "title": "Cruel Summer [re-release]",
    "artist": "Taylor Swift"
  }
]
```

### Get Yearly Top Songs
```
GET /api/chart/yearly-top/:year?source=musicchartsarchive&chartType=top-200
```

**Parameters:**
- `year` (number): The year to get yearly top songs for
- `source` (query): Data source - 'musicchartsarchive', 'kworb', or 'shazam'
- `chartType` (query): Chart type for Shazam

**Response:**
```json
[
  {
    "order": 1,
    "title": "Luther",
    "artist": "Kendrick Lamar",
    "totalPoints": 245,
    "highestPosition": 1,
    "appearances": 8
  },
  {
    "order": 2,
    "title": "Die With A Smile",
    "artist": "Lady Gaga",
    "totalPoints": 198,
    "highestPosition": 2,
    "appearances": 6
  }
]
```

### Get Shazam Chart Types
```
GET /api/chart/shazam/chart-types
```

**Response:**
```json
[
  {
    "id": "top-200",
    "name": "Top 200"
  },
  {
    "id": "top-100",
    "name": "Top 100"
  }
]
```

## Data Sources

This application integrates with multiple music chart data sources:

### **Music Charts Archive**
- **URL**: https://musicchartsarchive.com
- **Data**: Historical Billboard charts
- **Features**: Weekly and yearly data, comprehensive historical records
- **Scraping**: HTML parsing with Cheerio

### **Kworb**
- **URL**: https://kworb.net
- **Data**: Real-time chart data
- **Features**: Current trending information, historical support
- **Scraping**: HTML parsing with Cheerio

### **Shazam**
- **URL**: https://www.shazam.com
- **Data**: Current trending songs
- **Features**: Multiple chart types, real-time data only (no historical)
- **Integration**: Official API with authentication

## Data Processing

The application extracts and processes:

1. **Chart Dates**: Available chart dates for each year (Music Charts Archive & Kworb)
2. **Song Rankings**: Top songs with their chart positions, titles, and artists
3. **Yearly Analytics**: Multi-factor ranking algorithm calculating:
   - **Total Points**: Reverse scoring (1st = 50 points, 50th = 1 point)
   - **Highest Position**: Best position achieved during the year
   - **Appearances**: Number of weeks on the charts

## Development

### Adding New Features

1. **Frontend**: Add new components in `frontend/src/components/`
2. **Backend**: Add new routes in `backend/src/routes/` and controllers in `backend/src/controllers/`
3. **Scraping**: Modify service files in `backend/src/models/` for new data extraction
4. **Styling**: Modify `frontend/src/styles.css` for global styles
5. **API Integration**: Update `frontend/src/services/chartApi.js` for new endpoints
6. **JSON Formatting**: Modify `frontend/src/components/JsonViewer.jsx` for custom data formats

### Testing

- Backend tests: `cd backend && npm test`
- Frontend tests: `cd frontend && npm test`

## Technologies Used

### Frontend
- React 18
- Custom Hooks
- CSS3 with modern features
- Axios for API calls (with extended timeouts for yearly calculations)

### Backend
- Node.js
- Express.js
- Cheerio for HTML parsing
- Axios for web scraping (with optimized timeouts)
- CORS for cross-origin requests
- Helmet for security headers
- Morgan for logging

## Performance Optimizations

### Timeout Management
- **Frontend API Timeout**: 5 minutes (300,000ms) for yearly calculations
- **Backend Scraping Timeout**: 30 seconds per request
- **Request Delays**: 100ms between requests to respect server limits

### Data Processing
- **Progress Logging**: Real-time progress updates during yearly calculations
- **Error Recovery**: Graceful handling of failed requests with continuation
- **Memory Optimization**: Efficient data structures for large datasets
- **Multi-Source Routing**: Efficient routing to appropriate service based on source

## Legal Notice

This application is for educational and research purposes. Please respect the terms of service of all data sources (Music Charts Archive, Kworb, and Shazam) and implement appropriate rate limiting and caching strategies for production use.

## License

MIT License 