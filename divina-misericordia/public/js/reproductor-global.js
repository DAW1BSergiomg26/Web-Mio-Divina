/**
 * ============================================================
 * REPRODUCTOR GLOBAL DIVINO - VERSIÓN CORREGIDA
 * Sistema de ambientación musical sagrada
 * ============================================================
 */

(function() {
  'use strict';

  // ==========================================
  // CONFIGURACIÓN DE MÚSICA POR SECCIÓN
  // ==========================================
  const CONFIG_MUSICA = {
    // Páginas principales
    'index': {
      archivo: 'mp3/15. Canon in D.mp3',
      titulo: 'Canon in D - Pachelbel',
      frase: 'Jesús, en Ti confío',
      volumen: 0.6
    },
    'coronilla': {
      archivo: 'mp3/15. Canon in D.mp3',
      titulo: 'Canon in D - Pachelbel',
      frase: 'Jesús, en Ti confío',
      volumen: 0.6
    },
    'novena': {
      archivo: 'mp3/10. Spring (La Primavera) Op.8 No.1 E Major_ Allegro.mp3',
      titulo: 'La Primavera - Vivaldi',
      frase: '9 días de gracia',
      volumen: 0.5
    },
    'santo-rosario': {
      archivo: 'mp3/11. Swan Lake, Op. 20a_ I. Scène.mp3',
      titulo: 'Swan Lake - Tchaikovsky',
      frase: 'Santa María, Madre de Dios',
      volumen: 0.5
    },
    'hora-de-la-misericordia': {
      archivo: 'mp3/06. Serse, HWV 40_ Largo _Ombra mai fu.mp3',
      titulo: 'Largo "Ombra mai fu" - Handel',
      frase: 'A las 3 de la tarde',
      volumen: 0.5
    },
    'via-crucis': {
      archivo: 'mp3/08. Handel _ Orch. Hale_ Keyboard Suite No. 4 in D Minor, HWV 437_ III. Sarabande.mp3',
      titulo: 'Sarabande - Handel',
      frase: 'Jesús, camino de salvación',
      volumen: 0.5
    },
    'santa-faustina': {
      archivo: 'mp3/00. Santa Faustina, Himno Moderno.mp3',
      titulo: 'Santa Faustina - Himno Moderno',
      frase: 'Apóstol de la Misericordia',
      volumen: 0.7
    },
    'estudios-biblicos': {
      archivo: 'mp3/00. Violin Sonata No. 3 in C Major, BWV 1005 (Arr. for Piano by Víkingur Ólafsson)_ I. Adagio.mp3',
      titulo: 'Violin Sonata No. 3 - Bach',
      frase: 'La Palabra de Dios',
      volumen: 0.4
    },
    'maria': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Santa María, Madre de Dios',
      volumen: 0.6
    },
    'virgen-lujan': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Patrona de Argentina',
      volumen: 0.6
    },
    'virgen-caacupe': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Madre del Pueblo Paraguayo',
      volumen: 0.6
    },
    'maria-auxiliadora': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Ayuda de los Cristianos',
      volumen: 0.6
    },
    'oraciones': {
      archivo: 'mp3/04. Sweet Hour of Prayer.mp3',
      titulo: 'Sweet Hour of Prayer',
      frase: 'En tu presencia, Señor',
      volumen: 0.5
    },
    'musica-sacra': {
      archivo: 'mp3/05. Brandenburg Concerto No. 1 in F Major, BWV 1046_ I.mp3',
      titulo: 'Brandenburg Concerto - Bach',
      frase: 'Cánticos del cielo',
      volumen: 0.6
    },
    // Santos
    'ss-juan-pablo-ii': {
      archivo: 'mp3/05. A New Name in Glory - Instrumental.mp3',
      titulo: 'A New Name in Glory',
      frase: 'Totus Tuus',
      volumen: 0.6
    },
    'ss-francisco': {
      archivo: 'mp3/05. A New Name in Glory - Instrumental.mp3',
      titulo: 'A New Name in Glory',
      frase: ' Misericordia',
      volumen: 0.6
    },
    'san-jose': {
      archivo: 'mp3/19. Concerto 2 in D Major, Op. 7_ I. Adagio.mp3',
      titulo: 'Adagio - Corelli',
      frase: 'Patrón de la Iglesia',
      volumen: 0.5
    },
    // Santos adicionales
    'san-sanson': {
      archivo: 'mp3/34. Heart of Courage.mp3',
      titulo: 'Heart of Courage',
      frase: 'Patrón de los pobres',
      volumen: 0.6
    },
    'san-judas-tadeo': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Patrón de los imposibles',
      volumen: 0.6
    },
    'san-benito': {
      archivo: 'mp3/23. Concerto Grosso in D Major, Op. 1, No. 5_ III. Largo.mp3',
      titulo: 'Concerto Grosso - Corelli',
      frase: 'Patrón de Europa',
      volumen: 0.5
    },
    'san-francisco': {
      archivo: 'mp3/00. Salve Regina.mp3',
      titulo: 'Salve Regina',
      frase: 'Patrón de los pobres',
      volumen: 0.6
    },
    'san-cayetano': {
      archivo: 'mp3/38.He\'s a Pirate.mp3',
      titulo: "He's a Pirate",
      frase: 'Patrón del pan y el trabajo',
      volumen: 0.5
    },
    'divino-nino-jesus': {
      archivo: 'mp3/63. A Narnia Lullaby.mp3',
      titulo: 'A Narnia Lullaby',
      frase: 'El Niño Dios',
      volumen: 0.5
    },
    // Vírgenes y devociones marianas
    'virgen-lujan': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Patrona de Argentina',
      volumen: 0.6
    },
    'virgen-caacupe': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Madre del Pueblo Paraguayo',
      volumen: 0.6
    },
    'maria-auxiliadora': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Ayuda de los Cristianos',
      volumen: 0.6
    },
    'la-santina': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Virgen del Carmen',
      volumen: 0.6
    },
    'medalla-milagrosa': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Medalla Milagrosa',
      volumen: 0.6
    },
    'devociones-marianas': {
      archivo: 'mp3/00. Ave Maria.mp3',
      titulo: 'Ave Maria',
      frase: 'Devociones Marianas',
      volumen: 0.6
    },
    // Otras devociones
    'otras-devociones': {
      archivo: 'mp3/04. Sweet Hour of Prayer.mp3',
      titulo: 'Sweet Hour of Prayer',
      frase: 'Oración constante',
      volumen: 0.5
    },
    'consagracion': {
      archivo: 'mp3/00. Santa Faustina, Himno Moderno.mp3',
      titulo: 'Santa Faustina - Himno',
      frase: 'Consagración a la Divina Misericordia',
      volumen: 0.6
    },
    'consagracion-sagrado-corazon': {
      archivo: 'mp3/00. Santa Faustina, Himno Moderno.mp3',
      titulo: 'Santa Faustina - Himno',
      frase: 'Consagración al Sagrado Corazón',
      volumen: 0.6
    },
    'lugares-de-culto': {
      archivo: 'mp3/23. Concerto Grosso in D Major, Op. 1, No. 5_ III. Largo.mp3',
      titulo: 'Concerto Grosso - Corelli',
      frase: 'Santuarios de fe',
      volumen: 0.5
    },
    'oraciones': {
      archivo: 'mp3/04. Sweet Hour of Prayer.mp3',
      titulo: 'Sweet Hour of Prayer',
      frase: 'En tu presencia, Señor',
      volumen: 0.5
    },
    'oracion-santa-cruz': {
      archivo: 'mp3/38.He\'s a Pirate.mp3',
      titulo: "He's a Pirate",
      frase: 'La Santa Cruz',
      volumen: 0.5
    },
    'oracion-san-miguel': {
      archivo: 'mp3/34. Heart of Courage.mp3',
      titulo: 'Heart of Courage',
      frase: 'San Miguel Arcángel',
      volumen: 0.6
    },
    'obras-de-misericordia': {
      archivo: 'mp3/04. Sweet Hour of Prayer.mp3',
      titulo: 'Sweet Hour of Prayer',
      frase: 'Obras de Misericordia',
      volumen: 0.5
    },
    // Default
    'default': {
      archivo: 'mp3/15. Canon in D.mp3',
      titulo: 'Canon in D - Pachelbel',
      frase: 'Divina Misericordia',
      volumen: 0.5
    }
  };

  // ==========================================
  // CLASE REPRODUCTOR DIVINO
  // ==========================================
  class ReproductorDivino {
    constructor() {
      this.audio = null;
      this.isPlaying = false;
      this.currentSection = 'index';
      this.volume = 0.5;
      this.isInitialized = false;
      
      this.init();
    }

    init() {
      // Cargar volumen guardado
      const savedVolume = localStorage.getItem('divineVolume');
      if (savedVolume) {
        this.volume = parseFloat(savedVolume);
      }

      // Crear el elemento de audio
      this.crearAudio();

      // Crear la interfaz visual
      this.crearInterfaz();

      // Configurar eventos
      this.configurarEventos();

      // Detectar sección actual
      this.detectarSeccion();

      // Configurar navegación
      this.configurarNavegacion();

      this.isInitialized = true;
      console.log('🎵 Reproductor Divino inicializado');
    }

    crearAudio() {
      // Eliminar audio anterior si existe
      const oldAudio = document.getElementById('divine-audio-element');
      if (oldAudio) {
        oldAudio.remove();
      }

      // Crear nuevo elemento de audio
      this.audio = document.createElement('audio');
      this.audio.id = 'divine-audio-element';
      this.audio.preload = 'metadata';
      this.audio.crossOrigin = 'anonymous';
      document.body.appendChild(this.audio);
    }

    crearInterfaz() {
      // Verificar si ya existe
      if (document.getElementById('sacred-player-wrapper')) return;

      const playerHTML = `
        <div id="sacred-player-wrapper">
          <div class="sacred-player">
            <div class="sp-halo"></div>
            <div class="sp-core">
              <button id="sp-play-btn" class="sp-play-btn" aria-label="Reproducir">
                <span class="sp-icon">▶</span>
              </button>
            </div>
            <div class="sp-track-info">
              <div class="sp-track-name" id="sp-track-name">Divina Misericordia</div>
              <div class="sp-progress">
                <div class="sp-progress-bar" id="sp-progress-bar">
                  <div class="sp-progress-fill"></div>
                </div>
              </div>
              <div class="sp-times">
                <span id="sp-current-time">0:00</span>
                <span>/</span>
                <span id="sp-duration">--:--</span>
              </div>
            </div>
            <div class="sp-controls">
              <button id="sp-mute-btn" class="sp-control-btn" aria-label="Volumen">🔊</button>
              <input type="range" id="sp-volume" class="sp-volume" min="0" max="1" step="0.05" value="${this.volume}">
            </div>
            <div class="sp-frase" id="sp-frase">
              <span class="sp-frase-icon">✝</span>
              <span class="sp-frase-text">Jesús, en Ti confío</span>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', playerHTML);

      // Insertar estilos
      this.insertarEstilos();
    }

    insertarEstilos() {
      if (document.getElementById('sacred-player-styles')) return;

      const styles = `
        #sacred-player-wrapper {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 99999;
          font-family: 'EB Garamond', Georgia, serif;
          animation: sp-enter 0.5s ease-out;
        }

        @keyframes sp-enter {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sacred-player {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(230,242,255,0.92) 50%, rgba(255,240,240,0.9) 100%);
          border-radius: 20px;
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.8);
          transition: all 0.3s ease;
          position: relative;
          overflow: visible;
        }

        .sacred-player:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 0 20px rgba(74,144,217,0.15);
        }

        .sp-halo {
          position: absolute;
          inset: -15px;
          background: radial-gradient(ellipse at 30% 50%, rgba(74,144,217,0.3) 0%, rgba(201,162,39,0.15) 40%, transparent 70%);
          border-radius: 30px;
          opacity: 0;
          transition: opacity 0.8s ease;
          pointer-events: none;
          z-index: -1;
        }

        .sacred-player.playing .sp-halo {
          opacity: 1;
          animation: sp-halo-pulse 3s ease-in-out infinite;
        }

        @keyframes sp-halo-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        .sp-core {
          flex-shrink: 0;
        }

        .sp-play-btn {
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffffff, #e8f4fc);
          box-shadow: 0 3px 12px rgba(74,144,217,0.35), inset 0 2px 0 rgba(255,255,255,0.9);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .sp-play-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 5px 20px rgba(74,144,217,0.5);
        }

        .sacred-player.playing .sp-play-btn {
          background: linear-gradient(145deg, #fff5f5, #ffe8e8);
          box-shadow: 0 3px 12px rgba(229,115,115,0.4);
          animation: sp-btn-beat 1.5s ease-in-out infinite;
        }

        @keyframes sp-btn-beat {
          0%, 100% { box-shadow: 0 3px 12px rgba(229,115,115,0.4); }
          50% { box-shadow: 0 3px 20px rgba(229,115,115,0.7); }
        }

        .sp-icon {
          font-size: 16px;
          color: #4a7db8;
        }

        .sacred-player.playing .sp-icon {
          color: #e57373;
        }

        .sp-track-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sp-track-name {
          font-size: 13px;
          font-weight: 600;
          color: #2c3e50;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sp-progress {
          width: 100%;
        }

        .sp-progress-bar {
          width: 100%;
          height: 5px;
          background: rgba(74,144,220,0.15);
          border-radius: 8px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .sp-progress-bar:hover {
          height: 8px;
        }

        .sp-progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #4a90d9 0%, #6fa8dc 50%, #e57373 100%);
          border-radius: 8px;
          transition: width 0.1s linear;
        }

        .sp-times {
          display: flex;
          gap: 4px;
          font-size: 10px;
          color: rgba(44,62,80,0.5);
        }

        .sp-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sp-control-btn {
          background: none;
          border: none;
          font-size: 14px;
          cursor: pointer;
          padding: 4px;
          opacity: 0.6;
          color: #5a6c7d;
          transition: all 0.2s;
        }

        .sp-control-btn:hover {
          opacity: 1;
          transform: scale(1.15);
        }

        .sp-volume {
          width: 50px;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(74,144,220,0.2);
          border-radius: 4px;
          cursor: pointer;
        }

        .sp-volume::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: linear-gradient(145deg, #fff, #e8f4fc);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(74,144,220,0.4);
        }

        .sp-frase {
          position: absolute;
          bottom: -22px;
          left: 0;
          right: 0;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          opacity: 0;
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }

        .sacred-player:hover .sp-frase {
          opacity: 1;
          transform: translateY(0);
        }

        .sp-frase-icon {
          font-size: 10px;
          color: #d4af37;
        }

        .sp-frase-text {
          font-size: 10px;
          color: rgba(44,62,80,0.6);
          font-style: italic;
        }

        /* Responsive */
        @media (max-width: 480px) {
          #sacred-player-wrapper {
            bottom: 10px;
            right: 10px;
            left: 10px;
          }
          .sacred-player {
            padding: 10px 14px;
            gap: 8px;
          }
          .sp-track-info {
            display: none;
          }
          .sp-controls {
            display: none;
          }
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.id = 'sacred-player-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    configurarEventos() {
      const playBtn = document.getElementById('sp-play-btn');
      const progressBar = document.getElementById('sp-progress-bar');
      const volumeSlider = document.getElementById('sp-volume');
      const muteBtn = document.getElementById('sp-mute-btn');
      const downloadBtn = document.getElementById('sp-download');

      if (playBtn) {
        playBtn.addEventListener('click', () => this.togglePlay());
      }

      if (progressBar) {
        progressBar.addEventListener('click', (e) => this.seek(e));
      }

      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
      }

      if (muteBtn) {
        muteBtn.addEventListener('click', () => this.toggleMute());
      }

      if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.descargar();
        });
      }

      // Eventos del audio
      this.audio.addEventListener('timeupdate', () => this.actualizarProgreso());
      this.audio.addEventListener('loadedmetadata', () => this.actualizarDuracion());
      this.audio.addEventListener('ended', () => this.onEnded());
      this.audio.addEventListener('error', (e) => {
        console.error('Error de audio:', e);
        this.mostrarError();
      });
      this.audio.addEventListener('canplay', () => {
        console.log('Audio listo para reproducir');
      });
    }

    detectarSeccion() {
      const path = window.location.pathname;
      const filename = path.split('/').pop().replace('.html', '') || 'index';
      
      // Buscar coincidencia en config
      let seccion = 'default';
      for (const key of Object.keys(CONFIG_MUSICA)) {
        if (filename.includes(key) || path.includes(key)) {
          seccion = key;
          break;
        }
      }

      this.cargarMusica(seccion);
    }

    cargarMusica(seccion) {
      const config = CONFIG_MUSICA[seccion] || CONFIG_MUSICA['default'];
      
      // Solo cambiar si es diferente
      const currentSrc = this.audio.src.split('/').pop();
      const newSrc = config.archivo;
      
      if (currentSrc !== newSrc && newSrc) {
        console.log(`🎵 Cargando: ${config.titulo} (${config.archivo})`);
        this.audio.src = config.archivo;
        
        // Actualizar UI
        const trackName = document.getElementById('sp-track-name');
        if (trackName) trackName.textContent = config.titulo;
        
        const downloadBtn = document.getElementById('sp-download');
        if (downloadBtn) downloadBtn.href = config.archivo;
      }

      // Actualizar frase
      const fraseText = document.querySelector('.sp-frase-text');
      if (fraseText && config.frase) {
        fraseText.textContent = config.frase;
      }

      this.currentSection = seccion;
      this.guardarEstado();
    }

    togglePlay() {
      if (!this.audio.src) {
        this.detectarSeccion();
      }

      if (this.isPlaying) {
        this.pausar();
      } else {
        this.reproducir();
      }
    }

    reproducir() {
      if (!this.audio.src) {
        this.detectarSeccion();
        return;
      }

      // Fade in
      this.audio.volume = 0;
      this.audio.play().then(() => {
        this.fadeIn();
        this.isPlaying = true;
        this.actualizarUIPlay(true);
        this.guardarEstado();
      }).catch(err => {
        console.error('Error al reproducir:', err);
        // Intentar sin fade
        this.audio.volume = this.volume;
        this.audio.play().catch(e => console.error('Sin audio:', e));
      });
    }

    pausar() {
      // Fade out
      this.fadeOut();
      this.isPlaying = false;
      this.actualizarUIPlay(false);
      this.guardarEstado();
    }

    fadeIn() {
      let vol = 0;
      this.audio.volume = 0;
      const interval = setInterval(() => {
        if (vol < this.volume) {
          vol += 0.05;
          this.audio.volume = Math.min(vol, this.volume);
        } else {
          clearInterval(interval);
        }
      }, 30);
    }

    fadeOut() {
      let vol = this.audio.volume;
      const interval = setInterval(() => {
        if (vol > 0) {
          vol -= 0.05;
          this.audio.volume = Math.max(vol, 0);
        } else {
          clearInterval(interval);
          this.audio.pause();
        }
      }, 30);
    }

    actualizarUIPlay(playing) {
      const wrapper = document.querySelector('.sacred-player');
      const btn = document.getElementById('sp-play-btn');
      const icon = btn?.querySelector('.sp-icon');
      
      if (wrapper) wrapper.classList.toggle('playing', playing);
      if (icon) icon.textContent = playing ? '⏸' : '▶';
    }

    seek(e) {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      if (this.audio.duration) {
        this.audio.currentTime = percent * this.audio.duration;
      }
    }

    actualizarProgreso() {
      if (!this.audio.duration) return;
      
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      const fill = document.querySelector('.sp-progress-fill');
      const timeEl = document.getElementById('sp-current-time');
      
      if (fill) fill.style.width = `${percent}%`;
      if (timeEl) timeEl.textContent = this.formatearTiempo(this.audio.currentTime);
    }

    actualizarDuracion() {
      const durEl = document.getElementById('sp-duration');
      if (durEl) durEl.textContent = this.formatearTiempo(this.audio.duration);
    }

    onEnded() {
      this.isPlaying = false;
      this.actualizarUIPlay(false);
      this.guardarEstado();
    }

    setVolume(value) {
      this.volume = parseFloat(value);
      this.audio.volume = this.volume;
      localStorage.setItem('divineVolume', this.volume);
      this.actualizarIconoVolumen();
    }

    toggleMute() {
      if (this.audio.volume > 0) {
        this.audio.volume = 0;
        document.getElementById('sp-volume').value = 0;
      } else {
        this.audio.volume = this.volume || 0.5;
        document.getElementById('sp-volume').value = this.volume || 0.5;
      }
      this.actualizarIconoVolumen();
    }

    actualizarIconoVolumen() {
      const btn = document.getElementById('sp-mute-btn');
      if (btn) {
        const vol = this.audio.volume;
        btn.textContent = vol === 0 ? '🔇' : vol < 0.5 ? '🔉' : '🔊';
      }
    }

    descargar() {
      if (!this.audio.src) return;
      
      const link = document.createElement('a');
      link.href = this.audio.src;
      link.download = this.audio.src.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    formatearTiempo(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    mostrarError() {
      const trackName = document.getElementById('sp-track-name');
      if (trackName) trackName.textContent = 'Error al cargar audio';
    }

    guardarEstado() {
      const estado = {
        src: this.audio.src,
        currentTime: this.audio.currentTime,
        isPlaying: this.isPlaying,
        volume: this.volume,
        section: this.currentSection,
        timestamp: Date.now()
      };
      localStorage.setItem('divinePlayerState', JSON.stringify(estado));
    }

    restaurarEstado() {
      try {
        const estado = JSON.parse(localStorage.getItem('divinePlayerState'));
        if (!estado || !estado.src) return;
        
        // Verificar si es reciente (menos de 30 min)
        if (Date.now() - estado.timestamp > 1800000) return;
        
        // Restaurar
        this.audio.src = estado.src;
        this.audio.currentTime = estado.currentTime || 0;
        this.volume = estado.volume || 0.5;
        this.audio.volume = 0; // No reproducir automáticamente
        
        // Actualizar UI
        const trackName = document.getElementById('sp-track-name');
        if (trackName && estado.trackName) trackName.textContent = estado.trackName;
        
        document.getElementById('sp-volume').value = this.volume;
        
      } catch (e) {
        console.log('No hay estado que restaurar');
      }
    }

    configurarNavegacion() {
      // Interceptar navegación
      const originalPushState = history.pushState;
      history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(() => this.detectarSeccion?.(), 200);
      }.bind(this);

      // Detectar clicks
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes('.html')) {
          setTimeout(() => this.detectarSeccion(), 300);
        }
      });

      // Hash change
      window.addEventListener('hashchange', () => this.detectarSeccion());
    }
  }

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    window.sacredPlayer = new ReproductorDivino();
  });

  // API pública
  window.cambiarMusica = function(ruta, titulo, frase) {
    if (window.sacredPlayer) {
      window.sacredPlayer.audio.src = ruta;
      const trackName = document.getElementById('sp-track-name');
      if (trackName) trackName.textContent = titulo;
      const fraseText = document.querySelector('.sp-frase-text');
      if (fraseText) fraseText.textContent = frase;
    }
  };

})();