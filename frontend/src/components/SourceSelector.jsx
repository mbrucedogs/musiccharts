import React from 'react';

const SourceSelector = ({ selectedSource, onSourceChange, shazamChartTypes, selectedChartType, onChartTypeChange }) => {
  const sources = [
    { id: 'musicchartsarchive', name: 'Music Charts Archive', description: 'Historical Billboard charts' },
    { id: 'kworb', name: 'Kworb', description: 'Real-time chart data' },
    { id: 'shazam', name: 'Shazam', description: 'Current trending songs (no historical data)' }
  ];

  return (
    <div className="source-selector">
      <div className="source-tabs">
        {sources.map((source) => (
          <button
            key={source.id}
            className={`source-tab ${selectedSource === source.id ? 'active' : ''}`}
            onClick={() => onSourceChange(source.id)}
          >
            <div className="source-name">{source.name}</div>
            <div className="source-description">{source.description}</div>
          </button>
        ))}
      </div>
      
      {selectedSource === 'shazam' && shazamChartTypes && (
        <div className="chart-type-selector">
          <label>Chart Type:</label>
          <select 
            value={selectedChartType || 'top-200'} 
            onChange={(e) => onChartTypeChange(e.target.value)}
          >
            {shazamChartTypes.map((chartType) => (
              <option key={chartType.id} value={chartType.id}>
                {chartType.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SourceSelector; 