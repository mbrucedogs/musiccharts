import React from 'react';

const YearlyDownloadButton = ({ data, year }) => {
  const downloadJSON = () => {
    if (!data || data.length === 0) return;

    // Create JSON content for yearly top songs data
    // Filter out calculation properties to keep original download format
    const songsForDownload = data.map(song => ({
      order: song.order,
      title: song.title,
      artist: song.artist
    }));

    const jsonData = {
      year: year,
      title: `Top Songs of ${year}`,
      songs: songsForDownload
    };

    const jsonContent = JSON.stringify(jsonData, null, 2);

    // Create and download the file
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `yearly-top-songs-${year}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="download-section">
      <button 
        onClick={downloadJSON}
        className="download-button"
        disabled={!data || data.length === 0}
      >
        Download Yearly Top Songs as JSON
      </button>
    </div>
  );
};

export default YearlyDownloadButton; 