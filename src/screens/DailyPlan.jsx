import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/dailyPlan.css';

const DailyPlan = () => {
  const { 
    dailyPlan, 
    updateHydration, 
    updateWalkMinutes, 
    toggleMindfulEating, 
    toggleMentalPause,
    adjustedGoals, 
    setActiveTab 
  } = useContext(AppContext);

  const [showCelebration, setShowCelebration] = useState(false);

  // Calcula a quantidade de hábitos concluídos
  const getCompletedHabitsCount = () => {
    let count = 0;
    if (dailyPlan.hydration >= adjustedGoals.hydrationGoal) count++;
    if (dailyPlan.walkMinutes >= adjustedGoals.walkGoal) count++;
    if (dailyPlan.mindfulEating) count++;
    if (dailyPlan.mentalPause) count++;
    return count;
  };

  const completedCount = getCompletedHabitsCount();
  const totalHabits = 4;
  const progressPercent = Math.round((completedCount / totalHabits) * 100);

  // Mensagem Inteligente baseada no progresso
  const getIncentiveMessage = () => {
    if (completedCount === 0) {
      return "Começar pequeno ainda é começar.";
    }
    if (completedCount === 1) {
      return "Excelente começo. Uma pequena ação concluída já gera progresso.";
    }
    if (completedCount === 2 || completedCount === 3) {
      return "Você está criando consistência.";
    }
    if (completedCount === 4) {
      return "Excelente. Seu corpo sente cada pequena escolha.";
    }
    return "Mantenha o foco em suas pequenas escolhas de hoje.";
  };

  // Disparador de confetes cenográficos no overlay de celebração
  const renderConfetti = () => {
    const confettiColors = ['#7B61FF', '#54B489', '#FFD166', '#F25F5C', '#118AB2'];
    return Array.from({ length: 25 }).map((_, idx) => {
      const randomColor = confettiColors[idx % confettiColors.length];
      const randomLeft = Math.random() * 100;
      const randomDelay = Math.random() * 2;
      return (
        <div 
          key={idx} 
          className="confetti" 
          style={{ 
            left: `${randomLeft}%`, 
            animationDelay: `${randomDelay}s`,
            backgroundColor: randomColor
          }}
        />
      );
    });
  };

  const handleFinalizeDay = () => {
    setShowCelebration(true);
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setActiveTab('progress'); // Redireciona de forma inteligente para ver a jornada de dias seguidos (Streak)
  };

  return (
    <div className="screen-container animate-fade-in daily-plan-container" style={{ '--theme-accent': adjustedGoals.toneColor }}>
      
      {/* 1. HEADER EMOCIONAL */}
      <header className="daily-plan-header">
        <h1>Seu plano de hoje</h1>
        <p>Pequenas ações feitas com consistência mudam tudo.</p>
      </header>

      {/* 2. CARD DE PROGRESSO */}
      <div className="progress-status-card animate-scale-up">
        <div className="progress-status-info">
          <span className="progress-status-title">
            {completedCount} de {totalHabits} hábitos concluídos
          </span>
          <span className="progress-status-percentage">{progressPercent}%</span>
        </div>
        <div className="premium-progress-track">
          <div 
            className="premium-progress-fill" 
            style={{ 
              width: `${progressPercent}%`, 
              backgroundColor: adjustedGoals.toneColor 
            }}
          ></div>
        </div>
      </div>

      {/* 3. LISTA DE HÁBITOS DO DIA */}
      <div className="habits-scroll-list">

        {/* Hábito 1: Hidratação */}
        <div className={`plan-habit-item animate-scale-up ${dailyPlan.hydration >= adjustedGoals.hydrationGoal ? 'completed' : ''}`}>
          <div className="plan-habit-header">
            <div className="plan-habit-icon-box" style={{ color: adjustedGoals.toneColor, backgroundColor: `${adjustedGoals.toneColor}12` }}>💧</div>
            <div className="plan-habit-meta">
              <h3 className="plan-habit-name">Hidratação</h3>
              <p className="plan-habit-desc">Seu corpo funciona melhor quando está hidratado. (Meta: {adjustedGoals.hydrationGoal} copos)</p>
            </div>
          </div>
          <div className="plan-habit-action-area">
            <div className="hydration-bubbles-row">
              {Array.from({ length: adjustedGoals.hydrationGoal }).map((_, idx) => {
                const isActive = idx < dailyPlan.hydration;
                return (
                  <button
                    key={idx}
                    onClick={() => updateHydration(idx + 1)}
                    className={`hydration-bubble ${isActive ? 'active' : ''}`}
                    style={isActive ? { backgroundColor: adjustedGoals.toneColor, borderColor: adjustedGoals.toneColor } : {}}
                    aria-label={`Registrar ${idx + 1} copos`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
              {dailyPlan.hydration > 0 && (
                <button 
                  onClick={() => updateHydration(dailyPlan.hydration - 1)}
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    color: 'var(--text-tertiary)', 
                    fontSize: '11px', 
                    cursor: 'pointer',
                    marginLeft: '4px',
                    textDecoration: 'underline'
                  }}
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hábito 2: Movimento */}
        <div className={`plan-habit-item animate-scale-up ${dailyPlan.walkMinutes >= adjustedGoals.walkGoal ? 'completed' : ''}`}>
          <div className="plan-habit-header">
            <div className="plan-habit-icon-box" style={{ color: adjustedGoals.toneColor, backgroundColor: `${adjustedGoals.toneColor}12` }}>🚶</div>
            <div className="plan-habit-meta">
              <h3 className="plan-habit-name">Movimente seu corpo</h3>
              <p className="plan-habit-desc">Até alguns minutos de caminhada já fazem diferença. (Meta: {adjustedGoals.walkLabel})</p>
            </div>
          </div>
          <div className="plan-habit-action-area">
            <div className="movement-stepper">
              <span className="movement-display-value">
                {dailyPlan.walkMinutes} min / {adjustedGoals.walkGoal} min
              </span>
              <div className="movement-btn-group">
                <button 
                  onClick={() => updateWalkMinutes(Math.max(0, dailyPlan.walkMinutes - 5))} 
                  className="stepper-action-btn"
                  aria-label="Remover 5 minutos de caminhada"
                >
                  —
                </button>
                <button 
                  onClick={() => updateWalkMinutes(dailyPlan.walkMinutes + 5)} 
                  className="stepper-action-btn"
                  aria-label="Adicionar 5 minutos de caminhada"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hábito 3: Alimentação Consciente */}
        <div className={`plan-habit-item animate-scale-up ${dailyPlan.mindfulEating ? 'completed' : ''}`}>
          <div className="plan-habit-header">
            <div className="plan-habit-icon-box" style={{ color: adjustedGoals.toneColor, backgroundColor: `${adjustedGoals.toneColor}12` }}>🌿</div>
            <div className="plan-habit-meta">
              <h3 className="plan-habit-name">Comer com presença</h3>
              <p className="plan-habit-desc">Tente fazer ao menos uma refeição sem distrações ou celular na mesa.</p>
            </div>
          </div>
          <div className="plan-habit-action-area">
            <div className="presence-toggle-wrapper" onClick={toggleMindfulEating}>
              <span className="presence-status-text">
                {dailyPlan.mindfulEating ? 'Almoço/jantar sem telas registrado ✓' : 'Ainda não praticado hoje'}
              </span>
              <div className={`toggle-switch-premium ${dailyPlan.mindfulEating ? 'active' : ''}`} style={dailyPlan.mindfulEating ? { backgroundColor: adjustedGoals.toneColor, borderColor: adjustedGoals.toneColor } : {}}>
                <div className="toggle-switch-handle"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hábito 4: Pausa Mental */}
        <div className={`plan-habit-item animate-scale-up ${dailyPlan.mentalPause ? 'completed' : ''}`}>
          <div className="plan-habit-header">
            <div className="plan-habit-icon-box" style={{ color: adjustedGoals.toneColor, backgroundColor: `${adjustedGoals.toneColor}12` }}>🧘</div>
            <div className="plan-habit-meta">
              <h3 className="plan-habit-name">Respire por um momento</h3>
              <p className="plan-habit-desc">Seu emocional também faz parte da transformação. Faça 3 respirações lentas.</p>
            </div>
          </div>
          <div className="plan-habit-action-area">
            <div className="mental-pause-wrapper">
              <span className="presence-status-text">
                {dailyPlan.mentalPause ? 'Foco mental e respiratório em dia ✓' : 'Respire fundo e marque abaixo'}
              </span>
              <button 
                onClick={toggleMentalPause}
                className={`btn-mental-pause-action ${dailyPlan.mentalPause ? 'completed' : ''}`}
                style={dailyPlan.mentalPause ? { backgroundColor: adjustedGoals.toneColor, borderColor: adjustedGoals.toneColor } : {}}
              >
                {dailyPlan.mentalPause ? 'Concluído ✓' : 'Marcar como feito'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4. MENSAGEM INTELIGENTE */}
      <div className="plan-incentive-box animate-scale-up">
        <p className="plan-incentive-text">
          “{getIncentiveMessage()}”
        </p>
      </div>

      {/* 5. CTA FINAL FIXO NO RODAPÉ */}
      <div className="fixed-cta-footer">
        <button 
          onClick={handleFinalizeDay}
          className="btn-finalize-day animate-pulse-slight"
          style={{ backgroundColor: adjustedGoals.toneColor }}
        >
          Finalizar meu dia
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(30, 8%, 15%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

      {/* OVERLAY CELEBRATIVO DE FINALIZAÇÃO */}
      {showCelebration && (
        <div className="finalize-celebration-overlay animate-fade-in">
          {renderConfetti()}
          <div className="celebration-check-icon" style={{ backgroundColor: adjustedGoals.toneColor }}>🏆</div>
          <h2 className="celebration-title">Dia Concluído!</h2>
          <p className="celebration-desc">
            Você fortaleceu seu corpo e sua mente mantendo suas metas de consistência hoje.
          </p>
          <button 
            onClick={handleCloseCelebration}
            className="btn-celebration-done"
            style={{ backgroundColor: adjustedGoals.toneColor }}
          >
            Ver progresso geral
          </button>
        </div>
      )}

    </div>
  );
};

export default DailyPlan;
