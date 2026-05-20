import React, { useState, useEffect } from 'react';

const EmotionalSlider = ({ type, title, subtitle, value, onChange }) => {
  const [emotion, setEmotion] = useState({ emoji: '🙂', text: 'Focado' });
  const [animate, setAnimate] = useState(false);

  // Mapeamento de respostas objetivas de check-in (1 a 5)
  const emotionMap = {
    mood: {
      1: { emoji: '😕', text: 'Baixo foco' },
      2: { emoji: '😐', text: 'Instável' },
      3: { emoji: '🙂', text: 'Focado' },
      4: { emoji: '😊', text: 'Motivado' },
      5: { emoji: '⚡', text: 'Totalmente focado' }
    },
    energy: {
      1: { emoji: '🥱', text: 'Esgotado' },
      2: { emoji: '💤', text: 'Disposição baixa' },
      3: { emoji: '🔋', text: 'Equilibrada' },
      4: { emoji: '⚡', text: 'Alta disposição' },
      5: { emoji: '💫', text: 'Disposição máxima' }
    },
    emotionalHunger: {
      1: { emoji: '✅', text: 'Sob controle' },
      2: { emoji: '🍵', text: 'Impulso leve' },
      3: { emoji: '🍫', text: 'Vontade de doce' },
      4: { emoji: '🍕', text: 'Ansiedade moderada' },
      5: { emoji: '🚨', text: 'Impulso forte' }
    }
  };

  useEffect(() => {
    if (emotionMap[type] && emotionMap[type][value]) {
      setEmotion(emotionMap[type][value]);
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 200);
      return () => clearTimeout(timer);
    }
  }, [value, type]);

  return (
    <div className="emotional-slider-card animate-scale-up">
      <div className="slider-header text-center">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{title}</h3>
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
