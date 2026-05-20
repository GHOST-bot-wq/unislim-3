import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ThemeSelector = () => {
  const { goals, saveGoals } = useContext(AppContext);

  const currentTheme = goals.theme || 'calm';

  const themes = [
    {
      id: 'calm',
      label: 'Calm',
      desc: 'Equilíbrio & Relaxamento',
      gradient: 'linear-gradient(135deg, #A78BFA, #F472B6)',
      icon: '🧘'
    },
    {
      id: 'focus',
      label: 'Focus',
      desc: 'Clareza & Produtividade',
      gradient: 'linear-gradient(135deg, #3B82F6, #10B981)',
      icon: '⚡'
    },
    {
      id: 'energy',
      label: 'Energy',
      desc: 'Vitalidade & Alta Performance',
      gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
      icon: '🔥'
    }
  ];

  const handleSelectTheme = (themeId) => {
    saveGoals({
      ...goals,
      theme: themeId
    });
  };

  return (
    <div className="theme-selector-section">
      <h3 className="profile-section-title">Tema Emocional</h3>
      <p className="profile-section-subtitle">Escolha o mood que melhor sintoniza com sua mente hoje</p>
      
      <div className="theme-options-grid">
        {themes.map((t) => {
          const isSelected = currentTheme === t.id;
          return (
            <button
              key={t.id}
              className={`theme-option-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectTheme(t.id)}
              style={{ '--theme-gradient': t.gradient }}
            >
              <div className="theme-card-glow" />
              <div className="theme-card-content">
                <span className="theme-icon">{t.icon}</span>
                <span className="theme-name">{t.label}</span>
                <span className="theme-desc">{t.desc}</span>
              </div>
              {isSelected && <span className="theme-selected-badge">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
