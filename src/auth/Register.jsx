import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import AuthLayout from './AuthLayout';

const Register = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  
  // Controle de etapas do Onboarding (1 a 5)
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Dados do formulário
  const [fullName, setFullName] = useState('');
  const [objective, setObjective] = useState('lose_weight');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    setErrorMsg('');
    
    // Validações por etapa
    if (step === 1 && !fullName.trim()) {
      setErrorMsg('Por favor, informe seu nome.');
      return;
    }
    if (step === 3 && (!currentWeight || parseFloat(currentWeight) <= 0)) {
      setErrorMsg('Por favor, informe um peso atual válido.');
      return;
    }
    if (step === 4 && (!goalWeight || parseFloat(goalWeight) <= 0)) {
      setErrorMsg('Por favor, informe uma meta de peso válida.');
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    console.log(`🔌 [Register] Iniciando envio do formulário de Onboarding. Criando usuário: ${email}`);
    setErrorMsg('');
    setIsSubmitting(true);

    const onboardingData = {
      fullName,
      objective,
      age: 25, // default
      height: 1.75, // default
      currentWeight: parseFloat(currentWeight),
      goalWeight: parseFloat(goalWeight)
    };

    try {
      const result = await register(email, password, onboardingData);

      if (!result.success) {
        console.warn(`⚠️ [Register] Falha no cadastro de usuário para ${email}: ${result.error}`);
        setErrorMsg(result.error || 'Erro ao realizar o cadastro. Verifique a conexão e tente novamente.');
        setIsSubmitting(false);
      } else {
        console.log(`✅ [Register] Cadastro realizado com sucesso para ${email}!`);
        const sessionCreated = result.data?.session;
        if (!sessionCreated) {
          alert('Sua conta foi criada com sucesso! Por favor, faça login com suas novas credenciais.');
          setIsSubmitting(false);
          onNavigateToLogin();
        } else {
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.error('❌ [Register] Erro inesperado durante o cadastro:', err.message);
      setErrorMsg('Erro inesperado na conexão com o servidor de autenticação.');
      setIsSubmitting(false);
    }
  };

  // Renderização dinâmica baseada no passo
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="auth-card-title">Como devemos te chamar?</h2>
            <p className="auth-card-subtitle">Queremos personalizar sua experiência no UniSlim.</p>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="name-input">Seu Nome</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="name-input"
                  type="text"
                  className="auth-input with-icon"
                  placeholder="Ex: Leonardo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="auth-card-title">Qual é o seu objetivo?</h2>
            <p className="auth-card-subtitle">Nos ajudará a calibrar sua dieta e suas metas diárias.</p>
            
            <div 
              className={`onboarding-option-card ${objective === 'lose_weight' ? 'selected' : ''}`}
              onClick={() => setObjective('lose_weight')}
            >
              <span className="onboarding-option-emoji">🎯</span>
              <div>
                <h4 className="onboarding-option-title">Emagrecimento Inteligente</h4>
                <p className="onboarding-option-desc">Foco em déficit calórico leve e consistência.</p>
              </div>
            </div>

            <div 
              className={`onboarding-option-card ${objective === 'gain_muscle' ? 'selected' : ''}`}
              onClick={() => setObjective('gain_muscle')}
            >
              <span className="onboarding-option-emoji">💪</span>
              <div>
                <h4 className="onboarding-option-title">Hipertrofia & Força</h4>
                <p className="onboarding-option-desc">Ganho de massa magra com foco proteico.</p>
              </div>
            </div>

            <div 
              className={`onboarding-option-card ${objective === 'harmony' ? 'selected' : ''}`}
              onClick={() => setObjective('harmony')}
            >
              <span className="onboarding-option-emoji">🌿</span>
              <div>
                <h4 className="onboarding-option-title">Equilíbrio & Longevidade</h4>
                <p className="onboarding-option-desc">Manutenção de peso saudável e rotina ativa.</p>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="auth-card-title">Qual é seu peso atual?</h2>
            <p className="auth-card-subtitle">Utilizado para calcular sua meta de hidratação e metabolismo.</p>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="current-weight-input">Peso Atual</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7H2a2 2 0 002-2h4a2 2 0 002 2m0 0l3-1m0 0l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9h-4a2 2 0 002-2h4a2 2 0 002 2m-6 4h4" />
                  </svg>
                </span>
                <input
                  id="current-weight-input"
                  type="number"
                  step="0.1"
                  className="auth-input with-icon with-suffix"
                  placeholder="75.0"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  autoFocus
                  required
                />
                <span className="auth-input-suffix">kg</span>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="auth-card-title">Qual sua meta de peso?</h2>
            <p className="auth-card-subtitle">Seu objetivo final da jornada saudável.</p>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="goal-weight-input">Peso Desejado</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <input
                  id="goal-weight-input"
                  type="number"
                  step="0.1"
                  className="auth-input with-icon with-suffix"
                  placeholder="68.0"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  autoFocus
                  required
                />
                <span className="auth-input-suffix">kg</span>
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="auth-card-title">Crie seu acesso premium</h2>
            <p className="auth-card-subtitle">Quase lá! Insira seu e-mail e escolha uma senha segura.</p>
            
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="register-email">E-mail</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="register-email"
                  type="email"
                  className="auth-input with-icon"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="register-password">Senha</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input with-icon with-suffix"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      {/* Topo do Cadastro */}
      <header className="auth-header">
        <div className="auth-logo-row">
          <span className="auth-logo-text">
            <span className="uni-part">UNI</span>
            <span className="slim-part">Slim</span>
          </span>
        </div>
        <p className="auth-subtitle">Onboarding Personalizado</p>
      </header>

      {/* Card Form */}
      <main className="auth-card">
        {/* Indicador de Etapas */}
        <div className="onboarding-progress-dots">
          {[...Array(totalSteps)].map((_, i) => (
            <div 
              key={i} 
              className={`onboarding-dot ${i + 1 === step ? 'active' : ''}`} 
            />
          ))}
        </div>

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

        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {step > 1 && (
              <button 
                type="button" 
                className="auth-btn-primary" 
                style={{ 
                  background: 'rgba(15, 23, 42, 0.05)', 
                  border: '1px solid rgba(15, 23, 42, 0.08)', 
                  color: 'var(--auth-text-primary)',
                  boxShadow: 'none'
                }}
                onClick={handlePrevStep}
                disabled={isSubmitting}
              >
                Voltar
              </button>
            )}

            {step < totalSteps ? (
              <button 
                type="button" 
                className="auth-btn-primary" 
                onClick={handleNextStep}
              >
                Continuar
              </button>
            ) : (
              <button 
                type="button" 
                className="auth-btn-primary" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="auth-spinner" />
                    <span>Criando conta...</span>
                  </>
                ) : (
                  <span>Finalizar Onboarding</span>
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Roda-pé: Link para Login */}
      <footer className="auth-footer">
        <p className="auth-footer-text">
          Já possui uma conta?
          <button 
            type="button" 
            className="auth-footer-link" 
            onClick={onNavigateToLogin}
          >
            Fazer Login
          </button>
        </p>
      </footer>
    </AuthLayout>
  );
};

export default Register;
