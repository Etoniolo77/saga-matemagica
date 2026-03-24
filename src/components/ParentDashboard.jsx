import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/SettingsService';
import { supabaseService } from '../services/SupabaseService';

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
    if (userEmail === 'evandro.toniolo@gmail.com') {
      setIsAdmin(true);
    }
  };

  const loadKeys = async () => {
    try {
      setLoadingKeys(true);
      const data = await supabaseService.getLicenseKeys();
      setKeys(data || []);
    } catch (err) {
      console.error("Erro ao listar chaves:", err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const generateNewKey = async () => {
    try {
      const code = 'SAGA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      await supabaseService.createLicenseKey(code);
      alert('SUCESSO! ✨ Chave Criada: ' + code);
      loadKeys();
    } catch (err) {
      alert('Erro ao criar chave.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Código Copiado! ✅ Mande para o cliente no WhatsApp.');
  };

  const handleSave = () => {
    settingsService.updateConfig(config);
    alert('✅ CONFIGURAÇÕES SALVAS!');
    // Disparar evento para outros componentes se necessário
    window.dispatchEvent(new Event('configUpdated'));
  };

  const toggleSubject = (subject) => {
    const active_subjects = config.active_subjects || [];
    const newSubjects = active_subjects.includes(subject)
      ? active_subjects.filter(s => s !== subject)
      : [...active_subjects, subject];
    setConfig({ ...config, active_subjects: newSubjects });
  };

  const handleUpdateStoreItem = (id, field, value) => {
    const newItems = config.storeItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setConfig({ ...config, storeItems: newItems });
  };

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      height: 'auto',
      overflowY: 'auto', 
      WebkitOverflowScrolling: 'touch',
      padding: '1rem', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      background: '#e2e8f0'
    }}>
      
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '1.5rem', marginBottom: '4rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '4px solid #000', paddingBottom: '0.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🛠️ PAINEL</h1>
            <button 
              onClick={() => window.location.reload()}
              style={{ background: '#f8fafc', border: '1px solid #000', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', marginTop: '5px' }}
            >
              🔄 ATUALIZAR APP
            </button>
          </div>
          <button onClick={onLogout} className="btn-secondary" style={{ background: '#ef4444', color: 'white', padding: '5px 15px', fontSize: '0.8rem' }}>SAIR</button>
        </div>

        {/* RECOMPENSAS */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderLeft: '4px solid #fbbf24', paddingLeft: '0.5rem' }}>💰 RECOMPENSAS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>ACERTO (R$):</label>
            <input 
              type="number" step="0.01" className="input-field" 
              style={{ width: '100%', padding: '0.8rem' }}
              value={config.reward_value_correct || 0} 
              onChange={(e) => setConfig({ ...config, reward_value_correct: parseFloat(e.target.value) })} 
            />
          </div>
        </section>

        {/* ESCOLA */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>📚 ESCOLA</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>ANO:</label>
              <select 
                className="input-field" style={{ width: '100%', padding: '0.8rem' }}
                value={config.school_year || 1} 
                onChange={(e) => setConfig({ ...config, school_year: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map(year => <option key={year} value={year}>{year}º ANO</option>)}
              </select>
            </div>
            
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>MATÉRIAS ATIVAS:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['Matemática', 'Português', 'Ciências', 'História', 'Geografia'].map(s => (
                  <button 
                    key={s}
                    onClick={() => toggleSubject(s)}
                    style={{
                      padding: '0.5rem 0.8rem', border: '2px solid #000', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.7rem',
                      background: config.active_subjects?.includes(s) ? '#00E676' : '#fff',
                      boxShadow: config.active_subjects?.includes(s) ? '0 3px 0 #000' : 'none',
                      transform: config.active_subjects?.includes(s) ? 'translateY(-2px)' : 'none'
                    }}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LOJA */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderLeft: '4px solid #f87171', paddingLeft: '0.5rem' }}>🎁 ITENS DA LOJA</h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '2px solid #000', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            {config.storeItems?.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.5rem', alignItems: 'center', background: '#fff', padding: '5px', borderRadius: '5px', border: '1px solid #e2e8f0' }}>
                <input style={{ width: '35px', textAlign: 'center' }} value={item.icon} onChange={(e) => handleUpdateStoreItem(item.id, 'icon', e.target.value)} />
                <input style={{ flex: 1, fontSize: '0.8rem' }} value={item.name} onChange={(e) => handleUpdateStoreItem(item.id, 'name', e.target.value)} />
                <input style={{ width: '55px', fontSize: '0.8rem' }} type="number" value={item.price} onChange={(e) => handleUpdateStoreItem(item.id, 'price', parseFloat(e.target.value))} />
              </div>
            ))}
          </div>
        </section>

        {/* GESTÃO DE LICENÇAS */}
        {isAdmin && (
          <section style={{ marginTop: '2.5rem', borderTop: '4px solid #000', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>📦 LICENÇAS (VENDAS)</h2>
              <button 
                onClick={generateNewKey}
                style={{ background: '#00B2FF', color: 'white', padding: '8px 12px', borderRadius: '10px', border: '2px solid #000', fontWeight: 'bold', fontSize: '0.7rem' }}
              >
                + NOVA CHAVE
              </button>
            </div>

            <div style={{ maxHeight: '250px', overflowY: 'auto', background: '#f1f5f9', border: '2px solid #000', borderRadius: '10px', padding: '0.5rem' }}>
              {loadingKeys ? <p>Carregando...</p> : (
                keys.length === 0 ? <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}>Nenhuma chave.</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {keys.map(k => (
                      <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <code style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{k.key}</code>
                          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>{new Date(k.created_at).toLocaleDateString()}</span>
                        </div>
                        {k.used_at ? (
                          <span style={{ color: '#ef4444', fontSize: '0.6rem', fontWeight: 'bold' }}>USADA</span>
                        ) : (
                          <button onClick={() => copyToClipboard(k.key)} style={{ background: '#00E676', color: 'white', padding: '4px 8px', borderRadius: '5px', border: '1px solid #000', fontSize: '0.7rem' }}>COPIAR</button>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </section>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button onClick={handleSave} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>💾 SALVAR TUDO</button>
          <button onClick={onBack} className="btn-secondary" style={{ width: '100%', background: '#94a3b8', padding: '0.8rem' }}>🔙 VOLTAR</button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
