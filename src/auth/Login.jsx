import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import AuthLayout from './AuthLayout';
import salmonBroccoli from '../assets/salmon_broccoli.png';

const Login = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controle de exibição da senha
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }
    
    console.log(`🔌 [Login] Iniciando autenticação para o e-mail: ${email}`);
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        console.warn(`⚠️ [Login] Falha na autenticação para ${email}: ${result.error}`);
        
        if (result.error && (result.error.includes('Email not confirmed') || result.error.includes('confirm_email'))) {
          setErrorMsg('Seu e-mail ainda não foi confirmado. O fluxo de auto-confirmação está ativo para novas contas.');
        } else if (result.error && result.error.includes('Invalid login credentials')) {
          setErrorMsg('E-mail ou senha incorretos. Por favor, tente novamente.');
        } else {
          setErrorMsg(result.error || 'Ocorreu um erro ao fazer login.');
        }
        setIsSubmitting(false);
      } else {
        console.log(`✅ [Login] Login efetuado com sucesso para ${email}. Redirecionando...`);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('❌ [Login] Erro inesperado durante o login:', err.message);
      setErrorMsg('Erro inesperado na conexão com o servidor de autenticação.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* Topo do Login: Marca Minimalista */}
      <header className="auth-header">
        <div className="auth-logo-row">
          <span className="auth-logo-text">
            <span className="uni-part">UNI</span>
            <span className="slim-part">Slim</span>
          </span>
        </div>
        <p className="auth-subtitle">
          Transforme seu corpo sem complicar sua rotina.
        </p>
      </header>

      {/* Hero Visual: Scanner de Calorias por IA Flutuante */}
      <div className="login-hero-dashboard-wrapper">
        <div className="login-hero-dashboard scanner-preview">
          <div className="dashboard-header">
            <span className="dashboard-title">Scanner de IA</span>
            <span className="dashboard-badge login-scanner-badge">Análise Ativa</span>
          </div>
          
          <div className="login-scanner-container">
            {/* Prato de Comida no Scanner */}
            <div className="login-scanner-plate-area">
              <img src={salmonBroccoli} alt="Salmão com Brócolis" className="login-scanner-food-img" loading="lazy" />
              {/* Linha horizontal de scan de laser brilhante */}
              <div className="login-scanner-laser-line"></div>
              {/* Cantinhos de foco */}
              <div className="focus-corner top-left"></div>
              <div className="focus-corner top-right"></div>
              <div className="focus-corner bottom-left"></div>
              <div className="focus-corner bottom-right"></div>
            </div>
            
            {/* Detecção da IA */}
            <div className="login-scanner-detection-details">
              <div className="detection-header">
                <span className="detection-status">Análise concluída</span>
                <span className="detection-match">98% match</span>
              </div>
              <div className="detected-food-name">Salmão com Brócolis</div>
              <div className="detected-macros">
                <div className="macro-badge protein">38g <span>Prot</span></div>
                <div className="macro-badge carb">12g <span>Carb</span></div>
                <div className="macro-badge fat">14g <span>Gord</span></div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-footer-stats">
            <span>Estimativa de calorias:</span>
            <strong className="calories-result">326 kcal</strong>
          </div>
        </div>
      </div>

      {/* Card Form Glassmorphism */}
      <main className="auth-card">
        <h2 className="auth-card-title">Acesse sua transformação</h2>
        <p className="auth-card-subtitle">Insira suas credenciais para entrar no app.</p>

        {errorMsg && (
          <div className="auth-error-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
              <span className="auth-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email-input"
                type="email"
                className="auth-input with-icon"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password-input">Senha</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="auth-input with-icon with-suffix"
                placeholder="Sua senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L1.39 1.39m12.481 12.48l8.74 8.74M21.542 12a9.979 9.979 0 00-1.562-3.029M16.125 5.825A9.979 9.979 0 0121.54 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
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
              <span>Entrar no UniSlim</span>
            )}
          </button>

          <div className="auth-divider">ou</div>

          <button 
            type="button" 
            className="auth-btn-secondary" 
            onClick={onNavigateToRegister}
            disabled={isSubmitting}
          >
            Criar conta
          </button>
        </form>
      </main>

      {/* Roda-pé de privacidade/segurança */}
      <footer className="auth-footer">
        <p className="auth-footer-text">
          Sua jornada de saúde com segurança e privacidade.
        </p>
      </footer>
    </AuthLayout>
  );
};

export default Login;
