import React, { useState, useEffect } from 'react';

const DeviceFrame = ({ children }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="device-wrapper">
      <div className="device-frame">
        {/* Barra de Status estilo iOS */}
        <div className="status-bar">
          <span className="time">{time}</span>
          {/* Notch sutil simulando aparelhos modernos */}
          <div style={{
            width: '110px',
            height: '24px',
            backgroundColor: 'hsl(30, 8%, 15%)',
            borderRadius: '0 0 16px 16px',
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100
          }}></div>
          <div className="icons">
            {/* Ícone de Rede Simulado */}
            <svg width="15" height="11" viewBox="0 0 17 12" fill="currentColor">
              <rect x="0" y="9" width="2" height="3" rx="0.5" />
              <rect x="4" y="7" width="2" height="5" rx="0.5" />
              <rect x="8" y="5" width="2" height="7" rx="0.5" />
              <rect x="12" y="2" width="2" height="10" rx="0.5" />
              <rect x="16" y="0" width="2" height="12" rx="0.5" opacity="0.3" />
            </svg>
            {/* Ícone de Wi-Fi Simulado */}
            <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
              <path d="M8 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-3.5-5.5a5 5 0 0 1 7 0 .5.5 0 0 0 .7-.7 6 6 0 0 0-8.4 0 .5.5 0 0 0 .7.7Zm-2.5-2.5a8.5 8.5 0 0 1 12 0 .5.5 0 0 0 .7-.7c-3.7-3.7-9.7-3.7-13.4 0a.5.5 0 0 0 .7.7Z" />
            </svg>
            {/* Ícone de Bateria Simulado */}
            <div className="battery"></div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DeviceFrame;
