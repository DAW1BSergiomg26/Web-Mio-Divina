/**
 * Reading Progress - Indicador de Progreso de Lectura
 * Barra de progreso en la parte superior de secciones largas
 */
(function() {
  'use strict';

  const ReadingProgress = {
    bar: null,
    container: null,
    sections: [],
    currentSection: null,
    ticking: false,

    init() {
      // Desactivar si prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.create();
      this.scanSections();
      this.bindScroll();
    },

    create() {
      this.container = document.createElement('div');
      this.container.className = 'reading-progress-container';
      this.container.innerHTML = `
        <div class="reading-progress-bar"></div>
        <span class="reading-progress-label"></span>
      `;
      this.bar = this.container.querySelector('.reading-progress-bar');
      document.body.appendChild(this.container);

      // Agregar estilos
      this.addStyles();
    },

    addStyles() {
      if (document.getElementById('reading-progress-styles')) return;

      const style = document.createElement('style');
      style.id = 'reading-progress-styles';
      style.textContent = `
        .reading-progress-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(5,13,26,0.8);
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }
        .reading-progress-container.active {
          opacity: 1;
          visibility: visible;
        }
        .reading-progress-bar {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, var(--gold-dark, #b8960c), var(--gold, #d4af37), var(--celestial, #6fa8dc));
          transition: width 0.1s linear;
        }
        .reading-progress-label {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          color: var(--gold, #d4af37);
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .reading-progress-container.active .reading-progress-label {
          opacity: 0.7;
        }
      `;
      document.head.appendChild(style);
    },

    scanSections() {
      // Buscar secciones principales
      const candidates = document.querySelectorAll('main, article, section, .main-content');
      candidates.forEach(section => {
        const rect = section.getBoundingClientRect();
        const height = rect.height;
        const isLong = height > window.innerHeight * 2;

        if (isLong) {
          const title = section.querySelector('h1, h2')?.textContent || 'Lectura';
          this.sections.push({
            el: section,
            title: title,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            height: height
          });
        }
      });

      // Si no hay secciones largas, usar documento completo
      if (this.sections.length === 0) {
        this.sections.push({
          el: document.body,
          title: 'Página',
          top: 0,
          bottom: document.body.scrollHeight,
          height: document.body.scrollHeight
        });
      }
    },

    bindScroll() {
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      window.addEventListener('resize', () => this.onResize());
    },

    onScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => this.update());
        this.ticking = true;
      }
    },

    onResize() {
      this.sections = [];
      this.scanSections();
      this.update();
    },

    update() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const scrollPercent = (scrollY / (documentHeight - viewportHeight)) * 100;

      // Encontrar sección actual
      let activeSection = null;
      for (const section of this.sections) {
        if (scrollY >= section.top - viewportHeight / 2) {
          activeSection = section;
        }
      }

      // Mostrar/ocultar según sección
      if (activeSection && activeSection.height > viewportHeight * 2) {
        this.container.classList.add('active');
        
        // Calcular progreso dentro de la sección actual
        const sectionProgress = ((scrollY - activeSection.top) / (activeSection.height - viewportHeight)) * 100;
        const clampedProgress = Math.max(0, Math.min(100, sectionProgress));
        
        this.bar.style.width = `${clampedProgress}%`;
        
        const label = this.container.querySelector('.reading-progress-label');
        if (label) label.textContent = activeSection.title;
      } else {
        // Mostrar progreso general del documento
        this.bar.style.width = `${scrollPercent}%`;
        
        if (scrollPercent > 5) {
          this.container.classList.add('active');
        } else {
          this.container.classList.remove('active');
        }
      }

      this.ticking = false;
    }
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ReadingProgress.init());
  } else {
    ReadingProgress.init();
  }

  window.ReadingProgress = ReadingProgress;
})();
