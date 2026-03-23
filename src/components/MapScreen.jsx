import { gameManager } from '../game_logic';

const MapScreen = ({ onSelectWorld, onOpenBank, onOpenStore, energy, lives, balance }) => {
  return (
    <div style={{
      width: '100%', minHeight: '100vh', 
      background: 'transparent', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '3rem'
    }}>
      <div className="hud" style={{ justifyContent: 'center' }}>
        <div style={{ 
          background: '#fef08a', padding: '0.8rem 1.5rem', borderRadius: '2rem', 
          fontWeight: '900', color: '#1e293b', boxShadow: '0 8px 16px rgba(234, 179, 8, 0.4)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', border: '4px solid #ca8a04', fontSize: '1.5rem'
        }}>
          💰 R$ {balance.toFixed(2).replace('.', ',')}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <img src="/avatar_guia.png" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '4px solid #0084ff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', objectFit: 'cover' }} alt="Guia" />
        <h1 className="hero-text" style={{ margin: 0, color: '#1e293b', fontSize: '2.2rem', textShadow: '2px 2px 0 #ffffff', textAlign: 'center'}}>
          Mapa Brookhaven
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', width: '90%', maxWidth: '320px', justifyContent: 'center' }}>
        <button onClick={onOpenBank} style={{
          background: '#facc15', border: 'none', borderBottom: '6px solid #ca8a04', 
          borderRadius: '1rem', padding: '0.8rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', cursor: 'pointer', flex: 1
        }}>
          💳 Extrato
        </button>

        <button onClick={onOpenStore} style={{
          background: '#4ade80', border: 'none', borderBottom: '6px solid #16a34a', 
          borderRadius: '1rem', padding: '0.8rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', cursor: 'pointer', flex: 1
        }}>
          🛒 Loja Real
        </button>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {gameManager.db.worlds.map(w => {
          const is_locked = !gameManager.unlockedWorlds.includes(w.id);
          return (
          <button 
            key={w.id}
            onClick={() => !is_locked && onSelectWorld(w.id)}
            style={{
              background: is_locked ? '#94a3b8' : '#ffffff',
              border: 'none', padding: '1.5rem', borderRadius: '2rem',
              width: '320px', cursor: is_locked ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: is_locked ? 0.7 : 1
            }}
          >
            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {is_locked ? '🔒' : (w.id === 1 ? '🏘️' : (w.id === 2 ? '🚓' : '🏦'))}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: is_locked ? '#475569' : '#0084ff', fontFamily: 'Fredoka, sans-serif' }}>
              {w.id === 1 ? 'Bairro Nobre' : (w.id === 2 ? 'Delegacia Central' : 'Banco do Brookhaven')}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              {w.description}
            </span>
          </button>
        )})}
      </div>
    </div>
  );
};

export default MapScreen;
