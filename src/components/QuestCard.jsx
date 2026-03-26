import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    syncStats(); 
    
    if (result.success) {
      setOverlay(result.isLevelUp ? 'levelup' : (result.isCombo ? 'combo' : 'success'));
      setTimeout(() => {
        setOverlay(null);
        setUserAnswer('');
        onNext(); 
      }, result.isLevelUp ? 3000 : 1500);
    } else {
      setIsSubmitShake(true);
      setOverlay('error');
      setTimeout(() => {
        setIsSubmitShake(false);
        setOverlay(null);
      }, 1200); 
    }
  };

  const handleAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(question.statement_text);
      msg.lang = 'pt-BR';
      msg.rate = 0.95;
      window.speechSynthesis.speak(msg);
    }
  };

  const getSubjectColor = () => {
    switch (question.subject) {
      case 'Matemática': return 'var(--primary)';
      case 'Português': return 'var(--secondary)';
      case 'Ciências': return '#00d2ff';
      case 'História': return '#ffab00';
      default: return 'var(--primary)';
    }
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
    // Pequeno feedback sonoro ou vibração poderia entrar aqui
  };

  const handleConfirm = () => {
    if (question.input_type === 'multiple_choice') {
      if (selectedOption) handleAnswer(selectedOption);
    } else {
      if (userAnswer) handleAnswer(userAnswer);
    }
  };

  return (
    <div className="app-container fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* HUD v2.0 */}
      <div className="hud-bar glass" style={{ margin: '1rem', borderRadius: '50px', padding: '0.8rem 1.5rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--primary)', overflow: 'hidden', background: '#000' }}>
            <img src={config.selectedAvatar || 'https://tr.rbxcdn.com/38c61c33c3a07af892523271d7d9179d/420/420/Avatar/Png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' }}>Lvl {config.journey.level}</div>
        </div>
        
        <div className="stat-pill" style={{ background: 'rgba(0,0,0,0.3)', border: 'none' }}>
          <div className="stat-icon" style={{ background: '#ffd700', color: '#000', fontWeight: '900', fontSize: '0.9rem' }}>R$</div>
          <span style={{ color: '#ffd700', fontSize: '1.2rem' }}>{balance.toFixed(0)}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ width: '100%' }}>
          {/* GALACTIC PROGRESS */}
          <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((config.journey.currentXP || 0) / gameManager.getXPToNextLevel(config.journey.level)) * 100}%` }}
                style={{ height: '100%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}
              />
            </div>
          </div>

          <motion.div 
            animate={isSubmitShake ? { x: [-10, 10, -10, 10, 0] } : {}}
            className="island-card"
            style={{ marginBottom: '1rem' }}
          >
            <div className="question-title">
               <span style={{ color: getSubjectColor(), display: 'block', fontSize: '0.85rem', marginBottom: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
                 {question.subject}
               </span>
              {question.statement_text}
            </div>

            {question.input_type === 'multiple_choice' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {question.options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleOptionClick(opt)}
                    className="btn-secondary"
                    style={{ 
                      padding: '1.2rem', 
                      fontSize: '1.1rem',
                      justifyContent: 'flex-start',
                      background: selectedOption === opt ? 'rgba(107, 254, 156, 0.15)' : 'rgba(255,255,255,0.03)',
                      borderColor: selectedOption === opt ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                      boxShadow: selectedOption === opt ? '0 0 15px rgba(107, 254, 156, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ 
                      marginRight: '1rem', 
                      background: selectedOption === opt ? 'var(--primary)' : 'var(--surface-high)', 
                      color: selectedOption === opt ? 'var(--on-primary)' : '#FFF',
                      width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' 
                    }}>
                      {String.fromCharCode(65 + i)}
                    </div> 
                    {opt}
                  </button>
                ))}

                <button 
                  onClick={handleConfirm}
                  disabled={!selectedOption}
                  className="btn-primary" 
                  style={{ marginTop: '1.5rem', opacity: selectedOption ? 1 : 0.4 }}
                >
                  CONFIRMAR RESPOSTA ✅
                </button>
              </div>
            ) : (
              <div className="fade-in">
                <div style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
                  {userAnswer || '?'}
                </div>
                <Numpad onUpdate={(v) => setUserAnswer(v)} current={userAnswer} />
                <button 
                  onClick={handleConfirm}
                  disabled={!userAnswer}
                  className="btn-primary" 
                  style={{ marginTop: '2.5rem', opacity: userAnswer ? 1 : 0.4 }}
                >
                  CONFIRMAR RESPOSTA ✅
                </button>
              </div>
            )}
          </motion.div>

          {/* UTILITY BAR */}
          <div style={{ display: 'flex', gap: '0.8rem', opacity: 0.8 }}>
            <button onClick={onOpenStore} className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>🛒 LOJA</button>
            <button onClick={onOpenBank} className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>🏦 BANCO</button>
            <button onClick={onExit} className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem', color: '#ef4444' }}>🏠 SAIR</button>
          </div>
        </div>
      </div>




      {/* OVERLAY SENSORIAL */}
      <AnimatePresence>
        {overlay && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="overlay glass" 
            style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            {overlay === 'levelup' ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🏆</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--primary)' }}>NÍVEL {config.journey.level}!</h1>
                <p style={{ fontWeight: 'bold' }}>Você subiu de rank!</p>
              </motion.div>
            ) : (
              <motion.div initial={{ y: 50 }} animate={{ y: 0 }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                  {overlay === 'success' ? '🌟' : overlay === 'combo' ? '🔥' : '💡'}
                </div>
                <h1 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '3.5rem', 
                  color: overlay === 'error' ? '#dc2626' : 'var(--primary)' 
                }}>
                  {overlay === 'success' ? 'EXCELENTE!' : overlay === 'combo' ? 'SURREAL!' : 'TENTE DE NOVO!'}
                </h1>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestCard;
