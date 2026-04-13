/**
 * Page Transitions - Transiciones Entre Secciones
 * Efecto de cortina de luz que se abre/cierra
 * Compatible con historial del navegador
 */
(function() {
  'use strict';

  const TRANSITION_DURATION = 400;

  const PageTransitions = {
    overlay: null,
    isTransitioning: false,

    init() {
      this.create();
      this.bindLinkClicks();
      this.bindPopState();
    },

    create() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'page-transition-overlay';
      this.overlay.innerHTML = '<div class="transition-curtain"></div>';
      document.body.appendChild(this.overlay);

      // Agregar estilos
      this.addStyles();
    },

    addStyles() {
      if (document.getElementById('transition-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'transition-styles';
      style.textContent = `
        .page-transition-overlay {
          position: fixed;
          inset: 0;
          z-index: 99998;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
        }
        .page-transition-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .transition-curtain {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5,13,26,0.97) 0%,
            rgba(10,22,40,0.95) 50%,
            rgba(5,13,26,0.97) 100%
          );
        }
        .transition-curtain::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent);
          animation: curtainGlow 1.5s ease-in-out infinite;
        }
        @keyframes curtainGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .page-transition-overlay.closing .transition-curtain {
          animation: curtainClose ${TRANSITION_DURATION}ms ease forwards;
        }
        .page-transition-overlay.opening .transition-curtain {
          animation: curtainOpen ${TRANSITION_DURATION}ms ease forwards;
        }
        @keyframes curtainClose {
          0% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 0 50% 0); }
        }
        @keyframes curtainOpen {
          0% { clip-path: inset(50% 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-transition-overlay,
          .transition-curtain {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    },

    bindLinkClicks() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Ignorar enlaces externos, anchors, o con target
        if (href.startsWith('http') || href.startsWith('#') || 
            link.target || link.hasAttribute('download')) {
          return;
        }
        
        // Ignorar si es la página actual
        if (href === window.location.pathname.split('/').pop()) {
          return;
        }
        
        e.preventDefault();
        this.transitionTo(href);
      });
    },

    bindPopState() {
      window.addEventListener('popstate', () => {
        // Permitir transición natural del navegador
      });
    },

    transitionTo(url) {
      if (this.isTransitioning) return;
      this.isTransitioning = true;

      // Cortina de cierre
      this.overlay.classList.add('active', 'closing');
      
      setTimeout(() => {
        window.location.href = url;
      }, TRANSITION_DURATION);
    },

    onPageLoad() {
      if (!this.overlay) return;
      
      // Cortina de apertura
      requestAnimationFrame(() => {
        this.overlay.classList.remove('closing');
        this.overlay.classList.add('active', 'opening');
        
        setTimeout(() => {
          this.overlay.classList.remove('active', 'opening');
          this.isTransitioning = false;
        }, TRANSITION_DURATION);
      });
    }
  };

  // Ejecutar al cargar página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PageTransitions.init());
  } else {
    PageTransitions.init();
  }

  // Hook para después de cargar página
  window.addEventListener('load', () => PageTransitions.onPageLoad());

  window.PageTransitions = PageTransitions;
})();
