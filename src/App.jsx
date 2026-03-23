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
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('intro'); 
  
  // HUD states bound to GameManager
  const [lives, setLives] = useState(gameManager.lives);
  const [energy, setEnergy] = useState(gameManager.energy);
  const [balance, setBalance] = useState(gameManager.balance);
  const [remainingSkips, setRemainingSkips] = useState(gameManager.checkAndResetSkips());
  const [currentQuest, setCurrentQuest] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const promptParentAccess = () => {
    setShowPinModal(true);
    setPinInput('');
  };

  const verifyPin = () => {
    if (pinInput === settings.parentPin) {
      setShowPinModal(false);
      setScreen('parent');
    } else {
      alert('PIN INCORRETO! ⛔ Apenas os pais podem entrar aqui.');
      setPinInput('');
    }
  };

  useEffect(() => {
    supabaseService.getSession().then(session => {
      setSession(session);
      if (!session) {
        setScreen('auth');
      } else if (!settings.childName) {
        setScreen('profile');
      }
      setLoading(false);
    });
  }, [settings.childName]);

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
    setScreen('auth');
  };

  const handleLevelComplete = () => {
    setEnergy(gameManager.energy);
    setLives(gameManager.lives);
    setBalance(gameManager.balance);
    setRemainingSkips(gameManager.checkAndResetSkips());
    
    const nextQ = gameManager.getNextQuestion();
    setCurrentQuest(nextQ);
  };

  const handlePurchase = (itemName, price) => {
    if (gameManager.buyItem(itemName, price)) {
      setBalance(gameManager.balance);
    }
  };

  if (loading) return <div className="screen" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><h1>CARREGANDO...</h1></div>;

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {screen === 'auth' && (
          <AuthScreen 
            key="auth" 
            onAuthSuccess={(s) => {
              setSession(s);
              setScreen(!settings.childName ? 'profile' : 'intro');
            }} 
            onBack={() => setScreen('auth')} 
          />
        )}
        
        {screen === 'intro' && session && (
          <IntroScreen 
            key="intro" 
            onStart={startAdventure} 
            onParentAccess={promptParentAccess} 
          />
        )}

        {/* CADEADO PARENTAL (PIN) */}
        {showPinModal && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card" 
              style={{ width: '300px', padding: '2rem', textAlign: 'center' }}
            >
              <h2 style={{ marginBottom: '1rem' }}>🔐 ÁREA DOS PAIS</h2>
              <p style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Digite sua senha (PIN):</p>
              
              <input 
                type="password" 
                maxLength={4} 
                autoFocus
                placeholder="****"
                style={{
                  width: '100%', padding: '1rem', fontSize: '2rem', textAlign: 'center',
                  background: '#f1f5f9', border: '3px solid #cbd5e1', borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifyPin()}
              />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setShowPinModal(false)}
                  className="btn-secondary" style={{ flex: 1, background: '#94a3b8' }}
                >
                  CANCELAR
                </button>
                <button 
                  onClick={verifyPin}
                  className="btn-primary" style={{ flex: 1 }}
                >
                  ENTRAR
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {screen === 'parent' && session && (
          <ParentDashboard 
            key="parent" 
            onBack={() => setScreen('intro')} 
            onLogout={handleLogout} 
          />
        )}

        {screen === 'onboarding' && (
          <OnboardingSettings 
            key="onboarding" 
            onComplete={startAdventure} 
          />
        )}

        {screen === 'profile' && session && (
          <ChildProfileScreen 
            key="profile" 
            onComplete={() => setScreen('intro')} 
          />
        )}

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
            syncStats={() => { 
                setEnergy(gameManager.energy); 
                setLives(gameManager.lives); 
                setBalance(gameManager.balance); 
            }}
          />
        )}

        {screen === 'bank' && <BankScreen key="bank" onBack={() => setScreen('quest')} balance={balance} history={gameManager.history} />}
        {screen === 'store' && <StoreScreen key="store" onBack={() => setScreen('quest')} balance={balance} onPurchase={handlePurchase} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
