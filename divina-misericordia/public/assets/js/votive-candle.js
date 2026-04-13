/**
 * Vela Votiva Virtual - Componente de Devoción
 * Vela 3D con llama animada, persiste en localStorage 24h
 */
(function() {
  'use strict';

  const VotiveCandle = {
    container: null,
    isLit: false,
    sectionKey: '',
    config: {
      burnDuration: 24 * 60 * 60 * 1000, // 24 horas
      baseWorshippers: 47
    },

    init(sectionKey, containerSelector) {
      this.sectionKey = sectionKey;
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.checkState();
      this.render();
      this.updateCounter();
    },

    checkState() {
      const stored = localStorage.getItem('votive_candle_' + this.sectionKey);
      if (stored) {
        const data = JSON.parse(stored);
        const elapsed = Date.now() - data.litAt;
        if (elapsed < this.config.burnDuration) {
          this.isLit = true;
        } else {
          localStorage.removeItem('votive_candle_' + this.sectionKey);
        }
      }
    },

    render() {
      const today = new Date().toDateString();
      const worshippersKey = 'worshippers_' + today;
      let worshippers = parseInt(localStorage.getItem(worshippersKey));
      
      if (!worshippers) {
        worshippers = this.config.baseWorshippers + Math.floor(Math.random() * 23);
        localStorage.setItem(worshippersKey, worshippers);
      }

      if (this.isLit) {
        worshippers++;
        localStorage.setItem(worshippersKey, worshippers);
      }

      this.container.innerHTML = `
        <div class="votive-candle-container ${this.isLit ? 'lit' : ''}" role="button" tabindex="0" aria-label="Encender vela votiva" aria-pressed="${this.isLit}">
          <div class="candle-body">
            <div class="candle-flame ${this.isLit ? 'active' : ''}">
              <div class="flame-core"></div>
              <div class="flame-outer"></div>
              <div class="flame-glow"></div>
            </div>
            <div class="candle-wick"></div>
            <div class="candle-wax"></div>
            <div class="wax-drip"></div>
          </div>
          <div class="candle-halo"></div>
          <button class="candle-button ${this.isLit ? 'lit' : ''}" ${this.isLit ? 'disabled' : ''}>
            ${this.isLit ? '✨ Vela Encendida' : '🕯️ Encender una vela'}
          </button>
          <div class="candle-counter">
            <span class="flame-icon">🕯️</span>
            <span class="count-number">${worshippers}</span>
            <span class="count-text">personas han encendido una vela hoy</span>
          </div>
        </div>
      `;

      this.addStyles();
      this.bindEvents();
    },

    addStyles() {
      if (document.getElementById('votive-candle-styles')) return;

      const style = document.createElement('style');
      style.id = 'votive-candle-styles';
      style.textContent = `
        .votive-candle-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          background: linear-gradient(180deg, rgba(5,13,26,0.8) 0%, rgba(10,22,40,0.9) 100%);
          border-radius: 16px;
          border: 1px solid rgba(212,175,55,0.2);
          max-width: 200px;
          margin: 20px auto;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .votive-candle-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 40px rgba(212,175,55,0.15);
        }
        .votive-candle-container:focus {
          outline: 2px solid var(--gold, #d4af37);
          outline-offset: 4px;
        }
        .candle-body {
          position: relative;
          width: 40px;
          height: 80px;
          margin-bottom: 20px;
        }
        .candle-wax {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 70px;
          background: linear-gradient(90deg, #e8dcc8 0%, #f5efe6 30%, #e8dcc8 60%, #d4c4a8 100%);
          border-radius: 4px 4px 8px 8px;
          box-shadow: inset -5px 0 10px rgba(0,0,0,0.1), inset 5px 0 10px rgba(255,255,255,0.2);
        }
        .candle-wick {
          position: absolute;
          bottom: 68px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 12px;
          background: linear-gradient(180deg, #333 0%, #1a1a1a 100%);
          border-radius: 2px;
        }
        .wax-drip {
          position: absolute;
          bottom: 20px;
          left: 8px;
          width: 8px;
          height: 25px;
          background: linear-gradient(180deg, #f5efe6 0%, #d4c4a8 100%);
          border-radius: 4px;
          animation: waxDrip 3s ease-in-out infinite;
        }
        @keyframes waxDrip {
          0%, 100% { height: 25px; opacity: 1; }
          50% { height: 30px; opacity: 0.8; }
        }
        .candle-flame {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 30px;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .candle-flame.active {
          opacity: 1;
          animation: flameFlicker 0.8s ease-in-out infinite;
        }
        @keyframes flameFlicker {
          0%, 100% { transform: translateX(-50%) scale(1) rotate(-2deg); }
          25% { transform: translateX(-50%) scale(1.05) rotate(2deg); }
          50% { transform: translateX(-50%) scale(0.98) rotate(-1deg); }
          75% { transform: translateX(-50%) scale(1.02) rotate(1deg); }
        }
        .flame-core {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 20px;
          background: radial-gradient(ellipse at bottom, #fff5c0 0%, #ffd700 40%, #ff8c00 80%, transparent 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        }
        .flame-outer {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 28px;
          background: radial-gradient(ellipse at bottom, #ffd700 0%, #ff6600 50%, transparent 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          opacity: 0.8;
        }
        .flame-glow {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(255,200,100,0.4) 0%, transparent 70%);
          animation: glowPulse 1.5s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
        }
        .candle-halo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255,200,100,0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .votive-candle-container.lit .candle-halo {
          opacity: 1;
        }
        .candle-button {
          background: linear-gradient(135deg, var(--gold-dark, #b8960c) 0%, var(--gold, #d4af37) 100%);
          color: var(--blue-deep, #050d1a);
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 15px;
        }
        .candle-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(212,175,55,0.5);
        }
        .candle-button:disabled, .candle-button.lit {
          background: linear-gradient(135deg, #4a4a4a 0%, #6a6a6a 100%);
          color: #aaa;
          cursor: default;
        }
        .candle-counter {
          margin-top: 15px;
          font-size: 0.75rem;
          color: rgba(250,247,240,0.7);
          text-align: center;
        }
        .candle-counter .flame-icon {
          font-size: 1rem;
        }
        .candle-counter .count-number {
          color: var(--gold-light, #f4e2a1);
          font-weight: bold;
          margin: 0 5px;
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      const btn = this.container.querySelector('.candle-button');
      if (btn && !this.isLit) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.light();
        });
      }

      const container = this.container.querySelector('.votive-candle-container');
      if (container) {
        container.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!this.isLit) this.light();
          }
        });
      }
    },

    light() {
      this.isLit = true;
      const data = {
        litAt: Date.now(),
        section: this.sectionKey
      };
      localStorage.setItem('votive_candle_' + this.sectionKey, JSON.stringify(data));
      
      const flame = this.container.querySelector('.candle-flame');
      if (flame) {
        flame.classList.add('active');
      }
      
      const btn = this.container.querySelector('.candle-button');
      if (btn) {
        btn.classList.add('lit');
        btn.disabled = true;
        btn.textContent = '✨ Vela Encendida';
      }

      // Actualizar contador
      const today = new Date().toDateString();
      const worshippersKey = 'worshippers_' + today;
      let worshippers = parseInt(localStorage.getItem(worshippersKey)) || 0;
      worshippers++;
      localStorage.setItem(worshippersKey, worshippers);
      
      const countNumber = this.container.querySelector('.count-number');
      if (countNumber) {
        countNumber.textContent = worshippers;
      }
    },

    updateCounter() {
      // El contador se actualiza al renderizar
    }
  };

  window.VotiveCandle = VotiveCandle;
})();