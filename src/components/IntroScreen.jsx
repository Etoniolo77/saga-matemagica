import React from 'react';
import { motion } from 'framer-motion';
import { settingsService } from '../services/SettingsService';

const IntroScreen = ({ onStart, onParentAccess }) => {
  const config = settingsService.getConfig();

  return (
    <div className="app-container fade-in">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        
        {/* AVATAR ISLAND */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="island-card" 
          style={{ width: '100%', maxWidth: '380px', textAlign: 'center', position: 'relative' }}
        >
          <div style={{ 
            width: '180px', height: '180px', 
            margin: '0 auto 2rem', 
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'var(--surface-variant)',
            border: '4px solid var(--primary)',
            boxShadow: '0 0 30px rgba(107, 254, 156, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <img 
              src={config.selectedAvatar || 'https://tr.rbxcdn.com/38c61c33c3a07af892523271d7d9179d/420/420/Avatar/Png'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="Avatar" 
            />
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#FFF', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 900 }}>
            {config.childName || 'HERÓI'}
          </h1>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '50px', display: 'inline-block', marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.2rem' }}>Nível {config.journey.level || 1}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <button onClick={onStart} className="btn-primary" style={{ padding: '1.5rem', fontSize: '1.8rem', boxShadow: '0 0 20px rgba(107, 254, 156, 0.3)' }}>
              ▶️ JOGAR!
            </button>
            <button 
              onClick={onParentAccess} 
              className="btn-secondary" 
              style={{ width: '100%', background: 'transparent', opacity: 0.7, fontSize: '0.9rem' }}
            >
              ⚙️ ÁREA DOS PAIS
            </button>
          </div>
        </motion.div>

        <p style={{ marginTop: '2rem', opacity: 0.4, color: '#FFF', fontSize: '0.8rem', letterSpacing: '2px' }}>
          SAGA MATEMÁGICA: ROBLOX CHRONICLES
        </p>
      </div>
    </div>
  );
};

export default IntroScreen;
