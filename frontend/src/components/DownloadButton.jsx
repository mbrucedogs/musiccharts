import React from 'react';

const DownloadButton = ({ data, selectedDate }) => {
  const downloadJSON = () => {
    if (!data || data.length === 0) return;

    // Format the date for the title
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    // Create JSON content for music chart data
    const jsonData = {
      title: `${formatDate(selectedDate)} - Top Songs`,
      date: selectedDate,
      totalSongs: data.length,
      songs: data
    };

    const jsonContent = JSON.stringify(jsonData, null, 2);

    // Create and download the file
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const dateStr = selectedDate ? selectedDate : 'chart-data';
    link.setAttribute('href', url);
    link.setAttribute('download', `music-chart-${dateStr}.json`);
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
        Download Chart as JSON
      </button>
    </div>
  );
};

export default DownloadButton; 