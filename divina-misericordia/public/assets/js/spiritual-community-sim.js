/**
 * Simulación de Comunidad Espiritual - Spiritual Community Sim
 * Números comunitarios creíbles sin backend
 * Sensación de comunidad sutil y auténtica
 */
(function() {
  'use strict';

  const CommunitySim = {
    config: {
      seed: null,
      baseNumbers: {
        pilgrimsOnline: 45,
        candlesToday: 28,
        prayersShared: 15,
        rosariesToday: 8,
        intentionsToday: 12
      },
      variationRange: {
        pilgrimsOnline: { min: -15, max: 25 },
        candlesToday: { min: -10, max: 15 },
        prayersShared: { min: -5, max: 10 },
        rosariesToday: { min: -3, max: 5 },
        intentionsToday: { min: -4, max: 8 }
      },
      timeFactors: {
        madrugue: { pilgrimsOnline: 0.3, candlesToday: 0.2 },
        manana: { pilgrimsOnline: 1.2, candlesToday: 1.5 },
        mediodia: { pilgrimsOnline: 1.0, candlesToday: 1.0 },
        tarde: { pilgrimsOnline: 1.3, candlesToday: 1.2 },
        noche: { pilgrimsOnline: 0.8, candlesToday: 0.7 }
      }
    },

    state: {
      pilgrimsOnline: 0,
      candlesToday: 0,
      prayersShared: 0,
      rosariesToday: 0,
      intentionsToday: 0,
      lastUpdate: null,
      simulatedTime: null
    },

    init() {
      this.generateSeed();
      this.calculateNumbers();
      this.startPeriodicUpdate();
      this.renderCommunityIndicators();
      console.log('👥 Community Sim initialized:', this.state.pilgrimsOnline, 'online');
    },

    generateSeed() {
      const date = new Date();
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      this.config.seed = this.hashCode(dateKey + 'santuario');
      this.state.simulatedTime = date.getHours();
    },

    hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    },

    seededRandom() {
      this.config.seed = (this.config.seed * 9301 + 49297) % 233280;
      return this.config.seed / 233280;
    },

    calculateNumbers() {
      const hour = new Date().getHours();
      const timeFactor = this.getTimeFactor(hour);
      
      const base = this.config.baseNumbers;
      const range = this.config.variationRange;
      
      const basePilgrims = Math.round(base.pilgrimsOnline * timeFactor.pilgrimsOnline);
      this.state.pilgrimsOnline = this.applyVariation(basePilgrims, range.pilgrimsOnline);
      
      const baseCandles = Math.round(base.candlesToday * timeFactor.candlesToday);
      this.state.candlesToday = this.applyVariation(baseCandles, range.candlesToday);
      
      this.state.prayersShared = this.applyVariation(base.prayersShared, range.prayersShared);
      this.state.rosariesToday = this.applyVariation(base.rosariesToday, range.rosariesToday);
      this.state.intentionsToday = this.applyVariation(base.intentionsToday, range.intentionsToday);
      
      this.state.lastUpdate = Date.now();
    },

    getTimeFactor(hour) {
      if (hour >= 0 && hour < 5) return this.config.timeFactors.madrugue;
      if (hour >= 5 && hour < 12) return this.config.timeFactors.manana;
      if (hour >= 12 && hour < 14) return this.config.timeFactors.mediodia;
      if (hour >= 14 && hour < 18) return this.config.timeFactors.tarde;
      return this.config.timeFactors.noche;
    },

    applyVariation(base, range) {
      const random = this.seededRandom();
      const variation = Math.round(range.min + random * (range.max - range.min));
      return Math.max(0, base + variation);
    },

    startPeriodicUpdate() {
      setInterval(() => {
        this.calculateNumbers();
        this.updateIndicators();
      }, 180000);
    },

    renderCommunityIndicators() {
      this.createCommunitySection();
      this.renderPilgrimCounter();
      this.renderCommunityStats();
      this.renderLiveActivity();
    },

    createCommunitySection() {
      const section = document.createElement('div');
      section.className = 'community-section';
      section.innerHTML = `
        <div class="community-header">
          <span class="community-icon">⛪</span>
          <span class="community-title">Comunidad del Santuario</span>
        </div>
        <div class="community-stats">
          <div class="stat-pilgrims">
            <span class="stat-value">${this.state.pilgrimsOnline}</span>
            <span class="stat-label">rezando ahora</span>
          </div>
          <div class="stat-candles">
            <span class="stat-value">${this.state.candlesToday}</span>
            <span class="stat-label">velas hoy</span>
          </div>
          <div class="stat-rosaries">
            <span class="stat-value">${this.state.rosariesToday}</span>
            <span class="stat-label">rosarios hoy</span>
          </div>
        </div>
        <div class="community-message">
          <p>${this.getCommunityMessage()}</p>
        </div>
      `;

      this.createCommunityStyles();

      const footer = document.querySelector('.main-footer, footer');
      if (footer) {
        footer.insertAdjacentElement('beforebegin', section);
      }
    },

    renderPilgrimCounter() {
      const existing = document.querySelector('.pilgrim-counter');
      if (existing) {
        this.updatePilgrimCounter(existing);
        return;
      }

      const counter = document.createElement('div');
      counter.className = 'pilgrim-counter';
      counter.innerHTML = `
        <span class="pilgrim-indicator"></span>
        <span class="pilgrim-number">${this.state.pilgrimsOnline}</span>
        <span class="pilgrim-label">peregrinos en el santuario</span>
      `;

      this.createCounterStyles();

      const footer = document.querySelector('.main-footer, footer');
      if (footer) {
        footer.appendChild(counter);
      }
    },

    renderCommunityStats() {
      const statsContainer = document.createElement('div');
      statsContainer.className = 'community-stats-widget';
      statsContainer.innerHTML = `
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-icon">🕯️</span>
            <span class="stat-count">${this.state.candlesToday}</span>
            <span class="stat-name">Velas hoy</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📿</span>
            <span class="stat-count">${this.state.rosariesToday}</span>
            <span class="stat-name">Rosarios</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">✝️</span>
            <span class="stat-count">${this.state.intentionsToday}</span>
            <span class="stat-name">Intenciones</span>
          </div>
        </div>
      `;

      this.createStatsStyles();

      const hero = document.querySelector('.hero, .main-hero');
      if (hero) {
        hero.insertAdjacentElement('afterend', statsContainer);
      }
    },

    renderLiveActivity() {
      const activity = document.createElement('div');
      activity.className = 'live-activity';
      
      const activities = this.generateLiveActivity();
      
      activity.innerHTML = `
        <div class="activity-ticker">
          <span class="activity-label">Actividad reciente:</span>
          <span class="activity-text">${activities.join(' · ')}</span>
        </div>
      `;

      this.createActivityStyles();

      const statsWidget = document.querySelector('.community-stats-widget');
      if (statsWidget) {
        statsWidget.insertAdjacentElement('afterend', activity);
      }
    },

    generateLiveActivity() {
      const activityTemplates = [
        'María de Madrid encendió una vela',
        'Juan de Buenos Aires rezó el Rosario',
        'Una intención desde Asunción',
        'Carlos de Santiago completó la Coronilla',
        'Ana de México compartó una intención',
        'Pedro de Barcelona terminó el Ángelus',
        'Luisa de Lima encendió una vela por su familia',
        'Un peregrino de Caracas started the Novena',
        'Rosa de Quito rezó por la paz',
        'Miguel de Sevilla completó el Rosario',
        'Sofía de Bogotá encendió una vela',
        'Diego de Buenos Aires oró en silencio'
      ];

      const activities = [];
      const count = Math.min(3, Math.floor(this.seededRandom() * 3) + 1);
      
      for (let i = 0; i < count; i++) {
        const index = Math.floor(this.seededRandom() * activityTemplates.length);
        activities.push(activityTemplates[index]);
      }

      return activities;
    },

    getCommunityMessage() {
      const messages = [
        'No estás solo en tu oración.',
        'Otros peregrinan contigo.',
        'La fe se fortalece en comunidad.',
        'Hoy muchos buscan la paz.',
        'El santuario está vivo.',
        'Otros encontraron consuelo aquí.',
        'La comunidad ora contigo.',
        'Tu oración se une a otras.'
      ];
      
      const index = Math.floor(this.seededRandom() * messages.length);
      return messages[index];
    },

    updateIndicators() {
      const pilgrimNum = document.querySelector('.pilgrim-number');
      if (pilgrimNum) {
        pilgrimNum.textContent = this.state.pilgrimsOnline;
      }

      const communitySection = document.querySelector('.community-section');
      if (communitySection) {
        const stats = communitySection.querySelectorAll('.stat-value');
        if (stats[0]) stats[0].textContent = this.state.pilgrimsOnline;
        if (stats[1]) stats[1].textContent = this.state.candlesToday;
        if (stats[2]) stats[2].textContent = this.state.rosariesToday;
      }

      const statsWidget = document.querySelectorAll('.community-stats-widget .stat-count');
      if (statsWidget[0]) statsWidget[0].textContent = this.state.candlesToday;
      if (statsWidget[1]) statsWidget[1].textContent = this.state.rosariesToday;
      if (statsWidget[2]) statsWidget[2].textContent = this.state.intentionsToday;
    },

    updatePilgrimCounter(element) {
      const num = element.querySelector('.pilgrim-number');
      if (num) {
        num.textContent = this.state.pilgrimsOnline;
      }
    },

    createCommunityStyles() {
      if (document.getElementById('community-sim-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'community-sim-styles';
      style.textContent = `
        .community-section {
          background: linear-gradient(135deg, rgba(20,18,15,0.9), rgba(35,30,25,0.9));
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          padding: 1rem;
          margin: 1rem auto;
          max-width: 600px;
        }
        .community-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
        }
        .community-icon {
          font-size: 1.5rem;
        }
        .community-title {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 1rem;
        }
        .community-stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 1rem;
        }
        .stat-pilgrims, .stat-candles, .stat-rosaries {
          text-align: center;
        }
        .community-stats .stat-value {
          display: block;
          font-size: 1.8rem;
          color: #d4af37;
          font-weight: bold;
        }
        .community-stats .stat-label {
          font-size: 0.75rem;
          color: rgba(250,247,240,0.6);
        }
        .community-message {
          text-align: center;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(212,175,55,0.2);
        }
        .community-message p {
          color: rgba(250,247,240,0.7);
          font-style: italic;
          font-size: 0.9rem;
          margin: 0;
        }
        
        .community-stats-widget {
          background: rgba(212,175,55,0.05);
          border-radius: 10px;
          padding: 0.8rem;
          margin: 1rem auto;
          max-width: 600px;
        }
        .stats-grid {
          display: flex;
          justify-content: space-around;
        }
        .stats-grid .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .stats-grid .stat-icon {
          font-size: 1.2rem;
        }
        .stats-grid .stat-count {
          color: #d4af37;
          font-size: 1.2rem;
          font-weight: bold;
        }
        .stats-grid .stat-name {
          font-size: 0.7rem;
          color: rgba(250,247,240,0.5);
        }
        
        .live-activity {
          text-align: center;
          padding: 0.5rem;
          margin: 0.5rem auto;
          max-width: 600px;
        }
        .activity-ticker {
          font-size: 0.8rem;
        }
        .activity-label {
          color: rgba(250,247,240,0.5);
        }
        .activity-text {
          color: rgba(250,247,240,0.7);
        }
      `;
      document.head.appendChild(style);
    },

    createCounterStyles() {
      if (document.getElementById('community-counter-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'community-counter-styles';
      style.textContent = `
        .pilgrim-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: rgba(250,247,240,0.7);
          font-family: 'EB Garamond', serif;
        }
        .pilgrim-indicator {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pilgrimPulse 2s ease-in-out infinite;
        }
        @keyframes pilgrimPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .pilgrim-number {
          color: #d4af37;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
    },

    createActivityStyles() {
      if (document.getElementById('community-activity-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'community-activity-styles';
      style.textContent = `
        .live-activity {
          font-family: 'EB Garamond', serif;
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    },

    createStatsStyles() {
      if (document.getElementById('community-widget-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'community-widget-styles';
      style.textContent = `
        .community-stats-widget {
          font-family: 'EB Garamond', serif;
        }
      `;
      document.head.appendChild(style);
    },

    getStats() {
      return { ...this.state };
    },

    getPilgrimsOnline() {
      return this.state.pilgrimsOnline;
    },

    getCandlesToday() {
      return this.state.candlesToday;
    },

    getRosariesToday() {
      return this.state.rosariesToday;
    },

    getIntentionsToday() {
      return this.state.intentionsToday;
    }
  };

  window.CommunitySim = CommunitySim;
  console.log('👥 Community Sim loaded');
})();