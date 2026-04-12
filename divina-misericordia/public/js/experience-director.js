/**
 * Experience Director - Director de Experiencia del Santuario
 * El cerebro que orquesta todos los subsistemas basándose en el contexto del usuario
 * Escucha eventos, toma decisiones de orquestación y coordina la experiencia espiritual
 */
(function() {
  'use strict';

  const ExperienceDirector = {
    config: {
      timeToActivateGeometry: 120000,
      timeToShowSuggestion: 180000,
      returnThreshold: 7 * 24 * 60 * 60 * 1000,
      angelusHours: [6, 12, 18],
      angelusDuration: 120000
    },
    state: {
      currentSection: null,
      timeOnPage: 0,
      timerInterval: null,
      musicWasPlaying: false,
      isInCathedralMode: false,
      isPenitentialMode: false,
      firstVisit: false,
      lastVisit: null,
      rosaryCompletionHandled: false,
      angelusShowing: false
    },
    companions: [],
    toasts: [],

    init(options = {}) {
      this.config = { ...this.config, ...options };
      this.detectFirstVisit();
      this.detectReturn();
      this.checkLiturgicalTime();
      this.startTimeTracking();
      this.bindEventListeners();
      this.initCompanions();
      console.log('🎬 Experience Director initialized');
    },

    detectFirstVisit() {
      const firstVisit = localStorage.getItem('primera_visita');
      if (!firstVisit) {
        this.state.firstVisit = true;
        localStorage.setItem('primera_visita', Date.now());
        localStorage.setItem('ultima_visita_fecha', Date.now());
        this.handleFirstVisit();
      } else {
        this.state.lastVisit = parseInt(localStorage.getItem('ultima_visita_fecha') || '0');
      }
    },

    detectReturn() {
      if (this.state.lastVisit) {
        const timeSinceLastVisit = Date.now() - this.state.lastVisit;
        if (timeSinceLastVisit > this.config.returnThreshold) {
          this.handleUserReturn(timeSinceLastVisit);
        }
      }
      localStorage.setItem('ultima_visita_fecha', Date.now());
    },

    checkLiturgicalTime() {
      if (typeof LiturgicalClock !== 'undefined') {
        const time = LiturgicalClock.getLiturgicalTime();
        if (time === 'cuaresma' || time === 'semana_santa') {
          this.activatePenitentialMode();
        }
      }
    },

    startTimeTracking() {
      this.state.timeOnPage = 0;
      this.state.timerInterval = setInterval(() => {
        this.state.timeOnPage += 1000;
        this.handleTimeMilestones();
      }, 1000);
    },

    handleTimeMilestones() {
      if (this.state.timeOnPage === this.config.timeToActivateGeometry) {
        this.triggerGeometryActivation();
      }

      if (this.state.timeOnPage === this.config.timeToShowSuggestion) {
        this.triggerCompanionSuggestion();
      }
    },

    triggerGeometryActivation() {
      if (typeof SacredGeometry !== 'undefined') {
        EventBus.emit(SanctuaryEvents.CANDLE_LIT, {
          reason: 'time_on_page',
          source: 'experience-director'
        });
      }

      const nav = document.querySelector('.main-nav, nav');
      if (nav) {
        nav.style.transition = 'opacity 1s ease';
        nav.style.opacity = '0.5';
      }

      EventBus.emit(SanctuaryEvents.TIME_ON_PAGE, {
        seconds: this.config.timeToActivateGeometry / 1000,
        action: 'geometry_activated'
      });
    },

    triggerCompanionSuggestion() {
      const suggestions = [
        'El silencio es oración. ¿Te gustaría sentarte un momento?',
        'Hay una古代 tradición que dice que la oración más fuerte es la simple presencia.',
        'El santuario siempre está abierto para ti. ¿Necesitas algo?',
        'La Virgen escuchó muchas oraciones hoy. ¿Quieres añadir la tuya?'
      ];

      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      EventBus.emit(SanctuaryEvents.COMPANION_SUGGESTION, {
        suggestion: randomSuggestion,
        context: this.state.currentSection
      });

      if (window.SpiritualCompanion && window.SpiritualCompanion.showSuggestion) {
        window.SpiritualCompanion.showSuggestion(randomSuggestion);
      }
    },

    handleFirstVisit() {
      EventBus.emit(SanctuaryEvents.FIRST_VISIT, {});

      setTimeout(() => {
        this.showWelcomeSplash();
      }, 1500);

      setTimeout(() => {
        this.triggerCompanionWarmGreeting();
      }, 3000);
    },

    showWelcomeSplash() {
      const splash = document.createElement('div');
      splash.className = 'welcome-splash';
      splash.innerHTML = `
        <div class="welcome-content">
          <h2>🏛️ Bienvenido al Santuario</h2>
          <p>Has llegado a un lugar de paz. Aquí puedes orar, reflexionar y encontrar consuelo.</p>
          <button class="welcome-close">Entrar al Santuario</button>
        </div>
      `;

      this.createWelcomeStyles();
      document.body.appendChild(splash);

      setTimeout(() => splash.classList.add('show'), 100);

      splash.querySelector('.welcome-close').addEventListener('click', () => {
        splash.classList.remove('show');
        setTimeout(() => splash.remove(), 500);
      });
    },

    createWelcomeStyles() {
      if (document.getElementById('welcome-splash-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'welcome-splash-styles';
      style.textContent = `
        .welcome-splash {
          position: fixed;
          inset: 0;
          background: rgba(10, 8, 6, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .welcome-splash.show {
          opacity: 1;
        }
        .welcome-content {
          text-align: center;
          max-width: 400px;
          padding: 2rem;
        }
        .welcome-content h2 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }
        .welcome-content p {
          color: rgba(250,247,240,0.8);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .welcome-close {
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1612;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 25px;
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .welcome-close:hover {
          transform: scale(1.05);
        }
      `;
      document.head.appendChild(style);
    },

    triggerCompanionWarmGreeting() {
      if (window.SpiritualCompanion) {
        EventBus.emit(SanctuaryEvents.COMPANION_OPENED, { reason: 'first_visit' });
      }
    },

    handleUserReturn(daysSince) {
      EventBus.emit(SanctuaryEvents.USER_RETURN, { daysSince });

      this.showToast(
        'El santuario te extrañaba. Bienvenido de nuevo.',
        { duration: 5000, type: 'welcome' }
      );

      if (window.PilgrimageSystem) {
        window.PilgrimageSystem.incrementStat('visitsCount');
      }
    },

    checkAngelusTime() {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();

      if (this.config.angelusHours.includes(hour) && minutes < 2 && !this.state.angelusShowing) {
        this.triggerAngelus();
      }
    },

    triggerAngelus() {
      this.state.angelusShowing = true;

      if (window.AudioController && window.AudioController.isPlaying) {
        this.state.musicWasPlaying = true;
        window.AudioController.pause();
      }

      this.playAngelusBell();

      this.showToast('El ángel del Señor anunció a María...', {
        duration: this.config.angelusDuration,
        type: 'angelus',
        showActions: true
      });

      EventBus.emit(SanctuaryEvents.ANGELUS_TIME, {});

      setTimeout(() => {
        this.state.angelusShowing = false;
        if (this.state.musicWasPlaying && window.AudioController) {
          window.AudioController.resume();
          this.state.musicWasPlaying = false;
        }
      }, this.config.angelusDuration);
    },

    playAngelusBell() {
      try {
        const audio = new Audio('/audio/angelus.mp3');
        audio.volume = 0.4;
        audio.play().catch(() => console.log('Angelus bell not available'));
      } catch (e) {}
    },

    activatePenitentialMode() {
      this.state.isPenitentialMode = true;
      EventBus.emit(SanctuaryEvents.MODE_PENITENTIAL_ACTIVE, {});

      document.body.classList.add('penitential-mode');

      const geometry = document.querySelector('.sacred-geometry-canvas');
      if (geometry) {
        geometry.style.opacity = '0.3';
        geometry.style.filter = 'brightness(0.5)';
      }

      const heroCross = document.querySelector('.hero-cross');
      if (heroCross) {
        heroCross.style.filter = 'grayscale(1) brightness(0.5)';
      }

      if (window.SacredGeometry && window.SacredGeometry.setSpeed) {
        window.SacredGeometry.setSpeed(0.3);
      }
    },

    handleRosaryComplete() {
      if (this.state.rosaryCompletionHandled) return;
      this.state.rosaryCompletionHandled = true;

      this.playRosaryCompletionSound();

      const heroCross = document.querySelector('.hero-cross');
      if (heroCross) {
        heroCross.style.transition = 'filter 0.5s ease';
        heroCross.style.filter = 'drop-shadow(0 0 20px #d4af37)';
        setTimeout(() => {
          heroCross.style.filter = '';
        }, 3000);
      }

      this.showToast('Has completado el rosario. La Virgen intercede por ti.', {
        duration: 5000,
        type: 'rosary_complete'
      });

      if (window.PilgrimageSystem) {
        window.PilgrimageSystem.incrementStat('rosariesCompleted');
        window.PilgrimageSystem.checkAchievements();
      }

      EventBus.emit(SanctuaryEvents.ROSARY_COMPLETE, {});

      setTimeout(() => {
        this.state.rosaryCompletionHandled = false;
      }, 60000);
    },

    playRosaryCompletionSound() {
      try {
        const audio = new Audio('/audio/amen.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {}
    },

    showToast(message, options = {}) {
      const toast = document.createElement('div');
      toast.className = `sanctuary-toast toast-${options.type || 'info'}`;
      
      let content = `<p>${message}</p>`;
      
      if (options.showActions) {
        content += `
          <div class="toast-actions">
            <button class="toast-action yes">Rezar el Ángelus</button>
            <button class="toast-action no">Continuar en silencio</button>
          </div>
        `;
      }

      toast.innerHTML = content;

      this.createToastStyles();
      document.body.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 100);

      const duration = options.duration || 4000;
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, duration);

      if (options.showActions) {
        toast.querySelector('.toast-action.yes')?.addEventListener('click', () => {
          this.guideAngelus();
          toast.remove();
        });
        toast.querySelector('.toast-action.no')?.addEventListener('click', () => {
          toast.remove();
        });
      }
    },

    guideAngelus() {
      this.showToast(' Reeves con nosotros:\n\n1. El ángel del Señor anunció a María...\n2. Y María concibió por obra del Espíritu Santo...\n3. Ave María...', {
        duration: 120000,
        type: 'prayer'
      });
    },

    createToastStyles() {
      if (document.getElementById('toast-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        .sanctuary-toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: linear-gradient(145deg, rgba(20,18,15,0.98), rgba(35,30,25,0.98));
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          max-width: 400px;
          text-align: center;
          z-index: 9999;
          opacity: 0;
          transition: all 0.4s ease;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .sanctuary-toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        .sanctuary-toast p {
          color: #faf7f0;
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
        }
        .toast-rosary_complete p {
          color: #d4af37;
          font-weight: bold;
        }
        .toast-angelus p {
          font-style: italic;
          color: #d4af37;
        }
        .toast-welcome p {
          color: #d4af37;
        }
        .toast-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 1rem;
        }
        .toast-action {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          font-family: 'EB Garamond', serif;
          transition: all 0.2s;
        }
        .toast-action.yes {
          background: #d4af37;
          color: #1a1612;
        }
        .toast-action.no {
          background: transparent;
          color: rgba(250,247,240,0.6);
          border: 1px solid rgba(250,247,240,0.3);
        }
        body.penitential-mode {
          filter: saturate(0.7) brightness(0.9);
        }
      `;
      document.head.appendChild(style);
    },

    initCompanions() {
      if (window.SpiritualCompanion) {
        this.companions.push('SpiritualCompanion');
      }
      if (window.CommunityRosary) {
        this.companions.push('CommunityRosary');
      }
    },

    bindEventListeners() {
      document.addEventListener('click', (e) => {
        if (e.target.closest('.rosary-btn')) {
          const rosary = window.CommunityRosary;
          if (rosary && rosary.currentHail >= 50 && !this.state.rosaryCompletionHandled) {
            this.handleRosaryComplete();
          }
        }
      });

      setInterval(() => {
        this.checkAngelusTime();
      }, 60000);

      EventBus.on(SanctuaryEvents.ROSARY_COMPLETE, () => {
        this.handleRosaryComplete();
      });

      EventBus.on(SanctuaryEvents.CATHEDRAL_MODE_ENTER, () => {
        this.state.isInCathedralMode = true;
      });

      EventBus.on(SanctuaryEvents.CATHEDRAL_MODE_EXIT, () => {
        this.state.isInCathedralMode = false;
      });
    },

    getState() {
      return { ...this.state };
    },

    destroy() {
      if (this.state.timerInterval) {
        clearInterval(this.state.timerInterval);
      }
    }
  };

  window.ExperienceDirector = ExperienceDirector;
  console.log('🎬 Experience Director loaded');
})();