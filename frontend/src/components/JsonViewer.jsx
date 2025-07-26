import React, { useState } from 'react';
import ItemCountSelector from './ItemCountSelector';

const JsonViewer = ({ data, title, filename, year, selectedSource, itemCount, onItemCountChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [customTitle, setCustomTitle] = useState(title || `${year} - Top 50 Songs`);
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

    // Limit data based on item count for Kworb source
    let dataToProcess = data;
    if (selectedSource === 'kworb' && itemCount) {
      dataToProcess = data.slice(0, itemCount);
    }

    const filteredSongs = dataToProcess.map((item, index) => {
      const filteredSong = {};
      
      // Map order to position to match the expected format
      if (selectedProperties.position && item.hasOwnProperty('order')) {
        // For Kworb source, renumber positions sequentially to handle missing numbers
        if (selectedSource === 'kworb') {
          filteredSong.position = index + 1; // Sequential numbering starting from 1
        } else {
          filteredSong.position = item.order; // Keep original order for other sources
        }
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
      title: customTitle,
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

  const updateTitle = () => {
    // This function can be used to update the title if needed
    // For now, the title updates automatically as the user types
  };

  return (
    <div className="json-viewer">
      {/* Form Section with Title Input and Item Count Selector */}
      <div className="json-form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="json-title">JSON Title:</label>
            <input
              id="json-title"
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="title-input"
              placeholder="Enter custom title for JSON"
            />
          </div>
          
          {/* Item Count Selector - only for Kworb */}
          <ItemCountSelector 
            itemCount={itemCount}
            onItemCountChange={onItemCountChange}
            selectedSource={selectedSource}
          />
        </div>
        
        <div className="form-actions">
          <button 
            onClick={updateTitle}
            className="update-btn"
          >
            Update Title
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="json-toggle-btn"
      >
        {isVisible ? 'Hide' : 'Show'} JSON Data
      </button>
      
      {isVisible && (
        <div className="json-container">
          <div className="json-header">
            <h4>{customTitle}</h4>
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