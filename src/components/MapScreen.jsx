import { gameManager } from '../game_logic';
import { motion } from 'framer-motion';

const MapScreen = ({ onSelectWorld, onOpenBank, onOpenStore, balance, config }) => {
  return (
    <div className="app-container fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', paddingBottom: '2rem' }}>
      
      {/* HUD v2.0 - Consistência com a Game Screen */}
      <div className="hud-bar glass" style={{ margin: '1rem', borderRadius: '50px', padding: '0.8rem 1.5rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--primary)', overflow: 'hidden', background: '#000' }}>
            <img src={config.selectedAvatar || 'https://tr.rbxcdn.com/38c61c33c3a07af892523271d7d9179d/420/420/Avatar/Png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' }}>MARCO</div>
        </div>
        
        <div className="stat-pill" style={{ background: 'rgba(0,0,0,0.3)', border: 'none' }}>
          <div className="stat-icon" style={{ background: '#ffd700', color: '#000', fontWeight: '900', fontSize: '0.9rem' }}>R$</div>
          <span style={{ color: '#ffd700', fontSize: '1.2rem' }}>{balance.toFixed(0)}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
        <h1 className="hero-text" style={{ fontSize: '2.4rem', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
          MAPA <span style={{ color: 'var(--primary)' }}>BROOKHAVEN</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: '700', marginTop: '0.5rem' }}>ESCOLHA SUA PRÓXIMA MISSÃO</p>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: 'flex', gap: '1rem', padding: '0 1.5rem', marginBottom: '3rem' }}>
        <button onClick={onOpenBank} className="btn-secondary" style={{ flex: 1, padding: '1rem' }}>🏦 BANCO</button>
        <button onClick={onOpenStore} className="btn-secondary" style={{ flex: 1, padding: '1rem' }}>🛒 LOJA</button>
      </div>

      {/* FLOATING ISLANDS ARCHIPELAGO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '0 1.5rem' }}>
        {gameManager.db.worlds.map((w, index) => {
          const is_locked = !gameManager.unlockedWorlds.includes(w.id);
          const quotas = gameManager.getOrInitQuotas(w.id);
          const totalRemaining = Object.values(quotas).reduce((a, b) => a + b, 0);
          const is_complete = totalRemaining === 0;
          
          const icons = { 1: '🏘️', 2: '🚓', 3: '🏦' };
          const names = { 1: 'Bairro Nobre', 2: 'Delegacia Central', 3: 'Banco Brookhaven' };

          return (
            <motion.div
              key={w.id}
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end', width: '90%' }}
            >
              <button 
                onClick={() => !is_locked && onSelectWorld(w.id)}
                disabled={is_locked}
                className="island-card"
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  background: is_locked ? 'rgba(255,255,255,0.02)' : (is_complete ? 'rgba(0, 255, 127, 0.05)' : 'rgba(23, 27, 38, 0.8)'),
                  borderColor: is_locked ? 'rgba(255,255,255,0.05)' : (is_complete ? '#00FF7F' : 'var(--primary)'),
                  opacity: is_locked ? 0.6 : 1,
                  filter: is_locked ? 'grayscale(0.8)' : 'none',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  textAlign: 'left'
                }}
              >
                {/* STATUS BADGE */}
                {!is_locked && (
                  <div style={{ 
                    position: 'absolute', top: '-10px', right: '10px', 
                    background: is_complete ? '#00FF7F' : 'var(--primary)', 
                    color: '#000', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '900' 
                  }}>
                    {is_complete ? '🏆 CONCLUÍDO' : '🚀 EM MISSÃO'}
                  </div>
                )}

                <div style={{ fontSize: '3rem', flexShrink: 0 }}>
                  {is_locked ? '🔒' : icons[w.id]}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: is_locked ? '#777' : '#FFF' }}>
                    {names[w.id]}
                  </div>
                  
                  {/* PROGRESS TRACKER FOR CHILD (BARRA DE PROGRESSO NEON) */}
                  {!is_locked && !is_complete && (
                    <div style={{ marginTop: '1.2rem', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.7rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>DOMÍNIO DO MUNDO</span>
                        <span style={{ color: 'var(--primary)', fontWeight: '900' }}>{Math.round(((1500 - totalRemaining) / 1500) * 100)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((1500 - totalRemaining) / 1500) * 100}%` }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, #32cd32, var(--primary))', boxShadow: '0 0 10px var(--primary)' }}
                        />
                      </div>
                      {/* SUBTITLE */}
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>
                        {1500 - totalRemaining} de 1.500 missões galácticas completas
                      </p>
                    </div>
                  )}
                  {is_complete && (
                    <div style={{ marginTop: '0.8rem', color: '#00FF7F', fontWeight: '900', fontSize: '0.8rem', textShadow: '0 0 10px rgba(0,255,127,0.3)' }}>
                      🏆 MESTRE DESTE MUNDO
                    </div>
                  )}
                </div>
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

export default MapScreen;
