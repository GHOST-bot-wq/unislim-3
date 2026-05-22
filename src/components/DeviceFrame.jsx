import React from 'react';

const DeviceFrame = ({ children }) => {
  return (
    <div className="device-wrapper">
      <div className="device-frame">
        {children}
      </div>
    </div>
  );
};

export default DeviceFrame;
