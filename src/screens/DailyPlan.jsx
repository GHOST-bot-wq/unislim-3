import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import HabitCard from '../components/HabitCard';
import { getHabitCompletionFeedback } from '../utils/feedbackHelper';

const DailyPlan = () => {
  const { dailyPlan, updateHydration, updateWalkMinutes, toggleMindfulEating } = useContext(AppContext);

  const feedbackText = getHabitCompletionFeedback(dailyPlan);

  return (
    <div className="screen-container animate-fade-in">
      <header style={{ marginBottom: '24px', marginTop: '8px' }}>
        <h1>Rotina de Cuidado</h1>
        <p style={{ marginTop: '4px' }}>Registre os pequenos gestos de atenção com você hoje.</p>
      </header>

      {/* Card de Hidratação */}
      <HabitCard
        type="hydration"
        title="Registro de Hidratação"
        subtitle="Mantenha suas células ativas e purificadas"
        value={dailyPlan.hydration}
        onChange={updateHydration}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
          </svg>
        }
      />

      {/* Card de Caminhada */}
      <HabitCard
        type="walk"
        title="Movimento Consciente"
        subtitle="Desperte sua energia com uma caminhada leve"
        value={dailyPlan.walkMinutes}
        onChange={updateWalkMinutes}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.8 20.2a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 0 1 1.4 1.4L16 16l2.8 2.8a1 1 0 0 1 0 1.4Z" />
            <path d="M3 22h10" />
            <path d="M9 18V6a3 3 0 0 1 6 0v2" />
            <circle cx="12" cy="3" r="1" />
          </svg>
        }
      />

      {/* Card de Alimentação Consciente */}
      <HabitCard
        type="eating"
        title="Alimentação Pausada"
        subtitle="Coma com calma, saboreando cada alimento sem telas"
        value={dailyPlan.mindfulEating}
        onChange={toggleMindfulEating}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      />

      {/* Feedback de Progresso Diário */}
      <div className="daily-feedback-box animate-scale-up">
        <span className="feedback-star-icon">🌱</span>
        <p className="feedback-msg-text">{feedbackText}</p>
      </div>
    </div>
  );
};

export default DailyPlan;
