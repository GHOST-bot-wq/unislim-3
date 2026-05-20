import React, { createContext, useState, useEffect } from 'react';
import { getAdjustedGoals } from '../utils/feedbackHelper';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Inicialização do Estado a partir do localStorage ou valores padrão
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('unislim_goals');
    return saved ? JSON.parse(saved) : {
      name: 'Leonardo',
      weightCurrent: '75',
      weightDesired: '68',
      activityLevel: 'moderate',
      mainGoal: 'lose_weight',
      theme: 'calm',
      avatar: '✨',
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
      hydration: 0, 
      walkMinutes: 0, 
      mindfulEating: false,
      mentalPause: false // Renomeado de sleepOffTelas para mentalPause
    };
  });

  const [checkIns, setCheckIns] = useState(() => {
    const saved = localStorage.getItem('unislim_checkins');
    return saved ? JSON.parse(saved) : [];
  });

  const [mealHistory, setMealHistory] = useState(() => {
    const saved = localStorage.getItem('unislim_meals');
    return saved ? JSON.parse(saved) : [];
  });

  // Estado do plano alimentar — reseta todo dia
  const [mealPlanState, setMealPlanState] = useState(() => {
    const saved = localStorage.getItem('unislim_meal_plan_state');
    const today = new Date().toDateString();
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) return parsed;
    }
    return { date: today, completed: [] };
  });

  const [activeTab, setActiveTab] = useState('home');
  const [streak, setStreak] = useState(0);

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || '';
  });

  // Efeito para salvar a foto de perfil no localStorage
  useEffect(() => {
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    } else {
      localStorage.removeItem('profileImage');
    }
  }, [profileImage]);

  // Efeito para salvar metas no localStorage
  useEffect(() => {
    localStorage.setItem('unislim_goals', JSON.stringify(goals));
  }, [goals]);

  // Efeito para salvar o plano diário no localStorage
  useEffect(() => {
    localStorage.setItem('unislim_daily_plan', JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  // Efeito para salvar o plano alimentar no localStorage
  useEffect(() => {
    localStorage.setItem('unislim_meal_plan_state', JSON.stringify(mealPlanState));
  }, [mealPlanState]);

  // Efeito para salvar refeições no localStorage
  useEffect(() => {
    localStorage.setItem('unislim_meals', JSON.stringify(mealHistory));
  }, [mealHistory]);

  // Efeito para salvar os check-ins e recalcular a consistência (streak)
  useEffect(() => {
    localStorage.setItem('unislim_checkins', JSON.stringify(checkIns));
    
    if (checkIns.length === 0) {
      setStreak(0);
      return;
    }

    const sortedDates = [...new Set(checkIns.map(c => c.date))].sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let expectedDate = new Date();
    
    const formatDateStr = (date) => date.toDateString();
    
    const todayStr = formatDateStr(expectedDate);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateStr(yesterday);
    
    const mostRecentCheckIn = sortedDates[0];
    if (mostRecentCheckIn !== todayStr && mostRecentCheckIn !== yesterdayStr) {
      setStreak(0);
      return;
    }

    for (let i = 0; i < sortedDates.length; i++) {
      const checkInDate = new Date(sortedDates[i]);
      const diffTime = Math.abs(expectedDate - checkInDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
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

  // Dados computados com base no check-in de hoje
  const todayStr = new Date().toDateString();
  const todayCheckIn = checkIns.find(c => c.date === todayStr);
  const adjustedGoals = getAdjustedGoals(todayCheckIn);

  // Progresso diário baseado em 4 hábitos de 25% cada
  const getDailyPercentage = () => {
    let score = 0;
    score += Math.min(dailyPlan.hydration / adjustedGoals.hydrationGoal, 1) * 25;
    score += Math.min(dailyPlan.walkMinutes / adjustedGoals.walkGoal, 1) * 25;
    score += dailyPlan.mindfulEating ? 25 : 0;
    score += dailyPlan.mentalPause ? 25 : 0; // mentalPause
    return Math.round(score);
  };
  
  const dailyPercentage = getDailyPercentage();

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
      hydration: Math.max(0, Math.min(10, value))
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

  const toggleMentalPause = () => {
    setDailyPlan(prev => ({
      ...prev,
      mentalPause: !prev.mentalPause // mentalPause
    }));
  };

  const addCheckIn = (checkInData) => {
    const todayStr = new Date().toDateString();
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

  const toggleMealCompleted = (mealId) => {
    setMealPlanState(prev => {
      const completed = prev.completed.includes(mealId)
        ? prev.completed.filter(id => id !== mealId)
        : [...prev.completed, mealId];
      return { ...prev, completed };
    });
  };

  const addMeal = (mealData) => {
    setMealHistory(prev => [mealData, ...prev].slice(0, 50)); // Máx 50 refeições
  };

  const resetData = () => {
    localStorage.removeItem('unislim_goals');
    localStorage.removeItem('unislim_daily_plan');
    localStorage.removeItem('unislim_checkins');
    localStorage.removeItem('unislim_meals');
    localStorage.removeItem('unislim_meal_plan_state');
    localStorage.removeItem('profileImage');
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
      mindfulEating: false,
      mentalPause: false
    });
    setCheckIns([]);
    setMealHistory([]);
    setMealPlanState({ date: new Date().toDateString(), completed: [] });
    setProfileImage('');
    setStreak(0);
    setActiveTab('home');
  };

  // Contagem de todos os hábitos concluídos na semana corrente (para o painel de consistência)
  const getWeeklyHabitsCount = () => {
    let count = 0;
    if (dailyPlan.hydration >= adjustedGoals.hydrationGoal) count++;
    if (dailyPlan.walkMinutes >= adjustedGoals.walkGoal) count++;
    if (dailyPlan.mindfulEating) count++;
    if (dailyPlan.mentalPause) count++;
    
    return count + (checkIns.length * 3);
  };

  const weeklyHabitsCount = getWeeklyHabitsCount();

  return (
    <AppContext.Provider value={{
      goals,
      dailyPlan,
      checkIns,
      activeTab,
      streak,
      todayCheckIn,
      adjustedGoals,
      dailyPercentage,
      weeklyHabitsCount,
      mealHistory,
      mealPlanState,
      addMeal,
      toggleMealCompleted,
      saveGoals,
      updateHydration,
      updateWalkMinutes,
      toggleMindfulEating,
      toggleMentalPause, // toggleMentalPause
      addCheckIn,
      hasDoneCheckInToday,
      setActiveTab,
      resetData,
      profileImage,
      setProfileImage
    }}>
      {children}
    </AppContext.Provider>
  );
};
