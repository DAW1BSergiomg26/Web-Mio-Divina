/**
 * Rosario Digital Interactivo - Componente de Contemplación
 * Contador de cuentas con detección automática de misterios
 */
(function() {
  'use strict';

  const RosaryCounter = {
    panel: null,
    isOpen: false,
    currentBead: 0,
    totalBeads: 59,
    currentMystery: null,
    audioContext: null,

    mysteries: {
      gozosos: {
        name: 'Misterios Gozosos',
        days: [1, 4],
        prayers: ['Dios te salve María', 'Santo María', 'Gloria']
      },
      dolorosos: {
        name: 'Misterios Dolorosos',
        days: [2, 5],
        prayers: ['Dios te salve María', 'Santo María', 'Gloria']
      },
      gloriosos: {
        name: 'Misterios Gloriosos',
        days: [3, 6, 0],
        prayers: ['Dios te salve María', 'Santo María', 'Gloria']
      },
      luminosos: {
        name: 'Misterios Luminosos',
        days: [-1], // Domingo
        prayers: ['Dios te salve María', 'Santo María', 'Gloria']
      }
    },

    init() {
      this.detectMystery();
      this.loadProgress();
      this.render();
    },

    detectMystery() {
      const day = new Date().getDay();
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      
      // Detectar misterio según el día
      for (const [key, mystery] of Object.entries(this.mysteries)) {
        if (mystery.days.includes(day)) {
          this.currentMystery = {
            ...mystery,
            key: key,
            dayName: dayNames[day]
          };
          return;
        }
      }
      
      // Por defecto: gloriosos
      this.currentMystery = {
        name: 'Misterios Gloriosos',
        key: 'gloriosos',
        dayName: dayNames[day]
      };
    },

    loadProgress() {
      const saved = sessionStorage.getItem('rosary_progress');
      if (saved) {
        const data = JSON.parse(saved);
        // Solo cargar si es del mismo día
        if (data.date === new Date().toDateString()) {
          this.currentBead = data.bead || 0;
        }
      }
    },

    saveProgress() {
      sessionStorage.setItem('rosary_progress', JSON.stringify({
        bead: this.currentBead,
        date: new Date().toDateString()
      }));
    },

    render() {
      this.createPanel();
      this.createFloatingButton();
      this.updateDisplay();
    },

    createPanel() {
      this.panel = document.createElement('div');
      this.panel.className = 'rosary-panel';
      this.panel.innerHTML = `
        <div class="rosary-header">
          <span class="rosary-icon">📿</span>
          <h3 class="rosary-title">Santo Rosario</h3>
          <button class="rosary-close" aria-label="Cerrar">&times;</button>
        </div>
        <div class="rosary-mystery">
          <span class="mystery-label">Misterio del día:</span>
          <span class="mystery-name">${this.currentMystery?.name || 'Misterios Gloriosos'}</span>
        </div>
        <div class="rosary-beads-container">
          <div class="rosary-beads"></div>
        </div>
        <div class="rosary-progress" aria-live="polite" aria-atomic="false">
          <div class="progress-label">Cuenta: <span class="current-bead">${this.currentBead}</span> / 59</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(this.currentBead / 59) * 100}%"></div>
          </div>
          <div class="decade-indicator">Década: <span class="decade-num">${Math.floor(this.currentBead / 10) + 1}</span>/6</div>
        </div>
        <div class="rosary-controls">
          <button class="rosary-btn advance" aria-label="Siguiente cuenta">Avanzar 📿</button>
          <button class="rosary-btn reset" aria-label="Reiniciar">Reiniciar</button>
        </div>
        <div class="rosary-instruction">
          <span class="keyboard-hint">⌨️ O presiona <kbd>Espacio</kbd></span>
        </div>
      `;
      document.body.appendChild(this.panel);
      this.addStyles();
      this.bindEvents();
    },

    createFloatingButton() {
      const floatBtn = document.createElement('button');
      floatBtn.className = 'rosary-float-btn';
      floatBtn.innerHTML = '📿';
      floatBtn.setAttribute('aria-label', 'Abrir rosario');
      floatBtn.setAttribute('title', 'Santo Rosario');
      document.body.appendChild(floatBtn);
      
      floatBtn.addEventListener('click', () => this.toggle());
    },

    addStyles() {
      if (document.getElementById('rosary-styles')) return;

      const style = document.createElement('style');
      style.id = 'rosary-styles';
      style.textContent = `
        .rosary-float-btn {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-dark, #b8960c) 0%, var(--gold, #d4af37) 100%);
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 9998;
          box-shadow: 0 4px 15px rgba(212,175,55,0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .rosary-float-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(212,175,55,0.6);
        }
        .rosary-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          width: 90%;
          max-width: 400px;
          background: linear-gradient(180deg, rgba(10,22,40,0.98) 0%, rgba(5,13,26,0.98) 100%);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          padding: 25px;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .rosary-panel.open {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -50%) scale(1);
        }
        .rosary-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          position: relative;
        }
        .rosary-icon {
          font-size: 1.5rem;
        }
        .rosary-title {
          font-family: 'Cinzel Decorative', serif;
          color: var(--gold-light, #f4e2a1);
          margin: 0;
          font-size: 1.3rem;
        }
        .rosary-close {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(250,247,240,0.6);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 5px;
        }
        .rosary-close:hover {
          color: var(--gold, #d4af37);
        }
        .rosary-mystery {
          text-align: center;
          margin-bottom: 20px;
          padding: 12px;
          background: rgba(212,175,55,0.1);
          border-radius: 10px;
        }
        .mystery-label {
          display: block;
          font-size: 0.75rem;
          color: rgba(250,247,240,0.6);
          margin-bottom: 5px;
        }
        .mystery-name {
          font-family: 'Cinzel', serif;
          color: var(--gold, #d4af37);
          font-size: 1rem;
        }
        .rosary-beads-container {
          margin: 20px 0;
          overflow-x: auto;
          padding: 10px 0;
        }
        .rosary-beads {
          display: flex;
          gap: 8px;
          min-width: max-content;
          justify-content: center;
        }
        .bead {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%);
          border: 2px solid #3a3a3a;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .bead.active {
          background: radial-gradient(circle at 30% 30%, #fff5c0 0%, var(--gold, #d4af37) 50%, var(--gold-dark, #b8960c) 100%);
          box-shadow: 0 0 10px rgba(212,175,55,0.8);
          transform: scale(1.3);
        }
        .bead.prayed {
          background: radial-gradient(circle at 30% 30%, #888 0%, #666 100%);
        }
        .bead:nth-child(5n) {
          width: 20px;
          height: 20px;
        }
        .rosary-progress {
          text-align: center;
          margin: 15px 0;
        }
        .progress-label {
          font-size: 0.9rem;
          color: rgba(250,247,240,0.8);
          margin-bottom: 8px;
        }
        .progress-label .current-bead {
          color: var(--gold, #d4af37);
          font-weight: bold;
        }
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-dark, #b8960c), var(--gold, #d4af37));
          transition: width 0.3s ease;
        }
        .decade-indicator {
          font-size: 0.8rem;
          color: rgba(250,247,240,0.6);
          margin-top: 8px;
        }
        .decade-num {
          color: var(--celestial, #6fa8dc);
          font-weight: bold;
        }
        .rosary-controls {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 15px;
        }
        .rosary-btn {
          padding: 12px 20px;
          border-radius: 25px;
          border: none;
          font-family: 'Cinzel', serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .rosary-btn.advance {
          background: linear-gradient(135deg, var(--gold-dark, #b8960c) 0%, var(--gold, #d4af37) 100%);
          color: var(--blue-deep, #050d1a);
        }
        .rosary-btn.advance:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(212,175,55,0.5);
        }
        .rosary-btn.reset {
          background: rgba(255,255,255,0.1);
          color: rgba(250,247,240,0.7);
        }
        .rosary-btn.reset:hover {
          background: rgba(255,255,255,0.15);
        }
        .rosary-instruction {
          text-align: center;
          margin-top: 15px;
        }
        .keyboard-hint {
          font-size: 0.75rem;
          color: rgba(250,247,240,0.5);
        }
        .keyboard-hint kbd {
          background: rgba(255,255,255,0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        @media (max-width: 768px) {
          .rosary-panel {
            width: 95%;
            padding: 20px;
          }
          .rosary-float-btn {
            bottom: 70px;
            right: 15px;
            width: 50px;
            height: 50px;
            font-size: 1.3rem;
          }
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      // Botón cerrar
      const closeBtn = this.panel.querySelector('.rosary-close');
      closeBtn.addEventListener('click', () => this.close());

      // Botón avanzar
      const advanceBtn = this.panel.querySelector('.rosary-btn.advance');
      advanceBtn.addEventListener('click', () => this.advance());

      // Botón reiniciar
      const resetBtn = this.panel.querySelector('.rosary-btn.reset');
      resetBtn.addEventListener('click', () => this.reset());

      // Tecla espacio
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && this.isOpen) {
          e.preventDefault();
          this.advance();
        }
      });

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      this.isOpen = true;
      this.panel.classList.add('open');
    },

    close() {
      this.isOpen = false;
      this.panel.classList.remove('open');
    },

    advance() {
      if (this.currentBead < this.totalBeads) {
        this.currentBead++;
        this.playChime();
        this.saveProgress();
        
        if (this.currentBead === 59) {
          this.celebrate();
        }
      }
      
      this.updateDisplay();
    },

    reset() {
      this.currentBead = 0;
      this.saveProgress();
      this.updateDisplay();
    },

    updateDisplay() {
      // Actualizar contador
      const currentBeadEl = this.panel.querySelector('.current-bead');
      if (currentBeadEl) {
        currentBeadEl.textContent = this.currentBead;
      }

      // Actualizar progress bar
      const progressFill = this.panel.querySelector('.progress-fill');
      if (progressFill) {
        progressFill.style.width = `${(this.currentBead / 59) * 100}%`;
      }

      // Actualizar década
      const decadeNum = this.panel.querySelector('.decade-num');
      if (decadeNum) {
        decadeNum.textContent = Math.floor(this.currentBead / 10) + 1;
      }

      // Actualizar cuentas
      const beadsContainer = this.panel.querySelector('.rosary-beads');
      if (beadsContainer) {
        let beadsHtml = '';
        
        // Crear cuentas: 5 decenas de 10 + 5 cuentas iniciales + 3 finales
        const beadGroups = [
          { count: 1, label: 'Credo' },
          { count: 1, label: 'AveMaría' },
          { count: 1, label: 'AveMaría' },
          { count: 1, label: 'AveMaría' },
          { count: 1, label: 'AveMaría' },
          { count: 10, label: 'Década' },
          { count: 10, label: 'Década' },
          { count: 10, label: 'Década' },
          { count: 10, label: 'Década' },
          { count: 10, label: 'Década' },
          { count: 1, label: 'Gloria' },
          { count: 1, label: 'Gloria' },
          { count: 1, label: 'Gloria' }
        ];

        let beadIndex = 0;
        beadGroups.forEach(group => {
          for (let i = 0; i < group.count; i++) {
            const isActive = beadIndex < this.currentBead;
            const isCurrent = beadIndex === this.currentBead;
            beadsHtml += `<div class="bead ${isActive ? 'prayed' : ''} ${isCurrent ? 'active' : ''}" title="${group.label}"></div>`;
            beadIndex++;
          }
        });

        beadsContainer.innerHTML = beadsHtml;
      }
    },

    playChime() {
      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
      } catch (e) {
        // Silenciar errores de audio
      }
    },

    celebrate() {
      const title = this.panel.querySelector('.rosary-title');
      title.textContent = '✨ Santo Rosario Completado ✨';
      title.style.color = 'var(--gold-light, #f4e2a1)';
      
      setTimeout(() => {
        title.textContent = 'Santo Rosario';
        title.style.color = '';
      }, 5000);
    }
  };

  window.RosaryCounter = RosaryCounter;
})();