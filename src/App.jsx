import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
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

// Folha de Estilos Globais
import './styles/global.css';

const AppContent = () => {
  const { goals, activeTab } = useContext(AppContext);

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
      <div className={`theme-${goals.theme || 'calm'}`} style={{ display: 'contents' }}>
        {renderActiveScreen()}
        <NavigationBar />
      </div>
    </DeviceFrame>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
