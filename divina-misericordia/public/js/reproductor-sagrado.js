// ============================================================
// REPRODUCTOR MUSICAL DIVINO - Divina Misericordia
// Reproductor sagrado con colores dorados y celestiales
// ============================================================

const reproductorDivino = {
  audio: null,
  currentBtn: null,
  currentPlayer: null,
  isPlaying: false,
  
  init() {
    this.audio = new Audio();
    this.audio.volume = 0.7;
    
    this.audio.addEventListener('ended', () => {
      this.onTrackEnded();
    });
    
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateDuration();
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

document.addEventListener('DOMContentLoaded', () => {
  reproductorDivino.init();
});

function togglePlaySagrado(btn) {
  reproductorDivino.togglePlay(btn);
}

function seekSagrado(container, e) {
  const player = container.closest('.reproductor-sagrado');
  reproductorDivino.seek(player, e);
}

function setVolumeSagrado(value) {
  reproductorDivino.setVolume(value);
}

function downloadSagrado(btn) {
  reproductorDivino.download(btn);
}