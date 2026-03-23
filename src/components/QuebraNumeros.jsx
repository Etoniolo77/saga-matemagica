import { useState } from 'react';

const QuebraNumeros = ({ onConfirm, isWrong }) => {
  const [placedCentenas, setPlacedCentenas] = useState(0);
  const [placedDezenas, setPlacedDezenas] = useState(0);
  const [placedUnidades, setPlacedUnidades] = useState(0);

  const totalValue = (placedCentenas * 100) + (placedDezenas * 10) + placedUnidades;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* Drop Zone Visual Representation */}
      <div 
        className={isWrong ? 'shake' : ''}
        style={{
          width: '100%', minHeight: '120px', background: '#e1f5f4', borderRadius: '1rem', 
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          border: isWrong ? '2px solid #ffb4a2' : '2px dashed #9fb1b0', marginBottom: '2rem',
          boxSizing: 'border-box', padding: '1rem', transition: 'border 0.2s'
      }}>
        <div style={{ fontSize: '1.25rem', color: '#697a79', marginBottom: '0.5rem' }}>Arraste para cá</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#006b1b' }}>
          {totalValue > 0 ? totalValue : ''}
        </div>
      </div>

      {/* Draggable Items (Click to add for mobile simplicity in this mock) */}
      <div style={{ display: 'flex', gap: '0.4rem', width: '100%', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        
        <button 
          onClick={() => setPlacedCentenas(prev => prev + 1)}
          style={{
            background: '#0047a0', color: '#ffffff', border: 'none', borderRadius: '0.8rem',
            padding: '0.8rem 0.2rem', cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 71, 160, 0.2)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Centena</span>
          <strong style={{ fontSize: '1.2rem', marginTop: '0.2rem' }}>+100</strong>
        </button>

        <button 
          onClick={() => setPlacedDezenas(prev => prev + 1)}
          style={{
            background: '#006b1b', color: '#ffffff', border: 'none', borderRadius: '0.8rem',
            padding: '0.8rem 0.2rem', cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 107, 27, 0.2)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Dezena</span>
          <strong style={{ fontSize: '1.2rem', marginTop: '0.2rem' }}>+10</strong>
        </button>

        <button 
          onClick={() => setPlacedUnidades(prev => prev + 1)}
          style={{
            background: '#91f78e', color: '#005e17', border: 'none', borderRadius: '0.8rem',
            padding: '0.8rem 0.2rem', cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(145, 247, 142, 0.2)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Unidade</span>
          <strong style={{ fontSize: '1.2rem', marginTop: '0.2rem' }}>+1</strong>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <button className="btn-primary" style={{ background: '#e1f5f4', color: '#005d16' }} 
          onClick={() => { setPlacedCentenas(0); setPlacedDezenas(0); setPlacedUnidades(0); }}>
          Limpar
        </button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={() => onConfirm(totalValue.toString())}>
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default QuebraNumeros;
