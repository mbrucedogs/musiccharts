# Music Charts Archive Scraper

A full-stack React application for scraping and visualizing music chart data from the Music Charts Archive website.

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
    │   ├── middleware/    # Express middleware
    │   └── server.js      # Main server file
    └── package.json
```

## Features

- **Year Selection**: Choose different years to view available chart dates
- **Date Selection**: Browse and select specific chart dates for detailed song data
- **Music Chart Display**: View ranked songs with title and artist information
- **Yearly Analytics**: Calculate and display top songs of the year using multi-factor ranking algorithm
- **Enhanced Data Export**: Export chart data in JSON format with customizable properties
- **JSON Viewer**: Interactive JSON data inspection with copy/download functionality
- **Property Selection**: Choose which data properties to include in exports
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error states and loading indicators
- **Web Scraping**: Real-time data scraping from Music Charts Archive

## Frontend Components

- `YearSelector`: Dropdown for year selection
- `DateList`: Grid of available chart dates for selected year
- `ChartTable`: Music chart data table with rankings
- `YearlyTopSongs`: Enhanced yearly analytics display with calculation metrics
- `JsonViewer`: Interactive JSON data viewer with property selection
- `DownloadButton`: JSON export functionality for weekly charts
- `YearlyDownloadButton`: JSON export functionality for yearly charts
- `Layout`: Main layout wrapper

## Backend API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/chart/dates/:year` - Get available chart dates for a year
- `GET /api/chart/data/:date` - Get chart data for a specific date
- `GET /api/chart/yearly-top/:year` - Get yearly top songs ranking with calculation metrics

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
GET /api/chart/dates/:year
```

**Parameters:**
- `year` (number): The year to get chart dates for (1970-present)

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
GET /api/chart/data/:date
```

**Parameters:**
- `date` (string): Date in YYYY-MM-DD format

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
GET /api/chart/yearly-top/:year
```

**Parameters:**
- `year` (number): The year to get yearly top songs for

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

## Data Source

This application scrapes data from [Music Charts Archive](https://musicchartsarchive.com), a comprehensive database of historical music charts. The scraper extracts:

1. **Chart Dates**: Available chart dates for each year
2. **Song Rankings**: Top songs with their chart positions, titles, and artists
3. **Yearly Analytics**: Multi-factor ranking algorithm calculating:
   - **Total Points**: Reverse scoring (1st = 50 points, 50th = 1 point)
   - **Highest Position**: Best position achieved during the year
   - **Appearances**: Number of weeks on the charts

## Development

### Adding New Features

1. **Frontend**: Add new components in `frontend/src/components/`
2. **Backend**: Add new routes in `backend/src/routes/` and controllers in `backend/src/controllers/`
3. **Scraping**: Modify `backend/src/models/chartService.js` for new data extraction
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

## Legal Notice

This application is for educational and research purposes. Please respect the terms of service of the Music Charts Archive website and implement appropriate rate limiting and caching strategies for production use.

## License

MIT License 