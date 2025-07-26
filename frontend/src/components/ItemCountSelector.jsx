import React from 'react';

const ItemCountSelector = ({ itemCount, onItemCountChange, selectedSource }) => {
  // Only show for Kworb source since it has random numbers
  if (selectedSource !== 'kworb') {
    return null;
  }

  const itemCountOptions = [40, 50, 60, 70, 80, 90, 100];

  return (
    <div className="item-count-selector">
      <label htmlFor="item-count">Number of items to download:</label>
      <select
        id="item-count"
        value={itemCount}
        onChange={(e) => onItemCountChange(parseInt(e.target.value))}
        className="item-count-select"
      >
        {itemCountOptions.map(count => (
          <option key={count} value={count}>
            {count} items
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemCountSelector; 