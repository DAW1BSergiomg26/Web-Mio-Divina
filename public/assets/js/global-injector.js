/**
 * ============================================================
 * Global Resources Injector
 * Inyecta estilos y scripts globales automáticamente en todas las páginas
 * ============================================================
 */
(function() {
  'use strict';

  if (window.globalResourcesInjected) return;
  window.globalResourcesInjected = true;

  const GlobalResources = {
    cssUrl: 'css/global.css',
    scriptUrl: 'assets/js/content-espiritual.js',

    init() {
      this.injectCSS();
      this.injectScript();
    },

    async injectCSS() {
      try {
        const response = await fetch(this.cssUrl);
        if (!response.ok) throw new Error('CSS not found');
        const css = await response.text();
        const style = document.createElement('style');
        style.id = 'global-styles-injected';
        style.textContent = css;
        document.head.appendChild(style);
        console.log('[GlobalResources] ✅ Estilos inyectados');
      } catch (err) {
        console.error('[GlobalResources] ❌ Error CSS:', err.message);
      }
    },

    injectScript() {
      const script = document.createElement('script');
      script.src = this.scriptUrl;
      script.async = true;
      script.onload = () => console.log('[GlobalResources] ✅ Script inyectado');
      document.head.appendChild(script);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GlobalResources.init());
  } else {
    GlobalResources.init();
  }

  window.GlobalResources = GlobalResources;
})();