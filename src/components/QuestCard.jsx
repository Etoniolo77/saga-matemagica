import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { gameManager } from '../game_logic';
import Numpad from './Numpad';
import { settingsService } from '../services/SettingsService';

const QuestCard = ({ question, onNext, syncStats, balance, remainingSkips, onOpenBank, onOpenStore, onSkip, onExit, onChangeSubject }) => {
  const config = settingsService.getConfig();
  const [overlay, setOverlay] = useState(null); 
  const [isSubmitShake, setIsSubmitShake] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const handleAnswer = (answer) => {
    if (overlay || isSubmitShake) return;
    
    const result = gameManager.handleAnswer(question, answer);
    syncStats(); // Atualiza o saldo no App.jsx
    
    if (result.success) {
      if (result.isLevelUp) {
        setOverlay('levelup');
      } else {
        setOverlay(result.isCombo ? 'combo' : 'success');
      }
      
      setTimeout(() => {
        setOverlay(null);
        setUserAnswer('');
        onNext(); 
      }, result.isLevelUp ? 3000 : 2000); // 3 Segundos no level up
    } else {
      setIsSubmitShake(true);
      setOverlay('error');
      setTimeout(() => {
        setIsSubmitShake(false);
        setOverlay(null);
      }, 1500); 
    }
  };

  const handleAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(question.statement_text);
      msg.lang = 'pt-BR';
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleSkip = () => {
    const result = gameManager.skipQuestion();
    if (result.success) {
      onNext();
    } else {
      alert(result.msg);
    }
  };

  const renderActiveMiniGame = () => {
    if (question.input_type === 'multiple_choice') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          {question.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(opt)}
              className="btn-secondary"
              style={{ padding: '1.2rem', fontSize: '1.1rem', background: '#FFF', color: '#000', textTransform: 'none' }}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }
    return null;
  };

  const getSubjectColor = () => {
    switch (question.subject) {
      case 'Matemática': return '#f0f9ff';
      case 'Português': return '#fff1f2';
      case 'Ciências': return '#f0fdf4';
      case 'História': return '#fff7ed';
      case 'Geografia': return '#f5f3ff';
      default: return '#FFF';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="screen"
      style={{
        background: getSubjectColor(),
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '2rem'
      }}>
      
      <div style={{ width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <div className="hud-item" style={{ fontSize: '2rem', background: '#FFF' }}>
          💰 R$ {balance.toFixed(2).replace('.', ',')}
        </div>
        
        <div className="hud-item" style={{ fontSize: '1.2rem', background: '#00B2FF', color: '#FFF' }}>
          ⭐ PONTOS: {config.journey.score}
        </div>
        
        <div style={{ width: '100%', maxWidth: '350px', textAlign: 'left', marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>XP DO NÍVEL:</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#00E676' }}>{config.journey.currentXP || 0}/{gameManager.getXPToNextLevel(config.journey.level)}</span>
        </div>
        <div style={{ width: '100%', maxWidth: '350px', height: '24px', background: '#000', border: '4px solid #000', position: 'relative', overflow: 'hidden' }}>
          <motion.div 
            animate={{ width: `${((config.journey.currentXP || 0) / gameManager.getXPToNextLevel(config.journey.level)) * 100}%` }}
            transition={{ type: 'spring', damping: 15 }}
            style={{ height: '100%', background: '#00E676', borderRight: '4px solid #000' }}
          />
        </div>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <span style={{ fontSize: '1rem', fontWeight: '900', background: '#000', color: '#FFF', padding: '2px 8px' }}>NÍVEL {config.journey.level}</span>
           <span style={{ fontSize: '0.8rem', color: '#666' }}>({config.journey.totalXP} XP ACUMULADO)</span>
        </div>
      </div>

      <motion.div 
        animate={isSubmitShake ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="card" 
        style={{ width: '90%', maxWidth: '480px', padding: '1.5rem', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{question.statement_text}</h2>
          <button onClick={handleAudio} style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#00B2FF', fontSize: '1.2rem' }}>🔊</button>
        </div>

        {renderActiveMiniGame()}

        {question.input_type !== 'multiple_choice' && (
          <>
            <div className="input-field" style={{ fontSize: '2.5rem', padding: '0.8rem', marginBottom: '1rem', background: '#f8fafc' }}>
              {userAnswer || '?'}
            </div>
            <Numpad onUpdate={(v) => setUserAnswer(v)} current={userAnswer} />
            <button 
              onClick={() => handleAnswer(userAnswer)}
              className="btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
            >
              CONFIRMAR ✅
            </button>
          </>
        )}

        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button onClick={onOpenStore} className="btn-secondary" style={{ flex: 1, background: '#FFAB00', minWidth: '100px' }}>🛒 LOJA</button>
          <button onClick={onOpenBank} className="btn-secondary" style={{ flex: 1, background: '#00B2FF', minWidth: '100px' }}>🏦 BANCO</button>
          <button 
            onClick={onSkip} 
            className="btn-secondary" 
            style={{ flex: 1, background: '#A020F0', minWidth: '100px', opacity: remainingSkips > 0 ? 1 : 0.5 }}
          >
            ⏩ PULAR ({remainingSkips})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
          <button onClick={onChangeSubject} className="btn-secondary" style={{ flex: 2, background: '#64748b' }}>📚 TROCAR MATÉRIA</button>
          <button onClick={onExit} className="btn-secondary" style={{ flex: 1, background: '#ef4444' }}>🏠 SAIR</button>
        </div>
      </motion.div>

      {overlay && (
        <div className="overlay" style={{ background: 'rgba(255,255,255,0.96)', zIndex: 1000, position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {overlay === 'levelup' ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <img src="/roblox_treasure_chest_unlocked.png" style={{ width: '300px', marginBottom: '1rem' }} alt="Chest" />
              <h1 style={{ fontSize: '4rem', color: '#FFAB00', textShadow: '4px 4px #000' }}>LEVEL {config.journey.level} UNLOCKED! 🏆</h1>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Você abriu o baú de recompensas!</p>
            </motion.div>
          ) : (
            <>
              <img src={config.selectedAvatar} style={{ width: '200px', height: '200px', border: '10px solid #00E676', borderRadius: '40px', marginBottom: '2rem' }} alt="Avatar" />
              <h1 style={{ fontSize: '4rem', color: overlay === 'error' ? '#ef4444' : '#00E676' }}>
                {overlay === 'success' ? 'BOAAA! 🔥' : overlay === 'combo' ? 'SURREAL! 🚀' : 'QUASE LÁ! 💡'}
              </h1>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default QuestCard;
