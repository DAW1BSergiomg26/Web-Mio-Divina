// ============================================================
// REPRODUCTOR MUSICAL DIVINO - Divina Misericordia
// Reproductor sagrado con colores dorados y celestiales
// ============================================================

const reproductorDivino = {
  audio: null,
  currentBtn: null,
  isPlaying: false,
  
  init() {
    this.audio = new Audio();
    this.audio.volume = 0.7;
    
    this.audio.addEventListener('ended', () => {
      this.resetPlayer(this.currentBtn);
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
    const title = player.getAttribute('data-title') || 'Tema Sagrado';
    
    if (!src) return;
    
    if (this.currentBtn && this.currentBtn !== btn) {
      this.resetPlayer(this.currentBtn);
    }
    
    if (this.isPlaying && this.currentBtn === btn) {
      this.audio.pause();
      btn.classList.remove('playing');
      btn.innerHTML = '▶';
      this.isPlaying = false;
    } else {
      this.audio.src = src;
      this.audio.play();
      btn.classList.add('playing');
      btn.innerHTML = '⏸';
      this.currentBtn = btn;
      this.isPlaying = true;
      
      player.classList.add('playing');
    }
  },
  
  resetPlayer(btn) {
    if (!btn) return;
    const player = btn.closest('.reproductor-sagrado');
    btn.classList.remove('playing');
    btn.innerHTML = '▶';
    player.classList.remove('playing');
    player.querySelector('.progress-bar').style.width = '0%';
    player.querySelector('.current-time').textContent = '0:00';
    this.isPlaying = false;
    this.currentBtn = null;
  },
  
  updateProgress() {
    if (!this.currentBtn) return;
    const player = this.currentBtn.closest('.reproductor-sagrado');
    const progress = player.querySelector('.progress-bar');
    const current = player.querySelector('.current-time');
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    progress.style.width = percent + '%';
    current.textContent = this.formatTime(this.audio.currentTime);
  },
  
  updateDuration() {
    if (!this.currentBtn) return;
    const player = this.currentBtn.closest('.reproductor-sagrado');
    const duration = player.querySelector('.duration');
    duration.textContent = this.formatTime(this.audio.duration);
  },
  
  seek(player, e) {
    const progress = player.querySelector('.progress');
    const rect = progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.audio.currentTime = percent * this.audio.duration;
  },
  
  setVolume(value) {
    this.audio.volume = value;
  },
  
  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
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

function seekSagrado(btn, e) {
  reproductorDivino.seek(btn.closest('.reproductor-sagrado'), e);
}

function setVolumeSagrado(value) {
  reproductorDivino.setVolume(value);
}

function downloadSagrado(btn) {
  reproductorDivino.download(btn);
}