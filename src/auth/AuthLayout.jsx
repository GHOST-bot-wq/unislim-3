import React from 'react';
import './auth.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout-container">
      {/* Orbs de glow cinematográficos no fundo para profundidade */}
      <div className="auth-ambient-glow">
        <div className="auth-glow-orb primary" />
        <div className="auth-glow-orb secondary" />
        <div className="auth-glow-orb tertiary" />
        <div className="auth-glow-orb pink-glow" />
      </div>
      
      {/* Container de conteúdo */}
      <div className="auth-content-wrapper">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
