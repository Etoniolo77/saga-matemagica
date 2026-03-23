import React from 'react';

const Unit = () => <div style={{width: 20, height: 20, background: '#fde047', border: '2px solid #ca8a04', borderRadius: 4, boxShadow: '2px 2px 0 rgba(0,0,0,0.1)'}} />;

const Ten = () => <div style={{width: 20, height: 100, background: '#fde047', border: '2px solid #ca8a04', borderRadius: 4, backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, #ca8a04 8px, #ca8a04 10px)', boxShadow: '2px 2px 0 rgba(0,0,0,0.1)'}} />;

const Hundred = () => <div style={{width: 100, height: 100, background: '#fde047', border: '2px solid #ca8a04', borderRadius: 4, backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, #ca8a04 8px, #ca8a04 10px), repeating-linear-gradient(to right, transparent, transparent 8px, #ca8a04 8px, #ca8a04 10px)', boxShadow: '2px 2px 0 rgba(0,0,0,0.1)'}} />;

const Thousand = () => (
  <div style={{width: 110, height: 110, position: 'relative', margin: '5px'}}>
    <div style={{position: 'absolute', top: 0, left: 10, width: 100, height: 100, background: '#eab308', border: '2px solid #a16207', borderRadius: 4}} />
    <div style={{position: 'absolute', top: 5, left: 5, width: 100, height: 100, background: '#facc15', border: '2px solid #a16207', borderRadius: 4}} />
    <div style={{position: 'absolute', top: 10, left: 0, width: 100, height: 100, background: '#fde047', border: '2px solid #ca8a04', borderRadius: 4,
                 backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, #ca8a04 8px, #ca8a04 10px), repeating-linear-gradient(to right, transparent, transparent 8px, #ca8a04 8px, #ca8a04 10px)'}} />
  </div>
);

const MaterialDouradoVisual = ({ number }) => {
  const m = Math.floor(number / 1000);
  const c = Math.floor((number % 1000) / 100);
  const d = Math.floor((number % 100) / 10);
  const u = number % 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '4px dashed #94a3b8' }}>
      
      {m > 0 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{color: '#64748b', fontWeight: 'bold', marginBottom: '0.5rem'}}>CUBOS GIGANTES (MILHARES)</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'}}>
            {Array.from({length: m}).map((_, i) => <Thousand key={`m${i}`} />)}
          </div>
        </div>
      )}

      {c > 0 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{color: '#64748b', fontWeight: 'bold', marginBottom: '0.5rem'}}>PLACAS (CENTENAS)</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center'}}>
            {Array.from({length: c}).map((_, i) => <Hundred key={`c${i}`} />)}
          </div>
        </div>
      )}

      {d > 0 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{color: '#64748b', fontWeight: 'bold', marginBottom: '0.5rem'}}>BARRAS (DEZENAS)</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'}}>
            {Array.from({length: d}).map((_, i) => <Ten key={`d${i}`} />)}
          </div>
        </div>
      )}

      {u > 0 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{color: '#64748b', fontWeight: 'bold', marginBottom: '0.5rem'}}>CUBINHOS (UNIDADES)</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'}}>
            {Array.from({length: u}).map((_, i) => <Unit key={`u${i}`} />)}
          </div>
        </div>
      )}

    </div>
  );
};

export default MaterialDouradoVisual;
