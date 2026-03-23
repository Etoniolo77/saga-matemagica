import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { settingsService } from '../services/SettingsService';

const OnboardingSettings = ({ onComplete }) => {
  const [year, setYear] = useState(1);
  const [subjects, setSubjects] = useState(['Matemática']);

  const toggleSubject = (s) => {
    setSubjects(prev => prev.includes(s) 
      ? prev.filter(item => item !== s) 
      : [...prev, s]
    );
  };

  const handleFinish = () => {
    if (subjects.length === 0) {
      alert('Escolha pelo menos uma matéria!');
      return;
    }
    const config = settingsService.getConfig();
    settingsService.updateConfig({ 
      ...config, 
      schoolYear: year, 
      activeSubjects: subjects,
      isConfigured: true 
    });
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="screen"
      style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>📚 VAMOS COMEÇAR!</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Escolha o que você quer estudar hoje:</p>

        <section style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>QUAL O SEU ANO ESCOLAR?</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {[1, 2, 3, 4].map(y => (
              <button 
                key={y}
                onClick={() => setYear(y)}
                className="btn-secondary"
                style={{ 
                  background: year === y ? '#00E676' : '#FFF',
                  color: year === y ? '#FFF' : '#333'
                }}
              >
                {y}º
              </button>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>QUAIS MATÉRIAS?</label>
            <button 
              onClick={() => setSubjects(['Matemática', 'Português', 'Ciências', 'História', 'Geografia'])}
              style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#000', color: '#FFF', border: 'none', cursor: 'pointer' }}
            >
              🌪️ MODO MIX (TUDO)
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {['Matemática', 'Português', 'Ciências', 'História', 'Geografia'].map(s => (
              <button 
                key={s}
                onClick={() => toggleSubject(s)}
                className="btn-secondary"
                style={{ 
                  background: subjects.includes(s) ? '#00B2FF' : '#FFF',
                  color: subjects.includes(s) ? '#FFF' : '#333',
                  fontSize: '0.8rem'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <button onClick={handleFinish} className="btn-primary" style={{ width: '100%', fontSize: '1.5rem' }}>PRONTO! 🚀</button>
      </div>
    </motion.div>
  );
};

export default OnboardingSettings;
