import React, { useState } from 'react';
import Layout from './components/Layout';
import YearSelector from './components/YearSelector';
import DateList from './components/DateList';
import ChartTable from './components/ChartTable';
import DownloadButton from './components/DownloadButton';
import YearlyTopSongs from './components/YearlyTopSongs';
import YearlyDownloadButton from './components/YearlyDownloadButton';
import SourceSelector from './components/SourceSelector';
import { useChartDates } from './hooks/useChartDates';
import { useChartData } from './hooks/useChartData';
import { useYearlyTopSongs } from './hooks/useYearlyTopSongs';
import { useShazamChartTypes } from './hooks/useShazamChartTypes';

function App() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'yearly'
  const [selectedSource, setSelectedSource] = useState('musicchartsarchive');
  const [selectedChartType, setSelectedChartType] = useState('top-200');
  
  const { chartTypes: shazamChartTypes, loading: chartTypesLoading } = useShazamChartTypes();
  const { dates, loading: datesLoading, error: datesError } = useChartDates(selectedSource === 'shazam' ? null : selectedYear, selectedSource);
  const { chartData, loading: dataLoading, error: dataError } = useChartData(selectedSource === 'shazam' ? 'today' : selectedDate, selectedSource, selectedSource === 'shazam' ? selectedChartType : null);
  const { yearlySongs, loading: yearlyLoading, error: yearlyError } = useYearlyTopSongs(selectedSource === 'shazam' ? null : (viewMode === 'yearly' ? selectedYear : null), selectedSource, selectedSource === 'shazam' ? selectedChartType : null);

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

  const handleSourceChange = (source) => {
    setSelectedSource(source);
    setSelectedDate(null); // Reset selected date when source changes
    if (source !== 'shazam') {
      setSelectedChartType('top-200'); // Reset chart type for non-Shazam sources
    }
  };

  const handleChartTypeChange = (chartType) => {
    setSelectedChartType(chartType);
    setSelectedDate(null); // Reset selected date when chart type changes
  };

  return (
    <Layout>
      <div className="app">
        <header className="app-header">
          <h1>Music Charts Archive</h1>
        </header>
        
        <main className="app-main">
          <div className="controls-section">
            <SourceSelector 
              selectedSource={selectedSource}
              onSourceChange={handleSourceChange}
              shazamChartTypes={shazamChartTypes}
              selectedChartType={selectedChartType}
              onChartTypeChange={handleChartTypeChange}
            />
            
            <div className="year-selector-container">
              {selectedSource !== 'shazam' && (
                <YearSelector 
                  selectedYear={selectedYear} 
                  onYearChange={handleYearChange} 
                />
              )}
              
              {selectedSource === 'shazam' && (
                <div className="shazam-info">
                  <div className="info-message">
                    <strong>Current Data Only</strong>
                    <p>Shazam provides current trending songs. Historical data is not available.</p>
                  </div>
                </div>
              )}
              
              <div className="view-mode-selector">
                <label>View Mode:</label>
                <div className="view-mode-buttons">
                  <button 
                    className={`view-mode-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                    onClick={() => handleViewModeChange('weekly')}
                  >
                    {selectedSource === 'shazam' ? 'Current Charts' : 'Weekly Charts'}
                  </button>
                  <button 
                    className={`view-mode-btn ${viewMode === 'yearly' ? 'active' : ''}`}
                    onClick={() => handleViewModeChange('yearly')}
                  >
                    {selectedSource === 'shazam' ? 'Current Top Songs' : 'Yearly Top Songs'}
                  </button>
                </div>
              </div>
            </div>
            
            {viewMode === 'weekly' && selectedSource !== 'shazam' && (
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
                  selectedDate={selectedSource === 'shazam' ? 'Current' : selectedDate}
                />
                
                {chartData && chartData.length > 0 && (
                  <DownloadButton data={chartData} selectedDate={selectedSource === 'shazam' ? 'Current' : selectedDate} />
                )}
              </>
            ) : (
              <>
                <YearlyTopSongs 
                  data={yearlySongs}
                  loading={yearlyLoading}
                  error={yearlyError}
                  year={selectedSource === 'shazam' ? 'Current' : selectedYear}
                />
                
                {yearlySongs && yearlySongs.length > 0 && (
                  <YearlyDownloadButton data={yearlySongs} year={selectedSource === 'shazam' ? 'Current' : selectedYear} />
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