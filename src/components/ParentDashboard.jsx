import React, { useState } from 'react';
import { settingsService } from '../services/SettingsService';

const ParentDashboard = ({ onBack, onLogout }) => {
  const [config, setConfig] = useState(settingsService.getConfig());

  const handleSave = () => {
    settingsService.updateConfig(config);
    alert('✅ CONFIGURAÇÕES SALVAS!');
  };

  const toggleSubject = (subject) => {
    const newSubjects = config.activeSubjects.includes(subject)
      ? config.activeSubjects.filter(s => s !== subject)
      : [...config.activeSubjects, subject];
    setConfig({ ...config, activeSubjects: newSubjects });
  };

  const handleUpdateStoreItem = (id, field, value) => {
    const newItems = config.storeItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setConfig({ ...config, storeItems: newItems });
  };

  return (
    <div className="screen" style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div className="card" style={{ width: '100%', maxWidth: '800px', padding: '2rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '4px solid #000', paddingBottom: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>🛠️ PAINEL</h1>
          <button onClick={onLogout} className="btn-secondary" style={{ background: '#ef4444', color: 'white' }}>SAIR</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
          {/* Coluna 1: Regras */}
          <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>💰 RECOMPENSAS</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>ACERTO (R$):</label>
              <input 
                type="number" step="0.05"
                className="input-field"
                style={{ width: '100%', padding: '0.8rem' }}
                value={config.rewardPerCorrect || 0}
                onChange={(e) => setConfig({...config, rewardPerCorrect: parseFloat(e.target.value)})}
              />
            </div>
            
            <h2 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '1rem' }}>📚 ESCOLA</h2>
            <label style={{ display: 'block', fontWeight: 'bold' }}>ANO:</label>
            <select 
              className="input-field"
              style={{ width: '100%', padding: '0.8rem' }}
              value={config.schoolYear || 1}
              onChange={(e) => setConfig({...config, schoolYear: parseInt(e.target.value)})}
            >
              <option value="1">1º ANO</option>
              <option value="2">2º ANO</option>
              <option value="3">3º ANO</option>
              <option value="4">4º ANO</option>
            </select>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>MATÉRIAS:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                {['Matemática', 'Português', 'Ciências', 'História', 'Geografia'].map(s => (
                  <button 
                    key={s}
                    onClick={() => toggleSubject(s)}
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.7rem',
                      borderRadius: '8px',
                      border: '2px solid #000',
                      background: config.activeSubjects?.includes(s) ? '#00E676' : '#E5E5E5',
                      color: config.activeSubjects?.includes(s) ? 'white' : '#000'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Coluna 2: Loja */}
          <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🎁 LOJA</h2>
            <div style={{ maxHeight: '250px', overflowY: 'auto', border: '2px solid #000', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px' }}>
              {config.storeItems?.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input style={{ width: '30px' }} value={item.icon} onChange={(e) => handleUpdateStoreItem(item.id, 'icon', e.target.value)} />
                  <input style={{ flex: 1, fontSize: '0.8rem' }} value={item.name} onChange={(e) => handleUpdateStoreItem(item.id, 'name', e.target.value)} />
                  <input style={{ width: '50px' }} type="number" value={item.price} onChange={(e) => handleUpdateStoreItem(item.id, 'price', parseFloat(e.target.value))} />
                </div>
              ))}
            </div>
          </section>
        </div>


        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={handleSave} className="btn-primary" style={{ width: '100%' }}>💾 SALVAR TUDO</button>
          <button onClick={onBack} className="btn-secondary" style={{ width: '100%', background: '#94a3b8' }}>🔙 VOLTAR AO JOGO</button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
