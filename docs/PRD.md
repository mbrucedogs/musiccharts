# Product Requirements Document (PRD)
## Multi-Source Music Charts Analytics Platform

---

## 📋 **Executive Summary**

A full-stack web application that scrapes, analyzes, and visualizes music chart data from multiple sources including Music Charts Archive, Kworb, and Shazam. The platform provides both weekly chart views and comprehensive yearly rankings, enabling users to explore historical music trends and download data for further analysis across different data sources.

---

## 🎯 **Product Vision**

Create a comprehensive music analytics platform that transforms raw chart data from multiple sources into actionable insights, making historical music trends accessible and analyzable for researchers, music enthusiasts, and data analysts.

---

## 🎵 **Core Features**

### **1. Multi-Source Data Integration**
- **Music Charts Archive**: Historical Billboard charts with weekly and yearly data
- **Kworb**: Real-time chart data with current trending information
- **Shazam**: Current trending songs with multiple chart types (no historical data)
- **Source Switching**: Seamless switching between data sources
- **Chart Type Selection**: Multiple chart types for Shazam integration

### **2. Data Scraping Engine**
- **Weekly Chart Scraping**: Extract song rankings from individual chart dates
- **Yearly Data Aggregation**: Collect and analyze data across all available dates for a year
- **Real-time Data Fetching**: Live scraping from multiple sources
- **Error Handling**: Graceful handling of missing data and network issues

### **3. Weekly Chart View**
- **Source Selection**: Choose between Music Charts Archive, Kworb, or Shazam
- **Date Selection**: Browse available chart dates by year (Music Charts Archive & Kworb)
- **Chart Display**: View top songs with rankings, titles, and artists
- **Data Export**: Download weekly chart data in JSON format
- **Responsive Design**: Mobile and desktop optimized interface

### **4. Yearly Analytics**
- **Yearly Rankings**: Calculate top songs of the year based on:
  - Total points (position-based scoring)
  - Highest achieved position
  - Number of appearances
- **Smart Algorithm**: Multi-factor ranking system
- **Yearly Export**: Download comprehensive yearly data
- **Source-Specific Logic**: Different algorithms for different data sources

### **5. Data Export System**
- **JSON Format**: Structured data export with metadata
- **File Naming**: Date/year-based file naming convention
- **Metadata Inclusion**: Chart date, total songs, formatted titles
- **Source Attribution**: Data source information in exports

---

## 🔧 **Technical Architecture**

### **Backend Requirements**

#### **Core Technologies (Current: Node.js/Express)**
- **Server Framework**: Node.js/Express, Python/Flask, Java/Spring Boot, C#/.NET, Go/Gin
- **Web Scraping**: Cheerio (Node.js), BeautifulSoup (Python), Jsoup (Java), HtmlAgilityPack (C#), goquery (Go)
- **HTTP Client**: Axios (Node.js), requests (Python), OkHttp (Java), HttpClient (C#), net/http (Go)
- **Data Processing**: JavaScript, Python, Java, C#, Go

#### **API Endpoints**
```
GET /api/health
- Purpose: Health check endpoint
- Response: Status confirmation

GET /api/chart/dates/:year
- Purpose: Get available chart dates for a year
- Parameters: year (number), source (query param)
- Response: Array of date objects with date and formattedDate

GET /api/chart/data/:date
- Purpose: Get chart data for specific date
- Parameters: date (YYYY-MM-DD format), source (query param), chartType (query param for Shazam)
- Response: Array of song objects with order, title, artist

GET /api/chart/yearly-top/:year
- Purpose: Get yearly top songs ranking with calculation metrics
- Parameters: year (number), source (query param), chartType (query param for Shazam)
- Response: Array of top songs with order, title, artist, totalPoints, highestPosition, appearances

GET /api/chart/shazam/chart-types
- Purpose: Get available Shazam chart types
- Response: Array of chart type objects with id and name
```

#### **Data Models**
```javascript
// Date Object
{
  date: "2024-01-20",
  formattedDate: "Jan 20, 2024"
}

// Song Object
{
  order: 1,
  title: "Lovin On Me",
  artist: "Jack Harlow"
}

// Weekly Chart Export
{
  title: "January 20, 2024 - Top Songs",
  date: "2024-01-20",
  totalSongs: 50,
  songs: [Song Object Array]
}

// Yearly Chart Export
{
  year: 2024,
  title: "Top Songs of 2024",
  songs: [Song Object Array]
}

// Enhanced Song Object (with calculation properties)
{
  order: 1,
  title: "Luther",
  artist: "Kendrick Lamar",
  totalPoints: 245,
  highestPosition: 1,
  appearances: 8
}

// Chart Type Object (Shazam)
{
  id: "top-200",
  name: "Top 200"
}
```

#### **Service Architecture**
```javascript
// Service Layer Structure
ChartService - Music Charts Archive integration
KworbService - Kworb real-time data integration  
ShazamService - Shazam API integration with chart types
```

#### **Scraping Logic**
1. **Source Detection**: Route requests to appropriate service based on source parameter
2. **Date Extraction**: Parse HTML for chart date links (Music Charts Archive & Kworb)
3. **Song Data Extraction**: Parse table rows for song information
4. **Data Validation**: Ensure data integrity and completeness
5. **Error Recovery**: Skip problematic dates and continue processing

#### **Yearly Ranking Algorithm**
```javascript
// Scoring System (Music Charts Archive & Kworb)
- Position Points: 1st = 50 points, 50th = 1 point
- Highest Position: Track best position achieved
- Appearance Count: Number of weeks on charts

// Sorting Priority
1. Total Points (descending)
2. Highest Position (ascending)
3. Appearance Count (descending)

// Shazam Algorithm (Current data only)
- Position-based ranking for current trending songs
- No historical aggregation available
```

### **Frontend Requirements**

#### **Core Technologies (Current: React)**
- **UI Framework**: React, Vue.js, Angular, Svelte, Flutter (mobile), SwiftUI (iOS), Jetpack Compose (Android)
- **State Management**: React Hooks, Vuex, Redux, NgRx, Svelte stores
- **HTTP Client**: Axios, fetch API, HttpClient
- **Styling**: CSS3, SCSS, Tailwind CSS, Material-UI, Bootstrap

#### **Component Architecture**
```
App
├── Layout
├── SourceSelector
├── YearSelector (conditional)
├── ViewModeSelector (Weekly/Yearly)
├── DateList (Weekly mode, conditional)
├── ChartTable
├── YearlyTopSongs
├── JsonViewer
├── DownloadButton
└── YearlyDownloadButton
```

#### **State Management**
```javascript
// Core State
{
  selectedSource: 'musicchartsarchive' | 'kworb' | 'shazam',
  selectedYear: number,
  selectedDate: string | null,
  selectedChartType: string, // For Shazam
  viewMode: 'weekly' | 'yearly',
  dates: DateObject[],
  chartData: SongObject[],
  yearlySongs: SongObject[],
  shazamChartTypes: ChartTypeObject[],
  selectedProperties: {
    position: boolean,
    title: boolean,
    artist: boolean,
    totalPoints: boolean,
    highestPosition: boolean,
    appearances: boolean
  }
}

// Loading States
{
  datesLoading: boolean,
  dataLoading: boolean,
  yearlyLoading: boolean,
  chartTypesLoading: boolean
}

// Error States
{
  datesError: string | null,
  dataError: string | null,
  yearlyError: string | null,
  chartTypesError: string | null
}
```

#### **User Interface Requirements**
- **Source Selection**: Tab-based interface for switching between data sources
- **Conditional UI**: Show/hide components based on selected source
- **Responsive Design**: Mobile-first approach
- **Loading States**: Visual feedback during data fetching with progress indicators
- **Error Handling**: User-friendly error messages with retry options
- **Accessibility**: WCAG 2.1 compliance
- **Cross-browser Compatibility**: Modern browser support
- **JSON Data Inspection**: Interactive JSON viewer with property selection
- **Enhanced Loading Messages**: Informative loading states for long-running operations

---

## 📱 **Mobile Platform Considerations**

### **iOS (Swift/SwiftUI)**
```swift
// Data Models
struct ChartDate: Codable {
    let date: String
    let formattedDate: String
}

struct Song: Codable {
    let order: Int
    let title: String
    let artist: String
}

struct ChartType: Codable {
    let id: String
    let name: String
}

// Network Layer
class ChartAPIService {
    func fetchChartDates(year: Int, source: String) async throws -> [ChartDate]
    func fetchChartData(date: String, source: String, chartType: String?) async throws -> [Song]
    func fetchYearlyTopSongs(year: Int, source: String, chartType: String?) async throws -> [Song]
    func fetchShazamChartTypes() async throws -> [ChartType]
}

// UI Components
struct SourceSelector: View
struct YearSelector: View
struct ChartTableView: View
struct YearlyTopSongsView: View
struct DownloadButton: View
```

### **Android (Kotlin/Jetpack Compose)**
```kotlin
// Data Models
data class ChartDate(
    val date: String,
    val formattedDate: String
)

data class Song(
    val order: Int,
    val title: String,
    val artist: String
)

data class ChartType(
    val id: String,
    val name: String
)

// Network Layer
class ChartAPIService {
    suspend fun fetchChartDates(year: Int, source: String): List<ChartDate>
    suspend fun fetchChartData(date: String, source: String, chartType: String?): List<Song>
    suspend fun fetchYearlyTopSongs(year: Int, source: String, chartType: String?): List<Song>
    suspend fun fetchShazamChartTypes(): List<ChartType>
}

// UI Components
@Composable fun SourceSelector()
@Composable fun YearSelector()
@Composable fun ChartTable()
@Composable fun YearlyTopSongs()
@Composable fun DownloadButton()
```

---

## 🎵 **Data Flow**

### **Source Selection Flow**
1. User selects data source → Load source-specific UI components
2. For Shazam → Fetch available chart types
3. For Music Charts Archive/Kworb → Show year selector and date list

### **Weekly Chart Flow**
1. User selects source and year → Fetch available dates (if applicable)
2. User selects date → Fetch chart data
3. Display chart table → Enable download
4. User downloads → Generate JSON file

### **Yearly Chart Flow**
1. User selects source and year → Fetch all dates for year (if applicable)
2. System scrapes all dates → Calculate rankings
3. Display yearly top songs → Enable download
4. User downloads → Generate yearly JSON file

---

## 🛠 **Development Guidelines**

### **Backend Development**
1. **Service Architecture**: Modular service layer for each data source
2. **Error Handling**: Implement comprehensive error handling
3. **Rate Limiting**: Respect website terms of service
4. **Caching**: Implement caching for frequently accessed data
5. **Logging**: Comprehensive logging for debugging
6. **Testing**: Unit tests for core algorithms

### **Frontend Development**
1. **Component Reusability**: Create reusable UI components
2. **State Management**: Centralized state management
3. **Performance**: Optimize for large datasets
4. **User Experience**: Smooth loading and error states
5. **Accessibility**: Screen reader and keyboard navigation support
6. **Conditional Rendering**: Handle different UI states based on source

### **Mobile Development**
1. **Offline Support**: Cache data for offline viewing
2. **Native Features**: Share functionality, file downloads
3. **Performance**: Optimize for mobile devices
4. **Platform Guidelines**: Follow iOS/Android design guidelines

---

## 📊 **Success Metrics**

### **Technical Metrics**
- **API Response Time**: < 2 seconds for chart data, < 5 minutes for yearly calculations
- **Scraping Success Rate**: > 95% successful data extraction
- **Error Rate**: < 5% failed requests
- **Uptime**: > 99% availability
- **Timeout Handling**: Graceful handling of long-running operations
- **Multi-Source Reliability**: Consistent performance across all data sources

### **User Experience Metrics**
- **Page Load Time**: < 3 seconds
- **User Engagement**: Time spent on platform
- **Download Rate**: Percentage of users downloading data
- **Error Recovery**: Successful error resolution rate
- **Source Switching**: Seamless transitions between data sources

---

## 🔒 **Security & Compliance**

### **Data Protection**
- **Rate Limiting**: Prevent abuse of scraping endpoints
- **User Agent**: Proper identification in requests
- **Error Handling**: No sensitive data in error messages
- **CORS**: Proper cross-origin resource sharing
- **API Key Management**: Secure handling of Shazam API keys

### **Legal Considerations**
- **Terms of Service**: Respect all data source terms
- **Data Usage**: Educational and research purposes
- **Attribution**: Proper credit to data sources
- **Rate Limiting**: Responsible scraping practices

---

## 🚀 **Future Enhancements**

### **Phase 2 Features**
- **Historical Trends**: Visual charts showing song performance over time
- **Artist Analytics**: Artist-specific statistics and rankings
- **Genre Analysis**: Genre-based filtering and analysis
- **Advanced Filtering**: Date range, artist, song title filters
- **Enhanced JSON Export**: Customizable data formats and property selection
- **Real-time Progress Tracking**: Visual progress indicators for long operations
- **Data Source Comparison**: Side-by-side comparison of different sources

### **Phase 3 Features**
- **User Accounts**: Save favorite charts and analyses
- **Social Features**: Share charts and insights
- **API Access**: Public API for developers
- **Data Visualization**: Interactive charts and graphs
- **Additional Sources**: Integration with more music data providers

---

## 📝 **Implementation Checklist**

### **Backend Setup**
- [ ] Choose server framework and language
- [ ] Set up web scraping library
- [ ] Implement multi-source service architecture
- [ ] Create API endpoints with source routing
- [ ] Implement data models for all sources
- [ ] Create yearly ranking algorithms
- [ ] Add error handling and logging
- [ ] Set up testing framework

### **Frontend Setup**
- [ ] Choose UI framework
- [ ] Set up state management
- [ ] Create reusable components
- [ ] Implement source selector component
- [ ] Create conditional UI logic
- [ ] Implement API integration
- [ ] Add download functionality
- [ ] Implement responsive design
- [ ] Add loading and error states

### **Mobile Setup (if applicable)**
- [ ] Set up mobile development environment
- [ ] Create data models for all sources
- [ ] Implement network layer with source routing
- [ ] Create UI components with conditional rendering
- [ ] Add native features (download, share)
- [ ] Test on devices

---

## 🎯 **Current Implementation Details**

### **Tech Stack**
- **Backend**: Node.js, Express.js, Cheerio, Axios (with optimized timeouts)
- **Frontend**: React 18, Custom Hooks, CSS3, Enhanced JSON Viewer
- **Development**: npm, nodemon
- **Performance**: Extended timeouts, request delays, progress logging

### **Project Structure**
```
MusicCharts/
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

### **Key Files**
- `start.sh` - Startup script for both services
- `README.md` - Setup and usage instructions
- `PRD.md` - This product requirements document
- `docs/songList.json` - Reference JSON format for data exports
- `docs/herse-songList-export.json` - Example data export format

---

## 🚀 **Recent Enhancements (Latest Update)**

### **Multi-Source Architecture**
- **SourceSelector Component**: Tab-based interface for switching between data sources
- **Service Layer**: Modular architecture with separate services for each data source
- **Conditional UI**: Dynamic component rendering based on selected source
- **Enhanced API**: Source-aware endpoints with query parameters

### **Shazam Integration**
- **Chart Types**: Multiple chart type selection (Top 200, Top 100, etc.)
- **Current Data**: Real-time trending songs (no historical data)
- **API Integration**: Complete Shazam API integration
- **Chart Type Endpoint**: New endpoint for fetching available chart types

### **Kworb Integration**
- **Real-time Data**: Current chart data from Kworb
- **Historical Support**: Yearly data aggregation capabilities
- **Service Implementation**: Dedicated KworbService for data extraction

### **Enhanced User Experience**
- **Source-Specific UI**: Different interfaces for different data sources
- **Loading States**: Source-aware loading indicators
- **Error Handling**: Source-specific error messages
- **Responsive Design**: Improved mobile and desktop experience

### **Data Format Standards**
- **Consistent JSON Structure**: Standardized format across all sources
- **Source Attribution**: Data source information in exports
- **Calculation Properties**: Full visibility into ranking algorithm metrics
- **Flexible Export Options**: Multiple export formats for different use cases

---

This PRD provides a comprehensive blueprint for the multi-source Music Charts Analytics Platform, supporting Music Charts Archive, Kworb, and Shazam integrations. The modular architecture and clear data flow make it adaptable to different implementation approaches while maintaining the core functionality and user experience across multiple data sources. 