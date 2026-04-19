// ============================================================
// REPRODUCTOR MUSICAL DIVINO - Divina Misericordia
// Reproductor sagrado con colores dorados y celestiales
// ============================================================

// Objeto global para el reproductor
window.reproductorDivino = {
  audio: null,
  currentBtn: null,
  currentPlayer: null,
  isPlaying: false,
  
  init() {
    // Crear elemento de audio
    this.audio = new Audio();
    this.audio.volume = 0.7;
    this.audio.preload = 'metadata';
    
    console.log('[ReproductorSagrado] Inicializado');
    
    this.audio.addEventListener('ended', () => {
      this.onTrackEnded();
    });
    
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateDuration();
    });
    
    this.audio.addEventListener('error', (e) => {
      console.error('[ReproductorSagrado] Error de audio:', e);
    });
  },
  
  togglePlay(btn) {
    const player = btn.closest('.reproductor-sagrado');
    const src = player.getAttribute('data-src');
    
    if (!src) return;
    
    // Si ya está reproduciendo este botón, pausar
    if (this.isPlaying && this.currentBtn === btn) {
      this.pauseTrack(btn, player);
      return;
    }
    
    // Si hay otra pista reproduciéndose, detenerla primero
    if (this.isPlaying && this.currentBtn && this.currentBtn !== btn) {
      this.resetAllPlayers();
    }
    
    // Reproducir la nueva pista
    this.playTrack(btn, player, src);
  },
  
  playTrack(btn, player, src) {
    this.audio.src = src;
    this.audio.play().then(() => {
      this.currentBtn = btn;
      this.currentPlayer = player;
      this.isPlaying = true;
      
      // Actualizar estado del botón
      btn.classList.add('playing');
      btn.innerHTML = '⏸';
      
      // Actualizar estado del reproductor
      player.classList.add('playing');
      
      // Sombrear los otros reproductores
      this.dimOtherPlayers(player);
      
    }).catch(err => {
      console.error('Error al reproducir:', err);
    });
  },
  
  pauseTrack(btn, player) {
    this.audio.pause();
    this.isPlaying = false;
    
    btn.classList.remove('playing');
    btn.innerHTML = '▶';
    player.classList.remove('playing');
    player.classList.remove('paused');
    
    // Quitar sombreado de otros
    this.undimAllPlayers();
  },
  
  onTrackEnded() {
    if (this.currentBtn) {
      this.resetAllPlayers();
    }
  },
  
  resetAllPlayers() {
    // Resetear todos los reproductores
    document.querySelectorAll('.reproductor-sagrado').forEach(player => {
      const btn = player.querySelector('.btn-play-sagrado');
      if (btn) {
        btn.classList.remove('playing');
        btn.innerHTML = '▶';
      }
      player.classList.remove('playing', 'paused', 'dimmed');
      
      const progressBar = player.querySelector('.progress-bar');
      const currentTime = player.querySelector('.current-time');
      if (progressBar) progressBar.style.width = '0%';
      if (currentTime) currentTime.textContent = '0:00';
    });
    
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    
    this.currentBtn = null;
    this.currentPlayer = null;
    this.isPlaying = false;
  },
  
  dimOtherPlayers(activePlayer) {
    document.querySelectorAll('.reproductor-sagrado').forEach(player => {
      if (player !== activePlayer) {
        player.classList.add('dimmed');
      }
    });
  },
  
  undimAllPlayers() {
    document.querySelectorAll('.reproductor-sagrado').forEach(player => {
      player.classList.remove('dimmed');
    });
  },
  
  updateProgress() {
    if (!this.currentPlayer || !this.currentBtn) return;
    
    const progressBar = this.currentPlayer.querySelector('.progress-bar');
    const currentTime = this.currentPlayer.querySelector('.current-time');
    
    if (this.audio.duration) {
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      if (progressBar) progressBar.style.width = percent + '%';
      if (currentTime) currentTime.textContent = this.formatTime(this.audio.currentTime);
    }
  },
  
  updateDuration() {
    if (!this.currentPlayer) return;
    const duration = this.currentPlayer.querySelector('.duration');
    if (duration && this.audio.duration) {
      duration.textContent = this.formatTime(this.audio.duration);
    }
  },
  
  seek(player, e) {
    if (!this.audio.src || !this.audio.duration) return;
    
    const progressContainer = player.querySelector('.progress-bar-container');
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    if (percent >= 0 && percent <= 1) {
      this.audio.currentTime = percent * this.audio.duration;
    }
  },
  
  setVolume(value) {
    this.audio.volume = value;
  },
  
  formatTime(seconds) {
    if (isNaN(seconds) || !seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  },
  
  download(btn) {
    const player = btn.closest('.reproductor-sagrado');
    const src = player.getAttribute('data-src');
    const title = player.getAttribute('data-title') || 'musica-sacra';
    
    if (!src) return;
    
    const link = document.createElement('a');
    link.href = src;
    link.download = title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.mp3';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  if (window.reproductorDivino) {
    window.reproductorDivino.init();
    console.log('[ReproductorSagrado] DOM listo, reproductor inicializado');
    
    // Vincular eventos a los botones de reproducción
    document.querySelectorAll('.btn-play-sagrado').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[ReproductorSagrado] Botón play clickeado');
        window.reproductorDivino.togglePlay(this);
      });
    });
    
    // Vincular eventos a las barras de progreso
    document.querySelectorAll('.progress-bar-container').forEach(function(container) {
      container.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const player = this.closest('.reproductor-sagrado');
        window.reproductorDivino.seek(player, e);
      });
    });
    
    console.log('[ReproductorSagrado] Eventos vinculados a', document.querySelectorAll('.btn-play-sagrado').length, 'botones');
  }
});

// Funciones globales siempre disponibles
window.togglePlaySagrado = function(btn) {
  console.log('[ReproductorSagrado] Toggle play llamado');
  if (window.reproductorDivino) {
    window.reproductorDivino.togglePlay(btn);
  } else {
    console.error('[ReproductorSagrado] reproductorDivino no está definido');
  }
};

window.seekSagrado = function(container, e) {
  if (window.reproductorDivino) {
    const player = container.closest('.reproductor-sagrado');
    window.reproductorDivino.seek(player, e);
  }
};

window.setVolumeSagrado = function(value) {
  if (window.reproductorDivino) {
    window.reproductorDivino.setVolume(value);
  }
};

window.downloadSagrado = function(btn) {
  if (window.reproductorDivino) {
    window.reproductorDivino.download(btn);
  }
};

// Inicializar inmediatamente también por si acaso
(function() {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (window.reproductorDivino && !window.reproductorDivino.audio) {
      window.reproductorDivino.init();
      console.log('[ReproductorSagrado] Inicializado inmediatamente');
    }
  }
})();