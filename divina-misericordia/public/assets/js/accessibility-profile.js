/**
 * Perfil de Accesibilidad - Modo Contemplativo
 * Especialmente diseñado para personas mayores
 * Configuración de accesibilidad espiritual sin术语 técnicos
 */
(function() {
  'use strict';

  const ContemplativeMode = {
    isActive: false,
    config: {
      fontScale: 1.2,
      highContrast: true,
      animationsDisabled: true,
      simplifiedNav: true,
      textHelp: true,
      companionSimple: true
    },
    originalSettings: {},

    init() {
      this.loadSavedPreference();
      if (this.isActive) {
        this.applySettings();
      }
      this.createToggleButton();
      this.setupEventListeners();
      console.log('🕊️ Contemplative Mode ready');
    },

    loadSavedPreference() {
      const saved = localStorage.getItem('modo_contemplativo');
      if (saved === 'active') {
        this.isActive = true;
      }
    },

    savePreference() {
      localStorage.setItem('modo_contemplativo', this.isActive ? 'active' : 'inactive');
    },

    toggle() {
      this.isActive = !this.isActive;
      this.savePreference();

      if (this.isActive) {
        this.applySettings();
      } else {
        this.restoreSettings();
      }

      this.updateToggleUI();
      
      EventBus.emit(SanctuaryEvents.MODE_CONTEMPLATIVE_ENABLED, {
        active: this.isActive
      });
    },

    applySettings() {
      this.storeOriginalSettings();

      const root = document.documentElement;
      root.style.setProperty('--font-scale', this.config.fontScale);
      root.classList.add('contemplative-mode');

      if (this.config.animationsDisabled) {
        this.disableAnimations();
      }

      if (this.config.highContrast) {
        this.applyHighContrast();
      }

      if (this.config.simplifiedNav) {
        this.simplifyNavigation();
      }

      if (this.config.textHelp) {
        this.addTextHelp();
      }

      if (this.config.companionSimple) {
        this.simplifyCompanion();
      }
    },

    storeOriginalSettings() {
      this.originalSettings = {
        fontSize: document.body.style.fontSize,
        animations: document.body.style.animation,
        transitions: document.body.style.transition,
        contrast: ''
      };
    },

    disableAnimations() {
      const style = document.createElement('style');
      style.id = 'contemplative-animations-off';
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .animate-on-scroll, .scroll-reveal, .fade-in, .slide-up {
          opacity: 1 !important;
          transform: none !important;
        }
        .particle-canvas canvas, .particles-js-canvas {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    },

    applyHighContrast() {
      document.body.classList.add('high-contrast');
      
      const style = document.createElement('style');
      style.id = 'contemplative-high-contrast';
      style.textContent = `
        body.high-contrast {
          background-color: #000 !important;
          color: #fff !important;
        }
        body.high-contrast a {
          color: #ff0 !important;
          text-decoration: underline !important;
        }
        body.high-contrast h1, body.high-contrast h2, body.high-contrast h3 {
          color: #ffd700 !important;
        }
        body.high-contrast .contemplative-toggle {
          border-color: #ffd700 !important;
          color: #fff !important;
        }
      `;
      document.head.appendChild(style);
    },

    simplifyNavigation() {
      const nav = document.querySelector('.main-nav, nav');
      if (!nav) return;

      const mainLinks = nav.querySelectorAll('a');
      mainLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        if (!link.querySelector('.nav-help-text')) {
          const helpSpan = document.createElement('span');
          helpSpan.className = 'nav-help-text';
          helpSpan.textContent = this.getLinkDescription(href);
          link.appendChild(helpSpan);
        }
      });

      const secondaryElements = nav.querySelectorAll('.nav-secondary, .social-links, .search-box');
      secondaryElements.forEach(el => el.style.display = 'none');
    },

    getLinkDescription(href) {
      const descriptions = {
        '/': 'Ir a la página principal',
        '/index.html': 'Ir a la página principal',
        '/contacto.html': 'Enviar un mensaje',
        '/donar.html': 'Colaborar con el santuario',
        '/oraciones.html': 'Ver oraciones',
        '/multimedia.html': 'Ver videos y música',
        '/blog.html': 'Leer artículos'
      };
      return descriptions[href] || '';
    },

    addTextHelp() {
      const buttons = document.querySelectorAll('button, .btn, a.btn');
      
      buttons.forEach(btn => {
        if (!btn.title && !btn.getAttribute('aria-label')) {
          const text = btn.textContent?.trim() || btn.innerHTML?.trim();
          if (text) {
            btn.setAttribute('aria-label', text);
          }
        }
      });

      const images = document.querySelectorAll('img:not([alt])');
      images.forEach(img => {
        img.alt = 'Imagen devocional';
      });
    },

    simplifyCompanion() {
      if (window.SpiritualCompanion && window.SpiritualCompanion.setSimpleMode) {
        window.SpiritualCompanion.setSimpleMode(true);
      }
    },

    restoreSettings() {
      const root = document.documentElement;
      root.classList.remove('contemplative-mode', 'high-contrast');
      root.style.removeProperty('--font-scale');

      const animStyle = document.getElementById('contemplative-animations-off');
      if (animStyle) animStyle.remove();

      const contrastStyle = document.getElementById('contemplative-high-contrast');
      if (contrastStyle) contrastStyle.remove();

      const nav = document.querySelector('.main-nav, nav');
      if (nav) {
        const helpTexts = nav.querySelectorAll('.nav-help-text');
        helpTexts.forEach(el => el.remove());

        const secondary = nav.querySelectorAll('.nav-secondary, .social-links, .search-box');
        secondary.forEach(el => el.style.display = '');
      }

      if (window.SpiritualCompanion && window.SpiritualCompanion.setSimpleMode) {
        window.SpiritualCompanion.setSimpleMode(false);
      }
    },

    createToggleButton() {
      if (document.querySelector('.contemplative-toggle')) return;

      this.createStyles();

      const toggle = document.createElement('button');
      toggle.className = 'contemplative-toggle';
      toggle.innerHTML = `
        <span class="toggle-icon">🕊️</span>
        <span class="toggle-text">Modo Contemplativo</span>
      `;
      toggle.setAttribute('aria-pressed', this.isActive);

      const header = document.querySelector('.main-header, header');
      if (header) {
        header.appendChild(toggle);
      }

      toggle.addEventListener('click', () => this.toggle());
    },

    updateToggleUI() {
      const toggle = document.querySelector('.contemplative-toggle');
      if (toggle) {
        toggle.classList.toggle('active', this.isActive);
        toggle.setAttribute('aria-pressed', this.isActive);
        
        const text = toggle.querySelector('.toggle-text');
        if (text) {
          text.textContent = this.isActive ? 'Salir del Modo Contemplativo' : 'Modo Contemplativo';
        }
      }
    },

    setupEventListeners() {
      EventBus.on(SanctuaryEvents.FIRST_VISIT, () => {
        setTimeout(() => {
          this.suggestContemplativeMode();
        }, 10000);
      });
    },

    suggestContemplativeMode() {
      if (this.isActive) return;

      const suggestion = document.createElement('div');
      suggestion.className = 'contemplative-suggestion';
      suggestion.innerHTML = `
        <div class="suggestion-content">
          <p>¿Prefieres una experiencia más sencilla?</p>
          <button class="suggestion-btn yes">Activar Modo Contemplativo</button>
          <button class="suggestion-btn no">Ahora no</button>
        </div>
      `;

      document.body.appendChild(suggestion);

      setTimeout(() => suggestion.classList.add('show'), 100);

      suggestion.querySelector('.yes').addEventListener('click', () => {
        this.toggle();
        suggestion.remove();
      });

      suggestion.querySelector('.no').addEventListener('click', () => {
        suggestion.remove();
      });

      setTimeout(() => {
        if (suggestion.parentNode) suggestion.remove();
      }, 15000);
    },

    createStyles() {
      if (document.getElementById('contemplative-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'contemplative-styles';
      style.textContent = `
        .contemplative-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          color: rgba(250,247,240,0.8);
          padding: 8px 14px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'EB Garamond', serif;
          font-size: 0.9rem;
          transition: all 0.3s;
          margin-left: 10px;
        }
        .contemplative-toggle:hover {
          background: rgba(212,175,55,0.2);
        }
        .contemplative-toggle.active {
          background: rgba(212,175,55,0.3);
          border-color: #d4af37;
        }
        .toggle-icon {
          font-size: 1rem;
        }
        
        :root {
          --font-scale: 1;
        }
        .contemplative-mode {
          font-size: calc(16px * var(--font-scale));
        }
        .contemplative-mode body {
          font-size: 120%;
        }
        
        .nav-help-text {
          display: none;
          font-size: 0.75rem;
          color: rgba(250,247,240,0.5);
          margin-left: 5px;
        }
        
        .contemplative-suggestion {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(145deg, rgba(20,18,15,0.98), rgba(35,30,25,0.98));
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 12px;
          padding: 1rem;
          z-index: 9999;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s ease;
        }
        .contemplative-suggestion.show {
          opacity: 1;
          transform: translateY(0);
        }
        .contemplative-suggestion p {
          color: rgba(250,247,240,0.8);
          margin: 0 0 10px 0;
          font-size: 0.95rem;
        }
        .contemplative-suggestion .suggestion-btn {
          padding: 8px 16px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          font-family: 'EB Garamond', serif;
          font-size: 0.9rem;
          margin-right: 8px;
        }
        .contemplative-suggestion .suggestion-btn.yes {
          background: #d4af37;
          color: #1a1612;
        }
        .contemplative-suggestion .suggestion-btn.no {
          background: transparent;
          color: rgba(250,247,240,0.6);
          border: 1px solid rgba(250,247,240,0.3);
        }
      `;
      document.head.appendChild(style);
    },

    isEnabled() {
      return this.isActive;
    },

    getConfig() {
      return { ...this.config };
    }
  };

  window.ContemplativeMode = ContemplativeMode;
  console.log('🕊️ Contemplative Mode loaded');
})();