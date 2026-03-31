/**
 * PWA Install Banner - Banner de instalación personalizado
 * Detecta beforeinstallprompt y muestra banner propio elegante
 */
(function() {
  'use strict';

  const PWAInstall = {
    deferredPrompt: null,
    bannerShown: false,

    init() {
      // Escuchar evento de instalación
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        
        // Solo mostrar si no se ha mostrado antes
        if (!this.shouldShowBanner()) {
          return;
        }
        
        setTimeout(() => this.showBanner(), 5000);
      });

      // Detectar si ya está instalado
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return;
      }
      
      // Si ya se dismissó hoy, no mostrar
      const dismissed = localStorage.getItem('pwa_banner_dismissed');
      if (dismissed) {
        const dismissedDate = new Date(dismissed);
        const today = new Date().toDateString();
        if (dismissedDate.toDateString() === today) {
          return;
        }
      }
    },

    shouldShowBanner() {
      // No mostrar en móviles (tienen su propio prompt)
      if (window.matchMedia('(max-width: 768px)').matches) {
        return false;
      }
      
      // No mostrar si ya se instaló
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return false;
      }
      
      return true;
    },

    showBanner() {
      if (this.bannerShown) return;
      this.bannerShown = true;

      const banner = document.createElement('div');
      banner.className = 'pwa-install-banner';
      banner.innerHTML = `
        <div class="banner-content">
          <div class="banner-icon">🕊️</div>
          <div class="banner-text">
            <h3 class="banner-title">Instala el santuario en tu dispositivo</h3>
            <p class="banner-desc">Accede sin conexión y lleva la Divina Misericordia contigo</p>
          </div>
          <div class="banner-actions">
            <button class="banner-btn install">Instalar</button>
            <button class="banner-btn dismiss">No por ahora</button>
          </div>
        </div>
      `;

      document.body.appendChild(banner);
      this.addStyles();

      // Botón instalar
      banner.querySelector('.install').addEventListener('click', () => this.install());

      // Botón dismiss
      banner.querySelector('.dismiss').addEventListener('click', () => this.dismiss());
    },

    addStyles() {
      if (document.getElementById('pwa-install-styles')) return;

      const style = document.createElement('style');
      style.id = 'pwa-install-styles';
      style.textContent = `
        .pwa-install-banner {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, rgba(10,22,40,0.98) 0%, rgba(5,13,26,0.98) 100%);
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 16px;
          padding: 20px 25px;
          z-index: 9999;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.1);
          animation: slideUp 0.5s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .banner-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .banner-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }
        .banner-text {
          flex: 1;
        }
        .banner-title {
          font-family: 'Cinzel Decorative', serif;
          color: var(--gold-light, #f4e2a1);
          font-size: 1.1rem;
          margin: 0 0 5px 0;
        }
        .banner-desc {
          color: rgba(250,247,240,0.7);
          font-size: 0.85rem;
          margin: 0;
        }
        .banner-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }
        .banner-btn {
          padding: 10px 20px;
          border-radius: 25px;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .banner-btn.install {
          background: linear-gradient(135deg, var(--gold-dark, #b8960c) 0%, var(--gold, #d4af37) 100%);
          color: var(--blue-deep, #050d1a);
          border: none;
        }
        .banner-btn.install:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(212,175,55,0.5);
        }
        .banner-btn.dismiss {
          background: transparent;
          color: rgba(250,247,240,0.6);
          border: 1px solid rgba(250,247,240,0.2);
        }
        .banner-btn.dismiss:hover {
          border-color: rgba(250,247,240,0.4);
          color: rgba(250,247,240,0.8);
        }
        @media (max-width: 600px) {
          .pwa-install-banner {
            left: 10px;
            right: 10px;
          }
          .banner-content {
            flex-direction: column;
            text-align: center;
          }
          .banner-actions {
            justify-content: center;
          }
        }
      `;
      document.head.appendChild(style);
    },

    async install() {
      if (!this.deferredPrompt) return;

      this.deferredPrompt.prompt();
      
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] Instalado correctamente');
      }
      
      this.deferredPrompt = null;
      this.hideBanner();
    },

    dismiss() {
      localStorage.setItem('pwa_banner_dismissed', new Date().toISOString());
      this.hideBanner();
    },

    hideBanner() {
      const banner = document.querySelector('.pwa-install-banner');
      if (banner) {
        banner.style.animation = 'slideDown 0.3s ease forwards';
        setTimeout(() => banner.remove(), 300);
      }
    }
  };

  // Agregar animación CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      to { transform: translateY(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PWAInstall.init());
  } else {
    PWAInstall.init();
  }

  window.PWAInstall = PWAInstall;
})();