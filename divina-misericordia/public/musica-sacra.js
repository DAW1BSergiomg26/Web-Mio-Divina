/**
 * Música Sacra - Módulo de Reproducción
 * Arquitectura moderna con IIFE, paginación e inteligencia litúrgica
 */
(function() {
  'use strict';

  // ============================================
  // CONFIGURACIÓN
  // ============================================
  const CONFIG = {
    CHUNK_SIZE: 15,        // Pistas por carga
    DEBOUNCE_MS: 300,     // Delay para buscar
    STORAGE_KEY: 'ms_audio_state'
  };

  // ============================================
  // ESTADO GLOBAL
  // ============================================
  const state = {
    allTracks: [],
    filteredTracks: [],
    currentIndex: -1,
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    renderOffset: 0,
    searchQuery: ''
  };

  // ============================================
  // AUDIO INSTANCE (una sola)
  // ============================================
  const audio = new Audio();
  audio.preload = 'none';

  // ============================================
  // DOM REFERENCES
  // ============================================
  const DOM = {
    container: document.getElementById('ms-container'),
    searchInput: document.getElementById('ms-search-input'),
    emptyMessage: document.getElementById('ms-empty'),
    trackList: document.getElementById('ms-track-list'),
    scrollSentinel: document.getElementById('ms-scroll-sentinel'),
    playerBar: document.getElementById('ms-player-bar'),
    trackTitle: document.getElementById('ms-track-title'),
    progressBar: document.getElementById('ms-progress-bar'),
    progressFill: document.getElementById('ms-progress-fill'),
    currentTime: document.getElementById('ms-current-time'),
    duration: document.getElementById('ms-duration'),
    playBtn: document.getElementById('ms-play-btn'),
    prevBtn: document.getElementById('ms-prev-btn'),
    nextBtn: document.getElementById('ms-next-btn'),
    stopBtn: document.getElementById('ms-stop-btn')
  };

  // ============================================
  // HELPERS
  // ============================================
  function formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function saveState() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
        index: state.currentIndex,
        time: audio.currentTime
      }));
    } catch (e) {}
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  // ============================================
  // CORE FUNCTIONS
  // ============================================
  function loadCatalog() {
    if (typeof AudioCatalog === 'undefined' || !AudioCatalog.getCategories) {
      console.warn('[MusicaSacra] Catálogo no disponible');
      return;
    }

    const categories = AudioCatalog.getCategories();
    const tracks = [];
    let index = 0;

    categories.forEach(cat => {
      if (cat.tracks) {
        cat.tracks.forEach(track => {
          tracks.push({
            index: index++,
            title: track.title || 'Sin título',
            artist: track.artist || 'Artista desconocido',
            src: track.src,
            file: track.file,
            tempo: track.tempo || 'moderada',
            caracter: track.caracter || 'sagrado',
            instrumentacion: track.instrumentacion || 'orquestal'
          });
        });
      }
    });

    state.allTracks = tracks;
    state.filteredTracks = tracks;
    console.log('[MusicaSacra] Catálogo cargado:', tracks.length, 'pistas');
  }

  function renderTracks() {
    if (!DOM.trackList) return;

    const start = state.renderOffset;
    const end = Math.min(start + CONFIG.CHUNK_SIZE, state.filteredTracks.length);
    const tracks = state.filteredTracks.slice(start, end);

    if (tracks.length === 0) {
      DOM.emptyMessage.classList.remove('hidden');
      return;
    }

    DOM.emptyMessage.classList.add('hidden');

    const html = tracks.map(track => `
      <li data-index="${track.index}" data-src="${track.src}" role="option">
        <div class="track-info">
          <span class="track-title">${track.title}</span>
          <span class="track-artist">${track.artist}</span>
        </div>
        <span class="track-meta">${track.caracter}</span>
      </li>
    `).join('');

    DOM.trackList.innerHTML += html;
    state.renderOffset = end;
  }

  function filterTracks(query) {
    state.searchQuery = query;
    state.renderOffset = 0;
    state.filteredTracks = query
      ? state.allTracks.filter(t => 
          t.title.toLowerCase().includes(query) || 
          t.artist.toLowerCase().includes(query)
        )
      : state.allTracks.slice();

    if (DOM.trackList) {
      DOM.trackList.innerHTML = '';
    }
    renderTracks();
  }

  function playTrack(index) {
    const track = state.filteredTracks[index];
    if (!track || !track.src) return;

    state.currentIndex = index;
    state.currentTrack = track;
    state.isPlaying = true;

    audio.src = track.src;
    audio.load();
    audio.play().catch(() => {});

    if (DOM.trackTitle) {
      DOM.trackTitle.textContent = track.title;
    }
    if (DOM.playBtn) {
      DOM.playBtn.textContent = '⏸';
    }

    saveState();
  }

  function pauseTrack() {
    audio.pause();
    state.isPlaying = false;
    if (DOM.playBtn) DOM.playBtn.textContent = '▶';
  }

  function stopTrack() {
    audio.pause();
    audio.currentTime = 0;
    state.isPlaying = false;
    if (DOM.progressFill) DOM.progressFill.style.width = '0%';
    if (DOM.currentTime) DOM.currentTime.textContent = '0:00';
    if (DOM.playBtn) DOM.playBtn.textContent = '▶';
  }

  function prevTrack() {
    if (state.filteredTracks.length === 0) return;
    const newIndex = (state.currentIndex - 1 + state.filteredTracks.length) % state.filteredTracks.length;
    playTrack(newIndex);
  }

  function nextTrack() {
    if (state.filteredTracks.length === 0) return;
    const newIndex = (state.currentIndex + 1) % state.filteredTracks.length;
    playTrack(newIndex);
  }

  function togglePlay() {
    if (state.currentTrack === null) {
      if (state.filteredTracks.length > 0) {
        playTrack(0);
      }
      return;
    }

    if (state.isPlaying) {
      pauseTrack();
    } else {
      playTrack(state.currentIndex);
    }
  }

  // ============================================
  // EVENT LISTENERS (EVENT DELEGATION)
  // ============================================
  
  // Click global
  document.addEventListener('click', function(e) {
    // Pista de la lista
    const trackItem = e.target.closest('[data-index]');
    if (trackItem) {
      const index = parseInt(trackItem.dataset.index, 10);
      playTrack(index);
      return;
    }

    // Controles
    if (e.target.closest('#ms-play-btn')) { togglePlay(); return; }
    if (e.target.closest('#ms-stop-btn')) { stopTrack(); return; }
    if (e.target.closest('#ms-prev-btn')) { prevTrack(); return; }
    if (e.target.closest('#ms-next-btn')) { nextTrack(); return; }

    // Progress bar seek
    if (e.target.closest('#ms-progress-bar') && audio.duration) {
      const rect = DOM.progressBar.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = ratio * audio.duration;
    }
  });

  // Input - buscador con debounce
  let debounceTimer;
  document.addEventListener('input', function(e) {
    if (e.target.id === 'ms-search-input') {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filterTracks(e.target.value.trim());
      }, CONFIG.DEBOUNCE_MS);
    }
  });

  // Infinite scroll
  if (DOM.scrollSentinel) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && state.renderOffset < state.filteredTracks.length) {
          renderTracks();
        }
      });
    }, { rootMargin: '100px' });
    observer.observe(DOM.scrollSentinel);
  }

  // Audio events
  audio.addEventListener('timeupdate', function() {
    if (audio.duration && DOM.progressFill) {
      const pct = (audio.currentTime / audio.duration) * 100;
      DOM.progressFill.style.width = pct + '%';
    }
    if (DOM.currentTime) {
      DOM.currentTime.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', function() {
    if (DOM.duration) {
      DOM.duration.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('ended', function() {
    nextTrack();
  });

  audio.addEventListener('error', function(e) {
    console.warn('[MusicaSacra] Error:', e);
  });

  // ============================================
  // INIT
  // ============================================
  function init() {
    loadCatalog();
    renderTracks();
    console.log('[MusicaSacra] Inicializado');
  }

  // Start
  document.addEventListener('DOMContentLoaded', init);

})();