/**
 * Splash Screen - Pantalla de Carga Sagrada
 * Animación de entrada con efecto de materialización luminosa
 * Se muestra una sola vez por sesión
 */
(function() {
  'use strict';

  const SPLASH_KEY = 'divina_misericordia_splash_shown';
  const SPLASH_DURATION = 2000;

  const SplashScreen = {
    element: null,
    overlay: null,

    init() {
      if (this.shouldShow()) {
        this.create();
        this.animateIn();
        setTimeout(() => this.animateOut(), SPLASH_DURATION);
      }
    },

    shouldShow() {
      // No mostrar en móviles
      if (window.matchMedia('(max-width: 768px)').matches) return false;
      // No mostrar si prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      // Solo mostrar una vez por sesión
      return !sessionStorage.getItem(SPLASH_KEY);
    },

    create() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'splash-overlay';
      this.overlay.innerHTML = `
        <div class="splash-content">
          <div class="splash-symbol">
            <svg viewBox="0 0 100 100" class="splash-cruz">
              <defs>
                <linearGradient id="splashGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fff5c0"/>
                  <stop offset="50%" stop-color="#d4af37"/>
                  <stop offset="100%" stop-color="#8a7000"/>
                </linearGradient>
                <filter id="splashGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <rect x="46" y="10" width="8" height="80" rx="4" fill="url(#splashGold)" filter="url(#splashGlow)"/>
              <rect x="20" y="35" width="60" height="8" rx="4" fill="url(#splashGold)" filter="url(#splashGlow)"/>
              <circle cx="50" cy="25" r="4" fill="#fff5c0" filter="url(#splashGlow)"/>
            </svg>
            <div class="splash-rings">
              <div class="splash-ring"></div>
              <div class="splash-ring"></div>
              <div class="splash-ring"></div>
            </div>
          </div>
          <h1 class="splash-title">Divina Misericordia</h1>
          <p class="splash-subtitle">Jesús, en Vos Confío</p>
        </div>
      `;

      document.body.appendChild(this.overlay);
      this.element = this.overlay;

      // Agregar estilos si no existen
      if (!document.getElementById('splash-styles')) {
        this.addStyles();
      }
    },

    addStyles() {
      const style = document.createElement('style');
      style.id = 'splash-styles';
      style.textContent = `
        .splash-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #050d1a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          opacity: 0;
          visibility: hidden;
        }
        .splash-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .splash-content {
          text-align: center;
          transform: scale(0.8);
          opacity: 0;
        }
        .splash-overlay.active .splash-content {
          animation: splashMaterialize 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes splashMaterialize {
          0% { transform: scale(0.5); opacity: 0; filter: blur(20px); }
          30% { transform: scale(1.05); opacity: 1; filter: blur(0); }
          50% { transform: scale(0.95); opacity: 1; filter: blur(0); }
          70% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .splash-symbol {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 30px;
        }
        .splash-cruz {
          width: 100%;
          height: 100%;
          animation: splashPulse 2s ease-in-out infinite;
        }
        @keyframes splashPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(212,175,55,0.6)); }
          50% { filter: drop-shadow(0 0 40px rgba(212,175,55,1)); }
        }
        .splash-rings {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .splash-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 50%;
          animation: splashRingExpand 2s ease-out infinite;
        }
        .splash-ring:nth-child(1) { animation-delay: 0s; }
        .splash-ring:nth-child(2) { animation-delay: 0.4s; }
        .splash-ring:nth-child(3) { animation-delay: 0.8s; }
        @keyframes splashRingExpand {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        .splash-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          color: var(--gold-light, #f4e2a1);
          margin-bottom: 10px;
          text-shadow: 0 0 30px rgba(212,175,55,0.5);
        }
        .splash-subtitle {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: rgba(250,247,240,0.7);
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .splash-overlay.fade-out {
          animation: splashFadeOut 0.6s ease forwards;
        }
        @keyframes splashFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `;
      document.head.appendChild(style);
    },

    animateIn() {
      requestAnimationFrame(() => {
        this.overlay.classList.add('active');
      });
    },

    animateOut() {
      // Marcar como mostrado
      sessionStorage.setItem(SPLASH_KEY, 'true');
      
      this.overlay.classList.add('fade-out');
      
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
      }, 600);
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SplashScreen.init());
  } else {
    SplashScreen.init();
  }

  window.SplashScreen = SplashScreen;
})();
