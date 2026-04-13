/**
 * Botón flotante para activar el Compañero Espiritual
 * Se adiciona a todas las páginas automáticamente
 */
(function() {
  'use strict';

  const CompanionLauncher = {
    init() {
      this.createFloatingButton();
    },

    createFloatingButton() {
      if (document.querySelector('.companion-launcher')) return;
      
      const btn = document.createElement('button');
      btn.className = 'companion-launcher';
      btn.innerHTML = '🕊️';
      btn.title = 'Hablar con mi compañero espiritual';
      
      const style = document.createElement('style');
      style.textContent = `
        .companion-launcher {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #b8960c);
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 4px 20px rgba(212,175,55,0.4);
          cursor: pointer;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9997;
          transition: all 0.3s ease;
          animation: gentlePulse 3s ease-in-out infinite;
        }
        @keyframes gentlePulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(212,175,55,0.4); }
          50% { box-shadow: 0 4px 30px rgba(212,175,55,0.6); }
        }
        .companion-launcher:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 35px rgba(212,175,55,0.7);
        }
        .companion-launcher:active {
          transform: scale(0.95);
        }
        @media (max-width: 768px) {
          .companion-launcher {
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(btn);
      
      btn.addEventListener('click', () => {
        if (window.SpiritualCompanion) {
          window.SpiritualCompanion.open();
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => CompanionLauncher.init(), 1000);
  });
  
  window.CompanionLauncher = CompanionLauncher;
})();