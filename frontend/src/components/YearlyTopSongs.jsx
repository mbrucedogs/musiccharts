import React from 'react';
import JsonViewer from './JsonViewer';

const YearlyTopSongs = ({ data, loading, error, year }) => {
  if (loading) {
    return (
      <div className="chart-table">
        <h3>Yearly Top Songs</h3>
        <div className="loading">
          <div>Calculating yearly top songs...</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>
            This may take a few minutes as we analyze all chart data for {year}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-table">
        <h3>Yearly Top Songs</h3>
        <div className="error">Error calculating yearly top songs: {error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-table">
        <h3>Yearly Top Songs</h3>
        <div className="no-data">
          {year 
            ? `No yearly data available for ${year}. Please select a different year.`
            : 'No yearly data available. Please select a year.'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="chart-table">
      <h3>Top Songs of {year}</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Total Points</th>
              <th>Best Position</th>
              <th>Weeks on Chart</th>
            </tr>
          </thead>
          <tbody>
            {data.map((song, index) => (
              <tr key={index}>
                <td className="rank-cell">{song.order}</td>
                <td className="title-cell">{song.title}</td>
                <td className="artist-cell">{song.artist}</td>
                <td className="points-cell">{song.totalPoints}</td>
                <td className="position-cell">#{song.highestPosition}</td>
                <td className="appearances-cell">{song.appearances}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* JSON Viewer for debugging and data inspection */}
      <JsonViewer 
        data={data}
        title={`Raw JSON Data for ${year} Yearly Top Songs`}
        filename={`yearly-top-songs-${year}-raw.json`}
        year={year}
      />
    </div>
  );
};

export default YearlyTopSongs; 