/**
 * Sistema de Inicialización Global
 * Punto de entrada único para todos los componentes globales
 * Ejecuta: Cursor, Header, ScrollButtons, GoldenLine, Footer
 */
(function() {
  'use strict';

  // Evitar múltiples inicializaciones
  if (window._globalInitRunning) return;
  window._globalInitRunning = true;

  const GlobalInit = {
    /**
     * Detectar variación por URL
     */
    detectTheme() {
      const url = window.location.pathname.toLowerCase();
      
      if (url.includes('devociones-marianas') || url.includes('virgen') || url.includes('maria')) {
        return 'marianas';
      }
      if (url.includes('caacupe')) {
        return 'caacupe';
      }
      if (url.includes('musica') || url.includes('musica')) {
        return 'musica';
      }
      return 'default';
    },

    /**
     * Inicializar cursor divino
     */
    initCursor() {
      if (window.CursorDivino && typeof CursorDivino.init === 'function') {
        CursorDivino.init();
        console.log('✝ Cursor divino inicializado');
      }
    },

    /**
     * Inicializar header global
     */
    initHeader() {
      if (window.HeaderGlobal && typeof HeaderGlobal.init === 'function') {
        const theme = this.detectTheme();
        HeaderGlobal.init({ theme });
        console.log('✝ Header global inicializado:', theme);
      }
    },

    /**
     * Inicializar botones de scroll
     */
    initScrollButtons() {
      if (window.ScrollButtons && typeof ScrollButtons.init === 'function') {
        const theme = this.detectTheme();
        ScrollButtons.init({ theme });
        console.log('✝ Scroll buttons inicializados:', theme);
      }
    },

    /**
     * Inicializar línea dorada
     */
    initGoldenLine() {
      if (window.GoldenLine && typeof GoldenLine.init === 'function') {
        GoldenLine.init({ position: 'beforeend' });
        console.log('✝ Línea dorada inicializada');
      }
    },

    /**
     * Inicializar footer global
     */
    initFooter() {
      if (window.FooterGlobal && typeof FooterGlobal.init === 'function') {
        const theme = this.detectTheme();
        FooterGlobal.init({ theme });
        console.log('✝ Footer global inicializado:', theme);
      }
    },

    /**
     * Inicializar todos los componentes
     */
    init() {
      // Pequeño delay para asegurar que todos los módulos están cargados
      setTimeout(() => {
        this.initCursor();
        this.initHeader();
        this.initScrollButtons();
        this.initGoldenLine();
        this.initFooter();
        console.log('✝ Sistema global completo inicializado');
      }, 50);
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GlobalInit.init());
  } else {
    // Si ya está listo, inicializar inmediatamente
    GlobalInit.init();
  }

  // Exportar para uso global
  window.GlobalInit = GlobalInit;

})();