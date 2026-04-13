/**
 * Sistema de Contexto Espiritual - Spiritual Context
 * Detecta contexto (hora, día, tiempo litúrgico) y adapta la experiencia
 * Un sistema vivo y sensible al momento del peregrino
 */
(function() {
  'use strict';

  const SpiritualContext = {
    config: {
      storageKey: 'santuario_contexto',
      checkInterval: 60000,
      timePeriods: {
        madrugue: { start: 0, end: 5, name: 'madrugada', intensity: 'minimal' },
        amanecer: { start: 5, end: 8, name: 'amanecer', intensity: 'soft' },
        manana: { start: 8, end: 12, name: 'mañana', intensity: 'normal' },
        mediodia: { start: 12, end: 14, name: 'mediodía', intensity: 'normal' },
        tarde: { start: 14, end: 18, name: 'tarde', intensity: 'normal' },
        atardecer: { start: 18, end: 21, name: 'atardecer', intensity: 'warm' },
        noche: { start: 21, end: 24, name: 'noche', intensity: 'calm' }
      }
    },

    state: {
      currentPeriod: 'manana',
      currentHour: 12,
      dayOfWeek: '',
      liturgicalTime: '',
      seasonColor: '#d4af37',
      isFeastDay: false,
      feastName: ''
    },

    init() {
      this.detectContext();
      this.applyContextualExperience();
      this.renderContextIndicator();
      this.startContextMonitoring();
      console.log('🌅 Spiritual Context initialized:', this.state.currentPeriod);
    },

    detectContext() {
      const now = new Date();
      this.state.currentHour = now.getHours();
      this.state.dayOfWeek = now.toLocaleDateString('es-ES', { weekday: 'long' });
      this.state.currentPeriod = this.getTimePeriod(this.state.currentHour);
      
      this.detectLiturgicalContext();
    },

    getTimePeriod(hour) {
      const periods = this.config.timePeriods;
      
      if (hour >= periods.madrugue.start && hour < periods.madrugue.end) return 'madrugada';
      if (hour >= periods.amanecer.start && hour < periods.amanecer.end) return 'amanecer';
      if (hour >= periods.manana.start && hour < periods.manana.end) return 'manana';
      if (hour >= periods.mediodia.start && hour < periods.mediodia.end) return 'mediodia';
      if (hour >= periods.tarde.start && hour < periods.tarde.end) return 'tarde';
      if (hour >= periods.atardecer.start && hour < periods.atardecer.end) return 'atardecer';
      return 'noche';
    },

    detectLiturgicalContext() {
      if (typeof LiturgicalClock !== 'undefined' && LiturgicalClock.getLiturgicalTime) {
        const time = LiturgicalClock.getLiturgicalTime();
        this.state.liturgicalTime = time;
        this.state.seasonColor = this.getSeasonColor(time);
      }

      if (typeof LiturgicalWidgets !== 'undefined' && LiturgicalWidgets.getTodayFeast) {
        const feast = LiturgicalWidgets.getTodayFeast();
        if (feast) {
          this.state.isFeastDay = true;
          this.state.feastName = feast.name;
        }
      }
    },

    getSeasonColor(liturgicalTime) {
      const colors = {
        'adviento': '#6B8E23',
        'navidad': '#FFFFFF',
        'cuaresma': '#8B4513',
        'semana_santa': '#800000',
        'pascua': '#FFD700',
        'tiempo_ordinario': '#d4af37',
        'pentecostes': '#FF4500'
      };
      return colors[liturgicalTime] || '#d4af37';
    },

    applyContextualExperience() {
      this.applyVisualTheme();
      this.applyAudioRecommendations();
      this.maybeShowContextualMessage();
    },

    applyVisualTheme() {
      const period = this.state.currentPeriod;
      const root = document.documentElement;
      
      const themes = {
        madrugada: {
          brightness: '0.7',
          saturation: '0.6',
          warmth: '0.3',
          particleOpacity: '0.3',
          animationSpeed: '0.5'
        },
        amanecer: {
          brightness: '0.85',
          saturation: '0.9',
          warmth: '0.7',
          particleOpacity: '0.5',
          animationSpeed: '0.8'
        },
        manana: {
          brightness: '1',
          saturation: '1',
          warmth: '1',
          particleOpacity: '0.7',
          animationSpeed: '1'
        },
        mediodia: {
          brightness: '1.1',
          saturation: '1',
          warmth: '1.1',
          particleOpacity: '0.8',
          animationSpeed: '1'
        },
        tarde: {
          brightness: '0.95',
          saturation: '0.95',
          warmth: '0.9',
          particleOpacity: '0.7',
          animationSpeed: '0.9'
        },
        atardecer: {
          brightness: '0.8',
          saturation: '0.9',
          warmth: '0.8',
          particleOpacity: '0.6',
          animationSpeed: '0.7'
        },
        noche: {
          brightness: '0.6',
          saturation: '0.7',
          warmth: '0.4',
          particleOpacity: '0.4',
          animationSpeed: '0.4'
        }
      };

      const theme = themes[period] || themes.manana;
      
      root.style.setProperty('--context-brightness', theme.brightness);
      root.style.setProperty('--context-saturation', theme.saturation);
      root.style.setProperty('--context-warmth', theme.warmth);
      root.style.setProperty('--context-particle-opacity', theme.particleOpacity);
      root.style.setProperty('--context-animation-speed', theme.animationSpeed);

      document.body.setAttribute('data-time-period', period);
      document.body.setAttribute('data-liturgical-time', this.state.liturgicalTime);
    },

    applyAudioRecommendations() {
      const recommendations = this.getAudioRecommendations();
      
      if (recommendations.length > 0) {
        this.storeAudioRecommendations(recommendations);
      }
    },

    getAudioRecommendations() {
      const period = this.state.currentPeriod;
      const liturgical = this.state.liturgicalTime;
      
      const recommendations = {
        madrugada: [
          { id: 'gregoriano-silencio', type: 'silencio', reason: 'La madrugada es momento de silencio' },
          { id: 'misericordia-noche', type: 'contemplativo', reason: 'Oración silenciosa' }
        ],
        amanecer: [
          { id: 'aleluya-manana', type: 'alegre', reason: 'El amanecer trae nueva luz' },
          { id: 'ave-maria', type: 'mariano', reason: 'Saludo al día con María' }
        ],
        manana: [
          { id: 'coronilla', type: 'devocional', reason: 'Buenos días, Jesús' },
          { id: 'gregoriano-energia', type: 'activado' }
        ],
        mediodia: [
          { id: 'angelus', type: 'oracion', reason: 'A las 12, el Ángelus' },
          { id: 'hora-misericordia', type: 'devocional', reason: 'La Hora de la Misericordia' }
        ],
        tarde: [
          { id: 'rosario-tarde', type: 'rosario', reason: 'El atardecer es propicio para el Rosario' },
          { id: 'gratitud', type: 'contemplativo' }
        ],
        atardecer: [
          { id: 'vispera', type: 'preparacion', reason: 'El día declina en oración' },
          { id: 'magnificat', type: 'mariano' }
        ],
        noche: [
          { id: 'complaneta', type: 'oracion', reason: 'Oración antes de descansar' },
          { id: 'salve-regina', type: 'mariano', reason: 'Bajo tu maternal cuidado' }
        ]
      };

      let recs = recommendations[period] || recommendations.manana;

      if (liturgical === 'cuaresma' || liturgical === 'semana_santa') {
        recs = recs.filter(r => r.type !== 'alegre');
        recs.unshift({ id: 'pasion', type: 'penitencial', reason: 'Tiempo de reflexión' });
      }

      if (this.state.isFeastDay) {
        recs.unshift({ id: 'fiesta', type: 'celebracion', reason: `Hoy celebramos: ${this.state.feastName}` });
      }

      return recs;
    },

    storeAudioRecommendations(recommendations) {
      localStorage.setItem('santuario_audio_context', JSON.stringify({
        period: this.state.currentPeriod,
        recommendations: recommendations,
        generatedAt: Date.now()
      }));
    },

    maybeShowContextualMessage() {
      const messages = this.getContextualMessages();
      if (!messages.length) return;

      const lastShown = parseInt(localStorage.getItem('contexto_mensaje_fecha') || '0');
      const now = Date.now();
      
      if (now - lastShown < 3600000) return;
      
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      localStorage.setItem('contexto_mensaje_fecha', now);
      
      this.showContextualToast(randomMsg);
    },

    getContextualMessages() {
      const period = this.state.currentPeriod;
      const messages = {
        madrugada: [
          'La madrugada es el momento más sagrado. El silencio habla.',
          'Dios está cerca en el silencio de la noche.',
          'Este momento de paz es un regalo.'
        ],
        amanecer: [
          'Un nuevo día amanece. ¿Cómo quieres comenzarlo?',
          'El sol sale para todos. También para ti.',
          'Es un buen momento para la oración silenciosa.'
        ],
        manana: [
          'Que tu día esté lleno de la presencia de Dios.',
          'La mañana es fresca. Tu fe también.',
          '¿Qué oración te acompaña hoy?'
        ],
        mediodia: [
          'A las 12, la Iglesia ora el Ángelus.',
          'El sol está en lo alto. Tu fe también.',
          '¿Has dado gracias hoy?'
        ],
        tarde: [
          'La tarde invita a la reflexión.',
          'El día va declinando. ¿Cómo lo aprovechas?',
          'Un momento para el Rosario.'
        ],
        atardecer: [
          'El atardecer es el momento del Magnificat.',
          'La luz se suaviza. Tu corazón también.',
          'Preparación para el descanso.'
        ],
        noche: [
          'Que tu sueño sea bendito.',
          'La nocheenvuelve todo en paz.',
          'Mañana será un nuevo día de gracia.'
        ]
      };

      let msgs = messages[period] || messages.manana;

      if (this.state.liturgicalTime === 'adviento') {
        msgs = msgs.concat([
          'El Adviento nos prepara para la venida del Señor.',
          'Viene Jesús. Prepárate.'
        ]);
      }

      if (this.state.isFeastDay) {
        msgs.push(`Hoy celebramos: ${this.state.feastName}`);
      }

      if (this.state.currentHour === 18 && this.state.liturgicalTime !== 'semana_santa') {
        msgs.push('Son las 6. Es hora del Ángelus.');
      }

      return msgs;
    },

    showContextualToast(message) {
      const toast = document.createElement('div');
      toast.className = 'context-toast';
      toast.innerHTML = `
        <p>${message}</p>
      `;

      this.createContextStyles();
      document.body.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 100);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 5000);
    },

    renderContextIndicator() {
      const existing = document.querySelector('.context-indicator');
      if (existing) return;

      const indicator = document.createElement('div');
      indicator.className = 'context-indicator';
      indicator.innerHTML = `
        <span class="context-icon">${this.getPeriodIcon()}</span>
        <span class="context-time">${this.getTimeGreeting()}</span>
      `;

      this.createContextStyles();
      
      const journeyIndicator = document.querySelector('.journey-indicator');
      if (journeyIndicator) {
        journeyIndicator.insertAdjacentElement('afterend', indicator);
      } else {
        const header = document.querySelector('.main-header, header');
        if (header) header.appendChild(indicator);
      }
    },

    getPeriodIcon() {
      const icons = {
        madrugada: '🌙',
        amanecer: '🌅',
        manana: '☀️',
        mediodia: '🌞',
        tarde: '🌤️',
        atardecer: '🌇',
        noche: '🌑'
      };
      return icons[this.state.currentPeriod] || '☀️';
    },

    getTimeGreeting() {
      const hour = this.state.currentHour;
      const periods = {
        madrugada: 'Madrugada',
        amanecer: 'Amanecer',
        manana: 'Buenos días',
        mediodia: 'Mediodía',
        tarde: 'Buenas tardes',
        atardecer: 'Atardecer',
        noche: 'Buenas noches'
      };
      return periods[this.state.currentPeriod] || 'Hola';
    },

    createContextStyles() {
      if (document.getElementById('context-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'context-styles';
      style.textContent = `
        .context-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 15px;
          font-size: 0.8rem;
        }
        .context-icon {
          font-size: 1rem;
        }
        .context-time {
          color: rgba(250,247,240,0.8);
          font-family: 'EB Garamond', serif;
        }
        
        .context-toast {
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: linear-gradient(145deg, rgba(20,18,15,0.95), rgba(35,30,25,0.95));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          padding: 12px 24px;
          max-width: 350px;
          text-align: center;
          opacity: 0;
          transition: all 0.5s ease;
          z-index: 9998;
        }
        .context-toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .context-toast p {
          color: rgba(250,247,240,0.9);
          font-family: 'EB Garamond', serif;
          font-size: 0.95rem;
          margin: 0;
          line-height: 1.5;
        }
        
        body[data-time-period="madrugada"] {
          --context-overlay: rgba(0,0,30,0.4);
        }
        body[data-time-period="amanecer"] {
          --context-overlay: rgba(255,200,100,0.2);
        }
        body[data-time-period="noche"] {
          --context-overlay: rgba(0,0,20,0.5);
        }
        body[data-time-period="atardecer"] {
          --context-overlay: rgba(255,150,50,0.2);
        }
        
        body[data-liturgical-time="semana_santa"] {
          --liturgical-overlay: rgba(50,0,0,0.3);
        }
        body[data-liturgical-time="adviento"] {
          --liturgical-overlay: rgba(50,80,0,0.2);
        }
        body[data-liturgical-time="pascua"] {
          --liturgical-overlay: rgba(255,220,100,0.2);
        }
      `;
      document.head.appendChild(style);
    },

    startContextMonitoring() {
      setInterval(() => {
        const newPeriod = this.getTimePeriod(new Date().getHours());
        if (newPeriod !== this.state.currentPeriod) {
          this.detectContext();
          this.applyContextualExperience();
          this.updateIndicator();
        }
      }, this.config.checkInterval);
    },

    updateIndicator() {
      const indicator = document.querySelector('.context-indicator');
      if (!indicator) return;

      const icon = indicator.querySelector('.context-icon');
      const time = indicator.querySelector('.context-time');

      if (icon) icon.textContent = this.getPeriodIcon();
      if (time) time.textContent = this.getTimeGreeting();
    },

    getContext() {
      return {
        period: this.state.currentPeriod,
        hour: this.state.currentHour,
        day: this.state.dayOfWeek,
        liturgicalTime: this.state.liturgicalTime,
        seasonColor: this.state.seasonColor,
        isFeastDay: this.state.isFeastDay,
        feastName: this.state.feastName
      };
    },

    getRecommendedAudio() {
      const stored = localStorage.getItem('santuario_audio_context');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.period === this.state.currentPeriod) {
          return data.recommendations;
        }
      }
      return this.getAudioRecommendations();
    },

    getMessage() {
      const messages = this.getContextualMessages();
      return messages[Math.floor(Math.random() * messages.length)];
    }
  };

  window.SpiritualContext = SpiritualContext;
  console.log('🌅 Spiritual Context loaded');
})();