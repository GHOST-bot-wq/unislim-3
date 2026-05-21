import supabase from '../supabase/client';

export const progressService = {
  // Obter o log do dia de hoje (ou criar um novo se não existir)
  getOrCreateTodayLog: async (userId) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];

      // Busca o log de hoje
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('created_at', todayStr)
        .maybeSingle();

      if (error) throw error;

      // Se encontrou, retorna
      if (data) {
        return { success: true, data };
      }

      // Se não encontrou, cria um novo log para hoje
      const { data: newLog, error: createError } = await supabase
        .from('daily_logs')
        .insert({
          user_id: userId,
          created_at: todayStr,
          water_intake: 0,
          steps: 0,
          calories: 0,
          mood: 'calm',
          completed: false
        })
        .select()
        .single();

      if (createError) throw createError;
      return { success: true, data: newLog };
    } catch (error) {
      console.error('Erro ao obter/criar log diário:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Atualizar log diário (água, passos, etc.)
  updateDailyLog: async (userId, logData) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_logs')
        .upsert({
          user_id: userId,
          created_at: todayStr,
          ...logData
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar log diário:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter logs recentes para gráficos ou histórico (ex: últimos 7 dias)
  getRecentLogs: async (userId, limit = 7) => {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao obter logs recentes:', error.message);
      return { success: false, error: error.message };
    }
  }
};

export default progressService;
