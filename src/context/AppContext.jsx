import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Inicialização do Estado a partir do localStorage ou valores padrão
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('unislim_goals');
    return saved ? JSON.parse(saved) : {
      name: 'Você',
      weightCurrent: '75',
      weightDesired: '68',
      activityLevel: 'moderate',
      mainGoal: 'harmony',
      isSet: true
    };
  });

  const [dailyPlan, setDailyPlan] = useState(() => {
    const saved = localStorage.getItem('unislim_daily_plan');
    const today = new Date().toDateString();
    
    // Se mudou o dia, reinicia o plano diário
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        return parsed;
      }
    }
    
    return {
      date: today,
      hydration: 0, // copos de água (meta sugerida: 8)
      walkMinutes: 0, // minutos de caminhada (meta sugerida: 30)
      mindfulEating: false // comeu de forma consciente
    };
  });

  const [checkIns, setCheckIns] = useState(() => {
    const saved = localStorage.getItem('unislim_checkins');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('home');
  const [streak, setStreak] = useState(0);

  // Efeito para salvar metas no localStorage
  useEffect(() => {
    localStorage.setItem('unislim_goals', JSON.stringify(goals));
  }, [goals]);

  // Efeito para salvar o plano diário no localStorage
  useEffect(() => {
    localStorage.setItem('unislim_daily_plan', JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  // Efeito para salvar os check-ins e recalcular a consistência (streak)
  useEffect(() => {
    localStorage.setItem('unislim_checkins', JSON.stringify(checkIns));
    
    // Lógica refinada para calcular a consistência (dias consecutivos)
    if (checkIns.length === 0) {
      setStreak(0);
      return;
    }

    const sortedDates = [...new Set(checkIns.map(c => c.date))].sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let expectedDate = new Date();
    
    // Formata uma data para string local simples
    const formatDateStr = (date) => date.toDateString();
    
    const todayStr = formatDateStr(expectedDate);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateStr(yesterday);
    
    // Se o check-in mais recente não for hoje nem ontem, a sequência quebrou
    const mostRecentCheckIn = sortedDates[0];
    if (mostRecentCheckIn !== todayStr && mostRecentCheckIn !== yesterdayStr) {
      setStreak(0);
      return;
    }

    // Calcula os dias consecutivos voltando no tempo
    for (let i = 0; i < sortedDates.length; i++) {
      const checkInDate = new Date(sortedDates[i]);
      const diffTime = Math.abs(expectedDate - checkInDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Se a diferença for de 0 ou 1 dia do esperado, a consistência continua
      if (diffDays <= 1) {
        currentStreak++;
        expectedDate = checkInDate;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  }, [checkIns]);

  // Funções de manipulação do estado
  const saveGoals = (newGoals) => {
    setGoals({
      ...newGoals,
      isSet: true
    });
  };

  const updateHydration = (value) => {
    setDailyPlan(prev => ({
      ...prev,
      hydration: Math.max(0, Math.min(10, value)) // limite máximo de 10 copos
    }));
  };

  const updateWalkMinutes = (minutes) => {
    setDailyPlan(prev => ({
      ...prev,
      walkMinutes: Math.max(0, minutes)
    }));
  };

  const toggleMindfulEating = () => {
    setDailyPlan(prev => ({
      ...prev,
      mindfulEating: !prev.mindfulEating
    }));
  };

  const addCheckIn = (checkInData) => {
    const todayStr = new Date().toDateString();
    
    // Evita duplicar check-in no mesmo dia
    const existingIndex = checkIns.findIndex(c => c.date === todayStr);
    
    if (existingIndex > -1) {
      const updated = [...checkIns];
      updated[existingIndex] = {
        ...checkInData,
        date: todayStr
      };
      setCheckIns(updated);
    } else {
      setCheckIns(prev => [
        {
          ...checkInData,
          date: todayStr
        },
        ...prev
      ]);
    }
  };

  const hasDoneCheckInToday = () => {
    const todayStr = new Date().toDateString();
    return checkIns.some(c => c.date === todayStr);
  };

  const resetData = () => {
    localStorage.removeItem('unislim_goals');
    localStorage.removeItem('unislim_daily_plan');
    localStorage.removeItem('unislim_checkins');
    setGoals({
      name: 'Você',
      weightCurrent: '75',
      weightDesired: '68',
      activityLevel: 'moderate',
      mainGoal: 'harmony',
      isSet: true
    });
    setDailyPlan({
      date: new Date().toDateString(),
      hydration: 0,
      walkMinutes: 0,
      mindfulEating: false
    });
    setCheckIns([]);
    setStreak(0);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider value={{
      goals,
      dailyPlan,
      checkIns,
      activeTab,
      streak,
      saveGoals,
      updateHydration,
      updateWalkMinutes,
      toggleMindfulEating,
      addCheckIn,
      hasDoneCheckInToday,
      setActiveTab,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};
