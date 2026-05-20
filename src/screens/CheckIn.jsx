import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import EmotionalSlider from '../components/EmotionalSlider';
import { getCheckInFeedback } from '../utils/feedbackHelper';

const CheckIn = () => {
  const { addCheckIn, checkIns, hasDoneCheckInToday, setActiveTab } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [emotionalHunger, setEmotionalHunger] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const checkInDone = hasDoneCheckInToday();

  // Busca os dados do check-in de hoje se já foi feito
  const getTodayCheckIn = () => {
    const todayStr = new Date().toDateString();
    return checkIns.find(c => c.date === todayStr);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      // Registra o check-in
      addCheckIn({ mood, energy, emotionalHunger });
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleResetCheckin = () => {
    // Permite refazer o check-in do dia
    setStep(1);
    setMood(3);
    setEnergy(3);
    setEmotionalHunger(1);
    setIsFinished(false);
    
    // Remove o de hoje temporariamente para exibir a tela de preenchimento
    const todayStr = new Date().toDateString();
    const updated = checkIns.filter(c => c.date !== todayStr);
    // Mas não vamos remover do banco global de uma vez para não perder dados à toa, 
    // apenas mudamos o estado local e reescreveremos no addCheckIn
    setIsFinished(false);
  };

  // Se já concluiu e está mostrando a tela de feedback de encerramento
  if (isFinished) {
    const feedback = getCheckInFeedback(mood, energy, emotionalHunger);
    return (
      <div className="screen-container flex-center animate-fade-in" style={{ paddingBottom: '24px' }}>
        <div className="checkin-finished-card text-center animate-scale-up">
          <span className="finished-icon">🕊️</span>
          <h2 className="finished-title">{feedback.title}</h2>
          <p className="finished-text" style={{ marginTop: '16px' }}>
            {feedback.message}
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="btn-premium interactive-hover"
            style={{ marginTop: '32px' }}
          >
            Voltar para o meu espaço
          </button>
        </div>
      </div>
    );
  }

  // Se já preencheu hoje e entrou na tela
  if (checkInDone && !isFinished) {
    const todayData = getTodayCheckIn() || { mood: 3, energy: 3, emotionalHunger: 1 };
    
    const emojiMap = {
      mood: { 1: '😔', 2: '😕', 3: '😌', 4: '😊', 5: '✨' },
      energy: { 1: '🥱', 2: '💤', 3: '🔋', 4: '⚡', 5: '💫' },
      hunger: { 1: '🌿', 2: '🍵', 3: '🍫', 4: '🍕', 5: '🚨' }
    };

    const moodLabelMap = { 1: 'Aflito', 2: 'Instável', 3: 'Sereno', 4: 'Contente', 5: 'Pleno' };
    const energyLabelMap = { 1: 'Esgotado', 2: 'Baixa', 3: 'Equilibrada', 4: 'Alta', 5: 'Vibrante' };
    const hungerLabelMap = { 1: 'Em paz', 2: 'Sob controle', 3: 'Leve desejo', 4: 'Forte impulso', 5: 'Impulso urgente' };

    return (
      <div className="screen-container flex-center animate-fade-in" style={{ paddingBottom: '24px' }}>
        <div className="checkin-done-state text-center animate-scale-up">
          <div className="done-state-badge">SINTONIA DO DIA</div>
          <h2 className="done-title" style={{ marginTop: '12px' }}>Você já se ouviu hoje</h2>
          <p className="done-subtitle" style={{ marginTop: '6px' }}>Cada momento de reflexão ajuda a fortalecer seu bem-estar.</p>
          
          <div className="checkin-summary-list">
            <div className="checkin-summary-item">
              <span className="summary-emoji">{emojiMap.mood[todayData.mood]}</span>
              <div className="summary-details">
                <span className="summary-label">Seu Humor</span>
                <span className="summary-val">{moodLabelMap[todayData.mood]}</span>
              </div>
            </div>
            <div className="checkin-summary-item">
              <span className="summary-emoji">{emojiMap.energy[todayData.energy]}</span>
              <div className="summary-details">
                <span className="summary-label">Sua Disposição</span>
                <span className="summary-val">{energyLabelMap[todayData.energy]}</span>
              </div>
            </div>
            <div className="checkin-summary-item">
              <span className="summary-emoji">{emojiMap.hunger[todayData.emotionalHunger]}</span>
              <div className="summary-details">
                <span className="summary-label">Relação Alimentar</span>
                <span className="summary-val">{hungerLabelMap[todayData.emotionalHunger]}</span>
              </div>
            </div>
          </div>
          
          <button onClick={handleResetCheckin} className="btn-secondary interactive-hover" style={{ marginTop: '28px' }}>
            Atualizar minhas respostas
          </button>
        </div>
      </div>
    );
  }

  // Formulário do Check-in em etapas
  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '24px' }}>
      <header style={{ marginBottom: '16px', marginTop: '8px' }}>
        <div className="goals-progress-indicator" style={{ marginBottom: '16px' }}>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
          <span className="progress-text">Sintonia {step} de 3</span>
        </div>
        <h1>Sintonia Diária</h1>
        <p style={{ marginTop: '4px' }}>Dedique um minuto para escutar seu corpo e suas emoções.</p>
      </header>

      <div className="checkin-step-content" style={{ flex: 1 }}>
        {step === 1 && (
          <EmotionalSlider
            type="mood"
            title="Como está seu humor hoje?"
            subtitle="Identificar e nomear o humor reduz o estresse da jornada."
            value={mood}
            onChange={setMood}
          />
        )}

        {step === 2 && (
          <EmotionalSlider
            type="energy"
            title="Como descreve sua disposição agora?"
            subtitle="Sua energia indica se seu corpo precisa de descanso ou estímulo."
            value={energy}
            onChange={setEnergy}
          />
        )}

        {step === 3 && (
          <EmotionalSlider
            type="emotionalHunger"
            title="Como está a fome emocional?"
            subtitle="Compreender seus impulsos alimentares ajuda a desarmar a ansiedade."
            value={emotionalHunger}
            onChange={setEmotionalHunger}
          />
        )}
      </div>

      <div className="goals-navigation" style={{ marginTop: 'auto' }}>
        {step > 1 ? (
          <button onClick={handleBack} className="btn-secondary" style={{ width: '48%' }}>
            Voltar
          </button>
        ) : (
          <div style={{ width: '48%' }}></div>
        )}
        <button onClick={handleNext} className="btn-premium" style={{ width: '48%' }}>
          {step === 3 ? 'Concluir' : 'Próximo'}
        </button>
      </div>
    </div>
  );
};

export default CheckIn;
