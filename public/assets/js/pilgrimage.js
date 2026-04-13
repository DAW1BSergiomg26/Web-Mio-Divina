/**
 * Sistema de Peregrinación y Logros
 * Gamificación espiritual: insignias, progreso y recompensas
 */
(function() {
  'use strict';

  const PilgrimageSystem = {
    achievements: [],
    userStats: {
      prayersCount: 0,
      visitsCount: 0,
      candlesLit: 0,
      rosariesCompleted: 0,
      daysActive: 0,
      streak: 0
    },
    config: {
      backend: null,
      achievements: []
    },

    achievementsData: [
      {
        id: 'first_visit',
        name: 'Primer Paso',
        description: 'Has visitado el santuario por primera vez',
        icon: '🚶',
        requirement: { visits: 1 },
        tier: 'bronze'
      },
      {
        id: 'devoted_visitor',
        name: 'Devoto Visitante',
        description: 'Has visitado el santuario 10 veces',
        icon: '⛪',
        requirement: { visits: 10 },
        tier: 'silver'
      },
      {
        id: 'faithful_pilgrim',
        name: 'Peregrino Fiel',
        description: 'Has visitado el santuario 50 veces',
        icon: '🏛️',
        requirement: { visits: 50 },
        tier: 'gold'
      },
      {
        id: 'first_prayer',
        name: 'Primera Oración',
        description: 'Has subido tu primera intención de oración',
        icon: '✝️',
        requirement: { prayers: 1 },
        tier: 'bronze'
      },
      {
        id: 'prayer_warrior',
        name: 'Guerrero de la Oración',
        description: 'Has subido 25 intenciones de oración',
        icon: '🗡️',
        requirement: { prayers: 25 },
        tier: 'silver'
      },
      {
        id: 'prayer_master',
        name: 'Maestro de la Oración',
        description: 'Has subido 100 intenciones de oración',
        icon: '👑',
        requirement: { prayers: 100 },
        tier: 'gold'
      },
      {
        id: 'first_candle',
        name: 'Vela Encendida',
        description: 'Has encendido tu primera vela virtual',
        icon: '🕯️',
        requirement: { candles: 1 },
        tier: 'bronze'
      },
      {
        id: 'candle_keeper',
        name: 'Guardián de la Luz',
        description: 'Has encendido 25 velas',
        icon: '✨',
        requirement: { candles: 25 },
        tier: 'silver'
      },
      {
        id: 'light_bringer',
        name: 'Portador de Luz',
        description: 'Has encendido 100 velas',
        icon: '🌟',
        requirement: { candles: 100 },
        tier: 'gold'
      },
      {
        id: 'first_rosary',
        name: 'Primer Rosario',
        description: 'Has completado un rosario',
        icon: '📿',
        requirement: { rosaries: 1 },
        tier: 'bronze'
      },
      {
        id: 'rosary_devotee',
        name: 'Devoto del Rosario',
        description: 'Has completado 10 rosarios',
        icon: '☦️',
        requirement: { rosaries: 10 },
        tier: 'silver'
      },
      {
        id: 'rosary_master',
        name: 'Maestro del Rosario',
        description: 'Has completado 50 rosarios',
        icon: '💫',
        requirement: { rosaries: 50 },
        tier: 'gold'
      },
      {
        id: 'week_streak',
        name: 'Semana de Fe',
        description: 'Has visitado el santuario 7 días consecutivos',
        icon: '🔥',
        requirement: { streak: 7 },
        tier: 'silver'
      },
      {
        id: 'month_streak',
        name: 'Mes de Devoción',
        description: 'Has visitado el santuario 30 días consecutivos',
        icon: '💎',
        requirement: { streak: 30 },
        tier: 'gold'
      },
      {
        id: 'early_bird',
        name: 'Ave del Amanecer',
        description: 'Has visitado el santuario antes de las 6 AM',
        icon: '🌅',
        requirement: { earlyVisit: true },
        tier: 'bronze',
        secret: true
      },
      {
        id: 'night_owl',
        name: 'Noctámbulo Espiritual',
        description: 'Has visitado el santuario después de medianoche',
        icon: '🦉',
        requirement: { lateVisit: true },
        tier: 'bronze',
        secret: true
      }
    ],

    init(options = {}) {
      this.config = { ...this.config, ...options };
      this.loadStats();
      this.updateStreak();
      this.checkAchievements();
      this.renderPilgrimagePanel();
    },

    loadStats() {
      const saved = localStorage.getItem('peregrino_stats');
      if (saved) {
        this.userStats = { ...this.userStats, ...JSON.parse(saved) };
      }

      const savedAchievements = localStorage.getItem('peregrino_achievements');
      this.achievements = savedAchievements ? JSON.parse(savedAchievements) : [];

      const lastVisit = localStorage.getItem('ultima_visita');
      const today = new Date().toDateString();
      
      if (lastVisit !== today) {
        this.userStats.visitsCount++;
        localStorage.setItem('ultima_visita', today);
        this.saveStats();
        this.checkTimeBasedAchievements();
      }
    },

    saveStats() {
      localStorage.setItem('peregrino_stats', JSON.stringify(this.userStats));
    },

    saveAchievements() {
      localStorage.setItem('peregrino_achievements', JSON.stringify(this.achievements));
    },

    updateStreak() {
      const lastVisit = localStorage.getItem('ultima_visita');
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (lastVisit === yesterday) {
        this.userStats.streak++;
      } else if (lastVisit !== today) {
        this.userStats.streak = 1;
      }

      this.userStats.daysActive = Math.max(this.userStats.daysActive, this.userStats.streak);
      this.saveStats();
    },

    incrementStat(statName) {
      if (this.userStats.hasOwnProperty(statName)) {
        this.userStats[statName]++;
        this.saveStats();
        this.checkAchievements();
      }
    },

    checkAchievements() {
      const newAchievements = [];

      this.achievementsData.forEach(achievement => {
        if (this.achievements.includes(achievement.id)) return;

        let earned = false;

        if (achievement.requirement.visits && this.userStats.visitsCount >= achievement.requirement.visits) {
          earned = true;
        }
        if (achievement.requirement.prayers && this.userStats.prayersCount >= achievement.requirement.prayers) {
          earned = true;
        }
        if (achievement.requirement.candles && this.userStats.candlesLit >= achievement.requirement.candles) {
          earned = true;
        }
        if (achievement.requirement.rosaries && this.userStats.rosariesCompleted >= achievement.requirement.rosaries) {
          earned = true;
        }
        if (achievement.requirement.streak && this.userStats.streak >= achievement.requirement.streak) {
          earned = true;
        }

        if (earned) {
          this.achievements.push(achievement.id);
          newAchievements.push(achievement);
        }
      });

      if (newAchievements.length > 0) {
        this.saveAchievements();
        this.showAchievementNotification(newAchievements);
      }
    },

    checkTimeBasedAchievements() {
      const hour = new Date().getHours();
      const newAchievements = [];

      this.achievementsData.forEach(achievement => {
        if (this.achievements.includes(achievement.id)) return;

        if (achievement.requirement.earlyVisit && hour < 6) {
          this.achievements.push(achievement.id);
          newAchievements.push(achievement);
        }
        if (achievement.requirement.lateVisit && hour >= 0 && hour < 5) {
          this.achievements.push(achievement.id);
          newAchievements.push(achievement);
        }
      });

      if (newAchievements.length > 0) {
        this.saveAchievements();
        this.showAchievementNotification(newAchievements);
      }
    },

    showAchievementNotification(newAchievements) {
      newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          this.createNotification(achievement);
        }, index * 2000);
      });
    },

    createNotification(achievement) {
      const notification = document.createElement('div');
      notification.className = 'achievement-notification';
      notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-content">
          <h4>🏆 ¡Logro Desbloqueado!</h4>
          <p class="achievement-name">${achievement.name}</p>
          <p class="achievement-desc">${achievement.description}</p>
        </div>
      `;

      this.createStyles();
      
      document.body.appendChild(notification);
      
      setTimeout(() => notification.classList.add('show'), 100);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
      }, 4000);
    },

    renderPilgrimagePanel() {
      this.createStyles();
      
      let container = document.querySelector('.pilgrimage-panel');
      if (container) {
        this.updatePanelDisplay();
        return;
      }

      container = document.createElement('div');
      container.className = 'pilgrimage-panel';

      container.innerHTML = `
        <div class="pilgrimage-header">
          <h3>Camino del Peregrino</h3>
          <button class="pilgrimage-toggle">▼</button>
        </div>
        <div class="pilgrimage-content">
          <div class="stats-summary">
            <div class="stat-item">
              <span class="stat-icon">👣</span>
              <span class="stat-value">${this.userStats.visitsCount}</span>
              <span class="stat-label">Visitas</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🕯️</span>
              <span class="stat-value">${this.userStats.candlesLit}</span>
              <span class="stat-label">Velas</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📿</span>
              <span class="stat-value">${this.userStats.rosariesCompleted}</span>
              <span class="stat-label">Rosarios</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🔥</span>
              <span class="stat-value">${this.userStats.streak}</span>
              <span class="stat-label">Días seguidos</span>
            </div>
          </div>
          <div class="achievements-section">
            <h4>Insignias Desbloqueadas</h4>
            <div class="achievements-grid">
              ${this.renderAchievements()}
            </div>
          </div>
        </div>
      `;

      const footer = document.querySelector('.main-footer, footer');
      if (footer) {
        footer.appendChild(container);
      }

      this.bindPanelEvents();
    },

    renderAchievements() {
      const earned = this.achievementsData.filter(a => this.achievements.includes(a.id));
      
      if (earned.length === 0) {
        return '<p class="no-achievements">Comienza tu peregrinación espiritual para ganar insignias</p>';
      }

      return earned.map(a => `
        <div class="achievement-badge ${a.tier}" title="${a.name}: ${a.description}">
          <span class="badge-icon">${a.icon}</span>
          <span class="badge-name">${a.name}</span>
        </div>
      `).join('');
    },

    updatePanelDisplay() {
      const panel = document.querySelector('.pilgrimage-panel');
      if (!panel) return;

      const statsHtml = `
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-icon">👣</span>
            <span class="stat-value">${this.userStats.visitsCount}</span>
            <span class="stat-label">Visitas</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🕯️</span>
            <span class="stat-value">${this.userStats.candlesLit}</span>
            <span class="stat-label">Velas</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📿</span>
            <span class="stat-value">${this.userStats.rosariesCompleted}</span>
            <span class="stat-label">Rosarios</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🔥</span>
            <span class="stat-value">${this.userStats.streak}</span>
            <span class="stat-label">Días seguidos</span>
          </div>
        </div>
      `;

      const statsContainer = panel.querySelector('.stats-summary');
      if (statsContainer) {
        statsContainer.innerHTML = statsHtml.replace(/<div class="stats-summary">|<\/div>$/g, '');
      }

      const achievementsGrid = panel.querySelector('.achievements-grid');
      if (achievementsGrid) {
        achievementsGrid.innerHTML = this.renderAchievements();
      }
    },

    bindPanelEvents() {
      const toggle = document.querySelector('.pilgrimage-toggle');
      const content = document.querySelector('.pilgrimage-content');
      
      if (toggle && content) {
        toggle.addEventListener('click', () => {
          content.classList.toggle('expanded');
          toggle.classList.toggle('rotated');
        });
      }
    },

    createStyles() {
      if (document.getElementById('pilgrimage-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'pilgrimage-styles';
      style.textContent = `
        .pilgrimage-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          max-width: 320px;
          background: linear-gradient(145deg, rgba(20,18,15,0.98), rgba(35,30,25,0.98));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 12px;
          overflow: hidden;
          z-index: 100;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .pilgrimage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(212,175,55,0.1);
          cursor: pointer;
        }
        .pilgrimage-header h3 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 0.95rem;
          margin: 0;
        }
        .pilgrimage-toggle {
          background: none;
          border: none;
          color: #d4af37;
          font-size: 0.8rem;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .pilgrimage-toggle.rotated {
          transform: rotate(180deg);
        }
        .pilgrimage-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }
        .pilgrimage-content.expanded {
          max-height: 400px;
        }
        .stats-summary {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 16px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
        }
        .stat-icon {
          font-size: 1.2rem;
          margin-bottom: 4px;
        }
        .stat-value {
          color: #d4af37;
          font-size: 1.1rem;
          font-weight: bold;
        }
        .stat-label {
          color: rgba(250,247,240,0.5);
          font-size: 0.7rem;
        }
        .achievements-section {
          padding: 0 16px 16px;
        }
        .achievements-section h4 {
          color: rgba(250,247,240,0.7);
          font-size: 0.8rem;
          margin-bottom: 10px;
          font-family: 'EB Garamond', serif;
        }
        .achievements-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .achievement-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 15px;
          font-size: 0.75rem;
        }
        .achievement-badge.bronze {
          background: linear-gradient(135deg, #cd7f32, #8b4513);
          color: #fff;
        }
        .achievement-badge.silver {
          background: linear-gradient(135deg, #c0c0c0, #808080);
          color: #1a1612;
        }
        .achievement-badge.gold {
          background: linear-gradient(135deg, #ffd700, #d4af37);
          color: #1a1612;
        }
        .badge-icon {
          font-size: 0.9rem;
        }
        .badge-name {
          white-space: nowrap;
        }
        .no-achievements {
          color: rgba(250,247,240,0.4);
          font-size: 0.8rem;
          font-style: italic;
        }
        
        .achievement-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          background: linear-gradient(145deg, rgba(20,18,15,0.98), rgba(40,35,25,0.98));
          border: 2px solid #d4af37;
          border-radius: 12px;
          padding: 15px 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          transform: translateX(120%);
          transition: transform 0.5s ease;
          z-index: 1000;
        }
        .achievement-notification.show {
          transform: translateX(0);
        }
        .achievement-icon {
          font-size: 2rem;
          animation: bounce 0.5s ease infinite alternate;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-5px); }
        }
        .achievement-content h4 {
          color: #d4af37;
          font-size: 0.8rem;
          margin: 0 0 5px 0;
        }
        .achievement-name {
          color: #faf7f0;
          font-weight: bold;
          font-size: 0.95rem;
          margin: 0 0 3px 0;
        }
        .achievement-desc {
          color: rgba(250,247,240,0.6);
          font-size: 0.8rem;
          margin: 0;
        }
      `;
      document.head.appendChild(style);
    },

    getProgress() {
      return {
        stats: this.userStats,
        achievements: this.achievements,
        totalAchievements: this.achievementsData.length,
        earnedAchievements: this.achievements.length
      };
    }
  };

  window.PilgrimageSystem = PilgrimageSystem;
  console.log('🎖️ Pilgrimage System loaded');
})();