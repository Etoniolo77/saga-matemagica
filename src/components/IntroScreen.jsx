import React from 'react';
import { motion } from 'framer-motion';
import { settingsService } from '../services/SettingsService';

const IntroScreen = ({ onStart, onParentAccess }) => {
  const config = settingsService.getConfig();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="screen"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}
    >
      <div className="card" style={{ width: '90%', maxWidth: '420px', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ 
          width: '180px', height: '180px', 
          margin: '0 auto 1.5rem', 
          border: 'var(--blox-border)', 
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#FFF',
          boxShadow: 'var(--blox-shadow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {config.selectedAvatar ? (
            <img src={config.selectedAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
          ) : (
            <div style={{ fontSize: '4rem' }}>❓</div>
          )}
        </div>
        
        <h1 style={{ fontSize: '2.8rem', color: '#111', marginBottom: '0.2rem', textTransform: 'uppercase', fontWeight: 900 }}>
          {config.childName.toUpperCase() || 'AVENTUREIRO'}
        </h1>
        <p style={{ color: '#444', fontSize: '1.2rem', marginBottom: '2.5rem', fontWeight: 'bold' }}>
          PRONTO PARA O DESAFIO? 🏆
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <button onClick={onStart} className="btn-primary" style={{ width: '100%', padding: '1.5rem' }}>
            🎮 JOGAR AGORA!
          </button>
          <button 
            onClick={onParentAccess} 
            className="btn-secondary" 
            style={{ width: '100%', background: '#94a3b8', fontSize: '1rem', padding: '1rem' }}
          >
            ⚙️ ÁREA DOS PAIS
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroScreen;
