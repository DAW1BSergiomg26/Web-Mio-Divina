/**
 * Cursor Divino - Sistema Global
 * Cursor personalizado tipo cruz con rayos de la Divina Misericordia
 * Compatible con Chrome, Firefox, Safari, Edge y móvil
 */
(function() {
  'use strict';

  // Evitar duplicación
  if (window.divineCursorInitialized) return;
  window.divineCursorInitialized = true;

  const CursorDivino = {
    cursor: null,
    mouseX: 0,
    mouseY: 0,
    cursorX: 0,
    cursorY: 0,
    smoothing: 0.15,
    isHovering: false,
    animationId: null,

    init() {
      // Verificar si es dispositivo táctil
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.style.cursor = 'default';
        return;
      }

      this.createCursor();
      this.bindEvents();
      this.animate();
    },

    createCursor() {
      const cursor = document.createElement('div');
      cursor.className = 'cursor-cruz';
      cursor.id = 'cursor-divino';
      cursor.innerHTML = `
        <svg class="cruz-normal" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cruzGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff5c0"/>
              <stop offset="50%" stop-color="#d4af37"/>
              <stop offset="100%" stop-color="#8a7000"/>
            </linearGradient>
            <filter id="glowGold">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect x="18" y="4" width="4" height="32" rx="2" fill="url(#cruzGold)" filter="url(#glowGold)"/>
          <rect x="6" y="14" width="28" height="4" rx="2" fill="url(#cruzGold)" filter="url(#glowGold)"/>
          <circle cx="20" cy="10" r="2" fill="#fff5c0" filter="url(#glowGold)"/>
        </svg>
        <svg class="cruz-hover" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cruzRojo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff6666"/>
              <stop offset="50%" stop-color="#cc0000"/>
              <stop offset="100%" stop-color="#880000"/>
            </linearGradient>
            <linearGradient id="cruzAzul" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#6699ff"/>
              <stop offset="50%" stop-color="#0044cc"/>
              <stop offset="100%" stop-color="#002266"/>
            </linearGradient>
            <filter id="glowRayos">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect x="18" y="4" width="4" height="32" rx="2" fill="url(#cruzRojo)" filter="url(#glowRayos)"/>
          <rect x="6" y="14" width="28" height="4" rx="2" fill="url(#cruzAzul)" filter="url(#glowRayos)"/>
          <circle cx="20" cy="10" r="2.5" fill="#ff8888" filter="url(#glowRayos)"/>
          <circle cx="20" cy="30" r="2" fill="#88bbff" filter="url(#glowRayos)"/>
        </svg>
      `;
      document.body.appendChild(cursor);
      this.cursor = cursor;
    },

    bindEvents() {
      // Movimiento del mouse
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }, { passive: true });

      // Detectar hover en elementos interactivos
      document.addEventListener('mouseover', (e) => {
        const shouldHover = e.target.closest('a, button, [onclick], .scroll-btn, .btn, input, textarea, select');
        if (shouldHover && !this.isHovering) {
          this.cursor.classList.add('hover');
          this.isHovering = true;
        }
      }, { passive: true });

      document.addEventListener('mouseout', (e) => {
        const wasHovering = e.target.closest('a, button, [onclick], .scroll-btn, .btn, input, textarea, select');
        if (wasHovering && this.isHovering) {
          // Verificar si todavía estamos sobre un elemento
          setTimeout(() => {
            if (!document.querySelector(':hover')) {
              this.cursor.classList.remove('hover');
              this.isHovering = false;
            }
          }, 50);
        }
      }, { passive: true });

      // Ocultar cursor cuando sale de la ventana
      document.addEventListener('mouseleave', () => {
        if (this.cursor) {
          this.cursor.style.opacity = '0';
        }
      }, { passive: true });

      document.addEventListener('mouseenter', () => {
        if (this.cursor) {
          this.cursor.style.opacity = '1';
        }
      }, { passive: true });
    },

    animate() {
      // Smooth interpolation
      this.cursorX += (this.mouseX - this.cursorX) * this.smoothing;
      this.cursorY += (this.mouseY - this.cursorY) * this.smoothing;

      if (this.cursor) {
        this.cursor.style.left = this.cursorX + 'px';
        this.cursor.style.top = this.cursorY + 'px';
      }

      this.animationId = requestAnimationFrame(() => this.animate());
    },

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.cursor && this.cursor.parentNode) {
        this.cursor.parentNode.removeChild(this.cursor);
      }
      window.divineCursorInitialized = false;
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CursorDivino.init());
  } else {
    CursorDivino.init();
  }

  // Exportar para uso global
  window.CursorDivino = CursorDivino;
})();
