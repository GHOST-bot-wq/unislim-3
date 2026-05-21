import React from 'react';
import './auth.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout-container">
      {/* 3 Orbs com glow desfocado no fundo para ar de luxo */}
      <div className="auth-ambient-glow">
        <div className="auth-glow-orb primary" />
        <div className="auth-glow-orb secondary" />
        <div className="auth-glow-orb tertiary" />
      </div>
      
      {/* Container de conteúdo */}
      <div className="auth-content-wrapper">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
