/**
 * Parallax Espiritual - Sistema de Parallax Sutil
 * Efectos parallax en fondos y elementos decorativos
 * Optimizado para 60fps con requestAnimationFrame
 */
(function() {
  'use strict';

  const ParallaxSpiritual = {
    elements: [],
    ticking: false,
    scrollY: 0,
    enabled: true,

    init() {
      // Desactivar en móviles o si prefers-reduced-motion
      if (window.matchMedia('(max-width: 768px)').matches ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.enabled = false;
        return;
      }

      this.scanElements();
      this.bindScroll();
    },

    scanElements() {
      // Elementos con data-parallax
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const direction = el.dataset.parallaxDirection || 'y';
        
        this.elements.push({
          el: el,
          speed: speed,
          direction: direction,
          initialY: 0,
          initialX: 0
        });

        // Guardar posición inicial
        const rect = el.getBoundingClientRect();
        if (direction === 'y') {
          this.elements[this.elements.length - 1].initialY = rect.top + window.scrollY;
        } else {
          this.elements[this.elements.length - 1].initialX = rect.left;
        }
      });

      // Fondos parallax
      document.querySelectorAll('.parallax-bg').forEach(el => {
        this.elements.push({
          el: el,
          speed: 0.3,
          direction: 'y',
          isBackground: true,
          initialY: 0
        });
        this.elements[this.elements.length - 1].initialY = parseFloat(getComputedStyle(el).backgroundPositionY) || 0;
      });
    },

    bindScroll() {
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    },

    onScroll() {
      this.scrollY = window.scrollY;
      
      if (!this.ticking) {
        requestAnimationFrame(() => this.update());
        this.ticking = true;
      }
    },

    update() {
      this.elements.forEach(item => {
        if (item.isBackground) {
          // Parallax para fondos
          const offset = this.scrollY * item.speed;
          item.el.style.backgroundPositionY = `${item.initialY + offset}px`;
        } else if (item.direction === 'y') {
          // Parallax vertical
          const offset = (this.scrollY - item.initialY + window.innerHeight) * item.speed;
          item.el.style.transform = `translate3d(0, ${offset}px, 0)`;
        } else {
          // Parallax horizontal
          const offset = this.scrollY * item.speed;
          item.el.style.transform = `translate3d(${offset}px, 0, 0)`;
        }
      });
      
      this.ticking = false;
    },

    // Agregar elementos dinámicamente
    add(el, speed = 0.3, direction = 'y') {
      if (!this.enabled) return;
      
      this.elements.push({
        el: el,
        speed: speed,
        direction: direction,
        initialY: el.getBoundingClientRect().top + window.scrollY,
        initialX: el.getBoundingClientRect().left
      });
    },

    // Remover elemento
    remove(el) {
      const index = this.elements.findIndex(item => item.el === el);
      if (index > -1) {
        this.elements.splice(index, 1);
      }
    }
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ParallaxSpiritual.init());
  } else {
    ParallaxSpiritual.init();
  }

  window.ParallaxSpiritual = ParallaxSpiritual;
})();
