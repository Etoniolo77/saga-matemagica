import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { settingsService } from '../services/SettingsService';

const avatars = [
  { id: 'avatar_boy_gamer', src: '/avatars/avatar_boy_gamer.png', name: 'Gamer' },
  { id: 'avatar_girl_adventurer', src: '/avatars/avatar_girl_adventurer.png', name: 'Aventurer' },
  { id: 'avatar_robot_friend', src: '/avatars/avatar_robot_friend.png', name: 'Robot' },
  { id: 'avatar_magical_creature', src: '/avatars/avatar_magical_creature.png', name: 'Magical' }
];

const ChildProfileScreen = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0].src);

  const handleCreate = () => {
    if (!name.trim()) {
      alert('POR FAVOR, DIGITE SEU NOME!');
      return;
    }
    const currentConfig = settingsService.getConfig();
    settingsService.updateConfig({
      ...currentConfig,
      childName: name.trim(),
      selectedAvatar: selectedAvatar
    });
    onComplete();
  };

  return (
    <div className="screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#cbd5e1' }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card" 
        style={{ width: '95%', maxWidth: '500px', padding: '2rem', textAlign: 'center' }}
      >
        <h1 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '2rem' }}>🎮 QUEM ESTÁ JOGANDO?</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>SEU NOME:</label>
          <input 
            type="text"
            className="input-field"
            style={{ width: '100%', padding: '1rem', textAlign: 'center', fontSize: '1.5rem' }}
            placeholder="DIGITE AQUI..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem' }}>ESCOLHA SEU AVATAR:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {avatars.map(av => (
            <motion.div 
              key={av.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedAvatar(av.src)}
              style={{
                cursor: 'pointer',
                border: selectedAvatar === av.src ? '6px solid #00E676' : '3px solid #ddd',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
                aspectRatio: '1/1',
                boxShadow: selectedAvatar === av.src ? '0 0 15px rgba(0,230,118,0.5)' : 'none'
              }}
            >
              <img src={av.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={av.name} />
            </motion.div>
          ))}
        </div>

        <button onClick={handleCreate} className="btn-primary" style={{ width: '100%' }}>
          VAMOS LÁ! 🚀
        </button>
      </motion.div>
    </div>
  );
};

export default ChildProfileScreen;
