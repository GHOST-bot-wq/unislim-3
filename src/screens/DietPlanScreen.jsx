import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {
  generateMealPlan,
  getTotalCalories
} from '../utils/mealPlanGenerator';
import '../styles/dietPlan.css';

const DietPlanScreen = () => {
  const {
    todayCheckIn,
    mealPlanState,
    toggleMealCompleted,
    mealHistory,
    setActiveTab
  } = useContext(AppContext);

  const plan = generateMealPlan(todayCheckIn);
  const totalCals = getTotalCalories(plan.meals);
  const completed = mealPlanState?.completed || [];
  const completedCount = completed.length;

  // Última refeição escaneada hoje
  const today = new Date().toDateString();
  const lastScannedToday = mealHistory.find(m => {
    const d = new Date(m.date).toDateString();
    return d === today;
  });

  return (
    <div className="screen-container diet-screen-container animate-fade-in">

      {/* Header com botão Voltar */}
      <header className="diet-screen-header">
        <button
          className="diet-screen-back-btn"
          onClick={() => setActiveTab('home')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar
        </button>
        <div className="diet-screen-plan-badge">
          🌿 {plan.label}
        </div>
        <h1 className="diet-screen-title">Plano alimentar<br />de hoje</h1>
        <p className="diet-screen-subtitle">{plan.insight}</p>
      </header>

      {/* Card de insight da IA */}
      <div className="diet-ai-insight-card">
        <span className="diet-ai-icon">🧠</span>
        <div className="diet-ai-text-group">
          <p className="diet-ai-label">Análise de IA</p>
          <p className="diet-ai-message">{plan.aiMessage}</p>
        </div>
      </div>

      {/* Resumo de calorias do dia */}
      <div className="diet-calories-summary">
        <div className="diet-cal-total">
          <span className="diet-cal-total-label">Estimativa total</span>
          <span className="diet-cal-total-value">{totalCals}</span>
          <span className="diet-cal-total-unit">kcal no plano de hoje</span>
        </div>
        <div className="diet-cal-progress-mini">
          <span className="diet-cal-progress-text">{completedCount}/{plan.meals.length} refeições</span>
          <div className="diet-mini-dots">
            {plan.meals.map(m => (
              <div
                key={m.id}
                className={`diet-mini-dot ${completed.includes(m.id) ? 'done' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lista de refeições do dia */}
      <div className="diet-meal-list">
        {plan.meals.map(meal => {
          const isDone = completed.includes(meal.id);
          return (
            <div
              key={meal.id}
              className={`diet-meal-card ${isDone ? 'completed' : ''}`}
            >
              {/* Topo do card */}
              <div className="diet-meal-card-top">
                <div className="diet-meal-period-badge">
                  <div className="diet-meal-emoji-circle">{meal.emoji}</div>
                  <div className="diet-meal-period-info">
                    <p className="diet-meal-period-name">{meal.period}</p>
                    <p className="diet-meal-time">{meal.time}</p>
                  </div>
                </div>
                {/* Botão de check/marcar como feito */}
                <button
                  className={`diet-meal-check-btn ${isDone ? 'checked' : ''}`}
                  onClick={() => toggleMealCompleted(meal.id)}
                  aria-label={isDone ? `Desmarcar ${meal.period}` : `Marcar ${meal.period} como feito`}
                >
                  {isDone && (
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="hsl(30, 8%, 15%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 5.5 5 9.5 13 1.5" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Corpo do card */}
              <div className="diet-meal-card-body">
                <h3 className="diet-meal-name">{meal.name}</h3>
                <p className="diet-meal-description">{meal.description}</p>
                <div className="diet-meal-meta-row">
                  <span className="diet-meal-calories-pill">≈ {meal.calories} kcal</span>
                </div>
                <div className="diet-meal-justification">
                  <span className="diet-meal-justification-icon">💡</span>
                  <p className="diet-meal-justification-text">{meal.justification}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integração com o Scanner */}
      <div style={{ marginTop: '24px' }}>
        {lastScannedToday && (
          <div className="diet-scanned-meal-card">
            {lastScannedToday.imageData ? (
              <img
                src={lastScannedToday.imageData}
                alt={lastScannedToday.name}
                className="diet-scanned-thumb"
                loading="lazy"
              />
            ) : (
              <div className="diet-scanned-thumb-placeholder">
                {lastScannedToday.emoji}
              </div>
            )}
            <div className="diet-scanned-info">
              <p className="diet-scanned-label">Escaneada hoje</p>
              <p className="diet-scanned-name">{lastScannedToday.name}</p>
            </div>
            <span className="diet-scanned-cal">{lastScannedToday.calories} kcal</span>
          </div>
        )}

        <div
          className="diet-scanner-link-card"
          onClick={() => setActiveTab('scanner')}
          role="button"
        >
          <div className="diet-scanner-link-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(30,8%,15%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <div className="diet-scanner-link-info">
            <p className="diet-scanner-link-title">Escanear uma refeição</p>
            <p className="diet-scanner-link-sub">A IA identifica e registra os nutrientes automaticamente.</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

    </div>
  );
};

export default DietPlanScreen;
