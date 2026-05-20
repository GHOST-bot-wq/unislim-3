import React from 'react';

const HabitCard = ({ type, title, subtitle, value, maxValue, onChange, icon }) => {
  const renderInteraction = () => {
    switch (type) {
      case 'hydration': {
        const maxCups = maxValue || 8;
        const cups = Array.from({ length: maxCups }, (_, i) => i + 1);
        return (
          <div className="habit-interaction hydration-grid">
            <div className="habit-stat">
              <span className="habit-value">{value}</span>
              <span className="habit-unit">/ {maxCups} copos</span>
            </div>
            <div className="cups-container">
              {cups.map((cup) => {
                const isFilled = cup <= value;
                return (
                  <button
                    key={cup}
                    onClick={() => onChange(cup)}
                    className={`cup-bubble interactive-hover ${isFilled ? 'filled' : ''}`}
                    aria-label={`Registrar ${cup} copos de água`}
                  >
                    {/* Ícone de gota d'água sutil */}
                    <svg width="12" height="15" viewBox="0 0 12 16" fill="currentColor">
                      <path d="M6 16c3.314 0 6-2.686 6-6 0-3.375-3.375-7.5-6-10-2.625 2.5-6 6.625-6 10 0 3.314 2.686 6 6 6Z"/>
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
      
      case 'walk': {
        const targetMin = maxValue || 30;
        return (
          <div className="habit-interaction walk-control">
            <div className="habit-stat">
              <span className="habit-value">{value}</span>
              <span className="habit-unit">/ {targetMin} minutos</span>
            </div>
            <div className="stepper-container">
              <button
                onClick={() => onChange(Math.max(0, value - 5))}
                className="step-btn interactive-hover"
                aria-label="Remover 5 minutos"
              >
                —
              </button>
              <button
                onClick={() => onChange(value + 5)}
                className="step-btn interactive-hover"
                aria-label="Adicionar 5 minutos"
              >
                +
              </button>
            </div>
          </div>
        );
      }
      
      case 'eating':
      case 'sleep': {
        const isChecked = !!value;
        return (
          <div className="habit-interaction eating-toggle" onClick={() => onChange()}>
            <div className="habit-stat">
              <span className="habit-status-text">
                {isChecked ? 'Concluído' : 'Ainda não registrado'}
              </span>
            </div>
            <button
              className={`toggle-check-bubble interactive-hover ${isChecked ? 'checked' : ''}`}
              aria-label="Marcar hábito"
            >
              {isChecked && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 5 5 8 12 1" />
                </svg>
              )}
            </button>
          </div>
        );
      }
      
      default:
        return null;
    }
  };

  return (
    <div className={`habit-card animate-scale-up ${type}`}>
      <div className="habit-header">
        <div className="habit-icon">{icon}</div>
        <div className="habit-title-container">
          <h3 className="habit-title">{title}</h3>
          <p className="habit-subtitle">{subtitle}</p>
        </div>
      </div>
      {renderInteraction()}
    </div>
  );
};

export default HabitCard;
