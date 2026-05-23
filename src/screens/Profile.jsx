import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import useAuth from '../hooks/useAuth';
import ProfileCard from '../components/ProfileCard';
import GoalCard from '../components/GoalCard';
import ThemeSelector from '../components/ThemeSelector';
import ProfileModal from '../components/ProfileModal';
import '../styles/profile.css';

const Profile = () => {
  const { 
    goals, 
    streak, 
    mealHistory, 
    dailyPlan, 
    adjustedGoals, 
    resetData,
    profileImage,
    setProfileImage
  } = useContext(AppContext);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const fileInputRef = useRef(null);
  
  // Toggles fakes para configurações
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  // Mensagens motivacionais baseadas no tema ou objetivo
  const getMotivationalSentence = () => {
    const name = goals.name || 'Leonardo';
    const mainGoal = goals.mainGoal || 'lose_weight';

    if (mainGoal === 'lose_weight') {
      return "Cada escolha consciente aproxima você do seu peso ideal.";
    } else if (mainGoal === 'gain_muscle') {
      return "Consistência e nutrição inteligente moldam sua melhor versão.";
    }
    return "O equilíbrio e a harmonia diária guiam sua longevidade.";
  };

  // Conquistas Dinâmicas (Calculadas)
  const achievementsList = [
    {
      id: 'streak_3',
      emoji: '🏆',
      title: '3 dias focados',
      desc: 'Manteve consistência por 3 dias',
      unlocked: streak >= 3
    },
    {
      id: 'hydration_done',
      emoji: '💧',
      title: 'Hidratação batida',
      desc: 'Bateu a meta de água diária',
      unlocked: dailyPlan.hydration >= (adjustedGoals?.hydrationGoal || 8)
    },
    {
      id: 'first_scan',
      emoji: '📸',
      title: 'Scanner Ativo',
      desc: 'Primeira refeição analisada por IA',
      unlocked: mealHistory.length >= 1
    },
    {
      id: 'streak_7',
      emoji: '🔥',
      title: 'Consistência de ferro',
      desc: 'Manteve sequência de 7 dias',
      unlocked: streak >= 7
    }
  ];

  const handleResetProgress = () => {
    if (window.confirm("Deseja redefinir todo o seu progresso? Isso apagará o histórico de refeições e hábitos.")) {
      resetData();
    }
  };

  const { logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("Deseja realmente sair da sua conta?")) {
      await logout();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setShowPhotoOptions(false);
  };

  const getAvatarContent = () => {
    if (profileImage) {
      return (
        <img 
          src={profileImage} 
          alt="Foto de Perfil" 
          className="profile-uploaded-image" 
          loading="lazy"
        />
      );
    }
    const nameLetter = (goals.name || 'Leonardo').charAt(0).toUpperCase();
    return <span className="profile-large-avatar-letter">{nameLetter}</span>;
  };

  return (
    <div className="screen-container profile-screen-container">
      {/* Brilhos de fundo adaptativos ao tema */}
      <div className="profile-ambient-glow">
        <div className="glow-orb primary" />
        <div className="glow-orb secondary" />
      </div>

      {/* HEADER DO PERFIL */}
      <header className="profile-premium-header">
        <div 
          className="profile-avatar-breathing-wrapper"
          onClick={() => setShowPhotoOptions(true)}
          title="Opções da foto"
          style={{ cursor: 'pointer' }}
        >
          <div className="avatar-breathing-glow" />
          <div className="avatar-inner-circle">
            {getAvatarContent()}
          </div>
          <div className="avatar-camera-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>
        <h2 className="profile-username">{goals.name || 'Leonardo'}</h2>
        <p className="profile-motto">“{getMotivationalSentence()}”</p>
        
        <button 
          className="btn-profile-edit-trigger"
          onClick={() => setIsEditOpen(true)}
        >
          Editar Perfil
        </button>
      </header>

      {/* CARD DE EVOLUÇÃO (GoalCard) */}
      <section className="profile-section">
        <GoalCard />
      </section>

      {/* CARD DE DADOS PESSOAIS (ProfileCard) */}
      <section className="profile-section">
        <ProfileCard onEdit={() => setIsEditOpen(true)} />
      </section>

      {/* SELETOR DE TEMAS EMOCIONAIS (ThemeSelector) */}
      <section className="profile-section">
        <ThemeSelector />
      </section>

      {/* CONQUISTAS PREMIUM */}
      <section className="profile-section">
        <h3 className="profile-section-title">Conquistas Premium</h3>
        <p className="profile-section-subtitle">Pequenos marcos que celebram sua jornada saudável</p>
        
        <div className="achievements-scroll-container">
          {achievementsList.map(ach => (
            <div 
              key={ach.id} 
              className={`achievement-badge-card ${ach.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="badge-glow" />
              <div className="badge-content">
                <span className="badge-emoji">{ach.emoji}</span>
                <h4 className="badge-title">{ach.title}</h4>
                <p className="badge-desc">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LISTA DE CONFIGURAÇÕES */}
      <section className="profile-section settings-section">
        <h3 className="profile-section-title">Preferências</h3>
        
        <div className="settings-list-card">
          <div className="settings-item">
            <span className="settings-label">Notificações Diárias</span>
            <label className="settings-toggle">
              <input 
                type="checkbox" 
                checked={notifications} 
                onChange={() => setNotifications(!notifications)} 
              />
              <span className="slider" />
            </label>
          </div>

          <div className="settings-item">
            <span className="settings-label">Lembretes de Água</span>
            <label className="settings-toggle">
              <input 
                type="checkbox" 
                checked={reminders} 
                onChange={() => setReminders(!reminders)} 
              />
              <span className="slider" />
            </label>
          </div>

          <button 
            className="settings-action-btn danger" 
            onClick={handleResetProgress}
          >
            🔄 Redefinir Progresso do App
          </button>

          <button 
            className="settings-action-btn logout" 
            onClick={handleLogout}
          >
            🚪 Sair da Conta
          </button>
          
          <div className="settings-footer-text">
            <span>Privacidade & Termos</span>
            <span>UniSlim v3.4 (Premium IA)</span>
          </div>
        </div>
      </section>

      {/* MODAL DE OPÇÕES DE FOTO */}
      {showPhotoOptions && (
        <div className="photo-options-overlay" onClick={() => setShowPhotoOptions(false)}>
          <div className="photo-options-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="photo-options-sheet-bar" />
            <h4 className="photo-options-title">Foto de Perfil</h4>
            <div className="photo-options-buttons">
              <button 
                className="photo-option-btn action" 
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                📸 Selecionar da Galeria
              </button>
              {profileImage && (
                <button 
                  className="photo-option-btn danger" 
                  onClick={() => {
                    setProfileImage('');
                    setShowPhotoOptions(false);
                  }}
                >
                  🗑️ Remover Foto Atual
                </button>
              )}
              <button 
                className="photo-option-btn cancel" 
                onClick={() => setShowPhotoOptions(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input de arquivo oculto */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleFileChange}
      />

      {/* MODAL DE EDICAO */}
      <ProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />
    </div>
  );
};

export default Profile;
