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

    const result = await register(email, password, onboardingData);

    if (!result.success) {
      setErrorMsg(result.error || 'Erro ao realizar o cadastro.');
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
                <input
                  id="name-input"
                  type="text"
                  className="auth-input"
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
                <input
                  id="current-weight-input"
                  type="number"
                  step="0.1"
                  className="auth-input"
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
                <input
                  id="goal-weight-input"
                  type="number"
                  step="0.1"
                  className="auth-input"
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
                <input
                  id="register-email"
                  type="email"
                  className="auth-input"
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
                <input
                  id="register-password"
                  type="password"
                  className="auth-input"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
          <span className="auth-logo-icon">✨</span>
          <span className="auth-logo-text">UniSlim</span>
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

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            {step > 1 && (
              <button 
                type="button" 
                className="auth-btn-primary" 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
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
