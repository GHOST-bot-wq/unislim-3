import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import DeviceFrame from './components/DeviceFrame';
import NavigationBar from './components/NavigationBar';

// Telas do App
import Home from './screens/Home';
import DailyPlan from './screens/DailyPlan';
import CheckIn from './screens/CheckIn';
import Progress from './screens/Progress';

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
        return <CheckIn />;
      case 'progress':
        return <Progress />;
      default:
        return <Home />;
    }
  };

  return (
    <DeviceFrame>
      {renderActiveScreen()}
      <NavigationBar />
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
