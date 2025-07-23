import React, { useState } from 'react';

const JsonViewer = ({ data, title, filename, year }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState({
    position: true,
    title: true,
    artist: true,
    totalPoints: false,
    highestPosition: false,
    appearances: false
  });

  // Filter data based on selected properties and format to match songList.json structure
  const formatData = () => {
    if (!data || data.length === 0) return null;

    const filteredSongs = data.map(item => {
      const filteredSong = {};
      
      // Map order to position to match the expected format
      if (selectedProperties.position && item.hasOwnProperty('order')) {
        filteredSong.position = item.order;
      }
      
      // Add other selected properties
      Object.keys(selectedProperties).forEach(prop => {
        if (prop !== 'position' && selectedProperties[prop] && item.hasOwnProperty(prop)) {
          filteredSong[prop] = item[prop];
        }
      });
      
      return filteredSong;
    });

    return {
      title: `${year} - Top 50 Songs`,
      songs: filteredSongs
    };
  };

  const formattedData = formatData();
  const jsonString = formattedData ? JSON.stringify(formattedData, null, 2) : '[]';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      alert('JSON copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = jsonString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('JSON copied to clipboard!');
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="json-viewer">
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="json-toggle-btn"
      >
        {isVisible ? 'Hide' : 'Show'} JSON Data
      </button>
      
      {isVisible && (
        <div className="json-container">
          <div className="json-header">
            <h4>{title}</h4>
            <div className="json-actions">
              <button onClick={copyToClipboard} className="copy-btn">
                Copy JSON
              </button>
              <button onClick={downloadJSON} className="download-btn">
                Download
              </button>
            </div>
          </div>
          
          {/* Property Selection */}
          <div className="property-selector">
            <h5>Select Properties to Include:</h5>
            <div className="property-checkboxes">
              {Object.keys(selectedProperties).map(prop => (
                <label key={prop} className="property-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedProperties[prop]}
                    onChange={(e) => setSelectedProperties(prev => ({
                      ...prev,
                      [prop]: e.target.checked
                    }))}
                  />
                  <span className="property-label">
                    {prop === 'position' ? 'position (rank)' : prop}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <pre className="json-content">{jsonString}</pre>
        </div>
      )}
    </div>
  );
};

export default JsonViewer; 