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
    <div className="screen" style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '800px', padding: '2rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '4px solid #000', paddingBottom: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>🛠️ PAINEL DE CONTROLE</h1>
          <button onClick={onLogout} style={{ background: '#ef4444', color: 'white', padding: '0.6rem 1.2rem' }}>SAIR</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Coluna 1: Regras */}
          <section>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💰 RECOMPENSAS</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>VALOR POR ACERTO (R$):</label>
              <input 
                type="number" step="0.05"
                className="input-field"
                style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
                value={config.rewardPerCorrect}
                onChange={(e) => setConfig({...config, rewardPerCorrect: parseFloat(e.target.value)})}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>MULTA POR ERRO (R$):</label>
              <input 
                type="number" step="0.01"
                className="input-field"
                style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
                value={config.penaltyPerError}
                onChange={(e) => setConfig({...config, penaltyPerError: parseFloat(e.target.value)})}
              />
              <small>Dica: O valor dobra a cada erro na mesma pergunta!</small>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>📚 ESCOLA</h2>
            <label style={{ display: 'block', fontWeight: 'bold' }}>ANO ATUAL:</label>
            <select 
              className="input-field"
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
              value={config.schoolYear}
              onChange={(e) => setConfig({...config, schoolYear: parseInt(e.target.value)})}
            >
              <option value="1">1º ANO</option>
              <option value="2">2º ANO</option>
              <option value="3">3º ANO</option>
              <option value="4">4º ANO</option>
            </select>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>MATÉRIAS:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {['Matemática', 'Português', 'Ciências', 'História', 'Geografia'].map(s => (
                  <button 
                    key={s}
                    onClick={() => toggleSubject(s)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.8rem',
                      background: config.activeSubjects.includes(s) ? '#00E676' : '#E5E5E5',
                      color: config.activeSubjects.includes(s) ? 'white' : '#000'
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
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎁 ITENS DA LOJA</h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '2px solid #000', padding: '1rem', background: '#f8fafc' }}>
              {config.storeItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input style={{ width: '40px' }} value={item.icon} onChange={(e) => handleUpdateStoreItem(item.id, 'icon', e.target.value)} />
                  <input style={{ flex: 1 }} value={item.name} onChange={(e) => handleUpdateStoreItem(item.id, 'name', e.target.value)} />
                  <input style={{ width: '60px' }} type="number" value={item.price} onChange={(e) => handleUpdateStoreItem(item.id, 'price', parseFloat(e.target.value))} />
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
