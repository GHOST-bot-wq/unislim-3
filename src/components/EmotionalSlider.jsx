import React, { useState, useEffect } from 'react';

const EmotionalSlider = ({ type, title, subtitle, value, onChange }) => {
  const [emotion, setEmotion] = useState({ emoji: '😌', text: 'Sereno' });
  const [animate, setAnimate] = useState(false);

  // Mapeamento de emoções com base no tipo e valor (1 a 5)
  const emotionMap = {
    mood: {
      1: { emoji: '😔', text: 'Aflito / Desanimado' },
      2: { emoji: '😕', text: 'Instável' },
      3: { emoji: '😌', text: 'Sereno' },
      4: { emoji: '😊', text: 'Contente' },
      5: { emoji: '✨', text: 'Pleno' }
    },
    energy: {
      1: { emoji: '🥱', text: 'Esgotado' },
      2: { emoji: '💤', text: 'Baixa' },
      3: { emoji: '🔋', text: 'Equilibrada' },
      4: { emoji: '⚡', text: 'Alta' },
      5: { emoji: '💫', text: 'Vibrante' }
    },
    emotionalHunger: {
      1: { emoji: '🌿', text: 'Em paz' },
      2: { emoji: '🍵', text: 'Sob controle' },
      3: { emoji: '🍫', text: 'Leve desejo' },
      4: { emoji: '🍕', text: 'Forte impulso' },
      5: { emoji: '🚨', text: 'Impulso urgente' }
    }
  };

  useEffect(() => {
    if (emotionMap[type] && emotionMap[type][value]) {
      setEmotion(emotionMap[type][value]);
      // Dispara animação rápida de troca de emoji
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 200);
      return () => clearTimeout(timer);
    }
  }, [value, type]);

  return (
    <div className="emotional-slider-card animate-scale-up">
      <div className="slider-header text-center">
        <span className={`slider-emoji-display ${animate ? 'scale-effect' : ''}`}>
          {emotion.emoji}
        </span>
        <h4 className="slider-emotion-text">{emotion.text}</h4>
        <p className="slider-subtitle">{subtitle}</p>
      </div>

      <div className="slider-body">
        <div className="slider-labels">
          <span>Mínimo</span>
          <span>Máximo</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="premium-range-slider"
          aria-label={title}
        />
        <div className="slider-ticks">
          <span className={value === 1 ? 'active' : ''}>1</span>
          <span className={value === 2 ? 'active' : ''}>2</span>
          <span className={value === 3 ? 'active' : ''}>3</span>
          <span className={value === 4 ? 'active' : ''}>4</span>
          <span className={value === 5 ? 'active' : ''}>5</span>
        </div>
      </div>
    </div>
  );
};

export default EmotionalSlider;
