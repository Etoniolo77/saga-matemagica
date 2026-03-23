// src/services/SettingsService.js

class SettingsService {
  constructor() {
    const defaultConfig = {
      schoolYear: 1,
      activeSubjects: ['Matemática', 'Português', 'Ciências', 'História', 'Geografia'],
      rewardPerCorrect: 0.25,
      penaltyPerError: 0.00,
      dailyGoal: 100,
      isTdahMode: true,
      childName: '',
      parentPin: '1234',
      selectedAvatar: '/avatars/avatar_boy_gamer.png',
      storeItems: [
        { id: 1, name: 'Dormir mais tarde', price: 5.00, icon: '🌙' },
        { id: 2, name: '1 Hora de Internet', price: 10.00, icon: '🌐' },
        { id: 3, name: '1 Jogo de PS5', price: 100.00, icon: '🎮' },
        { id: 4, name: 'Cinema em Família', price: 50.00, icon: '🍿' },
        { id: 5, name: 'Sorvete ou Doce', price: 15.00, icon: '🍦' }
      ],
      journey: {
        score: 0,
        streak: 0,
        level: 1,
        totalSolved: 0,
        remainingSkips: 3,
        lastSkipReset: new Date().toISOString()
      }
    };

    const saved = JSON.parse(localStorage.getItem('saga_gold_config'));
    this.config = saved ? { ...defaultConfig, ...saved } : defaultConfig;

    // Garantir que a loja tenha pelo menos 5 espaços agora
    if (this.config.storeItems && this.config.storeItems.length < 5) {
      this.config.storeItems = defaultConfig.storeItems;
    }
  }

  getConfig() {
    return this.config;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('saga_gold_config', JSON.stringify(this.config));
    // Emitir evento ou callback para o app reagir (recarregar estado)
    window.dispatchEvent(new Event('configUpdated'));
  }

  // Futuro: Sync com Supabase
  async syncWithSupabase() {
    console.log("Sincronizando com Supabase...");
    // Aqui usaremos o token quando disponível
  }
}

export const settingsService = new SettingsService();
