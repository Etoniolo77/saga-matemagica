import { useState } from 'react';

const JacareFaminto = ({ onConfirm, isWrong, options, leftNumber, rightNumber }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Drop Zone Visual Representation */}
      <div style={{
        display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem',
        fontSize: '4rem', fontWeight: 'bold', color: '#1e293b'
      }}>
        {/* Left Item */}
        <div style={{
          background: '#ffffff', borderRadius: '1rem', padding: '1.5rem', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80px'
        }}>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0369a1' }}>{leftNumber}</span>
        </div>
        
        <div 
          className={isWrong && !selectedSymbol ? 'shake' : ''}
          style={{
            width: '80px', height: '80px', borderRadius: '50%', background: selectedSymbol ? '#bae6fd' : '#f8fafc',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            border: isWrong && !selectedSymbol ? '4px solid #fca5a5' : (selectedSymbol ? '4px solid #0284c7' : '4px dashed #cbd5e1'),
            fontSize: '3.5rem', cursor: 'pointer', color: '#0284c7'
        }}>
          {selectedSymbol}
        </div>

        <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '1rem 2rem', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0369a1' }}>{rightNumber}</span>
        </div>
      </div>

      {/* Draggable (Selectable for simplicity in mock) Options */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['<', '>', '='].map(op => (
          <button 
            key={op}
            onClick={() => setSelectedSymbol(op)}
            style={{
              background: selectedSymbol === op ? '#0284c7' : '#ffffff',
              color: selectedSymbol === op ? '#ffffff' : '#0284c7',
              border: selectedSymbol === op ? 'none' : '4px solid #bae6fd',
              borderRadius: '50%', width: '70px', height: '70px',
              fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            {op}
          </button>
        ))}
      </div>

      <button className="btn-primary" style={{ width: '100%' }} onClick={() => onConfirm(selectedSymbol)} disabled={!selectedSymbol}>
        Confirmar
      </button>
    </div>
  );
};

export default JacareFaminto;
