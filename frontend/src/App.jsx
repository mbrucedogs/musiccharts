import React, { useState } from 'react';
import Layout from './components/Layout';
import YearSelector from './components/YearSelector';
import DateList from './components/DateList';
import ChartTable from './components/ChartTable';
import DownloadButton from './components/DownloadButton';
import YearlyTopSongs from './components/YearlyTopSongs';
import YearlyDownloadButton from './components/YearlyDownloadButton';
import { useChartDates } from './hooks/useChartDates';
import { useChartData } from './hooks/useChartData';
import { useYearlyTopSongs } from './hooks/useYearlyTopSongs';

function App() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'yearly'
  
  const { dates, loading: datesLoading, error: datesError } = useChartDates(selectedYear);
  const { chartData, loading: dataLoading, error: dataError } = useChartData(selectedDate);
  const { yearlySongs, loading: yearlyLoading, error: yearlyError } = useYearlyTopSongs(viewMode === 'yearly' ? selectedYear : null);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedDate(null); // Reset selected date when year changes
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'yearly') {
      setSelectedDate(null); // Clear selected date when switching to yearly view
    }
  };

  return (
    <Layout>
      <div className="app">
        <header className="app-header">
          <h1>Music Charts Archive</h1>
        </header>
        
        <main className="app-main">
          <div className="controls-section">
            <div className="year-selector-container">
              <YearSelector 
                selectedYear={selectedYear} 
                onYearChange={handleYearChange} 
              />
              
              <div className="view-mode-selector">
                <label>View Mode:</label>
                <div className="view-mode-buttons">
                  <button 
                    className={`view-mode-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                    onClick={() => handleViewModeChange('weekly')}
                  >
                    Weekly Charts
                  </button>
                  <button 
                    className={`view-mode-btn ${viewMode === 'yearly' ? 'active' : ''}`}
                    onClick={() => handleViewModeChange('yearly')}
                  >
                    Yearly Top Songs
                  </button>
                </div>
              </div>
            </div>
            
            {viewMode === 'weekly' && (
              <DateList 
                dates={dates}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                loading={datesLoading}
                error={datesError}
              />
            )}
          </div>
          
          <div className="chart-section">
            {viewMode === 'weekly' ? (
              <>
                <ChartTable 
                  data={chartData}
                  loading={dataLoading}
                  error={dataError}
                  selectedDate={selectedDate}
                />
                
                {chartData && chartData.length > 0 && (
                  <DownloadButton data={chartData} selectedDate={selectedDate} />
                )}
              </>
            ) : (
              <>
                <YearlyTopSongs 
                  data={yearlySongs}
                  loading={yearlyLoading}
                  error={yearlyError}
                  year={selectedYear}
                />
                
                {yearlySongs && yearlySongs.length > 0 && (
                  <YearlyDownloadButton data={yearlySongs} year={selectedYear} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default App; 