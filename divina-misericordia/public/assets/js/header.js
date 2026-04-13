/**
 * Header Global - Sistema Global
 * Menú de navegación con variaciones específicas
 * Compatible con Chrome, Firefox, Safari, Edge
 */
(function() {
  'use strict';

  // Evitar duplicación
  if (window.headerGlobalInitialized) return;
  window.headerGlobalInitialized = true;

  const HeaderGlobal = {
    header: null,
    nav: null,
    currentVariation: 'default',

    // Enlaces por defecto
    defaultLinks: [
      { href: 'index.html', text: 'Inicio' },
      { href: 'quienes-somos.html', text: 'Quiénes Somos' },
      { href: 'introduccion.html', text: 'Introducción' },
      { href: 'santa-faustina.html', text: 'Santa Faustina' },
      { href: 'hora-de-la-misericordia.html', text: 'Hora de la Misericordia' },
      { href: 'coronilla.html', text: 'Coronilla' },
      { href: 'novena.html', text: 'Novena' },
      { href: 'via-crucis.html', text: 'Vía Crucis' },
      { href: 'oraciones.html', text: 'Oraciones' },
      { href: 'santo-rosario.html', text: 'El Santo Rosario' },
      { href: 'maria.html', text: 'María' },
      { href: 'obras-de-misericordia.html', text: 'Obras de Misericordia' },
      { href: 'consagracion.html', text: 'Consagración' },
      { href: 'lugares-de-culto.html', text: 'Lugares de Culto' },
      { href: 'musica-sacra.html', text: 'Música Sacra' },
      { href: 'noticias.html', text: 'Noticias' },
      { href: 'enlaces.html', text: 'Enlaces' },
      { href: 'virgen-caacupe.html', text: 'Virgen Caacupé', class: 'caacupe-btn' },
      { href: 'devociones-marianas.html', text: 'Devociones Marianas', class: 'devociones-btn' },
      { href: 'estudios-biblicos.html', text: 'Estudios' },
      { href: 'otras-devociones.html', text: 'Otras Devociones ✦', class: 'nav-otras-devociones' },
      { href: 'contacto.html', text: 'Contacto' }
    ],

    // Variaciones del header
    variations: {
      default: {
        borderColor: 'rgba(212,175,55,0.25)',
        glowIntensity: '0.3'
      },
      marianas: {
        borderColor: 'rgba(244,114,182,0.3)',
        glowIntensity: '0.5',
        background: 'rgba(80,20,60,0.88)'
      },
      caacupe: {
        borderColor: 'rgba(74,222,128,0.3)',
        glowIntensity: '0.5',
        background: 'rgba(20,60,40,0.88)'
      },
      musica: {
        borderColor: 'rgba(167,139,250,0.3)',
        glowIntensity: '0.5',
        background: 'rgba(40,20,80,0.88)'
      }
    },

    init(options = {}) {
      this.links = options.links || this.defaultLinks;
      this.variation = options.variation || 'default';
      this.logo = options.logo || {
        href: 'index.html',
        src: 'img/logo_divina_misericordia.jpg',
        alt: 'Logo Divina Misericordia',
        text: 'Divina<span>Misericordia</span>'
      };
      
      this.createHeader();
      this.applyVariation(this.variation);
      this.setupScrollEffect();
    },

    createHeader() {
      // Verificar si ya existe
      if (document.querySelector('header#mainHeader')) {
        this.header = document.getElementById('mainHeader');
        this.nav = this.header.querySelector('nav');
        return;
      }

      // Crear header
      const header = document.createElement('header');
      header.id = 'mainHeader';
      
      // Crear logo
      const logo = document.createElement('a');
      logo.href = this.logo.href;
      logo.className = 'logo';
      logo.innerHTML = `
        <img src="${this.logo.src}" alt="${this.logo.alt}" loading="lazy">
        ${this.logo.text}
      `;
      
      // Crear navegación
      const nav = document.createElement('nav');
      nav.id = 'mainNav';
      nav.innerHTML = this.links.map(link => {
        const className = link.class ? link.class : '';
        return `<a href="${link.href}" class="${className}">${link.text}</a>`;
      }).join('');
      
      // Crear hamburger
      const hamburger = document.createElement('div');
      hamburger.className = 'hamburger';
      hamburger.id = 'hamburger';
      hamburger.setAttribute('onclick', "document.getElementById('mainNav').classList.toggle('active'); this.classList.toggle('open');");
      hamburger.innerHTML = '<span></span><span></span><span></span>';
      
      header.appendChild(logo);
      header.appendChild(nav);
      header.appendChild(hamburger);
      
      // Insertar al inicio del body
      document.body.insertBefore(header, document.body.firstChild);
      
      this.header = header;
      this.nav = nav;
    },

    applyVariation(variation) {
      if (!this.header) return;
      
      const vars = this.variations[variation] || this.variations.default;
      
      // Aplicar estilos según variación
      if (vars.background) {
        this.header.style.background = vars.background;
      }
      if (vars.borderColor) {
        this.header.style.borderBottomColor = vars.borderColor;
      }
      
      // Agregar clase de variación
      this.header.classList.remove('variation-default', 'variation-marianas', 'variation-caacupe', 'variation-musica');
      this.header.classList.add(`variation-${variation}`);
      
      this.currentVariation = variation;
    },

    setupScrollEffect() {
      if (!this.header) return;
      
      let lastScroll = 0;
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 60) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
      }, { passive: true });
    },

    // Métodos para variaciones específicas
    setVariation(variation) {
      this.variation = variation;
      this.applyVariation(variation);
      
      // Notificar cambio de tema a otros componentes
      if (window.setScrollTheme) {
        window.setScrollTheme(variation);
      }
    },

    // Variación para Devociones Marianas
    setMarianas() {
      this.setVariation('marianas');
    },

    // Variación para Virgen de Caacupé
    setCaacupe() {
      this.setVariation('caacupe');
    },

    // Variación para Música Sacra
    setMusica() {
      this.setVariation('musica');
    },

    destroy() {
      if (this.header && this.header.parentNode) {
        this.header.parentNode.removeChild(this.header);
      }
      window.headerGlobalInitialized = false;
    }
  };

  // Funciones globales para variaciones
  window.setHeaderVariation = function(variation) {
    if (window.HeaderGlobal) {
      HeaderGlobal.setVariation(variation);
    }
  };

  window.setHeaderMarianas = function() {
    window.setHeaderVariation('marianas');
  };

  window.setHeaderCaacupe = function() {
    window.setHeaderVariation('caacupe');
  };

  window.setHeaderMusica = function() {
    window.setHeaderVariation('musica');
  };

  // Auto-detectar página y aplicar variación
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('devociones-marianas') || path.includes('maria') || 
        path.includes('virgen-') || path.includes('caacupe') || path.includes('lujan') ||
        path.includes('milagrosa') || path.includes('auxiliadora') || path.includes('santina')) {
      window.setHeaderMarianas();
    } else if (path.includes('caacupe')) {
      window.setHeaderCaacupe();
    } else if (path.includes('musica')) {
      window.setHeaderMusica();
    }
  });

  window.HeaderGlobal = HeaderGlobal;
})();
