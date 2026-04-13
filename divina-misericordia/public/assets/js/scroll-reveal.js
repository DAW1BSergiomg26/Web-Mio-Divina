/**
 * Scroll Reveal - Sistema de Revelación por Scroll
 * IntersectionObserver centralizado para animaciones de entrada
 */
(function() {
  'use strict';

  const ScrollReveal = {
    observer: null,
    animatedElements: new WeakSet(),
    config: {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    },

    init() {
      // No ejecutar si prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.revealAll();
        return;
      }

      this.createObserver();
      this.observeElements();

      // Re-observar cuando el DOM cambia (SPA)
      if (typeof MutationObserver !== 'undefined') {
        new MutationObserver(() => this.observeElements())
          .observe(document.body, { childList: true, subtree: true });
      }
    },

    createObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            this.animatedElements.add(entry.target);
            this.animateElement(entry.target);
          }
        });
      }, this.config);
    },

    observeElements() {
      const elements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-rise, .reveal-glow, .reveal-sacred');
      elements.forEach(el => {
        if (!this.animatedElements.has(el)) {
          this.observer.observe(el);
        }
      });
    },

    revealAll() {
      const elements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-rise, .reveal-glow, .reveal-sacred');
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    },

    animateElement(el) {
      // Determinar tipo de animación
      const isReveal = el.classList.contains('reveal');
      const isFade = el.classList.contains('reveal-fade');
      const isRise = el.classList.contains('reveal-rise');
      const isGlow = el.classList.contains('reveal-glow');
      const isSacred = el.classList.contains('reveal-sacred');

      // Obtener delay individual o de stagger
      const delay = parseFloat(el.dataset.delay) || 0;

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (isFade || isReveal) {
            this.animateFade(el);
          } else if (isRise) {
            this.animateRise(el);
          } else if (isGlow) {
            this.animateGlow(el);
          } else if (isSacred) {
            this.animateSacred(el);
          } else {
            this.animateFade(el);
          }
        }, delay);
      });
    },

    animateFade(el) {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      
      requestAnimationFrame(() => {
        el.style.opacity = '1';
      });
    },

    animateRise(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
      
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    },

    animateGlow(el) {
      el.style.opacity = '0';
      el.style.filter = 'blur(10px)';
      el.style.transition = 'opacity 1s ease-out, filter 1s ease-out';
      
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.filter = 'blur(0)';
      });
    },

    animateSacred(el) {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.9)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
        
        // Agregar partículas breves si es un elemento sagrado
        if (el.classList.contains('reveal-sacred')) {
          this.addSacredParticles(el);
        }
      });
    },

    addSacredParticles(el) {
      const rect = el.getBoundingClientRect();
      if (rect.width < 100 || rect.height < 50) return;

      const particle = document.createElement('div');
      particle.className = 'reveal-particles';
      particle.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        border-radius: inherit;
      `;

      for (let i = 0; i < 8; i++) {
        const p = document.createElement('span');
        p.style.cssText = `
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(212,175,55,0.8);
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          bottom: 0;
          animation: revealParticleFloat ${1 + Math.random()}s ease-out forwards;
          animation-delay: ${Math.random() * 0.3}s;
        `;
        particle.appendChild(p);
      }

      if (!el.style.position) el.style.position = 'relative';
      el.appendChild(particle);

      setTimeout(() => particle.remove(), 1500);
    },

    // Método para agregar stagger a grupos
    stagger(container, itemSelector, baseDelay = 0, increment = 0.1) {
      const items = container.querySelectorAll(itemSelector);
      items.forEach((item, index) => {
        item.dataset.delay = (baseDelay + (index * increment)) + 's';
        item.classList.add('reveal-rise');
      });
    }
  };

  // Agregar estilos globales para partículas
  const style = document.createElement('style');
  style.textContent = `
    @keyframes revealParticleFloat {
      0% { transform: translateY(0) scale(1); opacity: 0.8; }
      100% { transform: translateY(-40px) scale(0); opacity: 0; }
    }
    .reveal, .reveal-fade, .reveal-rise, .reveal-glow, .reveal-sacred {
      will-change: opacity, transform;
    }
  `;
  document.head.appendChild(style);

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ScrollReveal.init());
  } else {
    ScrollReveal.init();
  }

  window.ScrollReveal = ScrollReveal;
})();
