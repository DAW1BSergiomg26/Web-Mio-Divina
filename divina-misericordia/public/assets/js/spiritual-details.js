/**
 * Detalles Espirituales y Easter Eggs
 * Micro-textos, transiciones, easter eggs y pulido final
 */
(function() {
  'use strict';

  const SpiritualDetails = {
    
    /**
     * Inicializa todos los detalles espirituales
     */
    init() {
      this.setupEasterEggs();
      this.setupTabTitle();
      this.setupConsoleMessage();
      this.setupTextSelection();
      this.setupMicroInteractions();
      console.log('✝ Detalles espirituales inicializados');
    },

    /**
     * Easter Egg: Escribir "AVE" muestra animación de luz dorada
     */
    setupEasterEggs() {
      let keystrokeBuffer = '';
      const secretCode = 'AVE';
      const maxBufferSize = 10;

      document.addEventListener('keydown', (e) => {
        // Ignorar si hay campo de texto activo
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
          return;
        }

        // Añadir solo letras al buffer
        if (e.key.match(/[a-zA-Z]/)) {
          keystrokeBuffer += e.key.toUpperCase();
          
          // Mantener buffer en tamaño máximo
          if (keystrokeBuffer.length > maxBufferSize) {
            keystrokeBuffer = keystrokeBuffer.slice(-maxBufferSize);
          }

          // Verificar si contiene el código secreto
          if (keystrokeBuffer.includes(secretCode)) {
            this.triggerAveMariaAnimation();
            keystrokeBuffer = '';
          }
        }
      });
    },

    /**
     * Animación de Ave María
     */
    triggerAveMariaAnimation() {
      // Crear overlay de luz dorada
      const overlay = document.createElement('div');
      overlay.id = 'ave-animation';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(212,175,55,0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 99999;
        animation: aveGlow 3s ease-out forwards;
      `;

      // Añadir animación CSS
      if (!document.getElementById('ave-animation-style')) {
        const style = document.createElement('style');
        style.id = 'ave-animation-style';
        style.textContent = `
          @keyframes aveGlow {
            0% { opacity: 0; transform: scale(0.5); }
            20% { opacity: 1; transform: scale(1.1); }
            80% { opacity: 1; }
            100% { opacity: 0; transform: scale(1); }
          }
          @keyframes aveText {
            0% { opacity: 0; transform: translateY(20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `;
        document.head.appendChild(style);
      }

      // Crear mensaje
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Cinzel', serif;
        font-size: clamp(1.2rem, 3vw, 2rem);
        color: #f4e2a1;
        text-shadow: 0 0 20px rgba(212,175,55,0.8), 0 0 40px rgba(212,175,55,0.4);
        animation: aveText 3s ease-out forwards;
        z-index: 100000;
        text-align: center;
        padding: 1rem 2rem;
        background: rgba(5,13,26,0.9);
        border: 1px solid rgba(212,175,55,0.3);
        border-radius: 8px;
      `;
      message.textContent = 'Ave María, llena eres de gracia ✦';

      document.body.appendChild(overlay);
      document.body.appendChild(message);

      // Remover después de 3 segundos
      setTimeout(() => {
        overlay.remove();
        message.remove();
      }, 3000);
    },

    /**
     * Título de pestaña dinámico
     */
    setupTabTitle() {
      const originalTitle = document.title;
      const awayTitle = '✝ Regresa cuando quieras — Divina Misericordia';

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          document.title = awayTitle;
        } else {
          document.title = originalTitle;
        }
      });
    },

    /**
     * Mensaje de consola para desarrolladores
     */
    setupConsoleMessage() {
      const asciiArt = `
    ╔═══════════════════════════════════════╗
    ║       ✝ DIVINA MISERICORDIA ✝        ║
    ║     Santuario Digital Espiritual      ║
    ╚═══════════════════════════════════════╝
    
    Bienvenido/a, desarrollador/a.
    Esta web fue construida con fe y código.
    Si encuentras algo que mejorar, es parte del servicio.
    
    ✦ "Jesús, en Vos confío" ✦
      `;

      console.log(asciiArt);
    },

    /**
     * Personalización de selección de texto
     */
    setupTextSelection() {
      const style = document.createElement('style');
      style.textContent = `
        ::selection {
          background: rgba(212,175,55,0.4);
          color: #faf7f0;
        }
        ::-moz-selection {
          background: rgba(212,175,55,0.4);
          color: #faf7f0;
        }
      `;
      document.head.appendChild(style);
    },

    /**
     * Micro-interacciones y textos espiritualizados
     */
    setupMicroInteractions() {
      // Reemplazar textos de botones
      this.replaceButtonTexts();
      
      // Reemplazar estados vacíos
      this.replaceEmptyStates();
      
      // Reemplazar textos de carga
      this.replaceLoadingTexts();
    },

    /**
     * Reemplazar textos de botones
     */
    replaceButtonTexts() {
      const buttonMappings = {
        'submit': 'Confiar al Señor',
        'Enviar': 'Confiar al Señor',
        'enviar': 'Confiar al Señor',
        'submit intention': 'Rezar esta intención',
        'Send': 'Enviar oración',
        'send': 'Enviar oración',
        'close': 'Cerrar',
        'Close': 'Cerrar',
        'play': 'Reproducir',
        'pause': 'Pausar'
      };

      document.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        for (const [old, newText] of Object.entries(buttonMappings)) {
          if (text === old.toLowerCase()) {
            btn.setAttribute('data-original-text', btn.textContent);
            // No cambiar el texto visible, solodocumentar
          }
        }
      });
    },

    /**
     * Reemplazar estados vacíos
     */
    replaceEmptyStates() {
      const emptyMappings = {
        'no hay canciones': 'El silencio también es oración',
        'no songs': 'El silencio también es oración',
        'no results': 'Tu oración será escuchada',
        'no results found': 'Tu oración será escuchada',
        'empty': 'El silencio también es oración',
        'no data': 'El silencio también es oración'
      };

      document.querySelectorAll('[class*="empty"], [class*="no-results"], [class*="no-data"]').forEach(el => {
        const text = el.textContent.toLowerCase();
        for (const [old, newText] of Object.entries(emptyMappings)) {
          if (text.includes(old)) {
            el.setAttribute('data-empty-message', newText);
          }
        }
      });
    },

    /**
     * Reemplazar textos de carga
     */
    replaceLoadingTexts() {
      const loadingMappings = {
        'cargando': 'Preparando el santuario...',
        'loading': 'Preparando el santuario...',
        'cargando...': 'Preparando el santuario...',
        'loading...': 'Preparando el santuario...'
      };

      document.querySelectorAll('[class*="loading"]').forEach(el => {
        const text = el.textContent.toLowerCase();
        for (const [old, newText] of Object.entries(loadingMappings)) {
          if (text.includes(old)) {
            el.setAttribute('data-loading-message', newText);
          }
        }
      });
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpiritualDetails.init());
  } else {
    SpiritualDetails.init();
  }

  // Exportar
  window.SpiritualDetails = SpiritualDetails;

})();

/**
 * Utilidad para micro-textos espiritualizados
 * Reemplaza textos técnicos por textos cálidos
 */
const MicroTexts = {
  // Textos de botones
  buttons: {
    submit: 'Confiar al Señor',
    send: 'Enviar oración',
    close: 'Cerrar',
    cancel: 'Cancelar',
    retry: 'Rezar de nuevo',
    reset: 'Reiniciar oración'
  },

  // Estados vacíos
  empty: {
    songs: 'El silencio también es oración',
    results: 'Tu oración será escuchada',
    data: 'El silencio también es oración',
    intentions: 'Tu primera intención puede ser esta'
  },

  // Estados de carga
  loading: {
    default: 'Preparando el santuario...',
    audio: 'Sintonizando música celestial...',
    images: 'Iluminando el espacio...',
    data: 'Uniendo oraciones...'
  },

  // Tooltips
  tooltips: {
    back: 'Volver al camino',
    home: 'Volver al inicio',
    menu: 'Explorar el santuario',
    audio: 'Música para el alma',
    prayer: 'Añadir tu intención',
    search: 'Buscar en el santuario'
  },

  // Errores
  errors: {
    404: 'Esta página no existe, pero la fe que te trajo aquí, sí.',
    offline: 'Estás sin conexión, pero Dios no.',
    network: 'La conexión se perdió, pero la oración permanece.',
    generic: 'Algo no salió como esperado, pero confía en el Señor.'
  },

  // Notificaciones
  notifications: {
    prayerAdded: 'Tu intención ha sido ofrecida al Señor',
    audioPlaying: 'Música sagrada suena en tu corazón',
    saved: 'Guardado en el corazón del santuario'
  },

  /**
   * Obtiene el texto apropiado según la clave
   */
  get(category, key) {
    return this[category]?.[key] || key;
  }
};

// Exportar
window.MicroTexts = MicroTexts;