import React from 'react';
import JsonViewer from './JsonViewer';

const ChartTable = ({ data, loading, error, selectedDate, selectedSource, itemCount, onItemCountChange }) => {
  if (loading) {
    return (
      <div className="chart-table">
        <h3>Music Chart Data</h3>
        <div className="loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-table">
        <h3>Music Chart Data</h3>
        <div className="error">Error loading chart data: {error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-table">
        <h3>Music Chart Data</h3>
        <div className="no-data">
          {selectedDate 
            ? `No chart data available for ${selectedDate}. Please select a different date.`
            : 'No data available. Please select a chart date.'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="chart-table">
      <h3>Music Chart Data {selectedDate && `- ${selectedDate}`}</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Title</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            {data.map((song, index) => (
              <tr key={index}>
                <td className="rank-cell">{song.order}</td>
                <td className="title-cell">{song.title}</td>
                <td className="artist-cell">{song.artist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* JSON Viewer for debugging and data inspection */}
      <JsonViewer 
        data={data}
        title={`Raw JSON Data for ${selectedDate || 'Current'} Chart`}
        filename={`chart-data-${selectedDate || 'current'}-raw.json`}
        selectedDate={selectedDate}
        selectedSource={selectedSource}
        itemCount={itemCount}
        onItemCountChange={onItemCountChange}
      />
    </div>
  );
};

export default ChartTable; 