import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { generateMealPlan, getCurrentMeal } from '../utils/mealPlanGenerator';
import ProfileModal from '../components/ProfileModal';
import '../styles/home.css';

const Home = () => {
  const { 
    goals, 
    dailyPlan, 
    streak, 
    setActiveTab, 
    adjustedGoals, 
    updateHydration, 
    updateWalkMinutes, 
    mealHistory,
    mealPlanState,
    todayCheckIn,
    profileImage,
    toggleMealCompleted
  } = useContext(AppContext);

  // Controle de visibilidade do modal de Perfil
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const todayStr = new Date().toDateString();

  // Soma de calorias escaneadas hoje
  const todayScanned = mealHistory.filter(m => new Date(m.date).toDateString() === todayStr);
  const scannedCalories = todayScanned.reduce((acc, m) => acc + m.calories, 0);

  const plan = generateMealPlan(todayCheckIn);
  const currentMeal = getCurrentMeal(plan.meals) || {};

  // Soma de calorias das refeições do plano concluídas hoje
  const completedMealIds = mealPlanState?.completed || [];
  const planCalories = plan.meals
    .filter(m => completedMealIds.includes(m.id))
    .reduce((acc, m) => acc + m.calories, 0);

  const totalConsumed = scannedCalories + planCalories;

  // Cálculo inteligente da meta calórica com base nos dados do usuário
  const getCalorieGoal = () => {
    const current = parseFloat(goals.weightCurrent) || 75;
    const activity = goals.activityLevel || 'moderado';
    
    let base = current * 22; 
    if (activity === 'ativo') base += 300;
    if (activity === 'moderado' || activity === 'moderate') base += 150;
    
    return Math.round(Math.max(1400, Math.min(2500, base)));
  };

  const calorieGoal = getCalorieGoal();

  // Frases de consistência premium diárias
  const MOTTOS = [
    "Seu corpo responde aos pequenos hábitos diários.",
    "Consistência silenciosa gera transformações duradouras.",
    "O emagrecimento inteligente é natural e sem esforço.",
    "Alimente seus objetivos hoje com escolhas simples.",
    "Pequenas vitórias diárias acumulam grandes resultados."
  ];
  const mottoIndex = new Date().getDate() % MOTTOS.length;
  const motto = MOTTOS[mottoIndex];

  // Saudação Dinâmica
  const getHeaderGreeting = () => {
    const hour = new Date().getHours();
    const userName = goals.name || 'Leonardo';
    
    if (hour >= 5 && hour < 12) return `Bom dia, ${userName}`;
    if (hour >= 12 && hour < 18) return `Boa tarde, ${userName}`;
    return `Boa noite, ${userName}`;
  };

  // Lógica da Única Ação e do Texto da Orb Central
  const getCentralAction = () => {
    const hydGoal = adjustedGoals?.hydrationGoal || 8;
    const wlkGoal = adjustedGoals?.walkGoal || 30;

    // 1. Prioridade: Se não escaneou nada ainda
    if (todayScanned.length === 0) {
      return {
        orbText: "Escanear Prato",
        ctaText: "📸 Escanear minha refeição",
        icon: "📸",
        action: () => setActiveTab('scanner')
      };
    }

    // 2. Prioridade: Hidratação pendente
    if (dailyPlan.hydration < hydGoal) {
      const diff = hydGoal - dailyPlan.hydration;
      return {
        orbText: "Beber Água",
        ctaText: `💧 Registrar 1 Copo de Água (${dailyPlan.hydration}/${hydGoal})`,
        icon: "💧",
        action: () => updateHydration(dailyPlan.hydration + 1)
      };
    }

    // 3. Prioridade: Caminhada pendente
    if (dailyPlan.walkMinutes < wlkGoal) {
      const diff = wlkGoal - dailyPlan.walkMinutes;
      return {
        orbText: "Caminhada Leve",
        ctaText: `🚶 Registrar +5 min de Caminhada (${dailyPlan.walkMinutes}/${wlkGoal} min)`,
        icon: "🚶",
        action: () => updateWalkMinutes(dailyPlan.walkMinutes + 5)
      };
    }

    // 4. Todas as metas diárias concluídas
    return {
      orbText: "Metas Batidas",
      ctaText: "Ver plano completo da dieta 🌿",
      icon: "✨",
      action: () => setActiveTab('dietplan')
    };
  };

  const currentAction = getCentralAction();

  return (
    <div className="screen-container home-container">
      {/* 1. EFEITOS DE BRILHO AMBIENTE NO FUNDO */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-glow-orb primary" />
        <div className="ambient-glow-orb accent" />
      </div>

      {/* 2. HEADER PREMIUM */}
      <header className="home-minimal-header">
        <div>
          <h1 className="greeting-title">{getHeaderGreeting()}</h1>
          <p className="greeting-subtitle">{motto}</p>
        </div>
        <button 
          className="home-profile-avatar-btn"
          onClick={() => setActiveTab('profile')}
          title="Ver Perfil e Temas"
        >
          {profileImage ? (
            <img src={profileImage} alt="" className="home-avatar-image-cropped" loading="lazy" />
          ) : (
            <span className="home-avatar-letter">{(goals.name || 'L').charAt(0).toUpperCase()}</span>
          )}
        </button>
      </header>

      {/* 3. ORB CENTRAL FLUIDO */}
      <section className="home-orb-section">
        <div className="home-fluid-orb" onClick={currentAction.action}>
          <span className="orb-emoji">{currentAction.icon}</span>
          <span className="orb-label">Próximo Passo</span>
          <span className="orb-title">{currentAction.orbText}</span>
        </div>
      </section>

      {/* 4. CONTADOR DE CALORIAS FUNCIONAL COM CONTABILIZADOR DE REFEIÇÕES */}
      <section className="home-cta-action-row" style={{ display: 'block', width: '100%' }}>
        <div className="home-calorie-counter-pill">
          <div className="counter-row">
            <span className="counter-consumed">
              <strong>{totalConsumed}</strong> / {calorieGoal} kcal
            </span>
            <span className="counter-remaining">
              {calorieGoal - totalConsumed > 0 
                ? `${calorieGoal - totalConsumed} kcal restam` 
                : 'Meta atingida! ✓'}
            </span>
          </div>
          
          <div className="counter-progress-bar">
            <div 
              className="counter-progress-fill" 
              style={{ width: `${Math.min(100, (totalConsumed / calorieGoal) * 100)}%` }} 
            />
          </div>

          <div className="counter-meals-row">
            <div className="meals-stats">
              <span className="meals-icon">🍽️</span>
              <span className="meals-label">Refeições Feitas</span>
            </div>
            <span className="meals-count">
              <strong>{completedMealIds.length}</strong> de {plan.meals.length}
            </span>
          </div>

          <div className="meals-progress-dots">
            {plan.meals.map((meal) => {
              const isCompleted = completedMealIds.includes(meal.id);
              return (
                <div 
                  key={meal.id} 
                  className={`meal-dot-indicator ${isCompleted ? 'completed' : ''}`}
                  title={`${meal.name}: ${isCompleted ? 'Feita' : 'Pendente'}`}
                  onClick={() => toggleMealCompleted(meal.id)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HISTÓRICO DE REFEIÇÕES DE HOJE / EMPTY STATE SCANNER */}
      <section className="home-meals-history-section">
        <div className="section-header-row">
          <h2 className="section-title">Refeições de Hoje</h2>
          {todayScanned.length > 0 && (
            <span className="section-subtitle">{todayScanned.length} registradas</span>
          )}
        </div>

        {todayScanned.length > 0 ? (
          <div className="home-meals-carousel">
            {todayScanned.map((meal) => {
              const mealTime = meal.date 
                ? new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
                : '--:--';

              return (
                <div 
                  key={meal.id} 
                  className="home-meal-history-card"
                  style={meal.image ? { backgroundImage: `url(${meal.image})` } : {}}
                >
                  <div className="meal-card-overlay" />
                  <div className="meal-card-content">
                    <div className="meal-card-top">
                      <span className="meal-card-time">{mealTime}</span>
                      <span className="meal-card-emoji">{meal.emoji || '🍽️'}</span>
                    </div>
                    <div className="meal-card-middle">
                      <h4 className="meal-card-name">{meal.name}</h4>
                      <span className="meal-card-calories"><strong>{meal.calories}</strong> kcal</span>
                    </div>
                    <div className="meal-card-bottom">
                      <div className="macro-badge protein" title="Proteínas">P: {Math.round(meal.protein || 0)}g</div>
                      <div className="macro-badge carbs" title="Carboidratos">C: {Math.round(meal.carbs || 0)}g</div>
                      <div className="macro-badge fat" title="Gorduras">G: {Math.round(meal.fat || 0)}g</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="home-meals-empty-card" onClick={() => setActiveTab('scanner')}>
            <div className="empty-card-glow" />
            <div className="empty-card-body">
              <span className="empty-card-icon">📸</span>
              <div className="empty-card-text">
                <h3 className="empty-card-title">Nenhuma refeição registrada hoje</h3>
                <p className="empty-card-desc">Tire foto do seu prato para calcular calorias e macros automaticamente.</p>
              </div>
              <button className="empty-card-btn">Registrar Agora</button>
            </div>
          </div>
        )}
      </section>


      {/* 6. MINI DIET PREVIEW INTERATIVO (CRONOGRAMA ALIMENTAR) */}
      <section className="home-diet-editorial-card">
        <div className="editorial-title-row">
          <h2 className="editorial-title">Cronograma Alimentar</h2>
          <span className="editorial-subtitle">Hoje</span>
        </div>
        <div className="home-diet-editorial-list">
          {plan.meals.map((meal) => {
            const isCompleted = completedMealIds.includes(meal.id);
            const isActive = currentMeal && currentMeal.id === meal.id;
            
            // Cálculo dinâmico de macros estimadas
            const prot = Math.round(meal.calories * 0.25 / 4);
            const carb = Math.round(meal.calories * 0.45 / 4);
            const fat = Math.round(meal.calories * 0.30 / 9);

            return (
              <div 
                key={meal.id} 
                className={`home-diet-editorial-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active-meal' : ''}`}
                onClick={() => toggleMealCompleted(meal.id)}
              >
                {isActive && <div className="active-meal-pulse-glow" />}
                <div className="meal-left-col">
                  <div className={`meal-checkbox ${isCompleted ? 'checked' : ''}`}>
                    {isCompleted && "✓"}
                  </div>
                  <div className="meal-emoji-wrapper">
                    {meal.emoji}
                  </div>
                  <div className="meal-details">
                    <div className="meal-meta-header">
                      <span className="meal-period">{meal.period}</span>
                      <span className="meal-time-tag">⏰ {meal.time}</span>
                      {isActive && <span className="active-badge">AGORA</span>}
                    </div>
                    <span className="meal-name">{meal.name}</span>
                    <div className="meal-macros-row">
                      <span className="meal-macro protein">🍗 {prot}g</span>
                      <span className="meal-macro carbs">🌾 {carb}g</span>
                      <span className="meal-macro fat">🥑 {fat}g</span>
                    </div>
                  </div>
                </div>
                <div className="meal-right-col">
                  <span className="meal-calories-badge">{meal.calories} kcal</span>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn-editorial-more" onClick={() => setActiveTab('dietplan')}>
          Ver plano completo →
        </button>
      </section>

      {/* 7. MODAL DE CONFIGURAÇÕES DE PERFIL E TEMAS */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};

export default Home;
