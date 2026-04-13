/**
 * Guided Meditation - Meditación Guiada con Audio Procedural
 * Web Speech API + Web Audio API para experiencia de meditación
 */
(function() {
  'use strict';

  const GuidedMeditation = {
    container: null,
    isPlaying: false,
    currentType: null,
    audioContext: null,
    soundscapeGain: null,
    meditationGain: null,
    speechSynthesis: null,
    verses: [
      'Yo estaré con ustedes todos los días, hasta el fin del mundo.',
      'Jesús, en Vos confío.',
      'Dios es amor.',
      'La paz les dejo, mi paz les doy.',
      'Venid a mí todos los que estáis cansados.',
      'El Señor es mi pastor, nada me falta.',
      'María, Madre de Dios, ruega por nosotros.',
      'Santifica mi corazón, oh Dios.',
      'Tu voluntad sea hecha, no la mía.',
      'Padre, en tus manos encomiendo mi espíritu.'
    ],

    types: {
      lectio: {
        name: 'Lectio Divina',
        description: 'Meditación sobre un versículo del día',
        duration: 300
      },
      maria: {
        name: 'Contemplación Mariana',
        description: 'Imagen, silencio y música',
        duration: 300
      },
      conciencia: {
        name: 'Examen de Conciencia',
        description: 'Preguntas guiadas con pausa',
        duration: 300
      },
      quietud: {
        name: 'Oración de Quietud',
        description: 'Silencio, sonido de catedral y luz',
        duration: 300
      }
    },

    init(containerSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;
      
      this.speechSynthesis = window.speechSynthesis;
      this.render();
    },

    render() {
      this.container.innerHTML = `
        <div class="meditation-wrapper">
          <h2 class="meditation-title">✝ Meditación Guiada</h2>
          <p class="meditation-subtitle">5 minutos de oración y paz interior</p>
          
          <div class="meditation-types">
            ${Object.entries(this.types).map(([key, type]) => `
              <button class="meditation-btn" data-type="${key}">
                <span class="meditation-btn-icon">${this.getIcon(key)}</span>
                <span class="meditation-btn-name">${type.name}</span>
                <span class="meditation-btn-desc">${type.description}</span>
              </button>
            `).join('')}
          </div>
          
          <div class="meditation-player" style="display: none;">
            <div class="meditation-progress">
              <div class="meditation-progress-bar"></div>
              <span class="meditation-time">5:00</span>
            </div>
            <div class="meditation-text"></div>
            <div class="meditation-controls">
              <button class="meditation-control-btn" id="meditation-play">
                ▶ Iniciar
              </button>
              <button class="meditation-control-btn" id="meditation-stop">
                ⏹ Detener
              </button>
            </div>
          </div>
        </div>
      `;
      
      this.createStyles();
      this.bindEvents();
    },

    getIcon(type) {
      const icons = {
        lectio: '📖',
        maria: '🕊️',
        conciencia: '🔍',
        quietud: '🕯️'
      };
      return icons[type] || '✝';
    },

    createStyles() {
      if (document.getElementById('meditation-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'meditation-styles';
      style.textContent = `
        .meditation-wrapper {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .meditation-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: 2rem;
          color: var(--gold, #d4af37);
          margin-bottom: 0.5rem;
        }
        .meditation-subtitle {
          color: var(--text-muted, rgba(250,247,240,0.7));
          margin-bottom: 2rem;
        }
        .meditation-types {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .meditation-btn {
          padding: 1.5rem;
          background: rgba(212,175,55,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        .meditation-btn:hover {
          background: rgba(212,175,55,0.15);
          transform: translateY(-3px);
        }
        .meditation-btn-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .meditation-btn-name {
          font-family: 'Cinzel', serif;
          color: var(--gold, #d4af37);
          display: block;
          margin-bottom: 0.3rem;
        }
        .meditation-btn-desc {
          font-size: 0.8rem;
          color: var(--text-muted, rgba(250,247,240,0.6));
        }
        .meditation-player {
          background: rgba(10,22,40,0.8);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(212,175,55,0.2);
        }
        .meditation-progress {
          margin-bottom: 1.5rem;
          position: relative;
        }
        .meditation-progress-bar {
          height: 4px;
          background: rgba(212,175,55,0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        .meditation-time {
          font-size: 0.8rem;
          color: var(--gold, #d4af37);
          margin-top: 0.5rem;
          display: block;
        }
        .meditation-text {
          font-family: 'EB Garamond', serif;
          font-size: 1.1rem;
          font-style: italic;
          color: var(--white, #faf7f0);
          min-height: 80px;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .meditation-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .meditation-control-btn {
          padding: 0.8rem 1.5rem;
          background: rgba(212,175,55,0.2);
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 20px;
          color: var(--gold, #d4af37);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .meditation-control-btn:hover {
          background: rgba(212,175,55,0.4);
        }
        @media (max-width: 600px) {
          .meditation-types {
            grid-template-columns: 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      const buttons = this.container.querySelectorAll('.meditation-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = e.currentTarget.dataset.type;
          this.startMeditation(type);
        });
      });
      
      const playBtn = document.getElementById('meditation-play');
      const stopBtn = document.getElementById('meditation-stop');
      
      if (playBtn) {
        playBtn.addEventListener('click', () => this.togglePlay());
      }
      if (stopBtn) {
        stopBtn.addEventListener('click', () => this.stop());
      }
    },

    startMeditation(type) {
      this.currentType = type;
      const player = this.container.querySelector('.meditation-player');
      player.style.display = 'block';
      
      this.initAudio();
      this.playSoundscape();
      
      setTimeout(() => this.speakVerse(), 3000);
    },

    initAudio() {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.soundscapeGain = this.audioContext.createGain();
        this.soundscapeGain.gain.value = 0.15;
        this.soundscapeGain.connect(this.audioContext.destination);
        this.meditationGain = this.audioContext.createGain();
        this.meditationGain.gain.value = 0.7;
        this.meditationGain.connect(this.audioContext.destination);
      }
    },

    playSoundscape() {
      const organOsc = this.audioContext.createOscillator();
      organOsc.type = 'sine';
      organOsc.frequency.value = 55;
      
      const organGain = this.audioContext.createGain();
      organGain.gain.value = 0.03;
      
      organOsc.connect(organGain);
      organGain.connect(this.soundscapeGain);
      organOsc.start();
      
      this.currentOsc = organOsc;
    },

    speakVerse() {
      if (!this.speechSynthesis) return;
      
      const verse = this.verses[Math.floor(Math.random() * this.verses.length)];
      const textEl = this.container.querySelector('.meditation-text');
      
      if (this.speechSynthesis.speaking) {
        this.speechSynthesis.cancel();
      }
      
      textEl.textContent = verse;
      
      const utterance = new SpeechSynthesisUtterance(verse);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      
      utterance.onend = () => {
        this.soundscapeGain.gain.setTargetAtTime(0.25, this.audioContext.currentTime, 2);
        this.scheduleEnd();
      };
      
      this.soundscapeGain.gain.setTargetAtTime(0.05, this.audioContext.currentTime, 0.5);
      this.speechSynthesis.speak(utterance);
    },

    scheduleEnd() {
      setTimeout(() => {
        this.playBell();
        this.stop();
      }, 10000);
    },

    playBell() {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 880;
      
      gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 4);
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 4);
    },

    togglePlay() {
      this.isPlaying = !this.isPlaying;
      const btn = document.getElementById('meditation-play');
      btn.textContent = this.isPlaying ? '⏸ Pausar' : '▶ Continuar';
    },

    stop() {
      this.isPlaying = false;
      
      if (this.speechSynthesis) {
        this.speechSynthesis.cancel();
      }
      
      if (this.currentOsc) {
        this.currentOsc.stop();
        this.currentOsc = null;
      }
      
      const player = this.container.querySelector('.meditation-player');
      player.style.display = 'none';
    }
  };

  window.GuidedMeditation = GuidedMeditation;
  console.log('🧘 Guided Meditation loaded');
})();