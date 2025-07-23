import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="layout-container">
        {children}
      </div>
    </div>
  );
};

export default Layout; 