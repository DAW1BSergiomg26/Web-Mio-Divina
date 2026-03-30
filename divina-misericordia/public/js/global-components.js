/**
 * Sistema Global de Componentes
 * Punto de entrada único para inicializar todos los componentes globales
 * 
 * Uso: Incluir este archivo antes de </body> en todas las páginas
 * <script src="js/global-components.js"></script>
 */
(function() {
  'use strict';

  // Evitar múltiples inicializaciones
  if (window.globalComponentsInitialized) return;
  window.globalComponentsInitialized = true;

  // Configuración global
  const config = {
    cursor: true,
    scrollButtons: true,
    footer: true,
    header: true,
    goldenLine: true,
    theme: 'default' // default, marianas, caacupe, musica
  };

  /**
   * Inicializar todos los componentes
   */
  function initAll(options = {}) {
    // Mergear configuración
    Object.assign(config, options);

    // Detectar variación por URL
    detectTheme();

    // Inicializar en orden
    if (config.cursor) initCursor();
    if (config.header) initHeader();
    if (config.scrollButtons) initScrollButtons();
    if (config.footer) initFooter();
    if (config.goldenLine) initGoldenLine();
  }

  /**
   * Detectar tema según URL actual
   */
  function detectTheme() {
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes('devociones-marianas') || path.includes('maria.html') || 
        path.includes('virgen-') || path.includes('milagrosa') || 
        path.includes('auxiliadora') || path.includes('santina') ||
        path.includes('lujan')) {
      config.theme = 'marianas';
    } else if (path.includes('caacupe')) {
      config.theme = 'caacupe';
    } else if (path.includes('musica')) {
      config.theme = 'musica';
    }
  }

  /**
   * Inicializar cursor
   */
  function initCursor() {
    // El cursor.js se carga externamente
    if (window.CursorDivino) {
      window.CursorDivino.init();
    }
  }

  /**
   * Inicializar header
   */
  function initHeader() {
    if (window.HeaderGlobal) {
      window.HeaderGlobal.init({ variation: config.theme });
    }
  }

  /**
   * Inicializar scroll buttons
   */
  function initScrollButtons() {
    if (window.ScrollButtons) {
      window.ScrollButtons.init({ theme: config.theme });
    }
  }

  /**
   * Inicializar footer
   */
  function initFooter() {
    // Verificar si el footer ya existe en el HTML
    const existingFooter = document.querySelector('footer.main-footer, footer.sacred-footer, .footer-menu');
    if (existingFooter) {
      // El footer ya existe, no crear uno nuevo
      return;
    }
    
    if (window.FooterGlobal) {
      window.FooterGlobal.init();
    }
  }

  /**
   * Inicializar golden line
   */
  function initGoldenLine() {
    if (window.GoldenLine) {
      const footer = document.querySelector('footer.main-footer, footer.sacred-footer');
      if (footer) {
        window.GoldenLine.init({
          container: footer.parentNode
        });
      }
    }
  }

  // Funciones de utilidad global
  window.GlobalComponents = {
    init: initAll,
    config: config,
    setTheme: function(theme) {
      config.theme = theme;
      if (window.setScrollTheme) window.setScrollTheme(theme);
      if (window.HeaderGlobal) HeaderGlobal.setVariation(theme);
    }
  };

  // Auto-inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll());
  } else {
    initAll();
  }

})();
