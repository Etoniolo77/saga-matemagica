import { useState, useEffect } from 'react';
import { settingsService } from './services/SettingsService';
import { gameManager } from './game_logic';
import { supabaseService } from './services/SupabaseService';
import { AnimatePresence } from 'framer-motion';

// Screens
import IntroScreen from './components/IntroScreen';
import MapScreen from './components/MapScreen';
import QuestCard from './components/QuestCard';
import BankScreen from './components/BankScreen';
import StoreScreen from './components/StoreScreen';
import ParentDashboard from './components/ParentDashboard';
import ChildProfileScreen from './components/ChildProfileScreen';
import AuthScreen from './components/AuthScreen';
import OnboardingSettings from './components/OnboardingSettings';

function App() {
  const settings = settingsService.getConfig();
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState(!settings.childName ? 'profile' : 'intro'); 
  // intro | map | quest | bank | store | parent | profile | auth
  const [currentQuest, setCurrentQuest] = useState(null);
  
  // HUD states bound to GameManager
  const [lives, setLives] = useState(gameManager.lives);
  const [energy, setEnergy] = useState(gameManager.energy);
  const [balance, setBalance] = useState(gameManager.balance);
  const [remainingSkips, setRemainingSkips] = useState(gameManager.checkAndResetSkips());

  useEffect(() => {
    supabaseService.getSession().then(session => {
      setSession(session);
    });
  }, []);

  const startAdventure = () => {
    const config = settingsService.getConfig();
    if (!config.isConfigured) {
      setScreen('onboarding');
      return;
    }
    const q = gameManager.getNextQuestion();
    setCurrentQuest(q);
    setScreen('quest');
  };

  const handleLogout = async () => {
    await supabaseService.signOut();
    setSession(null);
    setScreen('intro');
  };

  const handleLevelComplete = () => {
    // Refresh stats
    setEnergy(gameManager.energy);
    setLives(gameManager.lives);
    setBalance(gameManager.balance);
    setRemainingSkips(gameManager.checkAndResetSkips());
    
    // Get next question immediately
    const nextQ = gameManager.getNextQuestion();
    setCurrentQuest(nextQ);
  };

  const handlePurchase = (itemName, price) => {
    if (gameManager.buyItem(itemName, price)) {
      setBalance(gameManager.balance); // Atualiza vivo no display assim que clica!
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {screen === 'intro' && <IntroScreen key="intro" onStart={startAdventure} onParentAccess={() => setScreen('parent')} />}
        {screen === 'map' && <MapScreen key="map" onSelectWorld={startWorld} onOpenBank={() => setScreen('bank')} onOpenStore={() => setScreen('store')} energy={energy} lives={lives} balance={balance} />}
        {screen === 'bank' && <BankScreen key="bank" onBack={() => setScreen('quest')} balance={balance} history={gameManager.history} />}
        {screen === 'store' && <StoreScreen key="store" onBack={() => setScreen('quest')} balance={balance} onPurchase={handlePurchase} />}
        {screen === 'parent' && session && (
          <ParentDashboard key="parent" onBack={() => setScreen('intro')} onLogout={handleLogout} />
        )}
        {screen === 'parent' && !session && (
          <AuthScreen 
            key="auth" 
            onAuthSuccess={() => {
              supabaseService.getSession().then(s => { setSession(s); setScreen('parent'); });
            }} 
            onBack={() => setScreen('intro')} 
          />
        )}
        {screen === 'onboarding' && (
          <OnboardingSettings key="onboarding" onComplete={startAdventure} />
        )}
        {screen === 'profile' && <ChildProfileScreen key="profile" onComplete={() => setScreen('intro')} />}
        {screen === 'quest' && currentQuest && (
          <QuestCard 
            key={currentQuest.id}
            question={currentQuest} 
            onNext={handleLevelComplete}
            energy={energy}
            lives={lives}
            balance={balance}
            remainingSkips={remainingSkips}
            onSkip={() => {
              const res = gameManager.skipQuestion();
              if (res.success) {
                setRemainingSkips(res.remaining);
                handleLevelComplete();
              } else {
                alert(res.msg);
              }
            }}
            numQuest={settings.journey.totalSolved + 1}
            totalQuests="∞"
            onOpenBank={() => setScreen('bank')}
            onOpenStore={() => setScreen('store')}
            onExit={() => setScreen('intro')}
            onChangeSubject={() => setScreen('onboarding')}
            syncStats={() => { setEnergy(gameManager.energy); setLives(gameManager.lives); setBalance(gameManager.balance); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
