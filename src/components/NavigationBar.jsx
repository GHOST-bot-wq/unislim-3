import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const NavigationBar = () => {
  const { activeTab, setActiveTab, goals } = useContext(AppContext);

  // Se as metas não estiverem configuradas, oculta a barra de navegação
  if (!goals.isSet) return null;

  const tabs = [
    {
      id: 'home',
      label: 'Espaço',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'plan',
      label: 'Cuidado',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12z" />
          <path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8z" />
          <path d="M12 12V2" />
          <path d="M16.2 16.2 12 12" />
        </svg>
      )
    },
    {
      id: 'checkin',
      label: 'Sintonia',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    },
    {
      id: 'progress',
      label: 'Evolução',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </svg>
      )
    }
  ];

  return (
    <div className="nav-bar">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-label={tab.label}
          >
            <div className="icon-wrapper">{tab.icon}</div>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default NavigationBar;
