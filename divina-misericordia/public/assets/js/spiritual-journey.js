/**
 * Sistema de Viaje Espiritual - Spiritual Journey
 * Progresión emocional y espiritual sin gamificación agresiva
 * 4 niveles: Exploración → Profundización → Interiorización → Silencio
 */
(function() {
  'use strict';

  const SpiritualJourney = {
    config: {
      storageKey: 'santuario_journey',
      levels: [
        { 
          id: 'inicio',
          name: 'Exploración',
          icon: '🌱',
          color: '#90EE90',
          threshold: 0,
          description: 'Estás descubriendo el santuario'
        },
        {
          id: 'devocion',
          name: 'Profundización',
          icon: '🕯️',
          color: '#FFD700',
          threshold: 50,
          description: 'Estás profundizando en la fe'
        },
        {
          id: 'oracion',
          name: 'Interiorización',
          icon: '✝️',
          color: '#FF8C00',
          threshold: 150,
          description: 'La oración se convierte en diálogo'
        },
        {
          id: 'contemplacion',
          name: 'Silencio',
          icon: '🕊️',
          color: '#E6E6FA',
          threshold: 300,
          description: 'El silencio es oración'
        }
      ],
      actions: {
        visit_section: 1,
        complete_prayer: 5,
        light_candle: 3,
        share_intention: 4,
        complete_rosary: 15,
        listen_music: 2,
        read_devotion: 2,
        return_visit: 2,
        streak_day: 3
      }
    },

    state: {
      currentLevel: 'inicio',
      progress: 0,
      totalPoints: 0,
      unlockedContent: [],
      messagesUnlocked: [],
      lastLevelChange: null,
      history: []
    },

    init() {
      this.loadState();
      this.trackVisit();
      this.calculateProgress();
      this.renderJourneyIndicator();
      this.checkUnlocks();
      this.bindEvents();
      console.log('🕊️ Spiritual Journey initialized - Level:', this.state.currentLevel);
    },

    loadState() {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    },

    saveState() {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
    },

    trackVisit() {
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem('ultima_visita');
      
      if (lastVisit !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastVisit === yesterday) {
          this.addPoints('streak_day');
        }
        
        this.addPoints('return_visit');
      }
    },

    addPoints(action, customAmount = null) {
      const points = customAmount || this.config.actions[action] || 1;
      
      this.state.totalPoints += points;
      this.state.history.push({
        action,
        points,
        at: Date.now()
      });
      
      if (this.state.history.length > 50) {
        this.state.history = this.state.history.slice(-50);
      }
      
      this.calculateProgress();
      this.saveState();
    },

    calculateProgress() {
      const points = this.state.totalPoints;
      const levels = this.config.levels;
      
      let newLevel = levels[0];
      let nextLevel = levels[1];
      
      for (let i = 0; i < levels.length; i++) {
        if (points >= levels[i].threshold) {
          newLevel = levels[i];
          nextLevel = levels[i + 1] || null;
        }
      }
      
      const levelChanged = newLevel.id !== this.state.currentLevel;
      this.state.currentLevel = newLevel.id;
      
      if (nextLevel) {
        const progressInLevel = points - newLevel.threshold;
        const pointsNeeded = nextLevel.threshold - newLevel.threshold;
        this.state.progress = Math.min(100, Math.round((progressInLevel / pointsNeeded) * 100));
      } else {
        this.state.progress = 100;
      }
      
      if (levelChanged) {
        this.onLevelChange(newLevel);
      }
    },

    onLevelChange(newLevel) {
      this.state.lastLevelChange = Date.now();
      this.saveState();
      
      if (newLevel.id !== 'inicio') {
        this.showLevelUpMessage(newLevel);
      }
    },

    showLevelUpMessage(level) {
      const messages = {
        devocion: {
          title: '🌱 Has avanzado en tu camino',
          text: 'El santuario reconoce tu fidelidad. Explora nuevas devociones que te acercarán más a Dios.',
          unlock: 'Nuevo contenido disponible: Meditaciones del amanecer'
        },
        oracion: {
          title: '🕯️ Tu fe se profundiza',
          text: 'La oración ya no es solo palabras. Es diálogo. El silencio empieza a speak en tu corazón.',
          unlock: 'Nuevo contenido: Ejercicios de oración contemplativa'
        },
        contemplacion: {
          title: '✝️ El silencio te llama',
          text: 'Has llegado a un lugar donde las palabras sobran. Solo la presencia.',
          unlock: 'Acceso completo al modo catedral y geometría sagrada avanzada'
        }
      };
      
      const msg = messages[level.id];
      if (!msg) return;
      
      const toast = document.createElement('div');
      toast.className = 'journey-level-up';
      toast.innerHTML = `
        <div class="journey-level-content">
          <h3>${msg.title}</h3>
          <p>${msg.text}</p>
          <p class="unlock-text">${msg.unlock}</p>
        </div>
      `;
      
      this.createJourneyStyles();
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 6000);
    },

    checkUnlocks() {
      const unlocks = this.getUnlocksForLevel(this.state.currentLevel);
      
      unlocks.forEach(item => {
        if (!this.state.unlockedContent.includes(item.id)) {
          this.state.unlockedContent.push(item.id);
        }
      });
    },

    getUnlocksForLevel(levelId) {
      const unlocks = {
        inicio: [],
        devocion: [
          { id: 'meditation_am', name: 'Meditaciones del amanecer', type: 'content' },
          { id: 'deeper_prayers', name: 'Oraciones más profundas', type: 'content' }
        ],
        oracion: [
          { id: 'contemplative_exercises', name: 'Ejercicios contemplativos', type: 'content' },
          { id: 'sacred_music', name: 'Música sagrada avanzada', type: 'audio' },
          { id: 'deeper_geometry', name: 'Geometría sagrada avanzada', type: 'visual' }
        ],
        contemplacion: [
          { id: 'cathedral_full', name: 'Modo Catedral completo', type: 'feature' },
          { id: 'silence_mode', name: 'Modo Silencio', type: 'feature' },
          { id: 'deep_presence', name: 'Presencia espiritual profunda', type: 'content' }
        ]
      };
      
      return unlocks[levelId] || [];
    },

    recordAction(actionType) {
      const actionMap = {
        'section_visit': 'visit_section',
        'prayer_complete': 'complete_prayer',
        'candle_lit': 'light_candle',
        'intention_shared': 'share_intention',
        'rosary_complete': 'complete_rosary',
        'music_listen': 'listen_music',
        'devotion_read': 'read_devotion'
      };
      
      const action = actionMap[actionType];
      if (action) {
        this.addPoints(action);
      }
    },

    renderJourneyIndicator() {
      const existing = document.querySelector('.journey-indicator');
      if (existing) {
        this.updateIndicator();
        return;
      }

      const level = this.getCurrentLevel();
      const nextLevel = this.getNextLevel();
      
      const container = document.createElement('div');
      container.className = 'journey-indicator';
      container.innerHTML = `
        <div class="journey-icon">${level.icon}</div>
        <div class="journey-info">
          <span class="journey-level-name">${level.name}</span>
          ${nextLevel ? `
            <div class="journey-progress-bar">
              <div class="journey-progress-fill" style="width: ${this.state.progress}%"></div>
            </div>
            <span class="journey-next">Próximo: ${nextLevel.name}</span>
          ` : '<span class="journey-complete">Camino completado</span>'}
        </div>
      `;

      this.createJourneyStyles();
      
      const header = document.querySelector('.main-header, header');
      if (header) {
        header.appendChild(container);
      }
    },

    updateIndicator() {
      const indicator = document.querySelector('.journey-indicator');
      if (!indicator) return;
      
      const level = this.getCurrentLevel();
      const progressFill = indicator.querySelector('.journey-progress-fill');
      
      if (progressFill) {
        progressFill.style.width = `${this.state.progress}%`;
      }
      
      const icon = indicator.querySelector('.journey-icon');
      if (icon) {
        icon.textContent = level.icon;
      }
      
      const levelName = indicator.querySelector('.journey-level-name');
      if (levelName) {
        levelName.textContent = level.name;
      }
    },

    getCurrentLevel() {
      return this.config.levels.find(l => l.id === this.state.currentLevel) || this.config.levels[0];
    },

    getNextLevel() {
      const currentIndex = this.config.levels.findIndex(l => l.id === this.state.currentLevel);
      return this.config.levels[currentIndex + 1] || null;
    },

    getLevelDescription() {
      const level = this.getCurrentLevel();
      return level.description;
    },

    createJourneyStyles() {
      if (document.getElementById('journey-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'journey-styles';
      style.textContent = `
        .journey-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .journey-indicator:hover {
          background: rgba(212,175,55,0.2);
        }
        .journey-icon {
          font-size: 1.2rem;
        }
        .journey-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .journey-level-name {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 0.85rem;
        }
        .journey-progress-bar {
          width: 80px;
          height: 4px;
          background: rgba(212,175,55,0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        .journey-progress-fill {
          height: 100%;
          background: #d4af37;
          transition: width 0.5s ease;
        }
        .journey-next {
          font-size: 0.7rem;
          color: rgba(250,247,240,0.5);
        }
        .journey-complete {
          font-size: 0.7rem;
          color: #d4af37;
        }
        
        .journey-level-up {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(145deg, rgba(20,18,15,0.98), rgba(35,30,25,0.98));
          border: 2px solid rgba(212,175,55,0.5);
          border-radius: 12px;
          padding: 1.2rem;
          max-width: 320px;
          z-index: 9999;
          opacity: 0;
          transform: translateX(100px);
          transition: all 0.5s ease;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .journey-level-up.show {
          opacity: 1;
          transform: translateX(0);
        }
        .journey-level-content h3 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 1.1rem;
          margin: 0 0 10px 0;
        }
        .journey-level-content p {
          color: rgba(250,247,240,0.8);
          font-size: 0.9rem;
          margin: 5px 0;
          line-height: 1.4;
        }
        .unlock-text {
          color: #4ade80 !important;
          font-style: italic;
        }
        
        .journey-tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 10px;
          background: rgba(20,18,15,0.98);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 10px;
          padding: 1rem;
          width: 280px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s;
          z-index: 100;
        }
        .journey-indicator:hover .journey-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .journey-tooltip h4 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 0.95rem;
          margin: 0 0 10px 0;
        }
        .journey-tooltip p {
          color: rgba(250,247,240,0.7);
          font-size: 0.8rem;
          margin: 5px 0;
        }
        .journey-path {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid rgba(212,175,55,0.2);
        }
        .journey-path-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .journey-path-step .step-icon {
          font-size: 1.2rem;
          opacity: 0.5;
        }
        .journey-path-step.current .step-icon {
          opacity: 1;
        }
        .journey-path-step .step-name {
          font-size: 0.65rem;
          color: rgba(250,247,240,0.5);
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      document.addEventListener('click', (e) => {
        if (e.target.closest('.journey-indicator')) {
          this.showJourneyTooltip();
        }
      });

      document.addEventListener('prayer-complete', () => {
        this.recordAction('prayer_complete');
      });

      document.addEventListener('candle-lit', () => {
        this.recordAction('candle_lit');
      });

      document.addEventListener('intention-shared', () => {
        this.recordAction('intention_shared');
      });

      document.addEventListener('rosary-complete', () => {
        this.recordAction('rosary_complete');
      });
    },

    showJourneyTooltip() {
      const indicator = document.querySelector('.journey-indicator');
      if (!indicator) return;

      let tooltip = indicator.querySelector('.journey-tooltip');
      if (tooltip) {
        tooltip.remove();
        return;
      }

      tooltip = document.createElement('div');
      tooltip.className = 'journey-tooltip';
      
      const level = this.getCurrentLevel();
      const nextLevel = this.getNextLevel();
      
      tooltip.innerHTML = `
        <h4>Tu Camino Espiritual</h4>
        <p>${level.description}</p>
        <p>Points acumulados: <strong>${this.state.totalPoints}</strong></p>
        ${nextLevel ? `
          <p>Para llegar a ${nextLevel.name}: ${nextLevel.threshold - this.state.totalPoints} puntos más</p>
        ` : '<p>Has completado el camino espiritual 🕊️</p>'}
        <div class="journey-path">
          ${this.config.levels.map(l => `
            <div class="journey-path-step ${l.id === this.state.currentLevel ? 'current' : ''} ${this.config.levels.findIndex(x => x.id === l.id) < this.config.levels.findIndex(x => x.id === this.state.currentLevel) ? 'completed' : ''}">
              <span class="step-icon">${l.icon}</span>
              <span class="step-name">${l.name}</span>
            </div>
          `).join('')}
        </div>
      `;

      indicator.appendChild(tooltip);
    },

    getState() {
      return {
        level: this.state.currentLevel,
        levelInfo: this.getCurrentLevel(),
        progress: this.state.progress,
        points: this.state.totalPoints,
        unlocked: this.state.unlockedContent
      };
    },

    getContentForLevel(levelId) {
      return this.getUnlocksForLevel(levelId);
    },

    isContentUnlocked(contentId) {
      return this.state.unlockedContent.includes(contentId);
    },

    resetJourney() {
      localStorage.removeItem(this.config.storageKey);
      this.state = {
        currentLevel: 'inicio',
        progress: 0,
        totalPoints: 0,
        unlockedContent: [],
        messagesUnlocked: [],
        lastLevelChange: null,
        history: []
      };
      this.saveState();
      this.renderJourneyIndicator();
      console.log('🕊️ Journey reset');
    }
  };

  window.SpiritualJourney = SpiritualJourney;
  console.log('🕊️ Spiritual Journey loaded');
})();