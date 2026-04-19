/**
 * Footer Global - Sistema Global
 * Footer unificado con resplandor suave, efecto pulse y bordes luminosos
 * Compatible con Chrome, Firefox, Safari, Edge
 */
(function() {
  'use strict';

  // Evitar duplicación
  if (window.footerGlobalInitialized) return;
  window.footerGlobalInitialized = true;

  const FooterGlobal = {
    footerMenu: null,
    footerMain: null,
    goldenLine: null,
    links: [],
    
    // Configuración de enlaces por defecto
    defaultLinks: [
      { href: 'index.html', text: 'Inicio' },
      { href: 'oraciones.html', text: 'Oraciones' },
      { href: 'via-crucis.html', text: 'Vía Crucis' },
      { href: 'maria.html', text: 'María' },
      { href: 'obras-de-misericordia.html', text: 'Obras de Misericordia' },
      { href: 'consagracion.html', text: 'Consagración' },
      { href: 'lugares-de-culto.html', text: 'Lugares de Culto' },
      { href: 'noticias.html', text: 'Noticias' },
      { href: 'enlaces.html', text: 'Enlaces' },
      { href: 'contacto.html', text: 'Contacto' }
    ],

    init(options = {}) {
      this.links = options.links || this.defaultLinks;
      this.tagline = options.tagline || 'Jesús, En Vos Confío';
      this.copyright = options.copyright || '© 2026 — Portal de la Divina Misericordia';
      
      this.createFooter();
    },

    createFooter() {
      // Verificar si ya existe el footer principal
      if (document.querySelector('footer.main-footer') || 
          document.querySelector('footer.sacred-footer')) {
        return; // Ya existe, no crear
      }

      // Crear golden line
      this.goldenLine = document.createElement('div');
      this.goldenLine.className = 'golden-divine-line';
      this.goldenLine.setAttribute('role', 'separator');
      this.goldenLine.setAttribute('aria-label', 'División decorativa');
      document.body.appendChild(this.goldenLine);

      // Crear footer menu
      this.createFooterMenu();
      
      // Crear footer principal
      this.createMainFooter();
    },

    createFooterMenu() {
      // Verificar si ya existe
      if (document.querySelector('.footer-menu')) {
        this.footerMenu = document.querySelector('.footer-menu');
        return;
      }

      const footerMenu = document.createElement('div');
      footerMenu.className = 'footer-menu';
      footerMenu.style.position = 'relative';
      footerMenu.style.overflow = 'hidden';
      
      footerMenu.innerHTML = `
        <div class="sacred-glow-border"></div>
        <h3 class="footer-menu-title">Explora nuestra web</h3>
        <div class="footer-menu-links">
          ${this.links.map(link => 
            `<a href="${link.href}">${link.text}</a>`
          ).join('')}
        </div>
      `;
      
      document.body.appendChild(footerMenu);
      this.footerMenu = footerMenu;
    },

    createMainFooter() {
      const mainFooter = document.createElement('footer');
      mainFooter.className = 'main-footer sacred-footer';
      
      mainFooter.innerHTML = `
        <div class="cross-glow">+</div>
        <p class="tagline">${this.tagline}</p>
        <p>${this.copyright}</p>
      `;
      
      document.body.appendChild(mainFooter);
      this.footerMain = mainFooter;
    },

    // Actualizar enlaces del footer
    updateLinks(newLinks) {
      if (this.footerMenu) {
        const linksContainer = this.footerMenu.querySelector('.footer-menu-links');
        if (linksContainer) {
          linksContainer.innerHTML = newLinks.map(link => 
            `<a href="${link.href}">${link.text}</a>`
          ).join('');
        }
      }
    },

    // Actualizar tagline
    updateTagline(newTagline) {
      if (this.footerMain) {
        const taglineEl = this.footerMain.querySelector('.tagline');
        if (taglineEl) {
          taglineEl.textContent = newTagline;
        }
      }
    },

    destroy() {
      if (this.goldenLine && this.goldenLine.parentNode) {
        this.goldenLine.parentNode.removeChild(this.goldenLine);
      }
      if (this.footerMenu && this.footerMenu.parentNode) {
        this.footerMenu.parentNode.removeChild(this.footerMenu);
      }
      if (this.footerMain && this.footerMain.parentNode) {
        this.footerMain.parentNode.removeChild(this.footerMain);
      }
      window.footerGlobalInitialized = false;
    }
  };

  // Función helper global
  window.initFooterGlobal = function(options) {
    FooterGlobal.init(options);
    return FooterGlobal;
  };

  window.FooterGlobal = FooterGlobal;
})();
