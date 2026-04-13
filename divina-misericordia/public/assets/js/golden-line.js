/**
 * Golden Divine Line - Sistema Global
 * Línea luminosa con efecto de barrido y cruces pulsantes
 * Compatible con Chrome, Firefox, Safari, Edge
 */
(function() {
  'use strict';

  // Evitar duplicación
  if (window.goldenLineInitialized) return;
  window.goldenLineInitialized = true;

  const GoldenLine = {
    element: null,

    init(options = {}) {
      const container = options.container || document.body;
      const position = options.position || 'beforeend'; // beforeend, afterbegin
      
      // Verificar si ya existe
      if (document.querySelector('.golden-divine-line')) {
        this.element = document.querySelector('.golden-divine-line');
        return this.element;
      }

      const line = document.createElement('div');
      line.className = 'golden-divine-line';
      line.setAttribute('role', 'separator');
      line.setAttribute('aria-label', 'División decorativa');
      
      if (position === 'beforeend') {
        container.appendChild(line);
      } else {
        container.insertBefore(line, container.firstChild);
      }
      
      this.element = line;
      return line;
    },

    // Insertar antes de un elemento específico
    insertBefore(element) {
      if (!this.element) this.init();
      if (this.element && element && element.parentNode) {
        element.parentNode.insertBefore(this.element, element);
      }
    },

    // Insertar después de un elemento específico
    insertAfter(element) {
      if (!this.element) this.init();
      if (this.element && element && element.parentNode) {
        element.parentNode.insertBefore(this.element, element.nextSibling);
      }
    },

    remove() {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
        this.element = null;
      }
    }
  };

  // Función helper global
  window.addGoldenLine = function(options) {
    return GoldenLine.init(options);
  };

  // Auto-inicializar si hay un footer
  document.addEventListener('DOMContentLoaded', () => {
    const mainFooter = document.querySelector('footer.main-footer, footer.sacred-footer');
    if (mainFooter) {
      GoldenLine.init({ 
        container: mainFooter.parentNode,
        position: 'beforeend'
      });
      GoldenLine.insertBefore(mainFooter.nextSibling);
    }
  });

  window.GoldenLine = GoldenLine;
})();
