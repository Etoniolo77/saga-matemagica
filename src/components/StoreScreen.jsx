import React from 'react';
import { settingsService } from '../services/SettingsService';

const StoreScreen = ({ onBack, balance, onPurchase }) => {
  const config = settingsService.getConfig(); // Usa os itens reais configurados pelos pais

  return (
    <div className="screen" style={{ background: '#FFAB00', padding: '2rem', overflowY: 'auto' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '4px solid #000' }}>
          <h1 style={{ margin: 0 }}>🛒 SUPER LOJA</h1>
          <div className="hud-item" style={{ background: '#FFF' }}>💰 R$ {balance.toFixed(2)}</div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {config.storeItems.map(item => (
            <div key={item.id} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <h3 style={{ margin: '0.5rem 0' }}>{item.name}</h3>
              <p style={{ fontWeight: 900, color: '#00E676', fontSize: '1.2rem' }}>R$ {item.price.toFixed(2)}</p>
              <button 
                onClick={() => onPurchase(item.name, item.price)}
                className="btn-primary" 
                style={{ width: '100%', fontSize: '1rem', padding: '0.5rem', background: balance >= item.price ? '#00E676' : '#94a3b8' }}
              >
                COMPRAR
              </button>
            </div>
          ))}
        </div>

        <button onClick={onBack} className="btn-secondary" style={{ width: '100%', marginTop: '2rem', background: '#000' }}>
          VOLTAR PRO JOGO
        </button>
      </div>
    </div>
  );
};

export default StoreScreen;
