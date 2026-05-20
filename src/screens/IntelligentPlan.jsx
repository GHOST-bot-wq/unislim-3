import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { getCheckInFeedback, getAdjustedGoals } from '../utils/feedbackHelper';
import '../styles/intelligentPlan.css';

const IntelligentPlan = () => {
  const { addCheckIn, checkIns, hasDoneCheckInToday, setActiveTab } = useContext(AppContext);
  
  // Estados para gerenciar o fluxo da tela
  // Passo 0: Intro, Passo 1: Pergunta 1, Passo 2: Pergunta 2, Passo 3: Pergunta 3, Passo 4: Loading, Passo 5: Resultado
  const [step, setStep] = useState(0);
  
  // Respostas
  const [dayType, setDayType] = useState('tranquilo');
  const [obstacle, setObstacle] = useState('ansiedade');
  const [energyLevel, setEnergyLevel] = useState(3);

  // Efeito de simulação do processamento da IA
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        setStep(5);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const checkInDone = hasDoneCheckInToday();

  // Busca os dados do questionário de hoje caso já tenham sido registrados
  const getTodayCheckIn = () => {
    const todayStr = new Date().toDateString();
    return checkIns.find(c => c.date === todayStr);
  };

  const handleStart = () => {
    setStep(1);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else if (step === 3) {
      // Registra no AppContext (será persistido no localStorage)
      addCheckIn({ dayType, obstacle, energyLevel });
      setStep(4); // Vai para o Loading
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else if (step === 1) {
      setStep(0);
    }
  };

  const handleReset = () => {
    setStep(1);
    setDayType('tranquilo');
    setObstacle('ansiedade');
    setEnergyLevel(3);
  };

  // Emojis reativos para o Slider de Energia
  const getEnergyEmoji = (val) => {
    const emojiMap = {
      1: '😴',
      2: '🥱',
      3: '🔋',
      4: '⚡',
      5: '💫'
    };
    return emojiMap[val] || '🔋';
  };

  const getEnergyText = (val) => {
    const textMap = {
      1: 'Pouca energia (Esgotado)',
      2: 'Energia baixa (Cansado)',
      3: 'Energia equilibrada',
      4: 'Alta energia (Disposto)',
      5: 'Muita energia (Vibrante)'
    };
    return textMap[val] || 'Equilibrada';
  };

  // ──────────────────────────────────────────────
  // ESTADO 1: CHECK-IN JÁ FEITO HOJE (Visualização Premium do Plano)
  // ──────────────────────────────────────────────
  if (checkInDone && step === 0) {
    const todayData = getTodayCheckIn() || { dayType: 'tranquilo', obstacle: 'ansiedade', energyLevel: 3 };
    const localAdjustedGoals = getAdjustedGoals(todayData);
    const feedback = getCheckInFeedback(todayData.dayType, todayData.obstacle, todayData.energyLevel);

    const dayTypeLabel = {
      tranquilo: 'Tranquilo',
      corrido: 'Corrido',
      estressante: 'Estressante',
      cansativo: 'Cansativo'
    };

    const obstacleLabel = {
      ansiedade: 'Ansiedade',
      doce: 'Vontade de doce',
      beliscar: 'Beliscar fora de hora',
      tempo: 'Falta de tempo',
      desanimo: 'Desânimo'
    };

    return (
      <div className="screen-container intelligent-plan-container animate-fade-in" style={{ '--theme-accent': localAdjustedGoals.toneColor }}>
        
        <header style={{ marginTop: '8px', marginBottom: '20px' }}>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '700', 
            letterSpacing: '1px', 
            color: localAdjustedGoals.toneColor, 
            backgroundColor: `${localAdjustedGoals.toneColor}12`, 
            padding: '4px 10px', 
            borderRadius: '20px'
          }}>
            PLANOTECA INTELIGENTE ATIVA
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '12px', letterSpacing: '-0.5px' }}>
            Seu dia está calibrado
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            O UniSlim ajustou a dificuldade dos seus hábitos com base no seu check-in de hoje.
          </p>
        </header>

        <div className="ip-result-card" style={{ border: `1px solid ${localAdjustedGoals.toneColor}25` }}>
          <div className="ip-result-icon" style={{ backgroundColor: `${localAdjustedGoals.toneColor}15`, color: localAdjustedGoals.toneColor }}>
            🧠
          </div>
          <h2 className="ip-result-title">{feedback.title}</h2>
          <p className="ip-result-subtitle">{feedback.message}</p>

          <div className="ip-adaptations-list">
            <div className="ip-adaptation-item">
              <span className="ip-adaptation-bullet">💧</span>
              <span>Hidratação: <strong>{localAdjustedGoals.hydrationLabel}</strong></span>
            </div>
            <div className="ip-adaptation-item">
              <span className="ip-adaptation-bullet">🚶</span>
              <span>Movimento: <strong>{localAdjustedGoals.walkLabel}</strong></span>
            </div>
            <div className="ip-adaptation-item">
              <span className="ip-adaptation-bullet">🌿</span>
              <span>Alimentação: <strong>{localAdjustedGoals.mindfulEatingLabel}</strong></span>
            </div>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-main)', borderRadius: '14px', border: '1px solid var(--border-subtle)', marginBottom: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong>Dados do seu ajuste:</strong> Dia {dayTypeLabel[todayData.dayType]} • Foco no obstáculo {obstacleLabel[todayData.obstacle]} • Energia: {getEnergyEmoji(todayData.energyLevel)}
          </div>

          <button 
            onClick={handleReset} 
            className="btn-ip-secondary" 
            style={{ width: '100%', borderColor: `${localAdjustedGoals.toneColor}30`, color: localAdjustedGoals.toneColor }}
          >
            Ajustar plano novamente
          </button>
        </div>

        <div style={{ marginTop: 'auto', width: '100%' }}>
          <button 
            onClick={() => setActiveTab('home')} 
            className="btn-ip-primary animate-pulse-slight"
            style={{ backgroundColor: localAdjustedGoals.toneColor, width: '100%' }}
          >
            Ir para tela inicial
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // ESTADO 2: PASSO 0 - TELA INICIAL (INTRODUÇÃO)
  // ──────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="screen-container intelligent-plan-container animate-fade-in" style={{ justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '0 12px' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px', animation: 'bounceSlight 2s infinite ease-in-out' }}>🧠</div>
          <h1 className="ip-title">Vamos ajustar seu dia</h1>
          <p className="ip-subtitle" style={{ maxWidth: '300px', margin: '6px auto 32px auto' }}>
            Pequenas adaptações criam mais consistência. Diga-nos como está sua rotina para recalcularmos suas metas.
          </p>
          
          <button 
            onClick={handleStart}
            className="btn-ip-primary animate-pulse-slight"
            style={{ width: '100%', maxWidth: '240px', padding: '16px 32px', borderRadius: '24px' }}
          >
            Começar
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // ESTADO 3: LOADING DE PROCESSAMENTO DA IA (PASSO 4)
  // ──────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="screen-container intelligent-plan-container animate-fade-in" style={{ justifyContent: 'center' }}>
        <div className="ip-loading-wrapper">
          <div className="ip-loading-scanner">
            <div className="ip-loading-circle"></div>
            <div className="ip-loading-pulse"></div>
          </div>
          <h3 className="ip-loading-text">Analisando sua rotina...</h3>
          <p className="ip-loading-sub">A IA está gerando o plano de hábitos ideal para hoje.</p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // ESTADO 4: EXIBIÇÃO DO NOVO PLANO AJUSTADO (PASSO 5)
  // ──────────────────────────────────────────────
  if (step === 5) {
    const tempCheckIn = { dayType, obstacle, energyLevel };
    const localAdjustedGoals = getAdjustedGoals(tempCheckIn);
    const feedback = getCheckInFeedback(dayType, obstacle, energyLevel);

    return (
      <div className="screen-container intelligent-plan-container animate-fade-in" style={{ '--theme-accent': localAdjustedGoals.toneColor }}>
        <header style={{ marginTop: '8px', marginBottom: '20px' }}>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '700', 
            letterSpacing: '1px', 
            color: localAdjustedGoals.toneColor, 
            backgroundColor: `${localAdjustedGoals.toneColor}12`, 
            padding: '4px 10px', 
            borderRadius: '20px'
          }}>
            ANÁLISE DE ROTINA CONCLUÍDA
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '12px', letterSpacing: '-0.5px' }}>
            Plano ajustado para hoje
          </h1>
        </header>

        <div className="ip-result-card" style={{ border: `1px solid ${localAdjustedGoals.toneColor}25` }}>
          <div className="ip-result-icon" style={{ backgroundColor: `${localAdjustedGoals.toneColor}15`, color: localAdjustedGoals.toneColor }}>
            ✨
          </div>
          <h2 className="ip-result-title">{feedback.title}</h2>
          <p className="ip-result-subtitle" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {feedback.message}
          </p>

          <div className="ip-adaptations-list">
            <div className="ip-adaptation-item">
              <span className="ip-adaptation-bullet">💧</span>
              <span>Hidratação: <strong>{localAdjustedGoals.hydrationLabel}</strong></span>
            </div>
            <div className="ip-adaptation-item">
              <span className="ip-adaptation-bullet">🚶</span>
              <span>Movimento: <strong>{localAdjustedGoals.walkLabel}</strong></span>
            </div>
            <div className="ip-adaptation-item">
              <span className="ip-adaptation-bullet">🌿</span>
              <span>Alimentação: <strong>{localAdjustedGoals.mindfulEatingLabel}</strong></span>
            </div>
          </div>

          <span className="ip-impact-quote">
            “Consistência vale mais que perfeição.”
          </span>
        </div>

        <div className="ip-nav-buttons" style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => {
              setStep(0);
              setActiveTab('home'); // Abre a home com o tema e progresso calculados
            }}
            className="btn-ip-primary"
            style={{ backgroundColor: localAdjustedGoals.toneColor }}
          >
            Ativar Plano de Hoje
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // ESTADO 5: QUESTIONÁRIO FLUIDO DE 3 PASSOS (PASSOS 1 A 3)
  // ──────────────────────────────────────────────
  return (
    <div className="screen-container intelligent-plan-container animate-fade-in" style={{ '--theme-accent': 'var(--color-primary)' }}>
      
      {/* Indicador de Passos */}
      <div className="ip-progress-indicator">
        <div className="ip-progress-bar">
          <div className="ip-progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
        <span className="ip-progress-text">Pergunta {step} de 3</span>
      </div>

      {/* PERGUNTA 1: Como será seu dia hoje? */}
      {step === 1 && (
        <div className="ip-question-wrapper">
          <h2 className="ip-title">Como será seu dia hoje?</h2>
          <p className="ip-subtitle">Apenas uma opção selecionável para mapear o ritmo do dia.</p>
          
          <div className="ip-options-grid">
            {['tranquilo', 'corrido', 'estressante', 'cansativo'].map((opt) => {
              const labelMap = {
                tranquilo: 'Tranquilo',
                corrido: 'Corrido',
                estressante: 'Estressante',
                cansativo: 'Cansativo'
              };
              const isSelected = dayType === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setDayType(opt)}
                  className={`ip-option-card ${isSelected ? 'selected' : ''}`}
                >
                  <span className="ip-option-label">{labelMap[opt]}</span>
                  <div className="ip-radio-circle">
                    {isSelected && <div className="ip-radio-inner"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PERGUNTA 2: O que mais pode dificultar sua rotina hoje? */}
      {step === 2 && (
        <div className="ip-question-wrapper">
          <h2 className="ip-title">O que mais pode dificultar sua rotina hoje?</h2>
          <p className="ip-subtitle">Selecione o principal obstáculo que você prevê.</p>
          
          <div className="ip-options-grid">
            {['ansiedade', 'doce', 'beliscar', 'tempo', 'desanimo'].map((opt) => {
              const labelMap = {
                ansiedade: 'Ansiedade',
                doce: 'Vontade de doce',
                beliscar: 'Beliscar fora de hora',
                tempo: 'Falta de tempo',
                desanimo: 'Desânimo'
              };
              const isSelected = obstacle === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setObstacle(opt)}
                  className={`ip-option-card ${isSelected ? 'selected' : ''}`}
                >
                  <span className="ip-option-label">{labelMap[opt]}</span>
                  <div className="ip-radio-circle">
                    {isSelected && <div className="ip-radio-inner"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PERGUNTA 3: Quanta energia você sente hoje? */}
      {step === 3 && (
        <div className="ip-question-wrapper">
          <h2 className="ip-title">Quanta energia você sente hoje?</h2>
          <p className="ip-subtitle">Deslize para indicar seu nível de disposição física.</p>
          
          <div className="ip-slider-container">
            <div className="ip-energy-emoji-display">
              {getEnergyEmoji(energyLevel)}
            </div>
            
            <div className="ip-slider-scale">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="ip-range-input"
              />
            </div>

            <div className="ip-slider-labels">
              <span className="ip-slider-label-text">😴 pouca energia</span>
              <span className="ip-slider-label-text">⚡ muita energia</span>
            </div>

            <span className="ip-slider-level-text">
              {getEnergyText(energyLevel)}
            </span>
          </div>
        </div>
      )}

      {/* Navegação Inferior das Perguntas */}
      <div className="ip-nav-buttons">
        <button 
          onClick={handleBack} 
          className="btn-ip-secondary"
          style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
        >
          Voltar
        </button>
        <button 
          onClick={handleNext} 
          className="btn-ip-primary"
        >
          {step === 3 ? 'Gerar Plano' : 'Avançar'}
        </button>
      </div>

    </div>
  );
};

export default IntelligentPlan;
