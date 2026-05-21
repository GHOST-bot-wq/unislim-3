import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabase/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão inicial de forma assíncrona
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(initialSession);
        setUser(initialSession?.user || null);
      } catch (err) {
        console.error('Erro ao recuperar sessão do Supabase:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escuta mudanças de estado na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login com e-mail e senha
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro no login:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Cadastro de novo usuário com dados do onboarding
  const register = async (email, password, onboardingData) => {
    setLoading(true);
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
      return { success: true, data };
    } catch (error) {
      console.error('Erro no cadastro:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout do usuário
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deslogar:', error.message);
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
export default AuthContext;
