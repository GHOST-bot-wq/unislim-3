import supabase from '../supabase/client';

export const scanService = {
  // Salvar uma refeição analisada
  saveMealScan: async (userId, mealData, fileObject = null) => {
    try {
      let imageUrl = mealData.imageData || mealData.image_url || '';

      // Se o usuário tirou uma foto real (File) ou carregou da galeria, faz upload no Supabase Storage
      if (fileObject) {
        const fileExt = fileObject.name.split('.').pop() || 'png';
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('meals')
          .upload(fileName, fileObject, {
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('meals')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      // Inserir registro na tabela meal_scans
      const { data, error } = await supabase
        .from('meal_scans')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          calories: parseInt(mealData.calories),
          proteins: parseInt(mealData.protein || mealData.proteins || 0),
          carbs: parseInt(mealData.carbs || 0),
          fats: parseInt(mealData.fat || mealData.fats || 0),
          health_score: parseInt(mealData.health_score || mealData.healthScore || 90)
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao salvar scan de refeição:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter o histórico de refeições escaneadas do usuário
  getMealHistory: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('meal_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapeia os dados do Supabase para o formato que a UI do UniSlim consome
      const mappedHistory = data.map(item => ({
        id: item.id,
        name: getMealNameByCalories(item.calories), // fallback de nome
        calories: item.calories,
        protein: item.proteins,
        carbs: item.carbs,
        fat: item.fats,
        emoji: '🍽️',
        imageData: item.image_url,
        date: item.created_at
      }));

      return { success: true, data: mappedHistory };
    } catch (error) {
      console.error('Erro ao buscar histórico de refeições:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Função auxiliar simples para deduzir ou mapear nomes no fallback de listagem
function getMealNameByCalories(calories) {
  if (calories >= 600) return 'Refeição Completa';
  if (calories >= 400) return 'Prato Grelhado Executivo';
  if (calories >= 300) return 'Omelete Proteico com Salada';
  return 'Lanche Leve Nutritivo';
}

export default scanService;
