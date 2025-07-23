# Product Requirements Document (PRD)
## Music Charts Archive Scraper & Analytics Platform

---

## 📋 **Executive Summary**

A full-stack web application that scrapes, analyzes, and visualizes music chart data from the Music Charts Archive website. The platform provides both weekly chart views and comprehensive yearly rankings, enabling users to explore historical music trends and download data for further analysis.

---

## 🎯 **Product Vision**

Create a comprehensive music analytics platform that transforms raw chart data into actionable insights, making historical music trends accessible and analyzable for researchers, music enthusiasts, and data analysts.

---

## 🎵 **Core Features**

### **1. Data Scraping Engine**
- **Weekly Chart Scraping**: Extract song rankings from individual chart dates
- **Yearly Data Aggregation**: Collect and analyze data across all available dates for a year
- **Real-time Data Fetching**: Live scraping from Music Charts Archive website
- **Error Handling**: Graceful handling of missing data and network issues

### **2. Weekly Chart View**
- **Date Selection**: Browse available chart dates by year
- **Chart Display**: View top 50 songs with rankings, titles, and artists
- **Data Export**: Download weekly chart data in JSON format
- **Responsive Design**: Mobile and desktop optimized interface

### **3. Yearly Analytics**
- **Yearly Rankings**: Calculate top songs of the year based on:
  - Total points (position-based scoring)
  - Highest achieved position
  - Number of appearances
- **Smart Algorithm**: Multi-factor ranking system
- **Yearly Export**: Download comprehensive yearly data

### **4. Data Export System**
- **JSON Format**: Structured data export with metadata
- **File Naming**: Date/year-based file naming convention
- **Metadata Inclusion**: Chart date, total songs, formatted titles

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
- Parameters: year (number)
- Response: Array of date objects with date and formattedDate

GET /api/chart/data/:date
- Purpose: Get chart data for specific date
- Parameters: date (YYYY-MM-DD format)
- Response: Array of song objects with order, title, artist

GET /api/chart/yearly-top/:year
- Purpose: Get yearly top songs ranking with calculation metrics
- Parameters: year (number)
- Response: Array of top 50 songs with order, title, artist, totalPoints, highestPosition, appearances
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
```

#### **Scraping Logic**
1. **Date Extraction**: Parse HTML for chart date links
2. **Song Data Extraction**: Parse table rows for song information
3. **Data Validation**: Ensure data integrity and completeness
4. **Error Recovery**: Skip problematic dates and continue processing

#### **Yearly Ranking Algorithm**
```javascript
// Scoring System
- Position Points: 1st = 50 points, 50th = 1 point
- Highest Position: Track best position achieved
- Appearance Count: Number of weeks on charts

// Sorting Priority
1. Total Points (descending)
2. Highest Position (ascending)
3. Appearance Count (descending)
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
├── YearSelector
├── ViewModeSelector (Weekly/Yearly)
├── DateList (Weekly mode)
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
  selectedYear: number,
  selectedDate: string | null,
  viewMode: 'weekly' | 'yearly',
  dates: DateObject[],
  chartData: SongObject[],
  yearlySongs: SongObject[],
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
  yearlyLoading: boolean
}

// Error States
{
  datesError: string | null,
  dataError: string | null,
  yearlyError: string | null
}
```

#### **User Interface Requirements**
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

// Network Layer
class ChartAPIService {
    func fetchChartDates(year: Int) async throws -> [ChartDate]
    func fetchChartData(date: String) async throws -> [Song]
    func fetchYearlyTopSongs(year: Int) async throws -> [Song]
}

// UI Components
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

// Network Layer
class ChartAPIService {
    suspend fun fetchChartDates(year: Int): List<ChartDate>
    suspend fun fetchChartData(date: String): List<Song>
    suspend fun fetchYearlyTopSongs(year: Int): List<Song>
}

// UI Components
@Composable fun YearSelector()
@Composable fun ChartTable()
@Composable fun YearlyTopSongs()
@Composable fun DownloadButton()
```

---

## 🎵 **Data Flow**

### **Weekly Chart Flow**
1. User selects year → Fetch available dates
2. User selects date → Fetch chart data
3. Display chart table → Enable download
4. User downloads → Generate JSON file

### **Yearly Chart Flow**
1. User selects year → Fetch all dates for year
2. System scrapes all dates → Calculate rankings
3. Display yearly top songs → Enable download
4. User downloads → Generate yearly JSON file

---

## 🛠 **Development Guidelines**

### **Backend Development**
1. **Error Handling**: Implement comprehensive error handling
2. **Rate Limiting**: Respect website terms of service
3. **Caching**: Implement caching for frequently accessed data
4. **Logging**: Comprehensive logging for debugging
5. **Testing**: Unit tests for core algorithms

### **Frontend Development**
1. **Component Reusability**: Create reusable UI components
2. **State Management**: Centralized state management
3. **Performance**: Optimize for large datasets
4. **User Experience**: Smooth loading and error states
5. **Accessibility**: Screen reader and keyboard navigation support

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

### **User Experience Metrics**
- **Page Load Time**: < 3 seconds
- **User Engagement**: Time spent on platform
- **Download Rate**: Percentage of users downloading data
- **Error Recovery**: Successful error resolution rate

---

## 🔒 **Security & Compliance**

### **Data Protection**
- **Rate Limiting**: Prevent abuse of scraping endpoints
- **User Agent**: Proper identification in requests
- **Error Handling**: No sensitive data in error messages
- **CORS**: Proper cross-origin resource sharing

### **Legal Considerations**
- **Terms of Service**: Respect Music Charts Archive terms
- **Data Usage**: Educational and research purposes
- **Attribution**: Proper credit to data source
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

### **Phase 3 Features**
- **User Accounts**: Save favorite charts and analyses
- **Social Features**: Share charts and insights
- **API Access**: Public API for developers
- **Data Visualization**: Interactive charts and graphs

---

## 📝 **Implementation Checklist**

### **Backend Setup**
- [ ] Choose server framework and language
- [ ] Set up web scraping library
- [ ] Implement API endpoints
- [ ] Create data models
- [ ] Implement yearly ranking algorithm
- [ ] Add error handling and logging
- [ ] Set up testing framework

### **Frontend Setup**
- [ ] Choose UI framework
- [ ] Set up state management
- [ ] Create reusable components
- [ ] Implement API integration
- [ ] Add download functionality
- [ ] Implement responsive design
- [ ] Add loading and error states

### **Mobile Setup (if applicable)**
- [ ] Set up mobile development environment
- [ ] Create data models
- [ ] Implement network layer
- [ ] Create UI components
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
m/
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

### **Key Files**
- `start.sh` - Startup script for both services
- `README.md` - Setup and usage instructions
- `PRD.md` - This product requirements document
- `docs/songList.json` - Reference JSON format for data exports
- `docs/herse-songList-export.json` - Example data export format

---

## 🚀 **Recent Enhancements (Latest Update)**

### **Enhanced Data Export System**
- **JsonViewer Component**: Interactive JSON data inspection with property selection
- **Customizable Exports**: Choose which properties to include in JSON output
- **Copy/Download Functionality**: One-click copy to clipboard and direct download
- **Format Consistency**: Matches reference format from `docs/songList.json`

### **Performance Optimizations**
- **Extended Timeouts**: 5-minute frontend timeout for yearly calculations
- **Request Delays**: 100ms delays between scraping requests
- **Progress Logging**: Real-time progress updates during long operations
- **Error Recovery**: Graceful handling of failed requests with continuation

### **Enhanced User Experience**
- **Property Selection**: Checkboxes to customize JSON output properties
- **Loading Indicators**: Informative loading messages for long-running operations
- **Enhanced Error Handling**: Better error messages and recovery options
- **Responsive Design**: Improved mobile and desktop experience

### **Data Format Standards**
- **Consistent JSON Structure**: Standardized format matching industry standards
- **Calculation Properties**: Full visibility into ranking algorithm metrics
- **Flexible Export Options**: Multiple export formats for different use cases

---

This PRD provides a comprehensive blueprint for recreating the Music Charts Archive Scraper in any technology stack, from web frameworks to mobile platforms. The modular architecture and clear data flow make it adaptable to different implementation approaches while maintaining the core functionality and user experience. 