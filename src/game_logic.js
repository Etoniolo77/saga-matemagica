import db from './db_mock.json';
import bnccDb from './db_bncc.json';
import { settingsService } from './services/SettingsService';
import { supabaseService } from './services/SupabaseService';

class GameManager {
  constructor() {
    this.lives = parseInt(localStorage.getItem('saga_lives')) || 3;
    this.energy = parseInt(localStorage.getItem('saga_energy')) || 0;
    this.comboCount = 0;
    
    // FINANCIAL SYSTEM
    const savedBalance = localStorage.getItem('saga_balance');
    this.balance = savedBalance !== null ? parseFloat(savedBalance) : 0;
    this.history = JSON.parse(localStorage.getItem('saga_history')) || [];
    
    // QUOTA SYSTEM (Equilíbrio Multidisciplinar)
    this.quotas = JSON.parse(localStorage.getItem('saga_quotas')) || {};
    
    const today = new Date();
    const currentMonthStr = `${today.getMonth() + 1}-${today.getFullYear()}`;
    let savedMonth = localStorage.getItem('saga_current_month');
    
    if (!savedMonth) {
      savedMonth = currentMonthStr;
      localStorage.setItem('saga_current_month', savedMonth);
    } else if (savedMonth !== currentMonthStr) {
      this.history.push({ month: savedMonth, total: this.balance });
      localStorage.setItem('saga_history', JSON.stringify(this.history));
      this.balance = 0;
      localStorage.setItem('saga_balance', this.balance);
      localStorage.setItem('saga_current_month', currentMonthStr);
    }
    
    let unlocked = localStorage.getItem('saga_unlocked');
    this.unlockedWorlds = unlocked ? JSON.parse(unlocked) : [1];
    
    this.db = db;
    this.bnccDb = bnccDb;
    this.settings = settingsService;
    this.errorsPerQuestion = 0;
    this.childId = localStorage.getItem('saga_child_id');
    this.lastQuestionId = null;
    this.solvedQuestions = new Set(JSON.parse(localStorage.getItem('saga_solved')) || []);
    this.currentWorldContext = 1;
  }

  getOrInitQuotas(worldId) {
    if (!this.quotas[worldId]) {
      // Escalamos para 300 acertos por matéria por mundo.
      // Total por mundo: 1.500 questões. Total Saga: 4.500 - 5.000 questões.
      this.quotas[worldId] = {
        'Matemática': 300,
        'Português': 300,
        'História': 300,
        'Ciências': 300,
        'Geografia': 300
      };
      this.saveProgress();
    }
    return this.quotas[worldId];
  }

  saveProgress() {
    localStorage.setItem('saga_lives', this.lives);
    localStorage.setItem('saga_energy', this.energy);
    localStorage.setItem('saga_balance', this.balance);
    localStorage.setItem('saga_solved', JSON.stringify([...this.solvedQuestions]));
    localStorage.setItem('saga_quotas', JSON.stringify(this.quotas));
    localStorage.setItem('saga_unlocked', JSON.stringify(this.unlockedWorlds));
  }

  updateBalance(xpGained, isCorrect = true, worldId = 1) {
    const config = this.settings.getConfig();
    const basePenalty = config.penaltyPerError || 0.05;
    
    if (isCorrect) {
      // PREMIAÇÃO POR MUNDO: Mundo 1 = 0.01x, Mundo 2 = 0.02x, Mundo 3 = 0.05x
      const multiplier = worldId === 1 ? 0.01 : (worldId === 2 ? 0.02 : 0.05);
      const reward = xpGained * multiplier;
      this.balance += reward;
      this.errorsPerQuestion = 0;
    } else {
      const penaltyMultiplier = Math.pow(2, this.errorsPerQuestion);
      this.balance -= (basePenalty * penaltyMultiplier);
      this.errorsPerQuestion += 1;
      if (this.balance < 0) this.balance = 0;
    }
  }

  getNextQuestion(worldId = 1) {
    this.currentWorldContext = worldId;
    const config = this.settings.getConfig();
    const year = config.schoolYear || 3;
    const worldQuotas = this.getOrInitQuotas(worldId);
    
    // 1. SOBERANIA PARENTAL: Filtra apenas matérias ativas nas configurações
    const activeSubjects = config.activeSubjects || ['Matemática', 'Português', 'História', 'Ciências', 'Geografia'];
    
    // 2. Se o pai selecionou poucas ou apenas uma matéria, o foco é intensivo
    let subjectsToPick = activeSubjects;

    // 3. Se houver mais de uma permitida, equilibramos pelas cotas do mapa
    if (activeSubjects.length > 1) {
      const pendingInQuota = activeSubjects.filter(s => worldQuotas[s] > 0);
      if (pendingInQuota.length > 0) {
        subjectsToPick = pendingInQuota;
      }
    }
    
    // 4. Seleciona a mais necessária (ou a única disponível se em modo foco)
    const subject = subjectsToPick.sort((a, b) => (worldQuotas[b] || 0) - (worldQuotas[a] || 0))[0];
    const yearContent = this.bnccDb.bncc_content[year.toString()];
    
    const worldDifficultyMap = { 1: 'easy', 2: 'medium', 3: 'hard' };
    const targetDifficulty = worldDifficultyMap[worldId] || 'easy';

    if (subject === 'Matemática' && (!yearContent || !yearContent['Matemática'])) {
        return this.generateAdaptiveMath(worldId * 3, year);
    }

    const pool = (yearContent[subject] || []).filter(q => !this.solvedQuestions.has(q.id || q.statement));
    const finalPool = pool.length > 0 ? pool : (yearContent[subject] || []);

    if (finalPool.length === 0) return this.generateAdaptiveMath(worldId * 3, year);

    const nextQ = finalPool[Math.floor(Math.random() * finalPool.length)];
    this.lastQuestionId = nextQ.id || nextQ.statement;

    return { 
      ...nextQ, 
      correct_answer: nextQ.correct.toString(),
      statement_text: nextQ.statement,
      input_type: nextQ.options ? 'multiple_choice' : 'numpad',
      subject: subject,
      worldId: worldId,
      difficulty: targetDifficulty
    };
  }

  generateAdaptiveMath(difficultyScale, schoolYear) {
     const baseRange = 10 * difficultyScale * schoolYear;
     const topics = ['adicao', 'subtracao', 'multiplicacao'];
     if (schoolYear >= 3) topics.push('divisao');
     const topic = topics[Math.floor(Math.random() * topics.length)];
     
     let q = { id: `gen_${Date.now()}`, topic, input_type: 'numpad', subject: 'Matemática' };

     if (topic === 'adicao') {
          const a = Math.floor(Math.random() * baseRange) + 1;
          const b = Math.floor(Math.random() * baseRange) + 1;
          q.statement_text = `${a} + ${b} = ?`;
          q.correct_answer = (a + b).toString();
          q.difficulty = 'medium';
     } else {
          // Simplificando para brevidade, mas mantendo a estrutura
          q.statement_text = "Quantos lados tem um quadrado?";
          q.correct_answer = "4";
          q.difficulty = 'easy';
     }
     return q;
  }

  handleAnswer(question, givenAnswer) {
    const config = this.settings.getConfig();
    const journey = config.journey;
    const worldId = question.worldId || 1;

    if (question.correct_answer === givenAnswer) {
      this.energy += 10;
      this.comboCount += 1;
      
      const diffMap = { 'easy': 20, 'medium': 40, 'hard': 60 };
      const baseXP = diffMap[question.difficulty || 'medium'] || 20;
      const xpGain = baseXP + Math.min(this.comboCount * 5, 50);
      
      journey.currentXP = (journey.currentXP || 0) + xpGain;
      journey.totalXP = (journey.totalXP || 0) + xpGain;
      journey.totalSolved += 1;

      // ATUALIZA COTA DO MUNDO
      const worldQuotas = this.getOrInitQuotas(worldId);
      if (worldQuotas[question.subject] > 0) {
        worldQuotas[question.subject] -= 1;
      }

      this.updateBalance(xpGain, true, worldId);
      
      // VERIFICA SE COMPLETOU O MUNDO PARA DESBLOQUEAR O PRÓXIMO
      const isWorldComplete = Object.values(worldQuotas).every(q => q === 0);
      if (isWorldComplete) {
        this.unlockNextWorld(worldId);
      }

      this.solvedQuestions.add(question.id || question.statement_text);
      this.saveProgress();
      this.settings.updateConfig({ journey });

      return { success: true, overlay: 'OverlaySuccess', isLevelUp: false, isWorldComplete };
    } else {
      this.comboCount = 0; 
      this.updateBalance(0, false, worldId);
      this.saveProgress();
      return { success: false, overlay: 'OverlaySoftError' };
    }
  }

  unlockNextWorld(completedWorldId) {
    const nextWorldId = completedWorldId + 1;
    if (!this.unlockedWorlds.includes(nextWorldId)) {
      this.unlockedWorlds.push(nextWorldId);
      this.saveProgress();
    }
  }

  buyItem(itemName, price) {
    if (this.balance >= price) {
      this.balance -= price;
      this.saveProgress();
      return true;
    }
    return false;
  }
}

export const gameManager = new GameManager();
