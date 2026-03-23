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
    this.balance = savedBalance !== null ? parseFloat(savedBalance) : 10;
    this.history = JSON.parse(localStorage.getItem('saga_history')) || [];
    
    const today = new Date();
    const currentMonthStr = `${today.getMonth() + 1}-${today.getFullYear()}`;
    let savedMonth = localStorage.getItem('saga_current_month');
    
    if (!savedMonth) {
      savedMonth = currentMonthStr;
      localStorage.setItem('saga_current_month', savedMonth);
    } else if (savedMonth !== currentMonthStr) {
      // MONTH CHANGED! ROLLOVER!
      this.history.push({ month: savedMonth, total: this.balance });
      localStorage.setItem('saga_history', JSON.stringify(this.history));
      
      this.balance = 0; // zerar para o novo mês
      localStorage.setItem('saga_balance', this.balance);
      localStorage.setItem('saga_current_month', currentMonthStr);
    }
    
    let unlocked = localStorage.getItem('saga_unlocked');
    if (unlocked) {
      this.unlockedWorlds = JSON.parse(unlocked);
    } else {
      this.unlockedWorlds = [1, 2]; // Bairro Nobre e Delegacia iniciam liberados no onboarding
    }
    
    this.db = db;
    this.bnccDb = bnccDb;
    this.settings = settingsService;
    this.errorsPerQuestion = 0; // Track errors for current question
    this.childId = localStorage.getItem('saga_child_id'); // ID do filho logado
    this.lastQuestionId = null; // Evita repetições consecutivas
    this.solvedQuestions = new Set(JSON.parse(localStorage.getItem('saga_solved')) || []);
  }

  saveProgress() {
    localStorage.setItem('saga_lives', this.lives);
    localStorage.setItem('saga_energy', this.energy);
    localStorage.setItem('saga_balance', this.balance);
    localStorage.setItem('saga_solved', JSON.stringify([...this.solvedQuestions]));
  }

  updateBalance(xpGained, isCorrect = true) {
    const config = this.settings.getConfig();
    const basePenalty = config.penaltyPerError || 0.05;
    
    if (isCorrect) {
      // 100 XP = R$ 1.00
      const reward = xpGained * 0.01;
      this.balance += reward;
      this.errorsPerQuestion = 0;
    } else {
      const multiplier = Math.pow(2, this.errorsPerQuestion);
      this.balance -= (basePenalty * multiplier);
      this.errorsPerQuestion += 1;
      if (this.balance < 0) this.balance = 0;
    }
  }

  checkAndResetSkips() {
    const config = this.settings.getConfig();
    const journey = config.journey;
    const lastReset = new Date(journey.lastSkipReset);
    const now = new Date();
    
    // Check if 24 hours passed
    if (now - lastReset > 24 * 60 * 60 * 1000) {
      journey.remainingSkips = 3;
      journey.lastSkipReset = now.toISOString();
      this.settings.updateConfig({ journey });
    }
    return journey.remainingSkips;
  }

  skipQuestion() {
    const config = this.settings.getConfig();
    const journey = config.journey;
    const available = this.checkAndResetSkips();

    if (available > 0) {
      journey.remainingSkips -= 1;
      this.settings.updateConfig({ journey });
      this.errorsPerQuestion = 0; // Reset error count for the next question
      return { success: true, remaining: journey.remainingSkips };
    }
    return { success: false, msg: "Limite de 3 pulos por dia atingido!" };
  }

  getNextQuestion() {
    const config = this.settings.getConfig();
    const year = config.schoolYear || 1;
    const subjects = config.activeSubjects || ['Matemática'];
    const journey = config.journey || { level: 1, score: 0 };
    
    // Seleciona uma matéria ativa aleatória
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    // Se for Matemática, usa o gerador procedural adaptativo
    if (subject === 'Matemática') {
         return this.generateAdaptiveMath(journey.level, year);
    }
    
    // Busca do banco BNCC
    const yearContent = this.bnccDb.bncc_content[year.toString()];
    
    // Tenta encontrar uma matéria que tenha conteúdo
    let validSubject = subject;
    if (!yearContent || !yearContent[subject] || yearContent[subject].length === 0) {
      validSubject = subjects.find(s => yearContent && yearContent[s] && yearContent[s].length > 0) || 'Matemática';
    }

    if (validSubject === 'Matemática' && (!yearContent || !yearContent['Matemática'])) {
      return this.generateAdaptiveMath(journey.level, year);
    }

    const pool = yearContent[validSubject].filter(q => !this.solvedQuestions.has(q.id || q.statement));
    const finalPool = pool.length > 0 ? pool : yearContent[validSubject];

    let nextQ;
    let attempts = 0;
    
    do {
      nextQ = finalPool[Math.floor(Math.random() * finalPool.length)];
      attempts++;
    } while (nextQ.id === this.lastQuestionId && attempts < 5);

    this.lastQuestionId = nextQ.id || nextQ.statement;

    return { 
      ...nextQ, 
      correct_answer: nextQ.correct.toString(),
      statement_text: nextQ.statement,
      input_type: 'multiple_choice',
      subject: validSubject
    };
  }

  generateAdaptiveMath(journeyLevel, schoolYear) {
     const difficultyScale = Math.floor(journeyLevel / 5) + 1;
     const baseRange = 10 * difficultyScale * schoolYear;
     
     let q;
     let attempts = 0;
     
     do {
       const topics = ['adicao', 'subtracao', 'multiplicacao'];
       if (schoolYear >= 3) topics.push('divisao');
       if (schoolYear >= 4) topics.push('geometria', 'fracoes');
       
       const topic = topics[Math.floor(Math.random() * topics.length)];
       q = { id: `gen_${Date.now()}_${attempts}`, topic, input_type: 'numpad' };

       if (topic === 'adicao') {
            const a = Math.floor(Math.random() * baseRange) + 1;
            const b = Math.floor(Math.random() * baseRange) + 1;
            q.statement_text = `Resolva: ${a} + ${b} = ?`;
            q.correct_answer = (a + b).toString();
            q.difficulty = 'easy';
       } else if (topic === 'subtracao') {
            const a = Math.floor(Math.random() * baseRange) + 5;
            const b = Math.floor(Math.random() * a) + 1;
            q.statement_text = `Resolva: ${a} - ${b} = ?`;
            q.correct_answer = (a - b).toString();
            q.difficulty = 'easy';
       } else if (topic === 'multiplicacao') {
            const a = Math.floor(Math.random() * (difficultyScale + 2)) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            q.statement_text = `Resolva: ${a} x ${b} = ?`;
            q.correct_answer = (a * b).toString();
            q.difficulty = 'medium';
       } else if (topic === 'divisao') {
            const b = Math.floor(Math.random() * 9) + 1;
            const res = Math.floor(Math.random() * 10) + 1;
            const a = b * res;
            q.statement_text = `O explorador dividiu ${a} blocos por ${b} amigos. Quantos cada um ganhou?`;
            q.correct_answer = res.toString();
            q.difficulty = 'medium';
       } else if (topic === 'geometria') {
            const shapes = [
              { n: 'Triângulo', l: '3' }, { n: 'Quadrado', l: '4' }, 
              { n: 'Pentágono', l: '5' }, { n: 'Hexágono', l: '6' }
            ];
            const s = shapes[Math.floor(Math.random() * shapes.length)];
            q.statement_text = `Quantos LADOS tem um ${s.n} de blocos?`;
            q.correct_answer = s.l;
            q.difficulty = 'hard';
       } else if (topic === 'fracoes') {
            const fracs = [
              { q: 'Metade de 10', a: '5' }, { q: 'Metade de 100', a: '50' },
              { q: 'Dobro de 25', a: '50' }, { q: 'Um terço de 15', a: '5' }
            ];
            const f = fracs[Math.floor(Math.random() * fracs.length)];
            q.statement_text = `Quanto é ${f.q}?`;
            q.correct_answer = f.a;
            q.difficulty = 'hard';
       }
       attempts++;
     } while (q.statement_text === this.lastQuestionId && attempts < 5);

     this.lastQuestionId = q.statement_text;
     q.subject = 'Matemática';
     return q;
  }

  getXPToNextLevel(level) {
    return level * 100; // Formula simples: Nível 1 = 100 XP, Nível 2 = 200 XP...
  }

  handleAnswer(question, givenAnswer) {
    const config = this.settings.getConfig();
    const journey = config.journey;

    if (question.correct_answer === givenAnswer) {
      this.energy += 10;
      this.comboCount += 1;
      
      // XP SYSTEM baseado na dificuldade
      const diffMap = { 'easy': 20, 'medium': 40, 'hard': 60 };
      const baseXP = diffMap[question.difficulty || 'medium'] || 20;
      const comboBonus = Math.min(this.comboCount * 5, 50);
      const xpGain = baseXP + comboBonus;
      
      journey.currentXP = (journey.currentXP || 0) + xpGain;
      journey.totalXP = (journey.totalXP || 0) + xpGain;
      journey.score = journey.totalXP; // Score é o reflexo da experiência total
      journey.totalSolved += 1;

      this.updateBalance(xpGain);
      
      let isLevelUp = false;
      const xpNeeded = this.getXPToNextLevel(journey.level);
      
      if (journey.currentXP >= xpNeeded) {
        journey.currentXP -= xpNeeded;
        journey.level += 1;
        isLevelUp = true;
      }
      
      this.solvedQuestions.add(question.id || question.statement_text);
      this.settings.updateConfig({ journey });
      this.saveProgress();

      // Sincronizar com Supabase (Silencioso para não travar o jogo)
      if (this.childId) {
        supabaseService.recordProgress(
          this.childId, 
          question.id, 
          true, 
          10, // Pontos ganhos
          this.balance
        ).catch(err => console.error("Erro Supabase Sync:", err));
      }
      
      let isCombo = false;
      if (this.comboCount >= 3) {
        isCombo = true;
        this.comboCount = 0;
      }
      return { success: true, overlay: 'OverlaySuccess', isCombo, isLevelUp, newLevel: journey.level };
    } else {
      this.comboCount = 0; 
      this.updateBalance(0, false);
      this.saveProgress();

      // Sincronizar com Supabase (Silencioso para não travar o jogo)
      if (this.childId) {
        supabaseService.recordProgress(
          this.childId, 
          question.id, 
          false, 
          0, // Nenhum ponto ganho
          this.balance
        ).catch(err => console.error("Erro Supabase Sync:", err));
      }

      return { success: false, overlay: 'OverlaySoftError' };
    }
  }

  unlockNextWorld(completedWorldId) {
    const nextWorldId = completedWorldId + 1;
    if (this.db.worlds.some(w => w.id === nextWorldId) && !this.unlockedWorlds.includes(nextWorldId)) {
      this.unlockedWorlds.push(nextWorldId);
      localStorage.setItem('saga_unlocked', JSON.stringify(this.unlockedWorlds));
    }
  }

  buyItem(itemName, price) {
    if (this.balance >= price) {
      this.balance -= price;
      
      let purchases = JSON.parse(localStorage.getItem('saga_purchases')) || [];
      purchases.push({ 
        item: itemName, 
        price: price, 
        date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
      });
      localStorage.setItem('saga_purchases', JSON.stringify(purchases));
      
      this.saveProgress();
      return true; // Sucesso na compra
    }
    return false; // Saldo insuficiente
  }
}

export const gameManager = new GameManager();
