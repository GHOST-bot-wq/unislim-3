import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ProfileCard = ({ onEdit }) => {
  const { goals } = useContext(AppContext);

  const getGoalLabel = (goalId) => {
    switch (goalId) {
      case 'lose_weight': return 'Emagrecer';
      case 'maintain_weight': return 'Manter Peso';
      case 'gain_muscle': return 'Ganhar Massa';
      default: return 'Emagrecer';
    }
  };

  return (
    <div className="profile-details-card">
      <div className="profile-details-header">
        <h3 className="profile-card-title">Seus Dados</h3>
        <button className="btn-profile-card-edit" onClick={onEdit}>
          Editar
        </button>
      </div>

      <div className="profile-info-grid">
        <div className="info-item">
          <span className="info-label">Nome</span>
          <span className="info-value">{goals.name || 'Leonardo'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Idade</span>
          <span className="info-value">{goals.age || '26'} anos</span>
        </div>
        <div className="info-item">
          <span className="info-label">Altura</span>
          <span className="info-value">{goals.height || '178'} cm</span>
        </div>
        <div className="info-item">
          <span className="info-label">Peso Atual</span>
          <span className="info-value">{goals.weightCurrent || '75'} kg</span>
        </div>
        <div className="info-item">
          <span className="info-label">Peso Meta</span>
          <span className="info-value">{goals.weightDesired || '68'} kg</span>
        </div>
        <div className="info-item">
          <span className="info-label">Objetivo</span>
          <span className="info-value goal-highlight">
            {getGoalLabel(goals.mainGoal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
