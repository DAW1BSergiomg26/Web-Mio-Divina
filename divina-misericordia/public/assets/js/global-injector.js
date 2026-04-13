/**
 * ============================================================
 * Global Styles Injector
 * Inyecta los estilos globales automáticamente en todas las páginas
 * Sin duplicación - carga una sola vez
 * ============================================================
 */
(function() {
  'use strict';

  // Evitar duplicación
  if (window.globalStylesInjected) return;
  window.globalStylesInjected = true;

  const GlobalStyles = {
    cssUrl: 'css/global.css',
    loaded: false,

    init() {
      this.injectCSS();
    },

    async injectCSS() {
      if (this.loaded) return;
      
      try {
        const response = await fetch(this.cssUrl);
        if (!response.ok) throw new Error('CSS not found');
        
        const css = await response.text();
        
        // Crear tag style
        const style = document.createElement('style');
        style.id = 'global-styles-injected';
        style.textContent = css;
        
        // Insertar al inicio del head
        const firstStyle = document.querySelector('style');
        if (firstStyle) {
          firstStyle.parentNode.insertBefore(style, firstStyle);
        } else {
          document.head.appendChild(style);
        }
        
        this.loaded = true;
        console.log('[GlobalStyles] ✅ Inyectados correctamente');
        
      } catch (err) {
        console.error('[GlobalStyles] ❌ Error:', err.message);
      }
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GlobalStyles.init());
  } else {
    GlobalStyles.init();
  }

  // Exportar para uso global
  window.GlobalStyles = GlobalStyles;

})();