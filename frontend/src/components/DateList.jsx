import React from 'react';

const DateList = ({ dates, selectedDate, onDateSelect, loading, error }) => {
  if (loading) {
    return (
      <div className="date-list">
        <h3>Available Chart Dates</h3>
        <div className="loading">Loading chart dates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="date-list">
        <h3>Available Chart Dates</h3>
        <div className="error">Error loading dates: {error}</div>
      </div>
    );
  }

  if (!dates || dates.length === 0) {
    return (
      <div className="date-list">
        <h3>Available Chart Dates</h3>
        <div className="no-dates">No chart dates available for selected year</div>
      </div>
    );
  }

  return (
    <div className="date-list">
      <h3>Available Chart Dates</h3>
      <div className="date-grid">
        {dates.map((dateObj) => (
          <button
            key={dateObj.date}
            className={`date-item ${selectedDate === dateObj.date ? 'selected' : ''}`}
            onClick={() => onDateSelect(dateObj.date)}
          >
            {dateObj.formattedDate}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateList; 