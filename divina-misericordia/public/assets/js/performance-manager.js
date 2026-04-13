/**
 * Performance Manager - Modo de Ahorro Litúrgico
 * Gestiona recursos para usuarios con dispositivos de gama baja o batería limitada.
 */
(function() {
  'use strict';

  const PerformanceManager = {
    isSavingMode: false,

    init() {
      // Detección automática básica
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection && (connection.saveData === true || /4g|3g|2g/.test(connection.effectiveType))) {
        // Podríamos activar ahorro si hay poca batería o conexión lenta
      }
    },

    toggleSavingMode() {
      this.isSavingMode = !this.isSavingMode;
      
      if (this.isSavingMode) {
        this.activateSavingMode();
      } else {
        this.deactivateSavingMode();
      }

      EventBus.emit(SanctuaryEvents.MODE_SAVING_ACTIVE, { active: this.isSavingMode });
      console.log(`[PerformanceManager] Modo Ahorro: ${this.isSavingMode ? 'Activado' : 'Desactivado'}`);
    },

    activateSavingMode() {
      // 1. Detener animaciones WebGL y partículas
      const canvas = document.querySelectorAll('canvas');
      canvas.forEach(c => c.style.display = 'none');
      
      // 2. Parar cualquier bucle de renderizado global si existe
      if (window.SacredGeometry) window.SacredGeometry.stop();
      
      // 3. Aplicar clase de ahorro al body
      document.body.classList.add('saving-mode');
    },

    deactivateSavingMode() {
      const canvas = document.querySelectorAll('canvas');
      canvas.forEach(c => c.style.display = 'block');
      
      if (window.SacredGeometry) window.SacredGeometry.start();
      
      document.body.classList.remove('saving-mode');
    }
  };

  window.PerformanceManager = PerformanceManager;
  PerformanceManager.init();
})();
