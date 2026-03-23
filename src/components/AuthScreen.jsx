import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabaseService } from '../services/SupabaseService';

const AuthScreen = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = isLogin 
        ? await supabaseService.signIn(email, password)
        : await supabaseService.signUp(email, password);

      if (data && data.session) {
        onAuthSuccess(data.session);
      } else {
        // Caso o Supabase exija confirmação de e-mail
        alert('Conta criada com sucesso! 🛡️\n\nPor favor, verifique seu e-mail para confirmar a conta antes de fazer o primeiro login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || 'Erro de Conexão com Servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#e2e8f0' }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card" 
        style={{ width: '90%', maxWidth: '400px', padding: '2.5rem' }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 900 }}>
          {isLogin ? '🔑 Entrar' : '📝 Criar Conta'}
        </h1>
        
        {error && <div style={{ color: '#ef4444', background: '#fee2e2', padding: '0.8rem', border: '2px solid #ef4444', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" placeholder="Email" required
            className="input-field" style={{ width: '100%', padding: '1rem' }}
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Senha" required
            className="input-field" style={{ width: '100%', padding: '1rem' }}
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem' }}>
            {loading ? 'CARREGANDO...' : (isLogin ? 'ENTRAR' : 'CADASTRAR')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Novo por aqui? Crie uma conta' : 'Já tem conta? Faça Login'}
          </span>
        </div>

        <button 
          onClick={onBack}
          style={{ width: '100%', background: 'none', border: 'none', color: '#64748b', marginTop: '1.5rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← VOLTAR PARA O JOGO
        </button>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
