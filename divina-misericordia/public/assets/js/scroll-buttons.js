/**
 * Scroll Buttons - Sistema Global
 * Botones de navegación subir/bajar con soporte para color dinámico
 * Compatible con Chrome, Firefox, Safari, Edge y móvil
 */
(function() {
  'use strict';

  // Evitar duplicación
  if (window.scrollButtonsInitialized) return;
  window.scrollButtonsInitialized = true;

  const ScrollButtons = {
    buttons: [],
    colorTheme: 'default', // default, marianas, caacupe, musica

    init(options = {}) {
      this.colorTheme = options.theme || 'default';
      this.createButtons();
    },

    createButtons() {
      // Verificar si ya existen
      if (document.querySelector('.scroll-btn.scroll-up') && 
          document.querySelector('.scroll-btn.scroll-down')) {
        this.buttons = Array.from(document.querySelectorAll('.scroll-btn'));
        this.applyTheme();
        return;
      }

      const container = document.createElement('div');
      container.id = 'scroll-buttons-container';
      container.innerHTML = `
        <button class="scroll-btn scroll-up" onclick="window.scrollTo({top:0,behavior:'smooth'})" 
                title="Subir al inicio" aria-label="Subir al inicio">
          <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button class="scroll-btn scroll-down" onclick="window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})" 
                title="Ir al final" aria-label="Ir al final">
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      `;
      document.body.appendChild(container);
      
      this.buttons = Array.from(container.querySelectorAll('.scroll-btn'));
      this.applyTheme();
    },

    applyTheme() {
      const themeClass = `scroll-${this.colorTheme}`;
      this.buttons.forEach(btn => {
        // Remover todas las clases de tema primero
        btn.classList.remove('scroll-marianas', 'scroll-caacupe', 'scroll-musica');
        // Agregar la clase de tema si no es default
        if (this.colorTheme !== 'default') {
          btn.classList.add(themeClass);
        }
      });
    },

    setTheme(theme) {
      this.colorTheme = theme;
      this.applyTheme();
    },

    destroy() {
      const container = document.getElementById('scroll-buttons-container');
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      window.scrollButtonsInitialized = false;
    }
  };

  // Función global para cambiar el tema
  window.setScrollTheme = function(theme) {
    if (window.ScrollButtons) {
      window.ScrollButtons.setTheme(theme);
    }
  };

  // Exportar
  window.ScrollButtons = ScrollButtons;

  // Auto-inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ScrollButtons.init());
  } else {
    ScrollButtons.init();
  }
})();
