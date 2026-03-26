import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/SettingsService';
import { supabaseService } from '../services/SupabaseService';
import { motion } from 'framer-motion';

const ParentDashboard = ({ onBack, onLogout }) => {
  const [config, setConfig] = useState(settingsService.getConfig());
  const [keys, setKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
    loadKeys();
  }, []);

  const checkAdmin = async () => {
    const session = await supabaseService.getSession();
    const userEmail = session?.user?.email?.toLowerCase();
    if (userEmail === 'evandro.toniolo@gmail.com') setIsAdmin(true);
  };

  const loadKeys = async () => {
    try {
      setLoadingKeys(true);
      const data = await supabaseService.getLicenseKeys();
      setKeys(data || []);
    } catch (err) {
      console.error("Erro chaves:", err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const generateNewKey = async () => {
    try {
      const code = 'SAGA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      await supabaseService.createLicenseKey(code);
      alert('✨ CHAVE CRIADA: ' + code);
      loadKeys();
    } catch (err) {
      alert('Erro ao criar chave.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Código Copiado! ✅');
  };

  const handleSave = () => {
    settingsService.updateConfig(config);
    alert('✨ COMANDO RECEBIDO! Configurações aplicadas.');
    window.dispatchEvent(new Event('configUpdated'));
  };

  const toggleSubject = (subject) => {
    const currentActive = config.activeSubjects || [];
    const newSubjects = currentActive.includes(subject)
      ? currentActive.filter(s => s !== subject)
      : [...currentActive, subject];
    setConfig({ ...config, activeSubjects: newSubjects });
  };

  const handleUpdateStoreItem = (id, field, value) => {
    const newItems = config.storeItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setConfig({ ...config, storeItems: newItems });
  };

  return (
    <div className="app-container fade-in" style={{ height: '100vh', overflowY: 'auto', padding: '1rem' }}>
      
      <div className="island-card" style={{ maxWidth: '600px', margin: '1rem auto 4rem', padding: '2rem', background: 'rgba(23, 27, 38, 0.9)', borderColor: 'rgba(255,255,255,0.1)' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
          <div>
            <h1 className="hero-text" style={{ fontSize: '1.8rem', margin: 0 }}>PAINEL de <span style={{ color: 'var(--primary)' }}>CONTROLE</span></h1>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem', fontWeight: '800' }}>GERENCIAMENTO DA SAGA MATEMÁGICA</p>
          </div>
          <button onClick={onLogout} className="btn-secondary" style={{ background: '#ef4444', border: 'none', padding: '0.6rem 1.2rem', fontSize: '0.7rem' }}>FECHAR</button>
        </header>

        {/* 📚 ESCOLA & FOCO */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span> FOCO DOS ESTUDOS
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: '900', display: 'block', marginBottom: '0.8rem' }}>ANO ESCOLAR ATUAL:</label>
            <select 
              className="glass"
              style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
              value={config.schoolYear || 3} 
              onChange={(e) => setConfig({ ...config, schoolYear: parseInt(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map(year => <option key={year} value={year} style={{ background: '#171b26' }}>{year}º ANO DO ENSINO FUNDAMENTAL</option>)}
            </select>
          </div>

          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: '900', display: 'block', marginBottom: '1rem' }}>MATÉRIAS ATIVAS (MODO SAGA):</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {['Matemática', 'Português', 'Ciências', 'História', 'Geografia'].map(s => {
                const isActive = config.activeSubjects?.includes(s);
                return (
                  <button 
                    key={s}
                    onClick={() => toggleSubject(s)}
                    className={isActive ? "btn-primary" : "btn-secondary"}
                    style={{ padding: '0.8rem 1rem', fontSize: '0.65rem', flex: '1 1 45%', opacity: isActive ? 1 : 0.4 }}
                  >
                    {isActive ? '✅ ' : ''}{s.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 💰 ECONOMIA DO JOGO */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#ffd700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💰</span> RECOMPENSA EM R$ (ROBUX)
          </h2>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: '800', display: 'block', marginBottom: '0.5rem' }}>VALOR POR ACERTO (MUNDO 1):</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffd700' }}>R$</span>
              <input 
                type="number" step="0.01" 
                style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #ffd700', color: '#FFF', fontSize: '1.5rem', fontWeight: '900', width: '100%', outline: 'none' }}
                value={config.rewardPerCorrect || 0} 
                onChange={(e) => setConfig({ ...config, rewardPerCorrect: parseFloat(e.target.value) })} 
              />
            </div>
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.8rem' }}>* O jogo multiplica esse valor automaticamente em mundos mais avançados.</p>
          </div>
        </section>

        {/* 🎁 LOJA PERSONALIZADA */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#ff4d4d', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎁</span> ITENS DA LOJA RECOMPENSA
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {config.storeItems?.map(item => (
              <div key={item.id} className="glass" style={{ display: 'flex', gap: '0.8rem', padding: '0.8rem', borderRadius: '12px', alignItems: 'center' }}>
                <input style={{ width: '40px', background: 'transparent', border: 'none', fontSize: '1.5rem', textAlign: 'center' }} value={item.icon} onChange={(e) => handleUpdateStoreItem(item.id, 'icon', e.target.value)} />
                <input style={{ flex: 1, background: 'transparent', border: 'none', color: '#FFF', fontWeight: '700', fontSize: '0.9rem' }} value={item.name} onChange={(e) => handleUpdateStoreItem(item.id, 'name', e.target.value)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)' }}>R$</span>
                  <input style={{ width: '50px', background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: '900', textAlign: 'right' }} type="number" value={item.price} onChange={(e) => handleUpdateStoreItem(item.id, 'price', parseFloat(e.target.value))} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ADMIN LICENSES */}
        {isAdmin && (
          <section style={{ marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', color: '#00B2FF' }}>📦 CONTROLE DE VENDAS (ADMIN)</h2>
              <button onClick={generateNewKey} className="btn-secondary" style={{ fontSize: '0.6rem' }}>+ NOVA CHAVE</button>
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {keys.map(k => (
                <div key={k.id} style={{ fontSize: '0.7rem', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                  <code style={{ color: 'rgba(255,255,255,0.6)' }}>{k.key}</code>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: k.used_at ? '#ef4444' : '#00E676' }}>{k.used_at ? 'USADA' : 'DISPONÍVEL'}</span>
                    {!k.used_at && (
                      <button onClick={() => copyToClipboard(k.key)} style={{ background: 'transparent', border: '1px solid #00E676', color: '#00E676', padding: '2px 5px', borderRadius: '4px', fontSize: '0.5rem' }}>COPIAR</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={handleSave} className="btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.1rem' }}>💾 SALVAR COMANDOS</button>
          <button onClick={onBack} className="btn-secondary" style={{ width: '100%', padding: '1rem', color: 'rgba(255,255,255,0.5)' }}>VOLTAR</button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
