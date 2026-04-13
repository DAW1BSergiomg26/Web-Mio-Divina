/**
 * Cathedral Mode - Experiencia Inmersiva de Catedral Virtual
 * WebGL + Web Audio API para experiencia total
 */
(function() {
  'use strict';

  const CathedralMode = {
    container: null,
    overlay: null,
    isActive: false,
    webglScene: null,
    audioEngine: null,
    step: 0,
    stepDuration: 1000,
    soundscapeNodes: [],

    init() {
      this.createStyles();
      this.createOverlay();
      this.setupControls();
    },

    createStyles() {
      if (document.getElementById('cathedral-mode-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'cathedral-mode-styles';
      style.textContent = `
        .cathedral-overlay {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 1s ease;
        }
        .cathedral-overlay.active {
          opacity: 1;
          pointer-events: all;
        }
        .cathedral-content {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #0a0a15 0%, #1a1520 50%, #0d0d12 100%);
          overflow: hidden;
        }
        .cathedral-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .cathedral-step {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .cathedral-step.visible {
          opacity: 1;
        }
        .cathedral-step-1 { background: #000; }
        .cathedral-step-2 { 
          background: radial-gradient(ellipse at center, #1a1020 0%, #000 70%);
        }
        .cathedral-step-3 {
          background: radial-gradient(ellipse at 50% 80%, #2a1a10 0%, #0a0a0a 50%, #000 100%);
        }
        .cathedral-step-4 {
          background: radial-gradient(ellipse at 50% 50%, #1a1520 0%, #0a0510 100%);
        }
        .cathedral-step-5 {
          background: linear-gradient(180deg, #0d0d15 0%, #15101a 30%, #1a1520 100%);
        }
        .cathedral-cruz {
          font-size: 8rem;
          color: #d4af37;
          text-shadow: 0 0 60px rgba(212,175,55,0.8), 0 0 120px rgba(212,175,55,0.4);
          opacity: 0;
          transform: scale(0.8);
          transition: all 1s ease;
        }
        .cathedral-cruz.visible {
          opacity: 1;
          transform: scale(1);
        }
        .cathedral-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: 2.5rem;
          color: #f4e2a1;
          text-shadow: 0 0 30px rgba(244,226,161,0.5);
          margin-top: 2rem;
        }
        .cathedral-entrance-btn {
          margin-top: 2rem;
          padding: 1rem 3rem;
          background: linear-gradient(135deg, #d4af37, #b8960c);
          border: none;
          border-radius: 30px;
          color: #050d1a;
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .cathedral-entrance-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(212,175,55,0.6);
        }
        .cathedral-exit-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background: rgba(212,175,55,0.2);
          border: 1px solid rgba(212,175,55,0.5);
          border-radius: 20px;
          color: #d4af37;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          z-index: 10;
        }
        .cathedral-nav {
          position: absolute;
          bottom: 30px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        .cathedral-nav-item {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(212,175,55,0.1);
          border: 2px solid rgba(212,175,55,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #d4af37;
          font-size: 1.5rem;
        }
        .cathedral-nav-item:hover {
          background: rgba(212,175,55,0.3);
          transform: scale(1.1);
        }
        .cathedral-silence-zone {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .cathedral-silence-zone::after {
          content: 'SILENCIO';
          font-family: 'Cinzel', serif;
          color: rgba(212,175,55,0.5);
          letter-spacing: 5px;
        }
        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(212,175,55,0.2);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    },

    createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'cathedral-overlay';
      this.overlay.innerHTML = `
        <div class="cathedral-content">
          <button class="cathedral-exit-btn" style="display:none;">✝ Salir</button>
          
          <div class="cathedral-step cathedral-step-1">
            <div class="loading-spinner"></div>
          </div>
          
          <div class="cathedral-step cathedral-step-2">
            <div class="cathedral-cruz">✝</div>
          </div>
          
          <div class="cathedral-step cathedral-step-3">
            <h2 class="cathedral-title">La Fachada</h2>
          </div>
          
          <div class="cathedral-step cathedral-step-4">
            <h2 class="cathedral-title">Las Puertas se Abren</h2>
          </div>
          
          <div class="cathedral-step cathedral-step-5">
            <div class="cathedral-nav">
              <div class="cathedral-nav-item" data-section="altar">✝</div>
              <div class="cathedral-nav-item" data-section="rosario">📿</div>
              <div class="cathedral-nav-item" data-section="intenciones">🙏</div>
              <div class="cathedral-nav-item" data-section="silencio">◉</div>
              <div class="cathedral-nav-item" data-section="vitrales">💒</div>
            </div>
            <div class="cathedral-silence-zone" title="Zona de Silencio"></div>
          </div>
        </div>
      `;
      document.body.appendChild(this.overlay);
    },

    setupControls() {
      const exitBtn = this.overlay.querySelector('.cathedral-exit-btn');
      exitBtn.addEventListener('click', () => this.exit());
      
      const navItems = this.overlay.querySelectorAll('.cathedral-nav-item');
      navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          const section = e.currentTarget.dataset.section;
          this.navigateToSection(section);
        });
      });
    },

    async enter() {
      if (this.isActive) return;
      
      this.isActive = true;
      this.overlay.classList.add('active');
      
      await this.initAudio();
      this.playBell();
      
      setTimeout(() => this.showStep(2), 2000);
      setTimeout(() => this.showStep(3), 4000);
      setTimeout(() => this.showStep(4), 6000);
      setTimeout(() => this.showStep(5), 8000);
      
      const exitBtn = this.overlay.querySelector('.cathedral-exit-btn');
      exitBtn.style.display = 'block';
      
      this.startSoundscape();
    },

    async initAudio() {
      if (!window.SpatialAudio) {
        const script = document.createElement('script');
        script.src = 'js/spatial-audio.js';
        document.head.appendChild(script);
        await new Promise(r => script.onload = r);
      }
      window.SpatialAudio.init();
    },

    playBell() {
      const ctx = window.SpatialAudio?.audioContext || new (window.AudioContext || window.webkitAudioContext)();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 440;
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 3);
    },

    startSoundscape() {
      const ctx = window.SpatialAudio?.audioContext || new (window.AudioContext || window.webkitAudioContext)();
      
      const organOsc = ctx.createOscillator();
      organOsc.type = 'sine';
      organOsc.frequency.value = 55;
      
      const organGain = ctx.createGain();
      organGain.gain.value = 0.02;
      
      organOsc.connect(organGain);
      organGain.connect(ctx.destination);
      organOsc.start();
      
      this.soundscapeNodes.push(organOsc);
    },

    showStep(num) {
      const steps = this.overlay.querySelectorAll('.cathedral-step');
      steps.forEach(s => s.classList.remove('visible'));
      const target = this.overlay.querySelector(`.cathedral-step-${num}`);
      if (target) target.classList.add('visible');
    },

    navigateToSection(section) {
      switch(section) {
        case 'altar':
          window.location.href = 'el-altar.html';
          break;
        case 'rosario':
          window.location.href = 'santo-rosario.html';
          break;
        case 'intenciones':
          window.location.href = 'oraciones.html';
          break;
        case 'silencio':
          this.enterSilenceZone();
          break;
        case 'vitrales':
          window.location.href = 'devociones-marianas.html';
          break;
      }
    },

    enterSilenceZone() {
      this.soundscapeNodes.forEach(node => {
        if (node.stop) node.stop();
      });
      this.soundscapeNodes = [];
    },

    exit() {
      this.isActive = false;
      this.overlay.classList.remove('active');
      
      this.soundscapeNodes.forEach(node => {
        try { if (node.stop) node.stop(); } catch(e) {}
      });
      this.soundscapeNodes = [];
    }
  };

  window.CathedralMode = CathedralMode;
  
  document.addEventListener('DOMContentLoaded', () => CathedralMode.init());
  console.log('⛪ Cathedral Mode loaded');
})();