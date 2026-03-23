import React from 'react';

const BankScreen = ({ onBack, balance }) => {
  return (
    <div className="screen" style={{ background: '#00B2FF', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏦</div>
        <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase', fontWeight: 900 }}>MEU COFRINHO</h1>
        
        <div className="hud-item" style={{ fontSize: '3rem', margin: '2rem 0', background: '#fff' }}>
          R$ {balance.toFixed(2).replace('.', ',')}
        </div>

        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '3rem' }}>
          VOCÊ ESTÁ FICANDO RICO! <br/> CONTINUE ESTUDANDO! 🚀
        </p>

        <button onClick={onBack} className="btn-primary" style={{ width: '100%' }}>
          OBRIGADO! 🏆
        </button>
      </div>
    </div>
  );
};

export default BankScreen;
