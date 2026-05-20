import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/profileModal.css';

const ProfileModal = ({ isOpen, onClose }) => {
  const { goals, saveGoals, resetData } = useContext(AppContext);

  // Estados locais para edição dos campos
  const [name, setName] = useState(goals.name || 'Leonardo');
  const [avatar, setAvatar] = useState(goals.avatar || '✨');
  const [weightCurrent, setWeightCurrent] = useState(goals.weightCurrent || '75');
  const [weightDesired, setWeightDesired] = useState(goals.weightDesired || '68');
  const [mainGoal, setMainGoal] = useState(goals.mainGoal || 'lose_weight');
  const [theme, setTheme] = useState(goals.theme || 'calm');
  const [age, setAge] = useState(goals.age || '26');
  const [height, setHeight] = useState(goals.height || '178');

  const avatarsList = ['✨', '🧘', '🏃', '🌸', '🥑', '🦁', '🌊', '🍣', '🥗'];

  const goalsList = [
    { id: 'lose_weight', label: 'Emagrecer', desc: 'Foco em queima calórica e déficit leve.' },
    { id: 'maintain_weight', label: 'Manter Peso', desc: 'Equilíbrio nutricional e consistência.' },
    { id: 'gain_muscle', label: 'Ganhar Massa', desc: 'Superávit saudável com foco em proteínas.' }
  ];

  const themesList = [
    { id: 'calm', name: 'Calm', mood: 'Lavanda relaxante' },
    { id: 'focus', name: 'Focus', mood: 'Azul e sálvia' },
    { id: 'energy', name: 'Energy', mood: 'Pêssego e dourado' }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    saveGoals({
      ...goals,
      name,
      avatar,
      weightCurrent,
      weightDesired,
      mainGoal,
      theme,
      age,
      height,
      isSet: true
    });
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Deseja resetar todas as refeições e objetivos para o padrão inicial?')) {
      resetData();
      onClose();
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-drag-bar" />
        
        <div className="profile-modal-header">
          <h2 className="profile-modal-title">Personalização IA</h2>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Avatar Selecionável */}
          <div className="profile-form-section">
            <span className="profile-form-label">Escolha seu Avatar</span>
            <div className="avatar-picker-grid">
              {avatarsList.map(av => (
                <button
                  type="button"
                  key={av}
                  className={`avatar-option-btn ${avatar === av ? 'selected' : ''}`}
                  onClick={() => setAvatar(av)}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div className="profile-form-section">
            <label className="profile-form-label">Como devemos te chamar?</label>
            <input
              type="text"
              className="profile-input-text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..."
              required
            />
          </div>

          {/* Idade e Altura */}
          <div className="profile-form-section">
            <div className="profile-inputs-row">
              <div className="input-wrapper">
                <label className="profile-form-label">Idade (anos)</label>
                <input
                  type="number"
                  className="profile-input-number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="26"
                  min="10"
                  max="120"
                  required
                />
              </div>
              <div className="input-wrapper">
                <label className="profile-form-label">Altura (cm)</label>
                <input
                  type="number"
                  className="profile-input-number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="178"
                  min="100"
                  max="250"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pesos */}
          <div className="profile-form-section">
            <div className="profile-inputs-row">
              <div className="input-wrapper">
                <label className="profile-form-label">Peso Atual (kg)</label>
                <input
                  type="number"
                  className="profile-input-number"
                  value={weightCurrent}
                  onChange={(e) => setWeightCurrent(e.target.value)}
                  placeholder="75"
                  min="30"
                  max="200"
                  required
                />
              </div>
              <div className="input-wrapper">
                <label className="profile-form-label">Meta de Peso (kg)</label>
                <input
                  type="number"
                  className="profile-input-number"
                  value={weightDesired}
                  onChange={(e) => setWeightDesired(e.target.value)}
                  placeholder="68"
                  min="30"
                  max="200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Objetivo Principal */}
          <div className="profile-form-section">
            <span className="profile-form-label">Objetivo de Saúde</span>
            <div className="objective-pills-group">
              {goalsList.map(g => (
                <button
                  type="button"
                  key={g.id}
                  className={`objective-pill-btn ${mainGoal === g.id ? 'selected' : ''}`}
                  onClick={() => setMainGoal(g.id)}
                >
                  <div>
                    <span className="label" style={{ display: 'block' }}>{g.label}</span>
                    <span className="desc">{g.desc}</span>
                  </div>
                  <div className="indicator">
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                      transform: mainGoal === g.id ? 'scale(1)' : 'scale(0)',
                      transition: 'transform 0.2s ease'
                    }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tema Emocional */}
          <div className="profile-form-section">
            <span className="profile-form-label">Tema da Interface</span>
            <div className="theme-picker-row">
              {themesList.map(t => (
                <button
                  type="button"
                  key={t.id}
                  className={`theme-card-option ${theme === t.id ? 'selected' : ''} ${t.id}`}
                  onClick={() => setTheme(t.id)}
                >
                  <div className={`theme-color-preview ${t.id}`} />
                  <span className="name">{t.name}</span>
                  <span className="mood">{t.mood}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <button type="submit" className="btn-save-profile">
            Salvar Alterações
          </button>

          <button type="button" className="btn-reset-onboarding" onClick={handleReset}>
            Resetar e Limpar Dados
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
