import React from 'react';
import { motion } from 'framer-motion';

const BankScreen = ({ onBack, balance, config }) => {
  return (
    <div className="app-container fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="island-card"
        style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center', border: '3px solid var(--primary)', boxShadow: '0 0 40px rgba(107, 254, 156, 0.15)' }}
      >
        <div style={{ fontSize: '6rem', marginBottom: '2rem', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))' }}>🏦</div>
        
        <h1 className="hero-text" style={{ fontSize: '2.4rem', marginBottom: '1rem', letterSpacing: '2px' }}>
          MEU <span style={{ color: 'var(--primary)' }}>COFRINHO</span>
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2.5rem' }}>
          SALDO TOTAL DE ROBUX
        </p>

        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '30px', padding: '2rem 1rem', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ color: '#ffd700', fontSize: '1rem', fontWeight: '900', marginBottom: '0.5rem' }}>TOTAL ATUAL</div>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '4.5rem', fontWeight: '900', color: '#ffd700', textShadow: '0 0 25px rgba(255,215,0,0.4)' }}
          >
            <span style={{ fontSize: '2rem' }}>R$</span> {balance.toFixed(0)}
          </motion.div>
        </div>

        <p style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.5', marginBottom: '2.5rem' }}>
          VOCÊ ESTÁ FICANDO RICO!<br/> CONTINUE ACERTANDO! 🚀
        </p>

        <button onClick={onBack} className="btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
          VOLTAR AO MAPA 🏠
        </button>
      </motion.div>
    </div>
  );
};

export default BankScreen;
