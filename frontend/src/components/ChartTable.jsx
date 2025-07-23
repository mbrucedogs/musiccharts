import React from 'react';

const ChartTable = ({ data, loading, error, selectedDate }) => {
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
    </div>
  );
};

export default ChartTable; 