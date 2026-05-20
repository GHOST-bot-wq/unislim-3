import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { generateMealPlan, getCurrentMeal } from '../utils/mealPlanGenerator';
import '../styles/dietPlan.css';

/**
 * DietPlanCard — Card compacto que aparece na Home.
 * Mostra a refeição atual e o progresso geral do plano do dia.
 */
const DietPlanCard = () => {
  const { todayCheckIn, mealPlanState, setActiveTab } = useContext(AppContext);

  const plan = generateMealPlan(todayCheckIn);
  const currentMeal = getCurrentMeal(plan.meals);
  const completedCount = mealPlanState?.completed?.length || 0;
  const totalMeals = plan.meals.length;
  const progressPct = Math.round((completedCount / totalMeals) * 100);

  return (
    <div
      className="diet-plan-card animate-scale-up"
      onClick={() => setActiveTab('dietplan')}
      role="button"
      aria-label="Ver plano alimentar completo"
    >
      {/* Header */}
      <div className="dpc-header">
        <div className="dpc-title-group">
          <div className="dpc-badge">
            🌿 {plan.label}
          </div>
          <p className="dpc-title">Plano alimentar de hoje</p>
        </div>
        <div className="dpc-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      {/* Refeição em destaque */}
      {currentMeal && (
        <div className="dpc-current-meal">
          <div className="dpc-meal-emoji">{currentMeal.emoji}</div>
          <div className="dpc-meal-info">
            <p className="dpc-meal-period">{currentMeal.period}</p>
            <p className="dpc-meal-name">{currentMeal.name}</p>
            <p className="dpc-meal-calories">≈ {currentMeal.calories} kcal</p>
          </div>
        </div>
      )}

      {/* Progresso das refeições */}
      <div className="dpc-progress-row">
        <span className="dpc-progress-label">Refeições concluídas</span>
        <span className="dpc-progress-count">{completedCount} de {totalMeals}</span>
      </div>
      <div className="dpc-progress-track">
        <div className="dpc-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
};

export default DietPlanCard;
