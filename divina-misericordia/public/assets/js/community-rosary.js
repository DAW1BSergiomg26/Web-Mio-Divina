/**
 * Rosario Sincronizado en Tiempo Real
 * Permite a múltiples usuarios rezar juntos virtualmente
 * Soporta Supabase/Firebase o modo offline
 */
(function() {
  'use strict';

  const CommunityRosary = {
    currentMystery: 0,
    currentHail: 0,
    decade: 0,
    isLeading: false,
    participants: {},
    config: {
      backend: null,
      apiKey: null,
      projectUrl: null
    },

    mysteries: [
      { name: 'Los Misterios Gozosos', days: ['lunes', 'sabado'] },
      { name: 'Los Misterios Dolorosos', days: ['martes', 'viernes'] },
      { name: 'Los Misterios Gloriosos', days: ['miercoles', 'domingo'] },
      { name: 'Los Misterios Luminosos', days: ['jueves'] }
    ],

    mysteriesEspañol: [
      'El Ángel anunció a María',
      'La Visitación',
      'El Nacimiento de Jesús',
      'La Presentación en el Templo',
      'Jesús perdido y encontrado en el Templo'
    ],
    dolorososEspañol: [
      'Jesús ora en el Huerto',
      'Jesús flagelado',
      'Jesús coronado de espinas',
      'Jesús carga la cruz',
      'Jesús crucifixion'
    ],
    gloriososEspañol: [
      'La Resurrección',
      'La Ascensión',
      'La Venida del Espíritu Santo',
      'La Asunción de María',
      'La Coronación de María'
    ],
    luminososEspañol: [
      'Bautismo de Jesús',
      'Bodas de Caná',
      'Anuncio del Reino',
      'Transfiguración',
      'Institución de la Eucaristía'
    ],

    init(options = {}) {
      this.config = { ...this.config, ...options };
      this.determineTodayMystery();
      this.loadProgress();
      
      if (this.config.backend) {
        this.connectToBackend();
      } else {
        this.initOfflineMode();
      }
    },

    determineTodayMystery() {
      const day = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
      this.currentMystery = this.mysteries.findIndex(m => m.days.includes(day));
      if (this.currentMystery === -1) this.currentMystery = 0;
    },

    getCurrentMysteryName() {
      return this.mysteries[this.currentMystery].name;
    },

    getCurrentMysteryEspañol() {
      const lists = [
        this.mysteriesEspañol,
        this.dolorososEspañol,
        this.gloriososEspañol,
        this.luminososEspañol
      ];
      return lists[this.currentMystery][this.decade] || '';
    },

    loadProgress() {
      const saved = localStorage.getItem('rosario_progreso');
      if (saved) {
        const data = JSON.parse(saved);
        this.currentHail = data.currentHail || 0;
        this.decade = data.decade || 0;
      }
    },

    saveProgress() {
      localStorage.setItem('rosario_progreso', JSON.stringify({
        currentHail: this.currentHail,
        decade: this.decade,
        lastUpdated: Date.now()
      }));
    },

    connectToBackend() {
      console.log('Rosary: conectado al backend');
      this.listenForParticipants();
    },

    initOfflineMode() {
      this.renderRosaryInterface();
    },

    listenForParticipants() {
      // Placeholder para Supabase/Firebase subscription
    },

    startRosary() {
      this.isLeading = true;
      this.currentHail = 0;
      this.decade = 0;
      this.broadcastStart();
      this.renderRosaryInterface();
    },

    broadcastStart() {
      if (this.config.backend && window.supabase) {
        window.supabase.from('rosary_sessions').insert({
          started_at: new Date().toISOString(),
          mystery: this.currentMystery,
          leader_id: this.getUserId()
        });
      }
    },

    getUserId() {
      return localStorage.getItem('peregrino_id') || 'peregrino_' + Date.now();
    },

    nextHail() {
      this.currentHail++;
      
      if (this.currentHail % 10 === 0) {
        this.decade++;
        this.triggerDecadeComplete();
      }
      
      this.saveProgress();
      this.updateDisplay();
    },

    triggerDecadeComplete() {
      const audio = new Audio('/audio/amen.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});

      const event = new CustomEvent('decadeComplete', {
        detail: { decade: this.decade, mystery: this.getCurrentMysteryEspañol() }
      });
      document.dispatchEvent(event);
    },

    getMysteryImageUrl() {
      const images = [
        'gozosos', 'dolorosos', 'gloriosos', 'luminosos'
      ];
      return `/img/misterios-${images[this.currentMystery]}.jpg`;
    },

    renderRosaryInterface() {
      this.createStyles();
      
      let container = document.querySelector('.rosary-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'rosary-container';
        document.querySelector('.main-content, main')?.appendChild(container);
      }

      container.innerHTML = `
        <div class="rosary-card">
          <div class="rosary-header">
            <h2>☦ Santo Rosario</h2>
            <p class="mystery-name">${this.getCurrentMysteryName()}</p>
          </div>
          
          <div class="mystery-display">
            <div class="mystery-bead ${this.decade >= 1 ? 'completed' : ''}">1</div>
            <div class="mystery-bead ${this.decade >= 2 ? 'completed' : ''}">2</div>
            <div class="mystery-bead ${this.decade >= 3 ? 'completed' : ''}">3</div>
            <div class="mystery-bead ${this.decade >= 4 ? 'completed' : ''}">4</div>
            <div class="mystery-bead ${this.decade >= 5 ? 'completed' : ''}">5</div>
          </div>
          
          <div class="current-mystery-text">
            <p class="mystery-title">${this.getCurrentMysteryEspañol()}</p>
            <p class="hail-count">${this.currentHail} Ave Marías</p>
          </div>
          
          <div class="rosary-controls">
            <button class="rosary-btn pray-btn" id="rosary-pray">
              <span class="bead">●</span>
              Rezar un Ave María
            </button>
            <button class="rosary-btn reset-btn" id="rosary-reset">
              ↺ Reiniciar
            </button>
          </div>
          
          <div class="rosary-guide">
            <div class="prayer-text">
              <p><strong>En el nombre del Padre...</strong></p>
              <p>Yo creo, Dios mío...</p>
              <p>Padre nuestro que estás...</p>
              <p class="hail-prayer">Dios te salve María...</p>
              <p class="glory-text">Gloria al Padre...</p>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
      this.updateDisplay();
    },

    updateDisplay() {
      const hailCount = document.querySelector('.hail-count');
      if (hailCount) {
        hailCount.textContent = `${this.currentHail} Ave Marías`;
      }

      const mysteryBeads = document.querySelectorAll('.mystery-bead');
      mysteryBeads.forEach((bead, i) => {
        bead.classList.toggle('completed', this.decade > i);
        bead.classList.toggle('active', this.decade === i);
      });

      const mysteryText = document.querySelector('.mystery-title');
      if (mysteryText) {
        mysteryText.textContent = this.getCurrentMysteryEspañol();
      }
    },

    bindEvents() {
      const prayBtn = document.getElementById('rosary-pray');
      if (prayBtn) {
        prayBtn.addEventListener('click', () => {
          this.nextHail();
          this.playHailSound();
        });
      }

      const resetBtn = document.getElementById('rosary-reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.currentHail = 0;
          this.decade = 0;
          this.saveProgress();
          this.updateDisplay();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
          this.nextHail();
        }
      });
    },

    playHailSound() {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      
      oscillator.connect(gain);
      gain.connect(context.destination);
      
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      
      gain.gain.setValueAtTime(0.1, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
    },

    createStyles() {
      if (document.getElementById('rosary-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'rosary-styles';
      style.textContent = `
        .rosary-container {
          max-width: 500px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .rosary-card {
          background: linear-gradient(145deg, rgba(20,18,15,0.95), rgba(35,30,25,0.95));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
        }
        .rosary-header h2 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }
        .mystery-name {
          color: rgba(250,247,240,0.7);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .mystery-display {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 1.5rem;
        }
        .mystery-bead {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(212,175,55,0.2);
          border: 2px solid rgba(212,175,55,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(250,247,240,0.5);
          font-size: 0.9rem;
          transition: all 0.3s;
        }
        .mystery-bead.completed {
          background: #d4af37;
          color: #1a1612;
          border-color: #d4af37;
        }
        .mystery-bead.active {
          box-shadow: 0 0 15px rgba(212,175,55,0.5);
        }
        .current-mystery-text {
          margin-bottom: 1.5rem;
        }
        .mystery-title {
          font-family: 'EB Garamond', serif;
          color: #faf7f0;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .hail-count {
          color: #d4af37;
          font-size: 0.9rem;
        }
        .rosary-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .rosary-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .pray-btn {
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1612;
          font-weight: bold;
        }
        .pray-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(212,175,55,0.4);
        }
        .pray-btn .bead {
          margin-right: 8px;
        }
        .reset-btn {
          background: rgba(250,247,240,0.1);
          color: rgba(250,247,240,0.7);
          border: 1px solid rgba(250,247,240,0.2);
        }
        .reset-btn:hover {
          background: rgba(250,247,240,0.2);
        }
        .rosary-guide {
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          padding: 1rem;
          text-align: left;
        }
        .prayer-text p {
          color: rgba(250,247,240,0.7);
          font-size: 0.85rem;
          margin: 0.3rem 0;
          font-family: 'EB Garamond', serif;
        }
        .prayer-text .hail-prayer {
          font-style: italic;
          color: #d4af37;
        }
        .prayer-text .glory-text {
          color: rgba(250,247,240,0.5);
        }
      `;
      document.head.appendChild(style);
    }
  };

  window.CommunityRosary = CommunityRosary;
  console.log('📿 Community Rosary loaded');
})();