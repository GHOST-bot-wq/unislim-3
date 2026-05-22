import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabase/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let initialized = false;

    // Escuta mudanças de estado na autenticação (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`⚡ [AuthContext] onAuthStateChange disparado. Evento: ${event}`, currentSession ? `Usuário: ${currentSession.user.email}` : 'Nenhuma sessão ativa');
      
      if (active) {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setLoading(false);
        initialized = true;
      }
    });

    // Busca a sessão inicial de forma assíncrona como fallback caso o listener não dispare de imediato
    const initializeAuth = async () => {
      try {
        if (!initialized) {
          console.log('🔄 [AuthContext] Buscando sessão ativa via fallback...');
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (active && !initialized) {
            console.log('🔄 [AuthContext] Sessão inicial recuperada via fallback:', initialSession ? `Logado como ${initialSession.user.email}` : 'Nenhum usuário logado.');
            setSession(initialSession);
            setUser(initialSession?.user || null);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('❌ [AuthContext] Erro ao recuperar sessão inicial do Supabase:', err.message);
      } finally {
        if (active && !initialized) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
      subscription?.unsubscribe();
      console.log('🔌 [AuthContext] Limpando listener de autenticação.');
    };
  }, []);

  // Login com e-mail e senha
  const login = async (email, password) => {
    console.log(`🔌 [AuthContext] Tentando fazer login para: ${email}`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      console.log('✅ [AuthContext] Login bem-sucedido via Supabase!', data.user?.email);
      
      // O listener onAuthStateChange também atualizará os estados, 
      // mas garantimos a sincronização rápida e local aqui
      setSession(data.session);
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [AuthContext] Falha na tentativa de login:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Cadastro de novo usuário com dados do onboarding
  const register = async (email, password, onboardingData) => {
    console.log(`🔌 [AuthContext] Iniciando cadastro para: ${email}`);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: onboardingData.fullName || email.split('@')[0],
            avatar_url: '',
            age: parseInt(onboardingData.age) || 25,
            height: parseFloat(onboardingData.height) || 1.75,
            current_weight: parseFloat(onboardingData.currentWeight) || 75.0,
            goal_weight: parseFloat(onboardingData.goalWeight) || 68.0,
            objective: onboardingData.objective || 'lose_weight',
          }
        }
      });
      if (error) throw error;
      
      console.log('✅ [AuthContext] Cadastro realizado com sucesso!', data.user?.email);
      
      // Se houver sessão de auto-login retornada, atualiza imediatamente
      if (data.session) {
        console.log('✅ [AuthContext] Login automático detectado no cadastro.', data.user?.email);
        setSession(data.session);
        setUser(data.user);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ [AuthContext] Erro ao cadastrar novo usuário:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout do usuário
  const logout = async () => {
    setLoading(true);
    console.log('🔌 [AuthContext] Iniciando processo de logout...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('✅ [AuthContext] Logout efetuado com sucesso.');
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (error) {
      console.error('❌ [AuthContext] Erro ao efetuar logout:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

