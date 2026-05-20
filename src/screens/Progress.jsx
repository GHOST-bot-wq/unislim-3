import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Progress = () => {
  const { checkIns, streak, resetData, dailyPlan, adjustedGoals } = useContext(AppContext);

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
      title: 'Primeiro passo dado',
      desc: 'Você iniciou sua jornada de consistência diária e foco nos hábitos saudáveis.'
    });

    // Conquista 2: Streak de 3 dias
    if (streak >= 3) {
      achievements.push({
        id: 'streak-3',
        icon: '✨',
        title: 'Consistência ativa',
        desc: `Você realizou seu check-in diário por ${streak} dias seguidos. Continue assim!`
      });
    }

    // Conquista 3: Hidratação perfeita hoje
    if (dailyPlan.hydration >= adjustedGoals.hydrationGoal) {
      achievements.push({
        id: 'hydrate-perfect',
        icon: '💧',
        title: 'Meta de água concluída',
        desc: 'Você atingiu sua meta ideal de hidratação hoje, respeitando o volume ideal recomendado.'
      });
    }

    // Conquista 4: Caminhada concluída hoje
    if (dailyPlan.walkMinutes >= adjustedGoals.walkGoal) {
      achievements.push({
        id: 'walk-perfect',
        icon: '🚶',
        title: 'Meta de movimento concluída',
        desc: 'Você atingiu sua meta de minutos de caminhada de hoje.'
      });
    }

    return achievements;
  };

  const achievements = getAchievements();
  const themeColor = adjustedGoals?.toneColor || 'var(--color-primary)';

  return (
    <div className="screen-container animate-fade-in" style={{ '--theme-accent': themeColor }}>
      <header style={{ marginBottom: '24px', marginTop: '8px' }}>
        <h1>Seu Progresso</h1>
        <p style={{ marginTop: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Acompanhe sua consistência diária e evolução nos hábitos saudáveis.
        </p>
      </header>

      {/* Grade de Consistência dos Últimos 7 Dias */}
      <section className="progress-card animate-scale-up">
        <h3 className="section-title">Consistência de Check-ins</h3>
        <div className="weekly-grid">
          {last7Days.map((day, idx) => (
            <div key={idx} className={`grid-day-item ${day.isToday ? 'today' : ''}`}>
              <span className="grid-day-name">{day.name}</span>
              <div 
                className={`grid-day-bubble ${day.checked ? 'checked' : ''} ${day.isToday ? 'today-bubble' : ''}`}
                style={day.checked ? { backgroundColor: themeColor, borderColor: themeColor } : day.isToday ? { borderColor: themeColor, color: themeColor } : {}}
              >
                {day.checked ? (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" stroke="hsl(30, 8%, 15%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Jornada de Consistência */}
      <section className="progress-card animate-scale-up" style={{ marginTop: '16px' }}>
        <h3 className="section-title">Jornada de Consistência</h3>
        <div className="journey-timeline">
          <div className="timeline-labels">
            <span>Início</span>
            <span>Semana 4</span>
            <span>Semana 8</span>
            <span>Meta</span>
          </div>
          <div className="timeline-track" style={{ backgroundColor: `${themeColor}20` }}>
            <div className="timeline-fill" style={{ width: streak > 0 ? `${Math.min(streak * 3.5, 100)}%` : '5%', backgroundColor: themeColor }}></div>
            <div className="timeline-node active" style={{ backgroundColor: themeColor, borderColor: `${themeColor}40` }}></div>
            <div className={`timeline-node ${streak >= 28 ? 'active' : ''}`} style={{ left: '33%', backgroundColor: streak >= 28 ? themeColor : 'var(--bg-card)', borderColor: `${themeColor}40` }}></div>
            <div className={`timeline-node ${streak >= 56 ? 'active' : ''}`} style={{ left: '66%', backgroundColor: streak >= 56 ? themeColor : 'var(--bg-card)', borderColor: `${themeColor}40` }}></div>
            <div className="timeline-node" style={{ left: '98%', borderColor: `${themeColor}40` }}></div>
          </div>
          <p className="timeline-desc" style={{ marginTop: '12px' }}>
            {streak === 0 
              ? "Faça seu check-in diário para começar a registrar sua consistência na linha do tempo."
              : `Você manteve um ritmo de foco constante. Continue alimentando seu dia a dia!`
            }
          </p>
        </div>
      </section>

      {/* Pequenas Vitórias / Conquistas */}
      <section style={{ marginTop: '24px' }}>
        <h3 className="section-title" style={{ marginBottom: '12px' }}>Pequenas Vitórias</h3>
        <div className="achievements-list">
          {achievements.map((item, idx) => (
            <div key={idx} className="achievement-card animate-scale-up" style={{ borderLeft: `4px solid ${themeColor}` }}>
              <span className="achievement-icon-badge" style={{ backgroundColor: `${themeColor}10` }}>{item.icon}</span>
              <div className="achievement-details">
                <h4 className="achievement-card-title">{item.title}</h4>
                <p className="achievement-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botão de Reset Discreto */}
      <footer className="progress-footer text-center" style={{ marginTop: '36px', paddingBottom: '12px' }}>
        <button
          onClick={() => {
            if (window.confirm("Deseja reiniciar todos os seus registros de consistência? Esta ação não pode ser desfeita.")) {
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
