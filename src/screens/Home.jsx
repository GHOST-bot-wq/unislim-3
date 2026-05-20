import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import RadialProgress from '../components/RadialProgress';
import { getGreetingMessage, getDailyAestheticQuote } from '../utils/feedbackHelper';

const Home = () => {
  const { goals, dailyPlan, streak, hasDoneCheckInToday, setActiveTab } = useContext(AppContext);
  
  const greeting = getGreetingMessage(goals.name);
  const quote = getDailyAestheticQuote(streak);

  // Calcula a porcentagem com base nos hábitos cumpridos hoje
  const getDailyPercentage = () => {
    let score = 0;
    // Hidratação (meta: 8 copos)
    score += Math.min(dailyPlan.hydration / 8, 1) * 33.3;
    // Caminhada (meta: 30 minutos)
    score += Math.min(dailyPlan.walkMinutes / 30, 1) * 33.3;
    // Alimentação consciente (sim/não)
    score += dailyPlan.mindfulEating ? 33.4 : 0;
    
    return Math.round(score);
  };

  const percentage = getDailyPercentage();
  const checkInDone = hasDoneCheckInToday();

  return (
    <div className="screen-container animate-fade-in">
      {/* Cabeçalho Meditativo */}
      <header className="home-header">
        <h1 className="home-greeting">{greeting.title}</h1>
        <p className="home-subtitle">{greeting.subtitle}</p>
      </header>

      {/* Círculo Principal Dominante */}
      <div className="home-radial-wrapper">
        <RadialProgress percentage={percentage} streak={streak} />
      </div>

      {/* Frase Emocional */}
      <div className="home-quote-card animate-scale-up">
        <p className="quote-text">“{quote}”</p>
      </div>

      {/* Tarefa Principal do Dia */}
      <div className="home-task-card animate-scale-up">
        <div className="task-badge">FOCO DE HOJE</div>
        {!checkInDone ? (
          <>
            <h3 className="task-title">Check-in de Sintonia</h3>
            <p className="task-desc">Como você está se sentindo fisicamente e emocionalmente agora?</p>
            <button
              onClick={() => setActiveTab('checkin')}
              className="btn-premium interactive-hover btn-pulse"
              style={{ marginTop: '16px' }}
            >
              Fazer meu check-in
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <h3 className="task-title">Cuidado concluído</h3>
            <p className="task-desc">Você completou sua sintonia hoje. Continue registrando seus hábitos para nutrir seu corpo.</p>
            <button
              onClick={() => setActiveTab('plan')}
              className="btn-secondary interactive-hover"
              style={{ marginTop: '16px', borderColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}
            >
              Ver meus hábitos
            </button>
          </>
        )}
      </div>

      {/* Resumo Discreto de Metas */}
      <div className="home-goals-mini animate-scale-up">
        <div className="mini-goal-item">
          <span className="mini-goal-label">Início</span>
          <span className="mini-goal-val">{goals.weightCurrent} kg</span>
        </div>
        <div className="mini-goal-divider"></div>
        <div className="mini-goal-item">
          <span className="mini-goal-label">Objetivo</span>
          <span className="mini-goal-val">{goals.weightDesired} kg</span>
        </div>
        <div className="mini-goal-divider"></div>
        <div className="mini-goal-item">
          <span className="mini-goal-label">Consistência</span>
          <span className="mini-goal-val">{percentage}% hoje</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
