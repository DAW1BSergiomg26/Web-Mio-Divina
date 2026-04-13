/**
 * Modo de Retiro Espiritual - Spiritual Retreat
 * Experiencia de retiro digital sin distracciones
 * UI minimalista con oración, audio y silencio
 */
(function() {
  'use strict';

  const SpiritualRetreat = {
    config: {
      storageKey: 'santuario_retiro',
      timerOptions: [5, 10, 15, 20, 30],
      defaultTimer: 10
    },

    state: {
      isActive: false,
      timerMinutes: 0,
      timerSeconds: 0,
      timerInterval: null,
      startTime: null,
      audioPlaying: false
    },

    init() {
      this.checkSavedRetreat();
      this.createRetreatButton();
      console.log('🛤️ Spiritual Retreat initialized');
    },

    checkSavedRetreat() {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.active && data.endTime > Date.now()) {
          this.state.isActive = true;
          this.state.timerMinutes = data.timerMinutes;
          this.state.startTime = data.startTime;
          this.state.timerSeconds = 0;
          this.activateRetreatMode(false);
        }
      }
    },

    saveRetreat() {
      localStorage.setItem(this.config.storageKey, JSON.stringify({
        active: this.state.isActive,
        timerMinutes: this.state.timerMinutes,
        startTime: this.state.startTime,
        endTime: this.state.startTime + (this.state.timerMinutes * 60000)
      }));
    },

    clearRetreat() {
      localStorage.removeItem(this.config.storageKey);
    },

    createRetreatButton() {
      const existing = document.querySelector('.retreat-btn');
      if (existing) return;

      const btn = document.createElement('button');
      btn.className = 'retreat-btn';
      btn.innerHTML = `
        <span class="retreat-icon">🛤️</span>
        <span class="retreat-text">Entrar en Retiro</span>
      `;

      this.createRetreatStyles();

      const nav = document.querySelector('.main-nav, nav');
      if (nav) {
        nav.appendChild(btn);
      }

      btn.addEventListener('click', () => this.showRetreatModal());
    },

    showRetreatModal() {
      if (this.state.isActive) {
        this.showExitConfirmation();
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'retreat-modal-overlay';
      modal.innerHTML = `
        <div class="retreat-modal">
          <div class="retreat-modal-header">
            <h2>🛤️ Modo de Retiro Espiritual</h2>
            <p>Un espacio de silencio y oración</p>
          </div>
          
          <div class="retreat-options">
            <div class="retreat-option">
              <label class="option-label">
                <input type="radio" name="retreat-type" value="silent" checked>
                <span class="option-icon">🤲</span>
                <span class="option-text">Silencio Orante</span>
              </label>
              <p class="option-desc">Solo oración y reflexión</p>
            </div>
            
            <div class="retreat-option">
              <label class="option-label">
                <input type="radio" name="retreat-type" value="audio">
                <span class="option-icon">🎵</span>
                <span class="option-text">Con Música Sacra</span>
              </label>
              <p class="option-desc">Música gregoriana de fondo</p>
            </div>
            
            <div class="retreat-option">
              <label class="option-label">
                <input type="radio" name="retreat-type" value="guided">
                <span class="option-icon">🗣️</span>
                <span class="option-text">Meditación Guiada</span>
              </label>
              <p class="option-desc">Guía espiritual en audio</p>
            </div>
          </div>
          
          <div class="retreat-timer-section">
            <label class="timer-label">Duración (opcional):</label>
            <div class="timer-options">
              ${this.config.timerOptions.map(m => `
                <button class="timer-btn" data-minutes="${m}">${m} min</button>
              `).join('')}
            </div>
          </div>
          
          <div class="retreat-actions">
            <button class="retreat-start-btn">Comenzar Retiro</button>
            <button class="retreat-cancel-btn">Cancelar</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const timerBtns = modal.querySelectorAll('.timer-btn');
      timerBtns[1].classList.add('selected');
      this.state.timerMinutes = this.config.defaultTimer;

      timerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          timerBtns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.state.timerMinutes = parseInt(btn.dataset.minutes);
        });
      });

      modal.querySelector('.retreat-start-btn').addEventListener('click', () => {
        const type = modal.querySelector('input[name="retreat-type"]:checked').value;
        this.startRetreat(type);
        modal.remove();
      });

      modal.querySelector('.retreat-cancel-btn').addEventListener('click', () => {
        modal.remove();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    },

    startRetreat(type) {
      this.state.isActive = true;
      this.state.startTime = Date.now();
      this.state.timerSeconds = this.state.timerMinutes * 60;
      
      if (this.state.timerMinutes > 0) {
        this.startTimer();
      }

      this.saveRetreat();
      this.activateRetreatMode(true, type);
    },

    startTimer() {
      this.state.timerInterval = setInterval(() => {
        this.state.timerSeconds--;
        
        this.updateTimerDisplay();
        
        if (this.state.timerSeconds <= 0) {
          this.completeRetreat();
        }
      }, 1000);
    },

    updateTimerDisplay() {
      const timerDisplay = document.querySelector('.retreat-timer-display');
      if (!timerDisplay) return;

      const minutes = Math.floor(this.state.timerSeconds / 60);
      const seconds = this.state.timerSeconds % 60;
      
      timerDisplay.innerHTML = `
        <span class="timer-time">${minutes}:${seconds.toString().padStart(2, '0')}</span>
        <span class="timer-label">Tiempo restante</span>
      `;
    },

    activateRetreatMode(showAnimation = true, type = 'silent') {
      document.body.classList.add('retreat-mode');
      
      if (showAnimation) {
        document.body.classList.add('retreat-entering');
        setTimeout(() => {
          document.body.classList.remove('retreat-entering');
        }, 1000);
      }

      this.createRetreatUI(type);
      this.applyRetreatStyles();

      if (type === 'audio') {
        this.startRetreatAudio();
      } else if (type === 'guided') {
        this.startGuidedMeditation();
      }

      EventBus.emit(SanctuaryEvents.MODE_CONTEMPLATIVE_ENABLED, { retreat: true });
    },

    createRetreatUI(type) {
      this.removeRetreatUI();

      const container = document.createElement('div');
      container.className = 'retreat-overlay';
      container.innerHTML = `
        <div class="retreat-content">
          <div class="retreat-header">
            <h1 class="retreat-title">🛤️ Retiro Espiritual</h1>
            <p class="retreat-subtitle">${this.getRetreatSubtitle()}</p>
          </div>
          
          ${this.state.timerMinutes > 0 ? `
            <div class="retreat-timer-display">
              <span class="timer-time">${this.state.timerMinutes}:00</span>
              <span class="timer-label">Tiempo restante</span>
            </div>
          ` : ''}
          
          <div class="retreat-focus">
            <div class="focus-cross">✝️</div>
            <p class="focus-text">${this.getFocusText()}</p>
          </div>
          
          ${type === 'audio' ? `
            <div class="retreat-audio-controls">
              <button class="audio-toggle-btn" id="retreat-audio-toggle">⏸️</button>
              <span class="audio-status">Música sacra</span>
            </div>
          ` : ''}
          
          <div class="retreat-exit">
            <button class="retreat-exit-btn">Salir del Retiro</button>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      if (type === 'audio') {
        const toggleBtn = document.getElementById('retreat-audio-toggle');
        if (toggleBtn) {
          toggleBtn.addEventListener('click', () => this.toggleRetreatAudio());
        }
      }

      container.querySelector('.retreat-exit-btn').addEventListener('click', () => {
        this.exitRetreat();
      });
    },

    getRetreatSubtitle() {
      const hour = new Date().getHours();
      if (hour < 8) return 'El silencio de la madrugada';
      if (hour < 12) return 'La luz del amanecer';
      if (hour < 14) return 'La paz del mediodía';
      if (hour < 18) return 'La gracia de la tarde';
      if (hour < 21) return 'La luz del atardecer';
      return 'El misterio de la noche';
    },

    getFocusText() {
      const texts = [
        'Oración silenciosa',
        'Meditación en Dios',
        'Reflexión espiritual',
        'Presencia Divina',
        'Diálogo interior',
        'Silencio sagrado'
      ];
      return texts[Math.floor(Math.random() * texts.length)];
    },

    startRetreatAudio() {
      if (window.AudioController && window.AudioController.play) {
        const tracks = ['gregoriano-1', 'misericordia-1', 'silencio-1'];
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        window.AudioController.play(randomTrack);
        this.state.audioPlaying = true;
      }
    },

    toggleRetreatAudio() {
      const btn = document.getElementById('retreat-audio-toggle');
      if (!btn) return;

      if (this.state.audioPlaying) {
        if (window.AudioController && window.AudioController.pause) {
          window.AudioController.pause();
        }
        btn.textContent = '▶️';
        this.state.audioPlaying = false;
      } else {
        if (window.AudioController && window.AudioController.resume) {
          window.AudioController.resume();
        } else {
          this.startRetreatAudio();
        }
        btn.textContent = '⏸️';
        this.state.audioPlaying = true;
      }
    },

    startGuidedMeditation() {
      if (window.GuidedMeditation && window.GuidedMeditation.start) {
        window.GuidedMeditation.start('contemplative');
      } else {
        this.startRetreatAudio();
      }
    },

    showExitConfirmation() {
      const confirm = document.createElement('div');
      confirm.className = 'retreat-confirm-overlay';
      confirm.innerHTML = `
        <div class="retreat-confirm">
          <p>¿Estás seguro de salir del retiro?</p>
          <div class="confirm-buttons">
            <button class="confirm-yes">Salir</button>
            <button class="confirm-no">Continuar</button>
          </div>
        </div>
      `;

      document.body.appendChild(confirm);

      confirm.querySelector('.confirm-yes').addEventListener('click', () => {
        this.exitRetreat();
        confirm.remove();
      });

      confirm.querySelector('.confirm-no').addEventListener('click', () => {
        confirm.remove();
      });
    },

    exitRetreat() {
      this.state.isActive = false;
      
      if (this.state.timerInterval) {
        clearInterval(this.state.timerInterval);
        this.state.timerInterval = null;
      }

      if (this.state.audioPlaying && window.AudioController) {
        window.AudioController.pause();
      }

      this.clearRetreat();
      this.deactivateRetreatMode();
    },

    deactivateRetreatMode() {
      document.body.classList.add('retreat-exiting');
      
      setTimeout(() => {
        document.body.classList.remove('retreat-mode', 'retreat-exiting');
        this.removeRetreatUI();
      }, 800);

      EventBus.emit(SanctuaryEvents.MODE_CONTEMPLATIVE_ENABLED, { retreat: false });
    },

    removeRetreatUI() {
      const overlay = document.querySelector('.retreat-overlay');
      if (overlay) overlay.remove();

      const modal = document.querySelector('.retreat-modal-overlay');
      if (modal) modal.remove();

      const confirm = document.querySelector('.retreat-confirm-overlay');
      if (confirm) confirm.remove();
    },

    completeRetreat() {
      if (this.state.timerInterval) {
        clearInterval(this.state.timerInterval);
        this.state.timerInterval = null;
      }

      const complete = document.createElement('div');
      complete.className = 'retreat-complete';
      complete.innerHTML = `
        <div class="complete-content">
          <h2>🙏 Retiro Completado</h2>
          <p>Que la paz de Dios permanezca contigo.</p>
          <button class="complete-btn">Volver al Santuario</button>
        </div>
      `;

      this.createCompleteStyles();
      document.body.appendChild(complete);

      complete.querySelector('.complete-btn').addEventListener('click', () => {
        this.exitRetreat();
        complete.remove();
      });

      setTimeout(() => {
        complete.classList.add('show');
      }, 100);

      if (window.SpiritualJourney) {
        window.SpiritualJourney.recordAction('retreat_complete');
      }
    },

    createRetreatStyles() {
      if (document.getElementByid('retreat-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'retreat-styles';
      style.textContent = `
        .retreat-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(180,140,50,0.2));
          border: 1px solid rgba(212,175,55,0.4);
          color: #d4af37;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'EB Garamond', serif;
          font-size: 0.9rem;
          transition: all 0.3s;
          margin-left: 10px;
        }
        .retreat-btn:hover {
          background: linear-gradient(135deg, rgba(212,175,55,0.3), rgba(180,140,50,0.3));
          transform: scale(1.02);
        }
        .retreat-icon {
          font-size: 1rem;
        }
      `;
      document.head.appendChild(style);
    },

    applyRetreatStyles() {
      if (document.getElementById('retreat-active-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'retreat-active-styles';
      style.textContent = `
        body.retreat-mode {
          overflow: hidden;
        }
        body.retreat-mode .main-nav,
        body.retreat-mode .main-header,
        body.retreat-mode footer,
        body.retriage-mode .hero,
        body.retreat-mode .sidebar {
          display: none !important;
        }
        
        .retreat-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(180deg, rgba(10,8,6,0.98) 0%, rgba(20,18,15,0.99) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 1s ease;
        }
        body.retreat-entering .retreat-overlay,
        body.retreat-mode .retreat-overlay {
          opacity: 1;
        }
        body.retreat-exiting .retreat-overlay {
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        
        .retreat-content {
          text-align: center;
          max-width: 500px;
          padding: 2rem;
        }
        .retreat-title {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .retreat-subtitle {
          color: rgba(250,247,240,0.6);
          font-size: 1rem;
          font-style: italic;
          margin-bottom: 2rem;
        }
        .retreat-timer-display {
          margin-bottom: 2rem;
        }
        .timer-time {
          display: block;
          font-size: 3rem;
          color: #d4af37;
          font-family: 'EB Garamond', serif;
        }
        .timer-label {
          color: rgba(250,247,240,0.5);
          font-size: 0.9rem;
        }
        .retreat-focus {
          margin: 3rem 0;
        }
        .focus-cross {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: gentlePulse 3s ease-in-out infinite;
        }
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .focus-text {
          color: rgba(250,247,240,0.8);
          font-size: 1.2rem;
          font-family: 'EB Garamond', serif;
          font-style: italic;
        }
        .retreat-audio-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 2rem 0;
        }
        .audio-toggle-btn {
          background: rgba(212,175,55,0.2);
          border: 1px solid rgba(212,175,55,0.4);
          color: #faf7f0;
          font-size: 1.5rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
        }
        .audio-status {
          color: rgba(250,247,240,0.6);
        }
        .retreat-exit {
          margin-top: 3rem;
        }
        .retreat-exit-btn {
          background: transparent;
          border: 1px solid rgba(250,247,240,0.3);
          color: rgba(250,247,240,0.5);
          padding: 10px 25px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'EB Garamond', serif;
          transition: all 0.3s;
        }
        .retreat-exit-btn:hover {
          background: rgba(250,247,240,0.1);
          color: #faf7f0;
        }
      `;
      document.head.appendChild(style);
    },

    createCompleteStyles() {
      if (document.getElementByid('retreat-complete-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'retreat-complete-styles';
      style.textContent = `
        .retreat-complete {
          position: fixed;
          inset: 0;
          background: rgba(10,8,6,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          opacity: 0;
          transition: opacity 0.5s;
        }
        .retreat-complete.show {
          opacity: 1;
        }
        .complete-content {
          text-align: center;
        }
        .complete-content h2 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .complete-content p {
          color: rgba(250,247,240,0.8);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .complete-btn {
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1612;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          font-size: 1rem;
          cursor: pointer;
        }
      `;
      document.head.appendChild(style);
    },

    isActive() {
      return this.state.isActive;
    },

    getRemainingTime() {
      if (this.state.timerSeconds > 0) {
        return {
          minutes: Math.floor(this.state.timerSeconds / 60),
          seconds: this.state.timerSeconds % 60
        };
      }
      return null;
    }
  };

  window.SpiritualRetreat = SpiritualRetreat;
  console.log('🛤️ Spiritual Retreat loaded');
})();