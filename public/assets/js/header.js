/**
 * Header Global - Sistema Global v2.0 (Premium)
 * Menú de navegación con gestión inteligente de rutas y nuevas funciones DIOS.
 */
(function() {
  'use strict';

  if (window.headerGlobalInitialized) return;
  window.headerGlobalInitialized = true;

  // Función para calcular la ruta base relativa
  const getBasePath = () => {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length;
    // Ajuste según si estamos en local o servidor
    const isLocal = window.location.hostname === 'localhost' || window.location.protocol === 'file:';
    
    // Si estamos en la raíz (index.html)
    if (path.endsWith('index.html') || path.endsWith('/')) return '';
    
    // Contar cuántos niveles estamos por debajo de public
    // Buscamos carpetas como /devociones/santos/ (2 niveles)
    const segments = path.split('/').filter(s => s.length > 0);
    const publicIndex = segments.indexOf('public');
    const levels = publicIndex !== -1 ? (segments.length - publicIndex - 1) : 0;
    
    return '../'.repeat(levels);
  };

  const basePath = getBasePath();

  const HeaderGlobal = {
    header: null,
    nav: null,
    
    defaultLinks: [
      { href: 'index.html', text: 'Inicio' },
      { href: 'comunidad/buscador.html', text: '🔍 Buscador', class: 'nav-highlight-gold' },
      { href: 'comunidad/diario.html', text: '✍️ Mi Diario', class: 'nav-highlight-gold' },
      { href: 'comunidad/quienes-somos.html', text: 'Quiénes Somos' },
      { href: 'comunidad/introduccion.html', text: 'Introducción' },
      { href: 'devociones/santos/santa-faustina.html', text: 'Santa Faustina' },
      { href: 'liturgia/hora-de-la-misericordia.html', text: 'Hora de la Misericordia' },
      { href: 'liturgia/coronilla.html', text: 'Coronilla' },
      { href: 'novena.html', text: 'Novena' },
      { href: 'liturgia/via-crucis.html', text: 'Vía Crucis' },
      { href: 'oraciones/oraciones.html', text: 'Oraciones' },
      { href: 'devociones/rosario/santo-rosario.html', text: 'El Santo Rosario' },
      { href: 'devociones/marianas/maria.html', text: 'María' },
      { href: 'devociones/obras-de-misericordia.html', text: 'Obras' },
      { href: 'comunidad/lugares-de-culto.html', text: 'Lugares' },
      { href: 'comunidad/musica-sacra.html', text: 'Música' },
      { href: 'comunidad/noticias.html', text: 'Noticias' },
      { href: 'comunidad/contacto.html', text: 'Contacto' }
    ],

    variations: {
      default: { borderColor: 'rgba(212,175,55,0.25)', glowIntensity: '0.3' },
      marianas: { borderColor: 'rgba(244,114,182,0.3)', background: 'rgba(80,20,60,0.88)' },
      caacupe: { borderColor: 'rgba(74,222,128,0.3)', background: 'rgba(20,60,40,0.88)' },
      musica: { borderColor: 'rgba(167,139,250,0.3)', background: 'rgba(40,20,80,0.88)' }
    },

    init(options = {}) {
      this.links = options.links || this.defaultLinks;
      this.variation = options.variation || 'default';
      this.logo = options.logo || {
        href: 'index.html',
        src: 'assets/img/logo_divina_misericordia.webp',
        alt: 'Logo Divina Misericordia',
        text: 'Divina<span>Misericordia</span>'
      };
      
      this.createHeader();
      this.applyVariation(this.variation);
      this.setupScrollEffect();
    },

    createHeader() {
      if (document.querySelector('header#mainHeader')) return;

      const header = document.createElement('header');
      header.id = 'mainHeader';
      
      const logo = document.createElement('a');
      logo.href = basePath + this.logo.href;
      logo.className = 'logo';
      logo.innerHTML = `
        <img src="${basePath + this.logo.src}" alt="${this.logo.alt}" loading="lazy">
        ${this.logo.text}
      `;
      
      const nav = document.createElement('nav');
      nav.id = 'mainNav';
      nav.innerHTML = this.links.map(link => {
        const className = link.class ? link.class : '';
        return `<a href="${basePath + link.href}" class="${className}">${link.text}</a>`;
      }).join('');
      
      const hamburger = document.createElement('div');
      hamburger.className = 'hamburger';
      hamburger.id = 'hamburger';
      hamburger.setAttribute('onclick', "document.getElementById('mainNav').classList.toggle('active'); this.classList.toggle('open');");
      hamburger.innerHTML = '<span></span><span></span><span></span>';
      
      header.appendChild(logo);
      header.appendChild(nav);
      header.appendChild(hamburger);
      document.body.insertBefore(header, document.body.firstChild);
      
      this.header = header;
      this.nav = nav;
    },

    applyVariation(variation) {
      if (!this.header) return;
      const vars = this.variations[variation] || this.variations.default;
      if (vars.background) this.header.style.background = vars.background;
      if (vars.borderColor) this.header.style.borderBottomColor = vars.borderColor;
      this.header.classList.add(`variation-${variation}`);
    },

    setupScrollEffect() {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 60) this.header.classList.add('scrolled');
        else this.header.classList.remove('scrolled');
      }, { passive: true });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    HeaderGlobal.init();
    // Auto-detección de variaciones
    const path = window.location.pathname;
    if (path.includes('marianas') || path.includes('maria') || path.includes('virgen')) {
      HeaderGlobal.applyVariation('marianas');
    }
  });

  window.HeaderGlobal = HeaderGlobal;
})();
