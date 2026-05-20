import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const GoalCard = () => {
  const { goals, streak, mealHistory, weeklyHabitsCount } = useContext(AppContext);

  const weightCurrent = parseFloat(goals.weightCurrent) || 75;
  const weightDesired = parseFloat(goals.weightDesired) || 68;
  const weightDiff = Math.abs(weightCurrent - weightDesired).toFixed(1);
  
  // Determina mensagem da jornada
  const getGoalStatusMessage = () => {
    if (weightCurrent === weightDesired) return "Você atingiu seu peso ideal!";
    if (weightCurrent > weightDesired) return `Faltam ${weightDiff} kg para alcançar seu objetivo.`;
    return `Faltam ${weightDiff} kg de ganho para sua meta.`;
  };

  return (
    <div className="evolution-card-container">
      <div className="evolution-card-glow" />
      <div className="evolution-header">
        <h3 className="evolution-title">Sua evolução</h3>
        <span className="evolution-badge">Jornada Ativa</span>
      </div>
      
      <div className="evolution-status-sentence">
        <span className="sentence-accent">{goals.mainGoal === 'gain_weight' ? 'Ganho inteligente' : 'Emagrecimento simples'}</span>: {getGoalStatusMessage()}
      </div>

      <div className="evolution-metrics-grid">
        {/* Métrica 1: Distância do Peso */}
        <div className="metric-item">
          <span className="metric-value">{weightDiff} <span className="metric-unit">kg</span></span>
          <span className="metric-label">Distância da Meta</span>
        </div>

        {/* Métrica 2: Streak Consistência */}
        <div className="metric-item">
          <span className="metric-value">{streak} <span className="metric-unit">dias</span></span>
          <span className="metric-label">Sequência Atual</span>
        </div>

        {/* Métrica 3: Refeições Escaneadas */}
        <div className="metric-item">
          <span className="metric-value">{mealHistory.length} <span className="metric-unit">pratos</span></span>
          <span className="metric-label">IA Analisados</span>
        </div>

        {/* Métrica 4: Hábitos Concluídos */}
        <div className="metric-item">
          <span className="metric-value">{weeklyHabitsCount} <span className="metric-unit">hábitos</span></span>
          <span className="metric-label">Foco Semanal</span>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
