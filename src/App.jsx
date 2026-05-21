import React, { useContext, useState } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import DeviceFrame from './components/DeviceFrame';
import NavigationBar from './components/NavigationBar';

// Telas do App
import Home from './screens/Home';
import DailyPlan from './screens/DailyPlan';
import IntelligentPlan from './screens/IntelligentPlan';
import MealScanner from './screens/MealScanner';
import DietPlanScreen from './screens/DietPlanScreen';
import Progress from './screens/Progress';
import Profile from './screens/Profile';

// Telas de Autenticação
import Login from './auth/Login';
import Register from './auth/Register';

// Folha de Estilos Globais
import './styles/global.css';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);
  const { goals, activeTab } = useContext(AppContext);
  
  // Controla se exibe Login ou Registro na área deslogada
  const [authView, setAuthView] = useState('login');

  // 1. Tela de Carregamento Premium
  if (loading) {
    return (
      <DeviceFrame>
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            backgroundColor: '#090a0f',
            color: '#ffffff'
          }}
        >
          <div 
            className="auth-spinner" 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderWidth: '3.5px',
              borderTopColor: '#a78bfa'
            }} 
          />
          <p 
            style={{ 
              marginTop: '16px', 
              fontSize: '13px', 
              color: '#94a3b8', 
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            Carregando UniSlim...
          </p>
        </div>
      </DeviceFrame>
    );
  }

  // 2. Proteção de Rotas: Se não autenticado, renderiza fluxo Auth
  if (!user) {
    return (
      <DeviceFrame>
        {authView === 'login' ? (
          <Login onNavigateToRegister={() => setAuthView('register')} />
        ) : (
          <Register onNavigateToLogin={() => setAuthView('login')} />
        )}
      </DeviceFrame>
    );
  }

  // 3. Usuário autenticado: Renderiza o app principal
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'plan':
        return <DailyPlan />;
      case 'checkin':
        return <IntelligentPlan />;
      case 'scanner':
        return <MealScanner />;
      case 'dietplan':
        return <DietPlanScreen />;
      case 'progress':
        return <Progress />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <DeviceFrame>
      <div className={`theme-${goals?.theme || 'calm'}`} style={{ display: 'contents' }}>
        {renderActiveScreen()}
        <NavigationBar />
      </div>
    </DeviceFrame>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
