import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import AuthLayout from './AuthLayout';

const Login = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }
    
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setErrorMsg(result.error || 'Ocorreu um erro ao fazer login.');
      setIsSubmitting(false);
    }
    // Caso dê sucesso, o session update no AuthContext fará o redirecionamento automático
  };

  return (
    <AuthLayout>
      {/* Topo do Login: Marca e Slogan */}
      <header className="auth-header">
        <div className="auth-logo-row">
          <span className="auth-logo-icon">✨</span>
          <span className="auth-logo-text">UniSlim</span>
        </div>
        <p className="auth-subtitle">
          “Seu corpo responde aos pequenos hábitos.”
        </p>
      </header>

      {/* Card Form */}
      <main className="auth-card">
        <h2 className="auth-card-title">Bem-vindo de volta</h2>
        <p className="auth-card-subtitle">Insira suas credenciais para acessar sua rotina saudável.</p>

        {errorMsg && (
          <div className="auth-error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email-input">E-mail</label>
            <div className="auth-input-wrapper">
              <input
                id="email-input"
                type="email"
                className="auth-input"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password-input">Senha</label>
            <div className="auth-input-wrapper">
              <input
                id="password-input"
                type="password"
                className="auth-input"
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-btn-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="auth-spinner" />
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>
      </main>

      {/* Roda-pé: Link para Onboarding */}
      <footer className="auth-footer">
        <p className="auth-footer-text">
          Não possui uma conta?
          <button 
            type="button" 
            className="auth-footer-link" 
            onClick={onNavigateToRegister}
          >
            Criar conta
          </button>
        </p>
      </footer>
    </AuthLayout>
  );
};

export default Login;
