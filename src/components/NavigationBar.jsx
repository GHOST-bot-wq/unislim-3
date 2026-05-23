import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const NavigationBar = () => {
  const { activeTab, setActiveTab, adjustedGoals } = useContext(AppContext);

  const themeColor = adjustedGoals?.toneColor || 'var(--color-primary)';

  const leftTabs = [
    {
      id: 'home',
      label: 'Hoje',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'plan',
      label: 'Rotina',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    }
  ];

  const rightTabs = [
    {
      id: 'progress',
      label: 'Progresso',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];

  const isScannerActive = activeTab === 'scanner';

  return (
    <div className="nav-bar" style={{ position: 'relative' }}>
      {/* Abas da esquerda */}
      {leftTabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={{ color: isActive ? themeColor : 'var(--text-tertiary)' }}
            aria-label={tab.label}
          >
            <div className="icon-wrapper" style={{ stroke: isActive ? themeColor : 'currentColor' }}>{tab.icon}</div>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}

      {/* Botão central de câmera — Scanner */}
      <button
        onClick={() => setActiveTab('scanner')}
        aria-label="Scanner de refeições"
        className="nav-scanner-btn"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '6px',
          flex: 1,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {/* Bolão central flutuante */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          width: '56px',
          height: '56px',
          borderRadius: '20px',
          background: isScannerActive
            ? `linear-gradient(135deg, ${themeColor}, hsl(270,60%,72%))`
            : 'linear-gradient(135deg, var(--color-primary), hsl(270,60%,72%))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isScannerActive
            ? '0 8px 24px rgba(123,97,255,0.35), 0 0 0 4px rgba(123,97,255,0.1)'
            : '0 6px 20px rgba(123,97,255,0.25)',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          transform: isScannerActive ? 'scale(1.08)' : 'scale(1)',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="hsl(30,8%,15%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: '700',
          color: isScannerActive ? themeColor : 'var(--text-tertiary)',
          letterSpacing: '0.2px',
          marginTop: '4px',
        }}>Scanner</span>
      </button>

      {/* Abas da direita */}
      {rightTabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={{ color: isActive ? themeColor : 'var(--text-tertiary)' }}
            aria-label={tab.label}
          >
            <div className="icon-wrapper" style={{ stroke: isActive ? themeColor : 'currentColor' }}>{tab.icon}</div>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default NavigationBar;
