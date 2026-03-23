import React from 'react';

const Numpad = ({ onUpdate, current }) => {
  const handlePadClick = (num) => {
    if (current.length < 4) {
      onUpdate(current + num);
    }
  };

  const handleClear = () => onUpdate('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', width: '100%', marginBottom: '1rem' 
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0].map((item, idx) => (
          <button
            key={idx}
            onClick={() => item === 'C' ? handleClear() : handlePadClick(item)}
            className="btn-secondary"
            style={{
              background: '#bae6fd', padding: '1rem', fontSize: '1.5rem',
              color: '#0369a1', textTransform: 'none'
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Numpad;
