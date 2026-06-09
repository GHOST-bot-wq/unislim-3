import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/scanScreen.css';

/* ─── Banco de refeições para simulação realista com classificação saudável ─── */
const MEAL_DATABASE = [
  {
    name: 'Frango Grelhado com Arroz e Legumes',
    calories: 520, protein: 38, carbs: 48, fat: 12,
    emoji: '🍗',
    healthRating: 'healthy',
    healthText: 'Excelente',
    tags: ['Rico em Proteína', 'Equilibrado', 'Recomendado'],
    feedback: 'Excelente equilíbrio de macronutrientes. O frango grelhado entrega proteína de alta qualidade, favorecendo saciedade e manutenção muscular.'
  },
  {
    name: 'Salada de Atum com Azeite de Oliva',
    calories: 310, protein: 28, carbs: 12, fat: 18,
    emoji: '🥗',
    healthRating: 'healthy',
    healthText: 'Excelente',
    tags: ['Leve', 'Alto em Proteína', 'Baixo em Carbs'],
    feedback: 'Refeição muito leve e nutritiva. O atum entrega proteína completa e o azeite fornece gorduras saudáveis que aumentam saciedade.'
  },
  {
    name: 'Prato Executivo Tradicional',
    calories: 720, protein: 35, carbs: 82, fat: 22,
    emoji: '🍽️',
    healthRating: 'attention',
    healthText: 'Atenção',
    tags: ['Alto em Calorias', 'Tradicional', 'Rico em Carbs'],
    feedback: 'Refeição calórica e rica em carboidratos simples. Tente equilibrar com uma janta mais leve e leve para uma caminhada após comer.'
  },
  {
    name: 'Iogurte Grego com Granola e Frutas',
    calories: 290, protein: 16, carbs: 38, fat: 7,
    emoji: '🥣',
    healthRating: 'healthy',
    healthText: 'Excelente',
    tags: ['Lanche Saudável', 'Proteico', 'Equilibrado'],
    feedback: 'Ótima combinação para lanche. O iogurte grego é excelente fonte de proteína e probióticos, auxiliando na digestão e saciedade.'
  },
  {
    name: 'Penne ao Sugo com Carne Moída',
    calories: 610, protein: 28, carbs: 72, fat: 19,
    emoji: '🍝',
    healthRating: 'neutral',
    healthText: 'Moderado',
    tags: ['Alto em Carbs', 'Energético', 'Moderado'],
    feedback: 'Refeição energética com carboidratos. Ideal para dias com maior atividade física. Considere reduzir a porção de macarrão no jantar.'
  },
  {
    name: 'Omelete de Ovos com Queijo Prato',
    calories: 360, protein: 26, carbs: 4, fat: 28,
    emoji: '🍳',
    healthRating: 'healthy',
    healthText: 'Excelente',
    tags: ['Baixo em Carbs', 'Rico em Proteína', 'Cetogênico'],
    feedback: 'Excelente fonte de proteínas e gorduras saudáveis. Muito boa opção para café da manhã ou jantar leve.'
  },
  {
    name: 'Salmão Grelhado com Batata Doce',
    calories: 490, protein: 36, carbs: 40, fat: 16,
    emoji: '🐟',
    healthRating: 'healthy',
    healthText: 'Excelente',
    tags: ['Premium', 'Omega-3', 'Equilibrado'],
    feedback: 'Combinação premium e muito nutritiva. O salmão é fonte de ômega-3 que favorece saúde cardiovascular e reduz inflamação.'
  },
  {
    name: 'Açaí Completo com Granola e Banana',
    calories: 480, protein: 8, carbs: 74, fat: 16,
    emoji: '🫐',
    healthRating: 'attention',
    healthText: 'Atenção',
    tags: ['Alto em Açúcar', 'Energético', 'Atenção'],
    feedback: 'Cuidado com o açúcar do açaí. Prefira versões sem adição de açúcar e com menos granola para reduzir as calorias da refeição.'
  },
  {
    name: 'Wrap Integral de Frango com Salada',
    calories: 440, protein: 30, carbs: 44, fat: 14,
    emoji: '🌯',
    healthRating: 'healthy',
    healthText: 'Excelente',
    tags: ['Equilibrado', 'Prático', 'Recomendado'],
    feedback: 'Boa refeição portátil e equilibrada. Lembre-se de preferir o wrap integral para aumentar a fibra e melhorar a saciedade.'
  },
  {
    name: 'Whey Protein Shake com Frutas Vermelhas',
    calories: 320, protein: 28, carbs: 34, fat: 6,
    emoji: '🥤',
    healthRating: 'healthy',
    healthText: 'Excelente',
    tags: ['Pós-treino', 'Rico em Proteína', 'Leve'],
    feedback: 'Ótimo para recuperação pós-atividade. Alto em proteína e carboidratos simples para reposição de energia rápida.'
  }
];

/* ─── Etapas do loading de IA ─── */
const LOADING_STEPS = [
  { text: 'Iniciando visão computacional...', sub: 'Acessando matriz de câmera fake', progress: 15 },
  { text: 'Analisando densidade do prato...', sub: 'Detectando volume e ingredientes', progress: 40 },
  { text: 'Reconhecendo macros...', sub: 'Calculando proporções de proteínas', progress: 65 },
  { text: 'Processando déficit calórico...', sub: 'Cruzando com seu perfil do UniSlim', progress: 85 },
  { text: 'Finalizando estratégia...', sub: 'Tudo pronto!', progress: 100 }
];

const MealScanner = () => {
  const { mealHistory, addMeal } = useContext(AppContext);

  // Estados principais
  const [phase, setPhase] = useState('idle'); // idle | preview | loading | result
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  // Configuração da Chave de API do Gemini para detecção real
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('unislim_gemini_key') || '');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [tempKey, setTempKey] = useState(geminiKey);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Função auxiliar para analisar comida usando a API do Gemini
  const analyzeWithGemini = async (base64Image, apiKey) => {
    const mimeType = base64Image.match(/data:([^;]+);base64/)?.[1] || 'image/jpeg';
    const base64Data = base64Image.split(',')[1];

    const prompt = `Analise esta imagem de refeição/comida e extraia as informações exatas e fiéis de calorias e macronutrientes. 
Se a imagem não for de comida ou for impossível de identificar, tente estimar de forma coerente ou use o contexto do prato.
Retorne APENAS um objeto JSON válido, sem qualquer bloco de código markdown (como \`\`\`json), sem textos adicionais antes ou depois. 
O JSON deve seguir exatamente esta estrutura de exemplo:
{
  "name": "Nome descritivo do prato em português (ex: Salmão Grelhado com Arroz)",
  "calories": 450,
  "protein": 35,
  "carbs": 40,
  "fat": 15,
  "emoji": "🐟",
  "healthRating": "healthy",
  "healthText": "Excelente",
  "tags": ["Premium", "Proteico", "Equilibrado"],
  "feedback": "Opinião curta e estratégica da IA em português sobre os benefícios desta refeição para a saúde."
}

As regras para as propriedades são:
- calories: número inteiro de calorias estimadas.
- protein: gramas de proteína (inteiro).
- carbs: gramas de carboidrato (inteiro).
- fat: gramas de gordura (inteiro).
- emoji: um único emoji condizente com a refeição.
- healthRating: deve ser exatamente "healthy", "neutral" ou "attention".
- healthText: deve ser exatamente "Excelente", "Moderado" ou "Atenção".
- tags: array de strings com 2 ou 3 tags curtas e estratégicas (ex: ["Rico em Fibras", "Leve"]).
- feedback: uma breve explicação nutricional estratégica em português.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API do Gemini: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Resposta vazia da API do Gemini.");
    }

    const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  };

  // Manipulador de imagem carregada
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setPhase('preview');
      setSaved(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Efeito de loop de carregamento da IA com chamada Gemini real
  const handleAnalyze = () => {
    setPhase('loading');
    setLoadingStep(0);
    setLoadingProgress(0);

    const activeKey = geminiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
    let apiResult = null;
    let apiError = null;

    const apiPromise = (async () => {
      if (activeKey) {
        try {
          const res = await analyzeWithGemini(imagePreview, activeKey);
          apiResult = res;
        } catch (err) {
          console.error("Erro na análise real:", err);
          apiError = err;
        }
      }
    })();

    let stepIndex = 0;
    const stepInterval = setInterval(async () => {
      if (stepIndex < LOADING_STEPS.length - 1) {
        stepIndex++;
        setLoadingStep(stepIndex);
        setLoadingProgress(LOADING_STEPS[stepIndex].progress);
      } else {
        clearInterval(stepInterval);

        // Aguarda a conclusão da API se ela estiver rodando
        if (activeKey) {
          try {
            await apiPromise;
          } catch {
            // Ignorado, o erro já é tratado no escopo da promise
          }
        }

        if (apiResult) {
          setResult(apiResult);
        } else {
          // Fallback se falhou ou não tem chave
          if (activeKey && apiError) {
            alert("A análise da IA real falhou (usando simulação de fallback). Detalhe: " + apiError.message);
          }
          const meal = MEAL_DATABASE[Math.floor(Math.random() * MEAL_DATABASE.length)];
          setResult(meal);
        }
        setTimeout(() => setPhase('result'), 500);
      }
    }, 800);
  };

  // Salvar no histórico
  const handleSave = () => {
    if (!result || saved) return;
    addMeal({
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      emoji: result.emoji,
      imageData: imagePreview,
      date: new Date().toISOString()
    }, selectedFile);
    setSaved(true);
  };

  const handleReset = () => {
    setPhase('idle');
    setImagePreview(null);
    setSelectedFile(null);
    setResult(null);
    setSaved(false);
    setLoadingStep(0);
    setLoadingProgress(0);
  };

  // Componente de mini anel calórico
  const MiniRing = ({ calories }) => {
    const max = 750;
    const pct = Math.min(calories / max, 1);
    const r = 18;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - pct);

    return (
      <svg width="46" height="46" viewBox="0 0 46 46">
        <circle cx="23" cy="23" r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="4" />
        <circle
          cx="23" cy="23" r={r} fill="none"
          stroke="var(--color-primary)" strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 23 23)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
    );
  };

  /* ────────────────────────────────────────────────────────
     FASE 1: IDLE (TELA INICIAL DE CÂMERA SIMULADA)
     ──────────────────────────────────────────────────────── */
  if (phase === 'idle') {
    const hasActiveKey = geminiKey || import.meta.env.VITE_GEMINI_API_KEY;

    return (
      <div className="screen-container scanner-container">
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileSelect} />

        <header style={{ marginBottom: '8px' }}>
          <div className="scanner-header-badge">
            <span className="scanner-header-badge-dot" />
            Scanner Inteligente
          </div>
          <h1 className="scanner-title">Analise sua Refeição</h1>
          <p className="scanner-subtitle">
            Aponte a câmera para seu prato de comida e descubra calorias e macronutrientes instantaneamente por IA.
          </p>
        </header>

        {/* Gemini API Key Config */}
        <div className={`gemini-key-card ${hasActiveKey ? 'active' : 'inactive'}`}>
          <div className="gemini-key-header" onClick={() => setShowKeyConfig(!showKeyConfig)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`status-dot ${hasActiveKey ? 'active' : 'inactive'}`} />
              <span className="status-text">
                {hasActiveKey ? 'IA Real Ativa (Gemini)' : 'Modo Simulação (Sem Chave)'}
              </span>
            </div>
            <button className="btn-key-toggle">
              {showKeyConfig ? 'Fechar ✕' : 'Configurar Key ⚙️'}
            </button>
          </div>

          {showKeyConfig && (
            <div className="gemini-key-dropdown">
              <p className="dropdown-info">
                Para analisar imagens reais de alimentos de forma 100% fiel, insira uma chave de API gratuita do Gemini:
              </p>
              <div className="key-input-row">
                <input
                  type="password"
                  placeholder="Cole sua API Key do Gemini..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="key-input"
                />
                <button
                  onClick={() => {
                    const cleanKey = tempKey.trim();
                    setGeminiKey(cleanKey);
                    if (cleanKey) {
                      localStorage.setItem('unislim_gemini_key', cleanKey);
                    } else {
                      localStorage.removeItem('unislim_gemini_key');
                    }
                    setShowKeyConfig(false);
                  }}
                  className="btn-key-save"
                >
                  Salvar
                </button>
              </div>
              <p className="dropdown-help">
                Como obter uma chave? Crie grátis no <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'underline' }}>Google AI Studio</a>.
              </p>
            </div>
          )}
        </div>

        {/* Câmera Simulada Premium */}
        <div className="scan-camera-fake" onClick={() => cameraInputRef.current?.click()}>
          <div className="scan-camera-lens-glow" />
          <div className="scan-camera-corners" />
          <div className="scan-camera-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <span className="scan-camera-text-primary">Escanear Refeição</span>
          <span className="scan-camera-text-secondary">Toque para abrir a câmera</span>
        </div>

        {/* Acesso à Galeria */}
        <button className="gallery-selector-btn" onClick={() => fileInputRef.current?.click()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Carregar da Galeria
        </button>

        {/* Histórico Recente */}
        <div className="scanner-history-section" style={{ marginTop: '8px' }}>
          <p className="scanner-history-title" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>
            Últimos registros
          </p>
          {mealHistory.length === 0 ? (
            <div className="scanner-history-empty" style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px dashed var(--border-subtle)', marginTop: '8px' }}>
              <p className="scanner-history-empty-text" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Nenhuma refeição registrada hoje.</p>
            </div>
          ) : (
            <div className="scanner-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {mealHistory.slice(0, 3).map((meal, index) => (
                <div key={index} className="scanner-history-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: 'var(--bg-card)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {meal.imageData ? (
                      <img src={meal.imageData} alt={meal.name} style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }} loading="lazy" />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{meal.emoji}</div>
                    )}
                    <div>
                      <p style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>{meal.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                        P: {meal.protein}g • C: {meal.carbs}g • G: {meal.fat}g
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>{meal.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────
     FASE 2: PREVIEW (CONFIRMAR IMAGEM ANTES DO SCAN)
     ──────────────────────────────────────────────────────── */
  if (phase === 'preview') {
    return (
      <div className="screen-container scanner-container">
        <header>
          <h1 className="scanner-title">Foto pronta</h1>
          <p className="scanner-subtitle">Confirme sua imagem abaixo para iniciar o cálculo de IA.</p>
        </header>

        <div className="scan-preview-wrapper">
          <img src={imagePreview} alt="Preview da refeição" className="scan-camera-preview" loading="lazy" />
          <button className="scan-preview-change-btn" onClick={() => cameraInputRef.current?.click()}>Trocar foto</button>
        </div>

        <button className="btn-scan-action" onClick={handleAnalyze}>
          <span>✨ Analisar com IA</span>
        </button>

        <button className="btn-scan-cancel" onClick={handleReset}>Cancelar</button>
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────
     FASE 3: LOADING (LINHA LASER E FEEDBACK EM TEMPO REAL)
     ──────────────────────────────────────────────────────── */
  if (phase === 'loading') {
    const currentStep = LOADING_STEPS[loadingStep];

    return (
      <div className="screen-container scanner-container">
        <header>
          <h1 className="scanner-title">Análise ativa</h1>
          <p className="scanner-subtitle">Nossos modelos de visão computacional estão processando seu prato.</p>
        </header>

        <div className="scan-preview-wrapper">
          <img src={imagePreview} alt="Analisando" className="scan-camera-preview" loading="lazy" />
          <div className="scan-laser-line" />
          <div className="scan-camera-lens-glow" />
        </div>

        <div className="scanner-loading-text-area" key={loadingStep}>
          <p className="scanner-loading-step-text">{currentStep.text}</p>
          <p className="scanner-loading-step-sub">{currentStep.sub}</p>
          <div className="scanner-progress-track">
            <div className="scanner-progress-fill" style={{ width: `${loadingProgress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────
     FASE 4: RESULTADO (MACROS E CARD PREMIUM)
     ──────────────────────────────────────────────────────── */
  if (phase === 'result' && result) {
    return (
      <div className="screen-container scanner-container">
        <div className="scanner-result-wrapper">
          
          {/* Card superior com imagem e nome */}
          <div className="scan-result-card-header">
            {imagePreview ? (
              <img src={imagePreview} alt={result.name} loading="lazy" />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', backgroundColor: 'var(--color-primary-light)' }}>
                {result.emoji}
              </div>
            )}
            <div className="scan-result-card-gradient" />
            
            <div className="scan-result-title-overlay">
              <span className={`health-pill ${result.healthRating}`}>{result.healthText}</span>
              <h2 className="name">{result.name}</h2>
            </div>
          </div>

          {/* Ficha técnica calórica */}
          <div className="scan-calories-detail-card">
            <div className="label-grp">
              <span className="lbl">Estimado por porção</span>
              <span className="val">{result.calories} kcal</span>
            </div>
            <MiniRing calories={result.calories} />
          </div>

          {/* Grid de Macros */}
          <div className="last-scanned-card" style={{ padding: '0', border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}>
            <div className="macros-mini-grid" style={{ border: 'none', paddingTop: '0' }}>
              <div className="macro-item" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px' }}>
                <span className="emoji">🥩</span>
                <div className="macro-details">
                  <span className="macro-label">Proteína</span>
                  <span className="macro-value">{result.protein}g</span>
                </div>
              </div>
              <div className="macro-item" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px' }}>
                <span className="emoji">🌾</span>
                <div className="macro-details">
                  <span className="macro-label">Carbo</span>
                  <span className="macro-value">{result.carbs}g</span>
                </div>
              </div>
              <div className="macro-item" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px' }}>
                <span className="emoji">🫒</span>
                <div className="macro-details">
                  <span className="macro-label">Gordura</span>
                  <span className="macro-value">{result.fat}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Inteligente */}
          <div className="last-scanned-card" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px' }}>
            <div className="section-header">
              <span className="section-header-title">Opinião da IA</span>
              <span className="section-header-badge">Estratégia</span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {result.feedback}
            </p>
            <div className="scan-feedback-tags-row">
              {result.tags.map((tag, i) => (
                <span key={i} className="scan-tag-pill">{tag}</span>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button className="btn-scan-action" onClick={handleSave} disabled={saved}>
              <span>{saved ? '✓ Refeição Salva' : 'Salvar no meu Diário'}</span>
            </button>
            <button className="btn-scan-cancel" onClick={handleReset}>Nova Foto</button>
          </div>

        </div>
      </div>
    );
  }

  return null;
};

export default MealScanner;
