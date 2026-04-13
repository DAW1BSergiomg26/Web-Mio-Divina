/**
 * Audio Player Premium - Sistema Global
 * Reproductor de audio con Web Audio API / HTMLAudioElement
 * Controles completos, gestión de estado, UI premium
 * Compatible con Chrome, Firefox, Safari, Edge y móvil
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  // INTEGRACIÓN CON AUDIO INTELLIGENCE
  // ═══════════════════════════════════════════════════════════════════
  
  let getNextTrack = null;
  let trackEvent = null;
  
  // Cargar módulos de forma segura
  (function loadIntelligenceModules() {
    try {
      if (window.getNextTrack) {
        getNextTrack = window.getNextTrack;
      }
      if (window.trackEvent) {
        trackEvent = window.trackEvent;
      }
      if (window.AudioMemory) {
        console.log('[AudioPlayer] AudioMemory disponible');
      }
    } catch(e) {
      console.log('[AudioPlayer] Módulos de inteligencia no disponibles aún');
    }
  })();

  console.log('[AudioPlayerPremium] Cargando módulo...');

  // ═══════════════════════════════════════════════════════════════════
  // FUNCIÓN: onSectionChange - Cambio de sección inteligente
  // ═══════════════════════════════════════════════════════════════════
  
  window.AudioPlayerOnSectionChange = function(section) {
    if (!getNextTrack) {
      console.log('[AudioPlayer] getNextTrack no disponible');
      return;
    }

    const catalog = window.AUDIO_CATALOG || [];
    const liturgy = window.LITURGY || {};

    const track = getNextTrack({
      section: section,
      catalog: catalog,
      liturgy: liturgy
    });

    if (track && window.AudioPlayerPremium.instance) {
      const player = window.AudioPlayerPremium.instance;
      player.playWithFadeSmart(track.src, track);
      console.log('[AudioPlayer] Reproduciendo por sección:', track.title, '(reason:', track.reason + ')');
    }
  };

  /**
   * Clase principal del reproductor
   */
  class AudioPlayerPremium {
    constructor(options = {}) {
      console.log('[AudioPlayerPremium] Constructor llamado');
      
      // Asignar instancia inmediatamente
      window.AudioPlayerPremium.instance = this;
      
      // Configuración
      this.options = {
        fadeDuration: options.fadeDuration || 1500,
        defaultVolume: options.defaultVolume || 0.7,
        autoPlay: options.autoPlay || false,
        ...options
      };

      // Estado del reproductor
      this.state = {
        status: 'stopped', // loading, playing, paused, stopped, error
        currentTrack: null,
        currentIndex: -1,
        currentCategory: null,
        volume: this.options.defaultVolume,
        isMuted: false,
        isMinimized: false,
        progress: 0,
        duration: 0,
        currentTime: 0,
        // Nuevos estados
        shuffle: false,
        repeat: 'none', // none, one, all
        favorites: [],
        history: []
      };

      // Audio element
      this.audio = null;
      this.audioContext = null;
      this.gainNode = null;

      // UI
      this.container = null;
      this.elements = {};

      // Catálogo de música
      this.library = [];

      // Timer para progress
      this.progressTimer = null;

      this.init();
    }

    /**
     * Inicializar el reproductor
     */
    init() {
      this.createAudioElement();
      this.createUI();
      this.bindEvents();
      this.createFloatingToggle();
      this.initBusListeners();
    }

    /**
     * Crear elemento de audio
     */
    createAudioElement() {
      this.audio = new Audio();
      this.audio.preload = 'none';
      this.audio.crossOrigin = 'anonymous';
    }

    /**
     * Crear UI del reproductor
     */
    createUI() {
      // Verificar si ya existe
      if (document.querySelector('.audio-player-container')) {
        this.container = document.querySelector('.audio-player-container');
        this.cacheElements();
        return;
      }

      // Crear estructura HTML
      this.container = document.createElement('div');
      this.container.className = 'audio-player-container';
      this.container.id = 'audioPlayerPremium';
      this.container.innerHTML = `
        <button class="player-toggle" aria-label="Minimizar reproductor">
          <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        
        <div class="audio-player-bar">
          <!-- Info de la pista -->
          <div class="player-info">
            <div class="player-artwork">
              <svg viewBox="0 0 24 24" class="music-icon">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div class="player-details">
              <div class="player-track-name">Selecciona una pista</div>
              <div class="player-track-reason"></div>
              <div class="player-track-artist">Biblioteca Musical</div>
            </div>
          </div>

          <!-- Visualizador -->
          <div class="player-visualizer">
            <div class="audio-waves">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
          </div>

          <!-- Controles -->
          <div class="player-controls">
            <button class="player-btn stop" onclick="AudioPlayerPremium.instance.stop()" aria-label="Detener">
              <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
            </button>
            <button class="player-btn main" onclick="AudioPlayerPremium.instance.togglePlay()" aria-label="Reproducir/Pausar">
              <svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <svg class="icon-pause" viewBox="0 0 24 24" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
            <button class="player-btn" onclick="AudioPlayerPremium.instance.prev()" aria-label="Anterior">
              <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button class="player-btn" onclick="AudioPlayerPremium.instance.next()" aria-label="Siguiente">
              <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
          </div>

          <!-- Visualizador -->
          <div class="player-visualizer">
            <div class="visualizer-bar"></div>
            <div class="visualizer-bar"></div>
            <div class="visualizer-bar"></div>
            <div class="visualizer-bar"></div>
            <div class="visualizer-bar"></div>
          </div>

          <!-- Progreso -->
          <div class="player-progress-container">
            <span class="player-time current">0:00</span>
            <div class="progress-wrapper" onclick="AudioPlayerPremium.instance.seek(event)">
              <div class="progress-bar" style="width: 0%"></div>
            </div>
            <span class="player-time">0:00</span>
          </div>

          <!-- Volumen -->
          <div class="player-volume">
            <button class="volume-btn" onclick="AudioPlayerPremium.instance.toggleMute()" aria-label="Silenciar">
              <svg class="icon-volume" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              <svg class="icon-muted" viewBox="0 0 24 24" style="display:none"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
            </button>
            <input type="range" class="volume-slider" min="0" max="1" step="0.05" value="${this.options.defaultVolume}" onchange="AudioPlayerPremium.instance.setVolume(this.value)" aria-label="Volumen">
          </div>

          <!-- Recomendaciones -->
          <div class="player-recommendations"></div>
        </div>
      `;

      // Insertar en el body
      document.body.appendChild(this.container);

      // Cachear elementos
      this.cacheElements();
    }

    /**
     * Cachear elementos del DOM
     */
    cacheElements() {
      this.elements = {
        container: this.container,
        toggle: this.container.querySelector('.player-toggle'),
        trackName: this.container.querySelector('.player-track-name'),
        trackReason: this.container.querySelector('.player-track-reason'),
        artistName: this.container.querySelector('.player-track-artist'),
        artwork: this.container.querySelector('.player-artwork'),
        mainBtn: this.container.querySelector('.player-btn.main'),
        iconPlay: this.container.querySelector('.icon-play'),
        iconPause: this.container.querySelector('.icon-pause'),
        controls: this.container.querySelector('.player-controls'),
        progressBar: this.container.querySelector('.progress-bar'),
        progressWrapper: this.container.querySelector('.progress-wrapper'),
        currentTimeEl: this.container.querySelector('.player-time.current'),
        durationTimeEl: this.container.querySelector('.player-time:not(.current)'),
        volumeBtn: this.container.querySelector('.volume-btn'),
        iconVolume: this.container.querySelector('.icon-volume'),
        iconMuted: this.container.querySelector('.icon-muted'),
        volumeSlider: this.container.querySelector('.volume-slider'),
        recommendations: this.container.querySelector('.player-recommendations'),
        audioWaves: this.container.querySelector('.audio-waves')
      };
    }

    /**
     * Inicializar el bus de audio global para eventos de ducking
     */
    initBusListeners() {
      // Bajar volumen cuando se abre el compañero o suena el Ángelus
      EventBus.on(SanctuaryEvents.COMPANION_OPENED, () => this.duckVolume(0.2));
      EventBus.on(SanctuaryEvents.COMPANION_CLOSED, () => this.restoreVolume());
      EventBus.on(SanctuaryEvents.ANGELUS_TIME, () => this.duckVolume(0.1));
    },

    duckVolume(targetVolume) {
      if (!this.audio) return;
      this.audio.volume = targetVolume;
    },

    restoreVolume() {
      if (!this.audio) return;
      this.audio.volume = this.state.volume;
    },


    /**
     * Enlazar eventos
     */
    bindEvents() {
      // Eventos del audio
      this.audio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
      this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
      this.audio.addEventListener('ended', () => this.onEnded());
      this.audio.addEventListener('error', (e) => this.onError(e));
      this.audio.addEventListener('canplay', () => this.onCanPlay());
      this.audio.addEventListener('waiting', () => this.setState('loading'));
      this.audio.addEventListener('playing', () => this.setState('playing'));

      // Toggle minimizar
      if (this.elements.toggle) {
        this.elements.toggle.onclick = () => this.toggleMinimize();
      }

      // Progress bar interactiva
      if (this.elements.progressWrapper) {
        let isDragging = false;
        
        this.elements.progressWrapper.addEventListener('mousedown', (e) => {
          isDragging = true;
          this.seek(e);
        });
        
        document.addEventListener('mousemove', (e) => {
          if (isDragging) this.seek(e);
        });
        
        document.addEventListener('mouseup', () => {
          isDragging = false;
        });

        // Touch support
        this.elements.progressWrapper.addEventListener('touchstart', (e) => {
          isDragging = true;
          this.seek(e.touches[0]);
        });
        
        document.addEventListener('touchmove', (e) => {
          if (isDragging) this.seek(e.touches[0]);
        });
        
        document.addEventListener('touchend', () => {
          isDragging = false;
        });
      }

      // Recomendaciones clickables
      if (this.elements.recommendations) {
        this.elements.recommendations.addEventListener('click', (e) => {
          const recItem = e.target.closest('.rec-item');
          if (recItem) {
            const src = recItem.dataset.src;
            const file = recItem.dataset.file;
            const track = window.AUDIO_CATALOG?.find(t => t.src === src);
            if (track) {
              this.playWithFadeSmart(src, track);
            }
          }
        });
      }
    }

    /**
     * Establecer biblioteca de música (Lazy)
     */
    setLibrary(library) {
      this.library = library;
      // No aplanamos todo el array al inicio para ahorrar memoria y CPU
      this.allTracks = null; 
    }

    /**
     * Obtener pista de forma eficiente (bajo demanda)
     */
    getAllTracks() {
      if (this.allTracks) return this.allTracks;
      
      this.allTracks = [];
      this.library.forEach(category => {
        category.tracks.forEach((track, index) => {
          this.allTracks.push({
            ...track,
            _category: category.category,
            _categoryIndex: this.library.indexOf(category),
            _trackIndex: index
          });
        });
      });
      return this.allTracks;
    }

    /**
     * Cargar una pista
     */
    loadTrack(track, category = null, autoPlay = true) {
      if (!track || !track.src) return;

      // Detener pista actual con fade out
      if (this.state.status === 'playing') {
        this.fadeOut(() => this._doLoadTrack(track, category, autoPlay));
      } else {
        this._doLoadTrack(track, category, autoPlay);
      }
    }

    /**
     * Cargar pista internamente - Lazy Loading
     */
    _doLoadTrack(track, category, autoPlay) {
      this.setState('loading');
      
      this.state.currentTrack = track;
      this.state.currentCategory = category;
      
      // Encontrar índice
      if (this.allTracks) {
        const idx = this.allTracks.findIndex(t => t.src === track.src);
        if (idx !== -1) this.state.currentIndex = idx;
      }

      // Actualizar UI
      this.updateTrackInfo(track, category);

      // Lazy loading: solo cargar audio cuando se va a reproducir
      if (autoPlay || this.options.autoPlay) {
        this.audio.src = track.src;
        this.audio.load();
        this.fadeIn();
      } else {
        // Solo pre-cargar metadata para mostrar duración
        this.audio.src = track.src;
        this.audio.preload = 'metadata';
      }

      // Mostrar reproductor
      this.show();
    }

    /**
     * Actualizar información de la pista
     */
    updateTrackInfo(track, category) {
      if (this.elements.trackName) {
        this.elements.trackName.textContent = track.title || 'Sin título';
      }
      if (this.elements.trackReason) {
        // Mostrar label (contextual) o reason
        this.elements.trackReason.textContent = track.label || track.reason || '';
        this.elements.trackReason.className = 'player-track-reason ' + (track.reason || '');
      }
      if (this.elements.artistName) {
        this.elements.artistName.textContent = track.artist || category || 'Biblioteca Musical';
      }
      
      // Actualizar recomendaciones
      this.updateRecommendations(track);
    }

    /**
     * Actualizar recomendaciones dinámicas
     */
    updateRecommendations(currentTrack) {
      if (!this.elements.recommendations || !window.AUDIO_CATALOG) return;
      
      const catalog = window.AUDIO_CATALOG;
      const nextTracks = catalog
        .filter(t => t.file !== currentTrack?.file)
        .slice(0, 3);
      
      if (nextTracks.length === 0) {
        this.elements.recommendations.innerHTML = '';
        return;
      }
      
      this.elements.recommendations.innerHTML = nextTracks.map(track => `
        <div class="rec-item" data-src="${track.src}" data-file="${track.file}" title="${track.title}">
          ${track.title}
        </div>
      `).join('');
    }

    /**
     * Mostrar estado playing en UI
     */
    setPlayingVisual(isPlaying) {
      if (this.elements.audioWaves) {
        this.elements.audioWaves.classList.toggle('active', isPlaying);
      }
      document.body.classList.toggle('is-playing', isPlaying);
    }

    /**
     * Reproducir - carga audio bajo demanda
     */
    play() {
      // Si no hay pista, no hacer nada
      if (!this.state.currentTrack) return;
      
      // Lazy loading: si el src está vacío o es diferente, cargar
      if (!this.audio.src || this.audio.src !== this.state.currentTrack.src) {
        this.audio.src = this.state.currentTrack.src;
        this.audio.load();
      }
      
      // Asegurar que preload está en 'auto' para reproducción
      this.audio.preload = 'auto';
      
      this.fadeIn();
    }

    /**
     * Pausar
     */
    pause() {
      this.audio.pause();
      this.setState('paused');
    }

    /**
     * Alternar play/pause
     */
    togglePlay() {
      if (this.state.status === 'playing') {
        this.pause();
      } else if (this.state.currentTrack) {
        this.play();
      }
    }

    /**
     * Detener completamente
     */
    stop() {
      console.log('[AudioPlayer] Stop llamado, estado actual:', this.state.status);
      this.audio.pause();
      this.audio.currentTime = 0;
      this.state.progress = 0;
      this.state.currentTime = 0;
      this.updateProgress(0);
      this.setState('stopped');
      console.log('[AudioPlayer] Stop completado, nuevo estado:', this.state.status);
    }

    /**
     * Pista anterior
     */
    prev() {
      const tracks = this.getAllTracks();
      if (!tracks || tracks.length === 0) return;
      
      let newIndex = this.state.currentIndex - 1;
      if (newIndex < 0) newIndex = tracks.length - 1;
      
      const track = tracks[newIndex];
      this.loadTrack(track, track._category, true);
    }

    /**
     * Pista siguiente
     */
    next() {
      const tracks = this.getAllTracks();
      if (!tracks || tracks.length === 0) return;
      
      let newIndex = this.state.currentIndex + 1;
      if (newIndex >= tracks.length) newIndex = 0;
      
      const track = tracks[newIndex];
      this.loadTrack(track, track._category, true);
    }

    /**
     * Buscar posición
     */
    seek(event) {
      if (!this.elements.progressWrapper || !this.state.duration) return;

      const rect = this.elements.progressWrapper.getBoundingClientRect();
      const pos = (event.clientX - rect.left) / rect.width;
      const time = pos * this.state.duration;
      
      this.audio.currentTime = Math.max(0, Math.min(time, this.state.duration));
    }

    /**
     * Establecer volumen
     */
    setVolume(value) {
      this.state.volume = parseFloat(value);
      this.audio.volume = this.state.volume;
      
      if (this.elements.volumeSlider) {
        this.elements.volumeSlider.value = this.state.volume;
      }
      
      if (this.state.volume > 0 && this.state.isMuted) {
        this.state.isMuted = false;
        this.updateVolumeIcon();
      }
    }

    /**
     * Alternar silencio
     */
    toggleMute() {
      this.state.isMuted = !this.state.isMuted;
      this.audio.muted = this.state.isMuted;
      this.updateVolumeIcon();
    }

    /**
     * Actualizar icono de volumen
     */
    updateVolumeIcon() {
      if (!this.elements.iconVolume || !this.elements.iconMuted) return;
      
      if (this.state.isMuted || this.state.volume === 0) {
        this.elements.iconVolume.style.display = 'none';
        this.elements.iconMuted.style.display = 'block';
      } else {
        this.elements.iconVolume.style.display = 'block';
        this.elements.iconMuted.style.display = 'none';
      }
    }

    /**
     * Fade in
     */
    fadeIn(duration = this.options.fadeDuration) {
      if (!this.audioContext) {
        // Modo simple sin Web Audio API
        this.audio.volume = 0;
        this.audio.play().catch(e => console.error('Error:', e));
        
        const step = this.state.volume / (duration / 50);
        const fadeInInterval = setInterval(() => {
          if (this.audio.volume < this.state.volume) {
            this.audio.volume = Math.min(this.audio.volume + step, this.state.volume);
          } else {
            clearInterval(fadeInInterval);
          }
        }, 50);
      } else {
        // Usar Web Audio API
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(this.state.volume, this.audioContext.currentTime + duration / 1000);
        this.audio.play().catch(e => console.error('Error:', e));
      }
      
      this.setState('playing');
    }

    /**
     * Fade out
     */
    fadeOut(callback, duration = this.options.fadeDuration) {
      if (!this.audioContext) {
        const step = this.audio.volume / (duration / 50);
        const fadeOutInterval = setInterval(() => {
          if (this.audio.volume > 0) {
            this.audio.volume = Math.max(this.audio.volume - step, 0);
          } else {
            clearInterval(fadeOutInterval);
            if (callback) callback();
          }
        }, 50);
      } else {
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000);
        setTimeout(() => {
          if (callback) callback();
        }, duration);
      }
    }

    /**
     * Reproducir con fade profesional + tracking
     * @param {string} src - URL del audio
     * @param {object} trackInfo - Info de la pista (title, file, reason)
     */
    playWithFadeSmart(src, trackInfo = {}) {
      const duration = 1500;
      
      if (this.state.status === 'playing') {
        this.fadeOut(() => {
          this.audio.src = src;
          this.audio.load();
          this.audio.play().catch(e => console.error('Error:', e));
          this.fadeIn(duration);
          
          // Tracking de reproducción
          if (trackEvent && trackInfo.file) {
            trackEvent('audio_play', trackInfo.file);
            console.log('[AudioPlayer] trackEvent audio_play:', trackInfo.file);
          }
          
          // AudioMemory: guardar reproducción
          if (window.AudioMemory && window.AudioMemory.addToHistory) {
            window.AudioMemory.addToHistory(trackInfo);
            console.log('[AudioPlayer] addToHistory:', trackInfo.title);
          }
          
          // Actualizar estado
          this.state.currentTrack = { src: src, title: trackInfo.title || 'Pista', file: trackInfo.file };
          this.updateTrackInfo(this.state.currentTrack);
          this.setState('playing');
        }, duration);
      } else {
        this.audio.src = src;
        this.audio.load();
        this.fadeIn(duration);
        
        // Tracking
        if (trackEvent && trackInfo.file) {
          trackEvent('audio_play', trackInfo.file);
          console.log('[AudioPlayer] trackEvent audio_play:', trackInfo.file);
        }
        
        // AudioMemory: guardar reproducción
        if (window.AudioMemory && window.AudioMemory.addToHistory) {
          window.AudioMemory.addToHistory(trackInfo);
          console.log('[AudioPlayer] addToHistory:', trackInfo.title);
        }
        
        this.state.currentTrack = { src: src, title: trackInfo.title || 'Pista', file: trackInfo.file };
        this.updateTrackInfo(this.state.currentTrack);
        this.setState('playing');
      }
    }

    /**
     * Reproducir pista directamente (sin fade)
     * @param {object} track - Objeto de pista {src, title, file}
     */
    playTrack(track) {
      if (!track || !track.src) return;
      
      this.audio.src = track.src;
      this.audio.load();
      this.fadeIn();
      
      // Tracking
      if (trackEvent && track.file) {
        trackEvent('audio_play', track.file);
      }
      
      // AudioMemory: guardar reproducción
      if (window.AudioMemory && window.AudioMemory.addToHistory) {
        window.AudioMemory.addToHistory(track);
      }
      
      this.state.currentTrack = track;
      this.updateTrackInfo(track);
      this.setState('playing');
    }

    /**
     * Mostrar reproductor
     */
    show() {
      if (this.container) {
        this.container.classList.add('active');
        if (this.elements.floatingToggle) {
          this.elements.floatingToggle.classList.remove('visible');
        }
      }
    }

    /**
     * Ocultar reproductor
     */
    hide() {
      if (this.container) {
        this.container.classList.remove('active');
      }
    }

    /**
     * Alternar minimizado
     */
    toggleMinimize() {
      this.state.isMinimized = !this.state.isMinimized;
      this.container.classList.toggle('minimized', this.state.isMinimized);
    }

    /**
     * Actualizar progreso
     */
    updateProgress(percent) {
      if (this.elements.progressBar) {
        this.elements.progressBar.style.width = `${percent}%`;
      }
    }

    /**
     * Formatear tiempo
     */
    formatTime(seconds) {
      if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Establecer estado
     */
    setState(status) {
      this.state.status = status;
      
      // Actualizar clases del contenedor
      this.container.classList.remove('loading', 'playing', 'paused', 'stopped', 'error');
      this.container.classList.add(status);

      // Actualizar botón play/pause
      if (this.elements.iconPlay && this.elements.iconPause) {
        if (status === 'playing') {
          this.elements.iconPlay.style.display = 'none';
          this.elements.iconPause.style.display = 'block';
          this.elements.controls.classList.add('playing');
        } else {
          this.elements.iconPlay.style.display = 'block';
          this.elements.iconPause.style.display = 'none';
          this.elements.controls.classList.remove('playing');
        }
      }

      // Actualizar botón flotante
      if (this.elements.floatingToggle) {
        this.elements.floatingToggle.classList.toggle('playing', status === 'playing');
      }

      // Loading state
      if (status === 'loading' && this.elements.progressBar) {
        this.elements.progressBar.classList.add('loading');
      } else if (this.elements.progressBar) {
        this.elements.progressBar.classList.remove('loading');
      }

      // Actualizar ondas de audio
      this.setPlayingVisual(status === 'playing');
    }

    // ==================== EVENT HANDLERS ====================

    onLoadedMetadata() {
      this.state.duration = this.audio.duration;
      if (this.elements.durationTimeEl) {
        this.elements.durationTimeEl.textContent = this.formatTime(this.audio.duration);
      }
    }

    onTimeUpdate() {
      if (!this.audio.duration) return;
      
      this.state.currentTime = this.audio.currentTime;
      this.state.progress = (this.audio.currentTime / this.audio.duration) * 100;
      
      this.updateProgress(this.state.progress);
      
      if (this.elements.currentTimeEl) {
        this.elements.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
      }
    }

    onEnded() {
      // Auto-play next track usando Audio Intelligence
      if (getNextTrack) {
        const catalog = window.AUDIO_CATALOG || [];
        const liturgy = window.LITURGY || {};
        
        const nextTrack = getNextTrack({
          catalog: catalog,
          liturgy: liturgy
        });
        
        if (nextTrack) {
          this.playWithFadeSmart(nextTrack.src, nextTrack);
          console.log('[AudioPlayer] Pista siguiente (reason:', nextTrack.reason + ')');
          return;
        }
      }
      
      // Fallback: siguiente pista tradicional
      this.next();
    }

    onError(e) {
      console.error('Error de audio:', e);
      this.setState('error');
      
      // Mostrar mensaje de error elegante
      const trackTitle = this.state.currentTrack ? this.state.currentTrack.title : 'esta pista';
      if (this.elements.trackName) {
        this.elements.trackName.textContent = '⚠️ Error al cargar';
      }
      if (this.elements.artistName) {
        this.elements.artistName.textContent = 'Intenta reproducir otra pista';
      }
      
      // Notificar al usuario con mensajetoast si está disponible
      if (window.showToast) {
        window.showToast('No se pudo cargar: ' + trackTitle, 'error');
      }
    }

    onCanPlay() {
      if (this.state.status === 'loading') {
        // Auto-play cuando esté listo
        // this.play(); // Descomentar para auto-play
      }
    }
  }

  // Instancia singleton - asegurar que existe
  if (typeof window.AudioPlayerPremium === 'function') {
    window.AudioPlayerPremium.instance = null;
  }

  // Constructor/Factory
  window.AudioPlayerPremium = function(options) {
    // Verificar si ya existe una instancia
    if (window.AudioPlayerPremium.instance && window.AudioPlayerPremium.instance instanceof AudioPlayerPremium) {
      console.log('[AudioPlayerPremium] Usando instancia existente');
      return window.AudioPlayerPremium.instance;
    }
    
    console.log('[AudioPlayerPremium] Creando nueva instancia');
    window.AudioPlayerPremium.instance = new AudioPlayerPremium(options);
    return window.AudioPlayerPremium.instance;
  };

  // Métodos estáticos de conveniencia
  window.AudioPlayerPremium.init = function(library, options = {}) {
    console.log('[AudioPlayerPremium] Init llamado con', library ? library.length + ' categorías' : 'sin biblioteca');
    const player = window.AudioPlayerPremium(options);
    if (library) {
      player.setLibrary(library);
    }
    console.log('[AudioPlayerPremium] Instancia creada:', !!player);
    return player;
  };

  window.AudioPlayerPremium.play = function(track, category) {
    if (window.AudioPlayerPremium.instance) {
      window.AudioPlayerPremium.instance.loadTrack(track, category, true);
    }
  };

  window.AudioPlayerPremium.getInstance = function() {
    console.log('[AudioPlayerPremium] getInstance:', !!window.AudioPlayerPremium.instance);
    return window.AudioPlayerPremium.instance;
  };

  // Auto-inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // El reproductor se inicializa manualmente con la biblioteca
    });
  }

})();

// Función global de notificaciones toast
window.showToast = function(message, type) {
  const existing = document.querySelector('.audio-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'audio-toast audio-toast-' + (type || 'info');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? 'rgba(180,50,50,0.95)' : 'rgba(30,60,90,0.95)'};
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    z-index: 10000;
    animation: toastFadeIn 0.3s ease;
    border: 1px solid ${type === 'error' ? '#ff6666' : '#d4af37'};
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastFadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Estilos para toast
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes toastFadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes toastFadeOut {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
  }
`;
document.head.appendChild(toastStyle);

/**
 * Funciones adicionales: Shuffle, Repeat, Favoritos
 */

// Shuffle
AudioPlayerPremium.prototype.toggleShuffle = function() {
  this.state.shuffle = !this.state.shuffle;
  const btn = document.querySelector('.icon-shuffle');
  if (btn) {
    btn.style.color = this.state.shuffle ? '#d4af37' : 'inherit';
  }
  this.showToast(this.state.shuffle ? 'Aleatorio activado' : 'Aleatorio desactivado');
};

// Repeat
AudioPlayerPremium.prototype.toggleRepeat = function() {
  const modes = ['none', 'one', 'all'];
  const currentIndex = modes.indexOf(this.state.repeat);
  this.state.repeat = modes[(currentIndex + 1) % modes.length];
  
  const repeatBtn = document.querySelector('.icon-repeat');
  const repeatOneBtn = document.querySelector('.icon-repeat-one');
  
  if (this.state.repeat === 'none') {
    if (repeatBtn) repeatBtn.style.color = 'inherit';
    if (repeatOneBtn) repeatOneBtn.style.display = 'none';
    this.showToast('Repetición desactivada');
  } else if (this.state.repeat === 'one') {
    if (repeatBtn) repeatBtn.style.display = 'none';
    if (repeatOneBtn) repeatOneBtn.style.display = 'block';
    this.showToast('Repetir una');
  } else {
    if (repeatBtn) repeatBtn.style.display = 'block';
    if (repeatOneBtn) repeatOneBtn.style.display = 'none';
    if (repeatBtn) repeatBtn.style.color = '#d4af37';
    this.showToast('Repetir todo');
  }
};

// Favoritos
AudioPlayerPremium.prototype.toggleFavorite = function() {
  if (!this.state.currentTrack) return;
  
  const trackId = this.state.currentTrack.src;
  const favIndex = this.state.favorites.indexOf(trackId);
  
  if (favIndex > -1) {
    this.state.favorites.splice(favIndex, 1);
    this.showToast('Eliminado de favoritos');
  } else {
    this.state.favorites.push(trackId);
    this.showToast('Añadido a favoritos');
  }
  
  const favBtn = document.querySelector('.icon-fav');
  const favActiveBtn = document.querySelector('.icon-fav-active');
  if (favBtn && favActiveBtn) {
    if (favIndex > -1) {
      favBtn.style.display = 'block';
      favActiveBtn.style.display = 'none';
    } else {
      favBtn.style.display = 'none';
      favActiveBtn.style.display = 'block';
    }
  }
};

// Modificar función next para shuffle y repeat
const originalNext = AudioPlayerPremium.prototype.next;
AudioPlayerPremium.prototype.next = function() {
  if (this.state.repeat === 'one') {
    this.audio.currentTime = 0;
    this.audio.play();
    return;
  }
  
  const tracks = this.getAllTracks();
  if (this.state.shuffle && tracks && tracks.length > 0) {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    const track = tracks[randomIndex];
    this.loadTrack(track, track._category, true);
    return;
  }
  
  originalNext.call(this);
};

// Modificar función prev
const originalPrev = AudioPlayerPremium.prototype.prev;
AudioPlayerPremium.prototype.prev = function() {
  if (this.audio.currentTime > 3) {
    this.audio.currentTime = 0;
    return;
  }
  originalPrev.call(this);
};
