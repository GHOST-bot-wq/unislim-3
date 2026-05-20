import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Goals = () => {
  const { saveGoals } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    weightCurrent: '',
    weightDesired: '',
    activityLevel: 'moderado',
    mainGoal: 'consistencia'
  });

  const [showSummary, setShowSummary] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    saveGoals(formData);
  };

  // Lógica de previsão humana (0.5kg por semana de redução saudável)
  const calculateWeeks = () => {
    const current = parseFloat(formData.weightCurrent);
    const desired = parseFloat(formData.weightDesired);
    if (isNaN(current) || isNaN(desired) || current <= desired) return 8; // default
    const diff = current - desired;
    return Math.ceil(diff / 0.5); // 0.5kg por semana
  };

  if (showSummary) {
    const weeks = calculateWeeks();
    return (
      <div className="screen-container flex-center animate-fade-in" style={{ paddingBottom: '24px' }}>
        <div className="goals-summary-card text-center animate-scale-up">
          <div className="summary-icon">✨</div>
          <h2 className="summary-title">Sua jornada de bem-estar desenhada</h2>
          <p className="summary-text" style={{ marginTop: '12px' }}>
            Olá, <strong>{formData.name}</strong>. Analisamos o seu ritmo de vida e seu objetivo.
          </p>
          <div className="summary-prediction-box">
            <span className="prediction-label">Estimativa saudável</span>
            <span className="prediction-value">{weeks} semanas</span>
            <span className="prediction-sub">Caminhando um dia de cada vez, sem pressa.</span>
          </div>
          <p className="summary-footer-text">
            Não focaremos em contagens matemáticas ou dietas exaustivas. Apenas em pequenos hábitos diários que reeducam o seu corpo e mente.
          </p>
          <button onClick={handleSubmit} className="btn-premium interactive-hover" style={{ marginTop: '28px' }}>
            Começar minha jornada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container animate-fade-in" style={{ paddingBottom: '24px' }}>
      {/* Indicador de progresso superior do formulário */}
      <div className="goals-progress-indicator">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
        <span className="progress-text">Etapa {step} de 4</span>
      </div>

      <div className="goals-step-container">
        {step === 1 && (
          <div className="goals-step animate-slide-right">
            <span className="step-badge-icon">🌿</span>
            <h1 className="step-title">Como devemos te chamar?</h1>
            <p className="step-subtitle">Queremos personalizar sua vivência.</p>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="goals-input"
              maxLength={20}
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="goals-step animate-slide-right">
            <span className="step-badge-icon">⚖️</span>
            <h1 className="step-title">Seu momento físico hoje</h1>
            <p className="step-subtitle">Nos diga como você está e onde deseja chegar de forma leve.</p>
            <div className="goals-weight-inputs">
              <div className="input-group-weight">
                <label>Peso atual (kg)</label>
                <input
                  type="number"
                  placeholder="00.0"
                  value={formData.weightCurrent}
                  onChange={(e) => setFormData({ ...formData, weightCurrent: e.target.value })}
                  className="goals-input-small"
                />
              </div>
              <div className="input-group-weight">
                <label>Peso desejado (kg)</label>
                <input
                  type="number"
                  placeholder="00.0"
                  value={formData.weightDesired}
                  onChange={(e) => setFormData({ ...formData, weightDesired: e.target.value })}
                  className="goals-input-small"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="goals-step animate-slide-right">
            <span className="step-badge-icon">🚶</span>
            <h1 className="step-title">Como é o seu ritmo de vida?</h1>
            <p className="step-subtitle">Adequamos a rotina baseados na sua energia diária.</p>
            <div className="goals-options-container">
              {[
                { id: 'leve', label: 'Mais pausado', desc: 'Trabalho sentado, pouco movimento ativo.' },
                { id: 'moderado', label: 'Ritmo moderado', desc: 'Caminhadas diárias leves ou tarefas ativas.' },
                { id: 'ativo', label: 'Movimento constante', desc: 'Rotina ativa, exercícios ou trabalho físico.' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, activityLevel: opt.id })}
                  className={`goals-option-btn ${formData.activityLevel === opt.id ? 'active' : ''}`}
                >
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="goals-step animate-slide-right">
            <span className="step-badge-icon">✨</span>
            <h1 className="step-title">O que mais motiva você hoje?</h1>
            <p className="step-subtitle">O principal objetivo por trás do seu bem-estar.</p>
            <div className="goals-options-container">
              {[
                { id: 'consistencia', label: 'Criar consistência saudável', desc: 'Aprender a manter hábitos sem sofrimento.' },
                { id: 'energia', label: 'Sentir mais disposição', desc: 'Combater o cansaço e a fadiga diária.' },
                { id: 'leveza', label: 'Sentir meu corpo mais leve', desc: 'Recuperar o conforto e a mobilidade.' },
                { id: 'ansiedade', label: 'Reduzir ansiedade alimentar', desc: 'Criar uma relação de paz com a comida.' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, mainGoal: opt.id })}
                  className={`goals-option-btn ${formData.mainGoal === opt.id ? 'active' : ''}`}
                >
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controles de Navegação do Formulário */}
      <div className="goals-navigation" style={{ marginTop: 'auto', paddingTop: '20px' }}>
        {step > 1 ? (
          <button onClick={handleBack} className="btn-secondary" style={{ width: '48%' }}>
            Voltar
          </button>
        ) : (
          <div style={{ width: '48%' }}></div>
        )}
        <button
          onClick={handleNext}
          className="btn-premium"
          style={{ width: '48%' }}
          disabled={
            (step === 1 && !formData.name.trim()) ||
            (step === 2 && (!formData.weightCurrent || !formData.weightDesired))
          }
        >
          {step === 4 ? 'Avançar' : 'Próximo'}
        </button>
      </div>
    </div>
  );
};

export default Goals;
