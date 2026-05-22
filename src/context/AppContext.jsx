import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { getAdjustedGoals } from '../utils/feedbackHelper';
import { AuthContext } from './AuthContext';
import profileService from '../services/profileService';
import scanService from '../services/scanService';
import progressService from '../services/progressService';
import dietService from '../services/dietService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Estados locais com cache em localStorage (para uso offline/carregamento instantâneo)
  const defaultGoals = {
    name: 'Você',
    weightCurrent: '75',
    weightDesired: '68',
    activityLevel: 'moderate',
    mainGoal: 'lose_weight',
    theme: 'calm',
    avatar: '✨',
    isSet: true
  };

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('unislim_goals');
      if (saved && saved !== 'null' && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('⚠️ [AppContext] Erro ao analisar unislim_goals do localStorage, usando defaults.');
    }
    return defaultGoals;
  });

  const [dailyPlan, setDailyPlan] = useState(() => {
    const today = new Date().toDateString();
    const defaultDailyPlan = {
      date: today,
      hydration: 0,
      walkMinutes: 0,
      mindfulEating: false,
      mentalPause: false
    };
    try {
      const saved = localStorage.getItem('unislim_daily_plan');
      if (saved && saved !== 'null' && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.date === today) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('⚠️ [AppContext] Erro ao analisar unislim_daily_plan do localStorage.');
    }
    return defaultDailyPlan;
  });

  const [checkIns, setCheckIns] = useState(() => {
    try {
      const saved = localStorage.getItem('unislim_checkins');
      if (saved && saved !== 'null' && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('⚠️ [AppContext] Erro ao analisar unislim_checkins do localStorage.');
    }
    return [];
  });

  const [mealHistory, setMealHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('unislim_meals');
      if (saved && saved !== 'null' && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('⚠️ [AppContext] Erro ao analisar unislim_meals do localStorage.');
    }
    return [];
  });

  const [mealPlanState, setMealPlanState] = useState(() => {
    const today = new Date().toDateString();
    const defaultMealPlanState = { date: today, completed: [] };
    try {
      const saved = localStorage.getItem('unislim_meal_plan_state');
      if (saved && saved !== 'null' && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.date === today && Array.isArray(parsed.completed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('⚠️ [AppContext] Erro ao analisar unislim_meal_plan_state do localStorage.');
    }
    return defaultMealPlanState;
  });

  const [activeTab, setActiveTab] = useState('home');
  const [streak, setStreak] = useState(0);
  const [profileImage, setProfileImage] = useState('');

  // Monitorar logout real para limpar dados locais
  const prevUserRef = useRef(user);
  useEffect(() => {
    if (prevUserRef.current && !user) {
      console.log('🚪 [AppContext] Logout detectado! Limpando dados na memória e no cache local...');
      resetData();
    }
    prevUserRef.current = user;
  }, [user]);

  // 1. EFEITO DE CARREGAMENTO DE DADOS DO SUPABASE APÓS LOGIN
  useEffect(() => {
    if (!user) {
      // Se deslogar, resetamos os estados locais principais
      console.log('🔌 [AppContext] Sem usuário logado. Resetando estados locais...');
      setProfileImage('');
      return;
    }

    let isCurrent = true;

    const loadUserDataFromSupabase = async () => {
      console.log('🔄 [AppContext] Carregando dados do Supabase para o usuário:', user.email);
      
      try {
        // A. Carregar Perfil (profiles)
        let profResult = await profileService.getProfile(user.id);
        if (!isCurrent) return;

        // Se a busca deu sucesso mas não encontrou o profile (data = null), criamos um profile resiliente local/nuvem
        if (profResult.success && !profResult.data) {
          console.log('⚠️ [AppContext] Profile não encontrado na tabela public.profiles. Tentando criar a partir de user_metadata...');
          const meta = user.user_metadata || {};
          const newProfile = {
            id: user.id,
            full_name: meta.full_name || user.email.split('@')[0],
            avatar_url: meta.avatar_url || '',
            age: parseInt(meta.age) || 25,
            height: parseFloat(meta.height) || 1.75,
            current_weight: parseFloat(meta.current_weight) || 75.0,
            goal_weight: parseFloat(meta.goal_weight) || 68.0,
            objective: meta.objective || 'lose_weight',
            theme: 'calm',
            streak_days: 0
          };

          // Tenta inserir na tabela profiles usando o client logado
          const { data: insertedData, error: insertError } = await profileService.updateProfile(user.id, newProfile);
          if (!insertError) {
            console.log('✅ [AppContext] Profile criado com sucesso via fallback de metadados.');
            // Re-busca o perfil recém criado
            profResult = await profileService.getProfile(user.id);
          } else {
            console.error('❌ [AppContext] Falha ao criar profile de fallback:', insertError);
          }
        }

        if (profResult.success && profResult.data) {
          const p = profResult.data;
          const mappedGoals = {
            name: p.full_name || 'Usuário',
            weightCurrent: p.current_weight?.toString() || '75',
            weightDesired: p.goal_weight?.toString() || '68',
            activityLevel: 'moderate',
            mainGoal: p.objective || 'lose_weight',
            theme: p.theme || 'calm',
            avatar: p.avatar_url ? '👤' : '✨',
            isSet: true
          };
          setGoals(mappedGoals);
          setProfileImage(p.avatar_url || '');
          setStreak(p.streak_days || 0);
          localStorage.setItem('unislim_goals', JSON.stringify(mappedGoals));
          console.log('✅ [AppContext] Perfil do usuário carregado do Supabase:', p.full_name);
        } else {
          console.warn('⚠️ [AppContext] Falha ao carregar perfil:', profResult.error);
        }

        // B. Carregar Log Diário de Hábitos (daily_logs)
        const logResult = await progressService.getOrCreateTodayLog(user.id);
        if (!isCurrent) return;

        if (logResult.success && logResult.data) {
          const l = logResult.data;
          const mappedPlan = {
            date: new Date().toDateString(),
            hydration: l.water_intake || 0,
            walkMinutes: l.steps || 0, // Mapeamos caminhada leve nos steps por simplicidade
            mindfulEating: l.completed || false, // Provisório
            mentalPause: l.mood === 'calm'
          };
          setDailyPlan(mappedPlan);
          localStorage.setItem('unislim_daily_plan', JSON.stringify(mappedPlan));
          console.log('✅ [AppContext] Log diário de hábitos carregado do Supabase.');
        } else {
          console.warn('⚠️ [AppContext] Falha ao obter/criar log diário:', logResult.error);
        }

        // C. Carregar Histórico de Refeições (meal_scans)
        const mealsResult = await scanService.getMealHistory(user.id);
        if (!isCurrent) return;

        if (mealsResult.success && mealsResult.data) {
          const mealsArray = Array.isArray(mealsResult.data) ? mealsResult.data : [];
          setMealHistory(mealsArray);
          localStorage.setItem('unislim_meals', JSON.stringify(mealsArray));
          console.log('✅ [AppContext] Histórico de refeições carregado do Supabase. Qtd:', mealsArray.length);
        } else {
          console.warn('⚠️ [AppContext] Falha ao buscar histórico de refeições:', mealsResult.error);
        }
      } catch (err) {
        console.error('❌ [AppContext] Erro no carregamento de dados do Supabase:', err.message);
      }
    };

    loadUserDataFromSupabase();

    return () => {
      isCurrent = false;
    };
  }, [user]);

  // Efeitos para persistência secundária local (localStorage)
  useEffect(() => {
    localStorage.setItem('unislim_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('unislim_daily_plan', JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  useEffect(() => {
    localStorage.setItem('unislim_meal_plan_state', JSON.stringify(mealPlanState));
  }, [mealPlanState]);

  useEffect(() => {
    localStorage.setItem('unislim_meals', JSON.stringify(mealHistory));
  }, [mealHistory]);

  // Calcula streak e consistência localmente
  useEffect(() => {
    localStorage.setItem('unislim_checkins', JSON.stringify(checkIns));
    
    if (checkIns.length === 0) {
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

    // Sincroniza streak no Supabase
    if (user) {
      profileService.updateProfile(user.id, { streak_days: currentStreak });
    }
  }, [checkIns, user]);

  // Dados computados baseados no check-in de hoje
  const todayStr = new Date().toDateString();
  const todayCheckIn = checkIns.find(c => c.date === todayStr);
  const adjustedGoals = getAdjustedGoals(todayCheckIn);

  // Progresso diário baseado em 4 hábitos de 25% cada
  const getDailyPercentage = () => {
    let score = 0;
    score += Math.min(dailyPlan.hydration / (adjustedGoals?.hydrationGoal || 8), 1) * 25;
    score += Math.min(dailyPlan.walkMinutes / (adjustedGoals?.walkGoal || 30), 1) * 25;
    score += dailyPlan.mindfulEating ? 25 : 0;
    score += dailyPlan.mentalPause ? 25 : 0;
    return Math.round(score);
  };
  
  const dailyPercentage = getDailyPercentage();

  // Calcula hábitos concluídos nos últimos 7 dias para o painel de progresso
  const getWeeklyHabitsCount = () => {
    let count = 0;
    const hydrationGoal = adjustedGoals?.hydrationGoal || 8;
    const walkGoal = adjustedGoals?.walkGoal || 30;
    
    // Hoje
    if (dailyPlan.hydration >= hydrationGoal) count++;
    if (dailyPlan.walkMinutes >= walkGoal) count++;
    if (dailyPlan.mindfulEating) count++;
    if (dailyPlan.mentalPause) count++;
    
    // Check-ins passados (últimos 7 dias)
    const todayStr = new Date().toDateString();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    checkIns.forEach(c => {
      const cDate = new Date(c.date);
      if (c.date !== todayStr && cDate >= oneWeekAgo) {
        if (c.waterIntake >= hydrationGoal || c.hydration >= hydrationGoal) count++;
        if (c.steps >= walkGoal || c.walkMinutes >= walkGoal) count++;
        if (c.mindfulEating) count++;
        if (c.mentalPause) count++;
      }
    });
    
    return count;
  };

  const weeklyHabitsCount = getWeeklyHabitsCount();

  // Métodos de alteração de dados do usuário e sincronização com Supabase

  const saveGoals = async (newGoals) => {
    const updated = { ...newGoals, isSet: true };
    setGoals(updated);

    if (user) {
      await profileService.updateProfile(user.id, {
        full_name: updated.name,
        current_weight: parseFloat(updated.weightCurrent),
        goal_weight: parseFloat(updated.weightDesired),
        objective: updated.mainGoal,
        theme: updated.theme || 'calm'
      });
    }
  };

  const updateHydration = async (value) => {
    const newVal = Math.max(0, Math.min(10, value));
    setDailyPlan(prev => ({ ...prev, hydration: newVal }));

    if (user) {
      await progressService.updateDailyLog(user.id, {
        water_intake: newVal
      });
    }
  };

  const updateWalkMinutes = async (minutes) => {
    const newVal = Math.max(0, minutes);
    setDailyPlan(prev => ({ ...prev, walkMinutes: newVal }));

    if (user) {
      await progressService.updateDailyLog(user.id, {
        steps: newVal // Guardamos passos/minutos de caminhada na coluna steps por praticidade
      });
    }
  };

  const toggleMindfulEating = async () => {
    const newStatus = !dailyPlan.mindfulEating;
    setDailyPlan(prev => ({ ...prev, mindfulEating: newStatus }));

    if (user) {
      await progressService.updateDailyLog(user.id, {
        completed: newStatus
      });
    }
  };

  const toggleMentalPause = async () => {
    const newStatus = !dailyPlan.mentalPause;
    setDailyPlan(prev => ({ ...prev, mentalPause: newStatus }));

    if (user) {
      await progressService.updateDailyLog(user.id, {
        mood: newStatus ? 'calm' : 'neutral'
      });
    }
  };

  const addCheckIn = (checkInData) => {
    const todayStr = new Date().toDateString();
    const existingIndex = checkIns.findIndex(c => c.date === todayStr);
    
    if (existingIndex > -1) {
      const updated = [...checkIns];
      updated[existingIndex] = { ...checkInData, date: todayStr };
      setCheckIns(updated);
    } else {
      setCheckIns(prev => [{ ...checkInData, date: todayStr }, ...prev]);
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

  const addMeal = async (mealData, fileObject = null) => {
    // 1. Atualiza na UI local instantaneamente
    const tempId = 'temp-' + Date.now();
    const tempMeal = { id: tempId, ...mealData };
    setMealHistory(prev => [tempMeal, ...prev].slice(0, 50));

    // 2. Persiste de forma assíncrona no Supabase
    if (user) {
      const result = await scanService.saveMealScan(user.id, mealData, fileObject);
      if (result.success && result.data) {
        // Atualiza a refeição temporária com o ID e dados finais do Supabase
        const finalMeal = {
          id: result.data.id,
          name: mealData.name,
          calories: result.data.calories,
          protein: result.data.proteins,
          carbs: result.data.carbs,
          fat: result.data.fats,
          emoji: '🍽️',
          imageData: result.data.image_url,
          date: result.data.created_at
        };
        setMealHistory(prev => prev.map(m => m.id === tempId ? finalMeal : m));
      }
    }
  };

  const handleSetProfileImage = async (urlOrFile) => {
    if (typeof urlOrFile === 'string') {
      setProfileImage(urlOrFile);
      if (!urlOrFile && user) {
        // Remover foto
        await profileService.updateProfile(user.id, { avatar_url: '' });
      }
    } else if (urlOrFile instanceof File && user) {
      // Fazer upload real do arquivo
      const uploadResult = await profileService.uploadAvatar(user.id, urlOrFile);
      if (uploadResult.success) {
        setProfileImage(uploadResult.url);
      } else {
        alert('Erro ao fazer upload da imagem: ' + uploadResult.error);
      }
    }
  };

  const resetData = async () => {
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
      mainGoal: 'lose_weight',
      theme: 'calm',
      avatar: '✨',
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

    // Sincroniza reset no banco se estiver logado
    if (user) {
      await profileService.updateProfile(user.id, {
        full_name: 'Você',
        current_weight: 75.0,
        goal_weight: 68.0,
        objective: 'lose_weight',
        theme: 'calm',
        avatar_url: '',
        streak_days: 0
      });
      // Deletar scans e diários no banco poderia ser feito aqui, 
      // mas mantemos simples e limpamos o perfil para evitar perda acidental excessiva.
    }
  };

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
      toggleMentalPause,
      addCheckIn,
      hasDoneCheckInToday,
      setActiveTab,
      resetData,
      profileImage,
      setProfileImage: handleSetProfileImage
    }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppContext;
