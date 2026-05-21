import supabase from '../supabase/client';

export const dietService = {
  // Obter o plano alimentar atual do usuário
  getDietPlan: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao buscar plano alimentar:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Salvar ou atualizar plano alimentar
  saveDietPlan: async (userId, planData) => {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .insert({
          user_id: userId,
          breakfast: planData.breakfast,
          lunch: planData.lunch,
          dinner: planData.dinner,
          snacks: planData.snacks
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao salvar plano alimentar:', error.message);
      return { success: false, error: error.message };
    }
  }
};

export default dietService;
