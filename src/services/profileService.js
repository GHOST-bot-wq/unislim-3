import supabase from '../supabase/client';

export const profileService = {
  // Obter perfil do usuário logado
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao buscar perfil:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Atualizar/Salvar perfil (Upsert para garantir criação caso não exista)
  updateProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profileData
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar/upsertar perfil:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Upload da foto de perfil para o Supabase Storage
  uploadAvatar: async (userId, file) => {
    try {
      // Exemplo de extensão do arquivo
      const fileExt = file.name.split('.').pop() || 'png';
      // Nome único para evitar caches agressivos do CDN
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload do arquivo para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obter URL pública da imagem recém enviada
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar o avatar_url na tabela profiles do usuário
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error.message);
      return { success: false, error: error.message };
    }
  }
};

export default profileService;
