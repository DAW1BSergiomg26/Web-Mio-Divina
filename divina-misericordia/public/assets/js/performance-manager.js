/**
 * Performance Manager - Optimización de rendimiento
 * Controla pausas automáticas de animaciones cuando no están en viewport
 */
(function() {
  'use strict';

  const PerformanceManager = {
    // Rastrear callbacks registrados
    registeredCallbacks: [],
    isPageVisible: true,
    lastScrollTime: 0,
    scrollTimeout: null,
    isLowPowerMode: false,

    /**
     * Inicializar
     */
    init() {
      this.detectLowPowerMode();
      this.setupVisibilityObserver();
      this.setupIdleDetection();
      this.setupPerformanceObserver();
      
      console.log('⚡ Performance Manager inicializado');
    },

    /**
     * Detectar modo de bajo consumo
     */
    detectLowPowerMode() {
      // Detectar dispositivos móviles o modo ahorro de batería
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      
      this.isLowPowerMode = isMobile || isReducedMotion || isSlowConnection;
      
      if (this.isLowPowerMode) {
        console.log('⚡ Modo bajo consumo activado');
      }
    },

    /**
     * Observador de visibilidad de página
     */
    setupVisibilityObserver() {
      document.addEventListener('visibilitychange', () => {
        this.isPageVisible = document.visibilityState === 'visible';
        
        if (this.isPageVisible) {
          this.resumeAll();
        } else {
          this.pauseAll();
        }
      });
    },

    /**
     * Detección de inactividad
     */
    setupIdleDetection() {
      // Pausar después de 30 segundos de inactividad
      const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
      
      const resetIdle = () => {
        this.lastScrollTime = Date.now();
        
        if (!this.isPageVisible) return;
        
        // Reanudar si estaba pausado por inactividad
        this.resumeAll();
      };

      events.forEach(event => {
        document.addEventListener(event, resetIdle, { passive: true });
      });

      // Verificar inactividad cada 10 segundos
      setInterval(() => {
        const idleTime = Date.now() - this.lastScrollTime;
        if (idleTime > 30000 && this.isPageVisible && this.isPageVisible) {
          this.pauseAll();
        }
      }, 10000);
    },

    /**
     * Observador de rendimiento (API experimental)
     */
    setupPerformanceObserver() {
      if (!window.PerformanceObserver) return;
      
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'longtask') {
              // Reducir actividad si hay tareas largas
              console.warn('⚠️ Tarea larga detectada, reduciendo animaciones');
              this.throttleAnimations();
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Ignorar si no está soportado
      }
    },

    /**
     * Registrar callback para gestión
     */
    register(callback, options = {}) {
      const entry = {
        id: Math.random().toString(36).substr(2, 9),
        callback: callback,
        name: options.name || 'anonymous',
        priority: options.priority || 'normal', // high, normal, low
        isRunning: false,
        isPaused: false,
        pauseWhenNotVisible: options.pauseWhenNotVisible !== false,
        pauseWhenIdle: options.pauseWhenIdle !== false,
        throttleOnLowPower: options.throttleOnLowPower !== false
      };

      this.registeredCallbacks.push(entry);
      return entry.id;
    },

    /**
     * Pausar callback específico
     */
    pause(id) {
      const entry = this.registeredCallbacks.find(e => e.id === id);
      if (entry && entry.isRunning) {
        entry.isPaused = true;
        if (entry.callback.pause) {
          entry.callback.pause();
        }
      }
    },

    /**
     * Reanudar callback específico
     */
    resume(id) {
      const entry = this.registeredCallbacks.find(e => e.id === id);
      if (entry && entry.isPaused) {
        entry.isPaused = false;
        if (entry.callback.resume) {
          entry.callback.resume();
        }
      }
    },

    /**
     * Pausar todos los callbacks
     */
    pauseAll() {
      this.registeredCallbacks.forEach(entry => {
        if (!entry.isPaused && entry.pauseWhenNotVisible) {
          entry.isPaused = true;
          if (entry.callback.pause) {
            try {
              entry.callback.pause();
            } catch (e) {
              console.warn('Error pausando callback:', entry.name);
            }
          }
        }
      });
    },

    /**
     * Reanudar todos los callbacks
     */
    resumeAll() {
      this.registeredCallbacks.forEach(entry => {
        if (entry.isPaused && entry.pauseWhenNotVisible) {
          entry.isPaused = false;
          if (entry.callback.resume) {
            try {
              entry.callback.resume();
            } catch (e) {
              console.warn('Error reanudando callback:', entry.name);
            }
          }
        }
      });
    },

    /**
     * 节流 animaciones en modo bajo consumo
     */
    throttleAnimations() {
      this.registeredCallbacks.forEach(entry => {
        if (entry.throttleOnLowPower && entry.callback.throttle) {
          try {
            entry.callback.throttle();
          } catch (e) {}
        }
      });
    },

    /**
     * Obtener estadísticas de rendimiento
     */
    getStats() {
      return {
        totalCallbacks: this.registeredCallbacks.length,
        running: this.registeredCallbacks.filter(e => e.isRunning && !e.isPaused).length,
        paused: this.registeredCallbacks.filter(e => e.isPaused).length,
        isLowPowerMode: this.isLowPowerMode,
        isPageVisible: this.isPageVisible
      };
    }
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PerformanceManager.init());
  } else {
    PerformanceManager.init();
  }

  // Exportar
  window.PerformanceManager = PerformanceManager;

})();

/**
 * Lazy Loader con IntersectionObserver optimizado
 */
(function() {
  'use strict';

  const DivineLazyLoader = {
    observer: null,
    loadedElements: new Set(),

    /**
     * Inicializar
     */
    init() {
      if (!('IntersectionObserver' in window)) {
        this.loadAll();
        return;
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      this.observeElements();
    },

    /**
     * Observar elementos lazy
     */
    observeElements() {
      // Imágenes lazy
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.observer.observe(img);
      });

      // Videos lazy
      document.querySelectorAll('video[data-src]').forEach(video => {
        this.observer.observe(video);
      });

      //iframe lazy
      document.querySelectorAll('iframe[data-src]').forEach(iframe => {
        this.observer.observe(iframe);
      });
    },

    /**
     * Cargar elemento
     */
    loadElement(el) {
      if (this.loadedElements.has(el)) return;
      this.loadedElements.add(el);

      const src = el.dataset.src;
      if (!src) return;

      if (el.tagName === 'IMG') {
        el.src = src;
        el.removeAttribute('data-src');
        if (el.dataset.srcset) {
          el.srcset = el.dataset.srcset;
          el.removeAttribute('data-srcset');
        }
      } else if (el.tagName === 'VIDEO') {
        el.src = src;
        el.removeAttribute('data-src');
      } else if (el.tagName === 'IFRAME') {
        el.src = src;
        el.removeAttribute('data-src');
      }
    },

    /**
     * Cargar todos (fallback)
     */
    loadAll() {
      document.querySelectorAll('[data-src]').forEach(el => this.loadElement(el));
    }
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DivineLazyLoader.init());
  } else {
    DivineLazyLoader.init();
  }

  window.DivineLazyLoader = DivineLazyLoader;

})();

/**
 * Debounce y Throttle utilities
 */
const DivineUtils = {
  /**
   * Debounce - ejecutar después de que停止调用
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle - ejecutar como máximo cada X ms
   */
  throttle(func, limit = 250) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * RequestAnimationFrame throttleado
   */
  rafThrottle(callback) {
    let ticking = false;
    return function(...args) {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }
};

window.DivineUtils = DivineUtils;