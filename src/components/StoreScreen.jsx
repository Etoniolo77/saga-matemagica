import React from 'react';
import { settingsService } from '../services/SettingsService';
import { motion } from 'framer-motion';

const StoreScreen = ({ onBack, balance, onPurchase, config: appConfig }) => {
  const config = settingsService.getConfig(); // Itens configurados pelos pais

  return (
    <div className="app-container fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', paddingBottom: '3rem' }}>
      
      {/* HUD v2.0 */}
      <div className="hud-bar glass" style={{ margin: '1rem', borderRadius: '50px', padding: '0.8rem 1.5rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--primary)', overflow: 'hidden', background: '#000' }}>
            <img src={appConfig.selectedAvatar || 'https://tr.rbxcdn.com/38c61c33c3a07af892523271d7d9179d/420/420/Avatar/Png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' }}>MARCO</div>
        </div>
        
        <div className="stat-pill" style={{ background: 'rgba(0,0,0,0.3)', border: 'none' }}>
          <div className="stat-icon" style={{ background: '#ffd700', color: '#000', fontWeight: '900', fontSize: '0.9rem' }}>R$</div>
          <span style={{ color: '#ffd700', fontSize: '1.2rem' }}>{balance.toFixed(0)}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '1rem 0 2.5rem' }}>
        <h1 className="hero-text" style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '3px' }}>
          BOUTIQUE <span style={{ color: 'var(--primary)' }}>ROBUX</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: '700', marginTop: '0.5rem', textTransform: 'uppercase' }}>Troque seus acertos por recompensas reais!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', padding: '0 1.5rem' }}>
        {config.storeItems.map((item, index) => {
          const canAfford = balance >= item.price;
          return (
            <motion.div 
              key={item.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              style={{ width: '100%' }}
            >
              <div className="island-card" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(23, 27, 38, 0.7)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '4.5rem', marginBottom: '1.2rem', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.2))' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.5rem', color: '#FFF' }}>{item.name}</h3>
                </div>
                
                <div>
                  <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.4rem', marginBottom: '1rem', textShadow: '0 0 10px rgba(0,255,0,0.2)' }}>
                    R$ {item.price.toFixed(0)}
                  </div>
                  <button 
                    onClick={() => canAfford && onPurchase(item.name, item.price)}
                    className={canAfford ? "btn-primary" : "btn-secondary"} 
                    style={{ 
                      width: '100%', 
                      fontSize: '0.85rem', 
                      padding: '0.8rem 0.5rem', 
                      opacity: canAfford ? 1 : 0.4,
                      cursor: canAfford ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {canAfford ? 'ADQUIRIR 🛒' : 'FALTA R$'}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ padding: '2rem 1.5rem' }}>
        <button onClick={onBack} className="btn-secondary" style={{ width: '100%', padding: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>
          VOLTAR PARA O MAPA 🏠
        </button>
      </div>
    </div>
  );
};

export default StoreScreen;
