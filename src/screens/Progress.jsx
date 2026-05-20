import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Progress = () => {
  const { checkIns, streak, resetData, dailyPlan } = useContext(AppContext);

  // Gera os últimos 7 dias da semana com nomes simplificados
  const getLast7Days = () => {
    const days = [];
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const hasCheckedIn = checkIns.some(c => c.date === dateStr);
      
      days.push({
        name: weekdays[d.getDay()],
        dayNum: d.getDate(),
        dateStr,
        checked: hasCheckedIn,
        isToday: d.toDateString() === new Date().toDateString()
      });
    }
    
    return days;
  };

  const last7Days = getLast7Days();

  // Mapeia quais conquistas/pequenas vitórias foram alcançadas
  const getAchievements = () => {
    const achievements = [];

    // Conquista 1: Começou
    achievements.push({
      id: 'started',
      icon: '🌱',
      title: 'Ponto de partida traçado',
      desc: 'Você definiu suas metas e deu o primeiro passo na sua reeducação mental e física.'
    });

    // Conquista 2: Streak de 3 dias
    if (streak >= 3) {
      achievements.push({
        id: 'streak-3',
        icon: '✨',
        title: 'Consistência viva',
        desc: `Você realizou sua sintonia emocional por ${streak} dias seguidos. Seu ritmo está se alinhando!`
      });
    }

    // Conquista 3: Hidratação perfeita hoje
    if (dailyPlan.hydration >= 8) {
      achievements.push({
        id: 'hydrate-perfect',
        icon: '💧',
        title: 'Corpo fluindo',
        desc: 'Você atingiu sua meta ideal de hidratação hoje, dando vida e movimento para seu metabolismo.'
      });
    }

    // Conquista 4: Caminhada concluída hoje
    if (dailyPlan.walkMinutes >= 30) {
      achievements.push({
        id: 'walk-perfect',
        icon: '🚶',
        title: 'Movimento contínuo',
        desc: 'Sua caminhada consciente hoje ativou sua clareza mental e oxigenou o corpo.'
      });
    }

    return achievements;
  };

  const achievements = getAchievements();

  return (
    <div className="screen-container animate-fade-in">
      <header style={{ marginBottom: '24px', marginTop: '8px' }}>
        <h1>Sua Evolução</h1>
        <p style={{ marginTop: '4px' }}>Acompanhe o ritmo de carinho e consistência da sua jornada.</p>
      </header>

      {/* Grade de Consistência dos Últimos 7 Dias */}
      <section className="progress-card animate-scale-up">
        <h3 className="section-title">Últimos 7 dias</h3>
        <div className="weekly-grid">
          {last7Days.map((day, idx) => (
            <div key={idx} className={`grid-day-item ${day.isToday ? 'today' : ''}`}>
              <span className="grid-day-name">{day.name}</span>
              <div className={`grid-day-bubble ${day.checked ? 'checked' : ''} ${day.isToday ? 'today-bubble' : ''}`}>
                {day.checked ? (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4.5 4 7.5 11 1" />
                  </svg>
                ) : (
                  <span>{day.dayNum}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Jornada Estimada */}
      <section className="progress-card animate-scale-up" style={{ marginTop: '16px' }}>
        <h3 className="section-title">Jornada Estimada</h3>
        <div className="journey-timeline">
          <div className="timeline-labels">
            <span>Início</span>
            <span>Semana 4</span>
            <span>Semana 8</span>
            <span>Metas</span>
          </div>
          <div className="timeline-track">
            <div className="timeline-fill" style={{ width: streak > 0 ? `${Math.min(streak * 3.5, 100)}%` : '5%' }}></div>
            <div className="timeline-node active"></div>
            <div className={`timeline-node ${streak >= 28 ? 'active' : ''}`} style={{ left: '33%' }}></div>
            <div className={`timeline-node ${streak >= 56 ? 'active' : ''}`} style={{ left: '66%' }}></div>
            <div className="timeline-node" style={{ left: '98%' }}></div>
          </div>
          <p className="timeline-desc" style={{ marginTop: '12px' }}>
            {streak === 0 
              ? "Faça seu check-in diário para começar a trilhar sua linha do tempo de bem-estar."
              : `Você está na trilha de autocuidado. Continue alimentando seu dia a dia!`
            }
          </p>
        </div>
      </section>

      {/* Pequenas Vitórias / Conquistas */}
      <section style={{ marginTop: '24px' }}>
        <h3 className="section-title" style={{ marginBottom: '12px' }}>Pequenas Vitórias</h3>
        <div className="achievements-list">
          {achievements.map((item, idx) => (
            <div key={idx} className="achievement-card animate-scale-up">
              <span className="achievement-icon-badge">{item.icon}</span>
              <div className="achievement-details">
                <h4 className="achievement-card-title">{item.title}</h4>
                <p className="achievement-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botão de Reset Discreto no final */}
      <footer className="progress-footer text-center" style={{ marginTop: '36px', paddingBottom: '12px' }}>
        <button
          onClick={() => {
            if (window.confirm("Deseja reiniciar todas as suas metas e registros? Esta ação não pode ser desfeita.")) {
              resetData();
            }
          }}
          className="btn-reset-discreet"
        >
          Reiniciar meus registros
        </button>
      </footer>
    </div>
  );
};

export default Progress;
