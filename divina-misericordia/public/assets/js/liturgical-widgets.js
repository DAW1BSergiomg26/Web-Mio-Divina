/**
 * Widget de Fiesta del Día (FeastBanner)
 * Muestra un banner sutil cuando hay fiesta litúrgica
 * Sin dependencias - Módulo puro JavaScript
 */
(function() {
  'use strict';

  const FeastBanner = {
    container: null,
    currentFeast: null,

    /**
     * Inicializa el widget
     */
    init() {
      this.createStyles();
      this.render();
    },

    /**
     * Crea los estilos CSS del banner
     */
    createStyles() {
      if (document.getElementById('feast-banner-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'feast-banner-styles';
      style.textContent = `
        .feast-banner {
          position: relative;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(90deg, 
            var(--liturgical-color, #d4af37) 0%, 
            var(--liturgical-color-light, #f4d87a) 50%,
            var(--liturgical-color, #d4af37) 100%);
          text-align: center;
          font-family: 'Cinzel', serif;
          cursor: pointer;
          transition: all 0.4s ease;
          z-index: 100;
        }
        .feast-banner:hover {
          filter: brightness(1.1);
        }
        .feast-banner-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .feast-banner-icon {
          font-size: 1.25rem;
        }
        .feast-banner-text {
          color: #050814;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
        }
        .feast-banner-type {
          font-size: 0.7rem;
          text-transform: uppercase;
          opacity: 0.8;
          margin-left: 0.5rem;
        }
        .feast-banner-close {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #050814;
          font-size: 1.25rem;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .feast-banner-close:hover {
          opacity: 1;
        }
        @media (max-width: 600px) {
          .feast-banner {
            padding: 0.5rem 2.5rem 0.5rem 1rem;
          }
          .feast-banner-text {
            font-size: 0.8rem;
          }
        }
      `;
      document.head.appendChild(style);
    },

    /**
     * Renderiza el banner si hay fiesta hoy
     */
    render() {
      // Obtener la fiesta de hoy
      const today = new Date();
      const feast = typeof LiturgicalCalendar !== 'undefined' 
        ? LiturgicalCalendar.getTodayFeast(today)
        : null;

      if (!feast) return;

      this.currentFeast = feast;

      // Crear el banner
      const banner = document.createElement('div');
      banner.className = 'feast-banner';
      banner.id = 'feastBanner';
      banner.setAttribute('role', 'alert');
      banner.setAttribute('aria-label', `Fiesta litúrgica: ${feast.name}`);
      
      // Color del banner según el tipo de fiesta
      if (feast.color === 'morado') {
        banner.style.background = 'linear-gradient(90deg, #5c4b8a 0%, #7a6aa8 50%, #5c4b8a 100%)';
      } else if (feast.color === 'rojo') {
        banner.style.background = 'linear-gradient(90deg, #8b2323 0%, #a84343 50%, #8b2323 100%)';
      }
      
      banner.innerHTML = `
        <div class="feast-banner-content">
          <span class="feast-banner-icon">♰</span>
          <span class="feast-banner-text">${feast.name}</span>
          <span class="feast-banner-type">${feast.type}</span>
        </div>
        <button class="feast-banner-close" aria-label="Cerrar">&times;</button>
      `;

      // Insertar después del header
      const header = document.querySelector('header') || document.body.firstElementChild;
      if (header && header.parentNode) {
        header.parentNode.insertBefore(banner, header.nextSibling);
      }

      // Evento de cierre
      const closeBtn = banner.querySelector('.feast-banner-close');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });

      // Click para navegar si hay sección
      if (feast.section) {
        banner.addEventListener('click', () => {
          window.location.href = feast.section;
        });
      }

      console.log(`🎉 Fiesta hoy: ${feast.name}`);
    },

    /**
     * Cierra el banner
     */
    close() {
      const banner = document.getElementById('feastBanner');
      if (banner) {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-100%)';
        setTimeout(() => banner.remove(), 300);
      }
    },

    /**
     * Muestra manualmente una fiesta (para testing)
     */
    showFeast(feast) {
      this.currentFeast = feast;
      // Remover banner existente
      this.close();
      // Renderizar nuevo
      setTimeout(() => this.render(), 350);
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FeastBanner.init());
  } else {
    FeastBanner.init();
  }

  // Exportar
  window.FeastBanner = FeastBanner;

})();

/**
 * Widget del Santo del Día (DailySaint)
 * Muestra el santo del día en sidebar o footer
 */
(function() {
  'use strict';

  const DailySaint = {
    containerSelector: null,

    /**
     * Inicializa el widget
     * @param {string} containerSelector - Selector del contenedor donde mostrar
     */
    init(containerSelector = '#dailySaint') {
      this.containerSelector = containerSelector;
      this.render();
    },

    /**
     * Crea los estilos CSS
     */
    createStyles() {
      if (document.getElementById('daily-saint-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'daily-saint-styles';
      style.textContent = `
        .daily-saint {
          background: var(--glass-bg, rgba(255,255,255,0.03));
          border: 1px solid var(--border-gold, rgba(212,175,55,0.25));
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
          font-family: 'Cinzel', serif;
        }
        .daily-saint-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted, rgba(250,247,240,0.7));
          margin-bottom: 0.75rem;
        }
        .daily-saint-icon {
          color: var(--liturgical-color, #d4af37);
        }
        .daily-saint-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--white, #faf7f0);
          margin-bottom: 0.5rem;
        }
        .daily-saint-desc {
          font-size: 0.85rem;
          color: var(--text-muted, rgba(250,247,240,0.7));
          line-height: 1.5;
          font-family: 'EB Garamond', serif;
        }
        .daily-saint-link {
          display: inline-block;
          margin-top: 0.75rem;
          color: var(--gold, #d4af37);
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 0.3s;
        }
        .daily-saint-link:hover {
          color: var(--gold-light, #f4e2a1);
        }
        .daily-saint-feast {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          background: var(--liturgical-color, #d4af37);
          color: var(--blue-deep, #050d1a);
          border-radius: 4px;
          font-size: 0.65rem;
          text-transform: uppercase;
          margin-left: 0.5rem;
        }
      `;
      document.head.appendChild(style);
    },

    /**
     * Renderiza el widget
     */
    render() {
      // Verificar si ya existe el contenedor
      let container = document.querySelector(this.containerSelector);
      if (!container) {
        // Buscar en footer o crear en sidebar
        const footer = document.querySelector('footer .footer-content, footer .footer-menu');
        if (!footer) return;
        
        container = document.createElement('div');
        container.id = 'dailySaint';
        container.className = 'daily-saint-widget';
        footer.appendChild(container);
      }

      this.createStyles();

      // Obtener santo del día
      const today = new Date();
      const saint = typeof LiturgicalCalendar !== 'undefined'
        ? LiturgicalCalendar.getTodaySaint(today)
        : null;

      if (!saint) {
        container.innerHTML = `
          <div class="daily-saint">
            <div class="daily-saint-title">
              <span class="daily-saint-icon">✝</span>
              Santo del Día
            </div>
            <div class="daily-saint-name">Celebramos a todos los santos</div>
            <div class="daily-saint-desc">Hoy la Iglesia ora por todos los santos que nos precedieron en la fe.</div>
          </div>
        `;
        return;
      }

      // Renderizar santo
      container.innerHTML = `
        <div class="daily-saint">
          <div class="daily-saint-title">
            <span class="daily-saint-icon">✝</span>
            Santo del Día
            ${saint.type === 'solemnidad' ? '<span class="daily-saint-feast">Solemnidad</span>' : ''}
          </div>
          <div class="daily-saint-name">${saint.name}</div>
          <div class="daily-saint-desc">${saint.description}</div>
          ${saint.section ? `<a href="${saint.section}" class="daily-saint-link">Ver devoción →</a>` : ''}
        </div>
      `;

      console.log(`✝ Santo del día: ${saint.name}`);
    }
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DailySaint.init());
  } else {
    DailySaint.init();
  }

  // Exportar
  window.DailySaint = DailySaint;

})();

/**
 * Sugerencia Musical Litúrgica
 * Sugiere música según la fiesta del día
 */
(function() {
  'use strict';

  const LiturgicalMusic = {
    /**
     * Inicializa el sistema
     */
    init() {
      this.checkTodayFeast();
    },

    /**
     * Verifica la fiesta de hoy y sugiere música
     */
    checkTodayFeast() {
      const today = new Date();
      const feast = typeof LiturgicalCalendar !== 'undefined'
        ? LiturgicalCalendar.getTodayFeast(today)
        : null;

      if (!feast) return;

      // Mapear fiestas a categorías de música
      const musicMap = {
        'mariana': ['mariano'],
        'senor': ['sagrado', 'epico'],
        'santos': ['celebracion', 'sagrado'],
        'temporal': ['penitencial', 'contemplativo']
      };

      const category = musicMap[feast.category];
      if (category) {
        console.log(`🎵 Suggesting ${category} music for: ${feast.name}`);
        this.highlightTracks(category);
      }
    },

    /**
     * Resalta pistas recomendadas en el reproductor
     */
    highlightTracks(categories) {
      // Verificar si existe el catálogo de audio
      if (typeof AudioCatalog !== 'undefined') {
        // El catálogo ya tiene las pistas clasificadas por categoría
        // Marcar visualmente las pistas relevantes
        const allTracks = document.querySelectorAll('.audio-track, .music-item, .track-item');
        
        allTracks.forEach(track => {
          const title = track.textContent.toLowerCase();
          const matches = categories.some(cat => 
            title.includes('maria') || 
            title.includes('virgen') || 
            title.includes('navidad') ||
            title.includes('pascua') ||
            title.includes('faustina')
          );
          
          if (matches) {
            track.classList.add('liturgical-recommended');
            // Añadir badge si no existe
            if (!track.querySelector('.music-badge')) {
              const badge = document.createElement('span');
              badge.className = 'music-badge';
              badge.textContent = '♰ Recomendada hoy';
              badge.style.cssText = `
                display: inline-block;
                margin-left: 0.5rem;
                padding: 0.15rem 0.4rem;
                background: var(--liturgical-color, #d4af37);
                color: var(--blue-deep, #050d1a);
                border-radius: 3px;
                font-size: 0.65rem;
                font-weight: 600;
              `;
              track.appendChild(badge);
            }
          }
        });
      }
    }
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LiturgicalMusic.init());
  } else {
    LiturgicalMusic.init();
  }

  // Exportar
  window.LiturgicalMusic = LiturgicalMusic;

})();