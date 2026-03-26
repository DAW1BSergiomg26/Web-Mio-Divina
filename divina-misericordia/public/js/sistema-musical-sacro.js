/**
 * ============================================================
 * SISTEMA DE AMBIENTACIÓN MUSICAL SACRA
 * "Divina Misericordia" - Integra con reproductor existente
 * 
 * Usa los controles visuales ya creados en la página
 * Sin duplicar interfaz - solo lógica de audio
 * ============================================================
 */

(function() {
  'use strict';

  // ============================================================
  // 1. BIBLIOTECA MUSICAL - Clasificación musicológica
  // ============================================================

  const BIBLIOTECA = {
    devocion: [
      { archivo: '00. Ave Maria.mp3', titulo: 'Ave Maria' },
      { archivo: '00. Santa Faustina, Himno Moderno.mp3', titulo: 'Santa Faustina - Himno' },
      { archivo: '04. Sweet Hour of Prayer.mp3', titulo: 'Sweet Hour of Prayer' },
      { archivo: '02. More About Jesus.mp3', titulo: 'More About Jesus' },
      { archivo: '03. I Have Decided to Follow Jesus.mp3', titulo: 'I Have Decided to Follow Jesus' },
      { archivo: '01. Jesus is all the world to me.mp3', titulo: 'Jesus is all the world' },
      { archivo: '00. Jesus Paid It All.mp3', titulo: 'Jesus Paid It All' },
      { archivo: '05. A New Name in Glory - Instrumental.mp3', titulo: 'A New Name in Glory' }
    ],
    reflexion: [
      { archivo: '05. Brandenburg Concerto No. 1 in F Major, BWV 1046_ I.mp3', titulo: 'Brandenburg Concerto No. 1' },
      { archivo: '03. Concierto-de-Branderburgo-n.3-BWV-1048-en-Sol-Mayor-Allegro-moderato.mp3', titulo: 'Brandenburg Concerto No. 3' },
      { archivo: '02. Concierto-de-Branderburgo-n.1-BWV-1046-en-Fa-mayor-Adagio_ok.mp3', titulo: 'Brandenburg Concerto - Adagio' },
      { archivo: '09. J.S. Bach_ J.S. Bach_ Orchestral Suite No. 3 in D Major, BWV 1068_ 2.mp3', titulo: 'Air - Bach' },
      { archivo: '07. Aria de la Suite no. 3 en Re Mayor, BWV 1068.mp3', titulo: 'Aria - Bach' },
      { archivo: '17. Sonata quarta in D Major_ I. Ciaccona.mp3', titulo: 'Ciaccona' }
    ],
    contemplacion: [
      { archivo: '15. Canon in D.mp3', titulo: 'Canon in D - Pachelbel' },
      { archivo: '14. Pachelbel Canon in D.mp3', titulo: 'Canon in D' },
      { archivo: '06. Serse, HWV 40_ Largo _Ombra mai fu.mp3', titulo: 'Largo "Ombra mai fu"' },
      { archivo: '11. Swan Lake, Op. 20a_ I. Scène.mp3', titulo: 'Swan Lake' },
      { archivo: '08. Handel _ Orch. Hale_ Keyboard Suite No. 4 in D Minor, HWV 437_ III. Sarabande.mp3', titulo: 'Sarabande - Handel' },
      { archivo: '19. Concerto 2 in D Major, Op. 7_ I. Adagio.mp3', titulo: 'Adagio - Corelli' },
      { archivo: '00. Violin Sonata No. 3 in C Major, BWV 1005 (Arr. for Piano by Víkingur Ólafsson)_ I. Adagio.mp3', titulo: 'Violin Sonata No. 3' },
      { archivo: '18. Violin Sonata No. 1 in D Minor_ VI. Aria.mp3', titulo: 'Aria - Violin Sonata' },
      { archivo: '23. Concerto Grosso in D Major, Op. 1, No. 5_ III. Largo.mp3', titulo: 'Concerto Grosso - Largo' }
    ],
    gloria: [
      { archivo: '10. Spring (La Primavera) Op.8 No.1 E Major_ Allegro.mp3', titulo: 'La Primavera - Vivaldi' },
      { archivo: '13. The Essence.mp3', titulo: 'The Essence' },
      { archivo: '12. Shades and Shadows.mp3', titulo: 'Shades and Shadows' },
      { archivo: '16. Sonata violino solo representativa in A Major_ III. Allemande.mp3', titulo: 'Allemande' },
      { archivo: '21. Les plaisirs_ Sarabande.mp3', titulo: 'Les plaisirs - Sarabande' },
      { archivo: '22. 5e livre de viole_ Chaconne.mp3', titulo: 'Chaconne' },
      { archivo: '20. Canzona undecima a due canti _detta la plettenberger.mp3', titulo: 'Canzona' }
    ]
  };

  // ============================================================
  // 2. MAPA DE SECCIONES
  // ============================================================

  const MAPA_SECCIONES = {
    'coronilla': { categoria: 'contemplacion', frase: 'Jesús, en Ti confío' },
    'novena': { categoria: 'gloria', frase: '9 días de gracia' },
    'santo-rosario': { categoria: 'contemplacion', frase: 'Santa María, Madre de Dios' },
    'hora-de-la-misericordia': { categoria: 'contemplacion', frase: 'A las 3 de la tarde' },
    'via-crucis': { categoria: 'reflexion', frase: 'Jesús, camino de salvación' },
    'oraciones': { categoria: 'devocion', frase: 'En tu presencia, Señor' },
    'santa-faustina': { categoria: 'devocion', frase: 'Apóstol de la Misericordia' },
    'estudios-biblicos': { categoria: 'reflexion', frase: 'La Palabra de Dios' },
    'maria': { categoria: 'devocion', frase: 'Santa María, Madre de Dios' },
    'virgen-lujan': { categoria: 'devocion', frase: 'Patrona de Argentina' },
    'virgen-caacupe': { categoria: 'devocion', frase: 'Madre del Pueblo Paraguayo' },
    'maria-auxiliadora': { categoria: 'devocion', frase: 'Ayuda de los Cristianos' },
    'devociones-marianas': { categoria: 'devocion', frase: 'María, Madre de la Iglesia' },
    'la-santina': { categoria: 'devocion', frase: 'Virgen del Valle' },
    'oracion-san-antonio': { categoria: 'devocion', frase: 'Encuentra lo perdido' },
    'oracion-san-miguel': { categoria: 'devocion', frase: 'Contra el mal' },
    'oracion-eucharistia': { categoria: 'contemplacion', frase: 'Pan de vida eterna' },
    'oracion-del-estudiante': { categoria: 'reflexion', frase: 'Sabiduría divina' },
    'oracion-santa-cruz': { categoria: 'contemplacion', frase: 'Santa Cruz, esperanza nuestra' },
    'ss-juan-pablo-ii': { categoria: 'devocion', frase: 'Totus Tuus' },
    'ss-francisco': { categoria: 'devocion', frase: ' Misericordia' },
    'ss-benedicto-xvi': { categoria: 'contemplacion', frase: 'Caritas in veritate' },
    'san-jose': { categoria: 'contemplacion', frase: 'Patrón de la Iglesia' },
    'san-jose-dormido': { categoria: 'contemplacion', frase: 'Sueño de San José' },
    'san-cayetano': { categoria: 'gloria', frase: 'Pan de los pobres' },
    'san-benito': { categoria: 'reflexion', frase: 'Padre del monaquismo' },
    'san-francisco': { categoria: 'contemplacion', frase: 'Paz y bien' },
    'san-judas-tadeo': { categoria: 'devocion', frase: 'Apóstol desesperados' },
    'san-sanson': { categoria: 'reflexion', frase: 'Patrón de los estudiantes' },
    'misterios-gozosos': { categoria: 'contemplacion', frase: 'Misterios de dicha' },
    'misterios-dolorosos': { categoria: 'contemplacion', frase: 'Passion de Cristo' },
    'misterios-luminosos': { categoria: 'reflexion', frase: 'Luz de Cristo' },
    'misterios-de-gloria': { categoria: 'gloria', frase: 'Gloria eterna' },
    'musica-sacra': { categoria: 'reflexion', frase: 'Cánticos del cielo' },
    'obras-de-misericordia': { categoria: 'contemplacion', frase: 'Misericordia quiero, no sacrificio' },
    'consagracion': { categoria: 'devocion', frase: 'Todo para Ti' },
    'consagracion-sagrado-corazon': { categoria: 'contemplacion', frase: 'Corazón de Jesús' },
    'espacio-jovenes': { categoria: 'gloria', frase: 'Jóvenes en Cristo' },
    'default': { categoria: 'contemplacion', frase: 'Jesús, en Ti confío' }
  };

  // ============================================================
  // 3. MOTOR DE AUDIO
  // ============================================================

  class SacroAudio {
    constructor() {
      this.audio = null;
      this.isPlaying = false;
      this.currentSection = 'default';
      this.currentCategoria = 'contemplacion';
      this.currentIndex = 0;
      this.volume = 0.5;
      this.fadeInterval = null;
    }

    init() {
      // Cargar volumen
      const savedVolume = localStorage.getItem('sacroVolume');
      if (savedVolume) this.volume = parseFloat(savedVolume);

      this.crearAudio();
      this.detectarSeccion();
      this.configurarNavegacion();
      this.conectarControles();

      console.log('🎵 Sistema de Audio Sacro inicializado');
    }

    crearAudio() {
      // Usar el elemento de audio existente o crear uno nuevo
      this.audio = document.getElementById('sacro-audio-element') || 
                   document.getElementById('divine-audio-element') ||
                   document.getElementById('sp-audio');

      if (!this.audio) {
        this.audio = document.createElement('audio');
        this.audio.id = 'sacro-audio-element';
        this.audio.preload = 'none';
        this.audio.crossOrigin = 'anonymous';
        document.body.appendChild(this.audio);
      }

      this.audio.addEventListener('timeupdate', () => this.actualizarProgreso());
      this.audio.addEventListener('loadedmetadata', () => this.actualizarDuracion());
      this.audio.addEventListener('ended', () => this.siguiente());
    }

    detectarSeccion() {
      const path = window.location.pathname;
      const filename = path.split('/').pop().replace('.html', '') || 'index';
      
      let seccion = 'default';
      for (const key of Object.keys(MAPA_SECCIONES)) {
        if (filename.includes(key) || path.includes(key)) {
          seccion = key;
          break;
        }
      }

      this.cambiarSeccion(seccion);
    }

    cambiarSeccion(seccion) {
      const config = MAPA_SECCIONES[seccion] || MAPA_SECCIONES['default'];
      
      // Solo cambiar si es diferente
      if (config.categoria !== this.currentCategoria || seccion !== this.currentSection) {
        this.currentSection = seccion;
        this.currentCategoria = config.categoria;
        this.currentIndex = 0;
        this.cargarCancion();
        this.actualizarFrase(config.frase);
      }
    }

    cargarCancion() {
      const canciones = BIBLIOTECA[this.currentCategoria];
      if (!canciones || !canciones.length) return;

      const cancion = canciones[this.currentIndex % canciones.length];
      this.audio.src = cancion.archivo;
      
      // Actualizar título en la UI
      const trackName = document.getElementById('sp-track-name') || 
                       document.getElementById('divine-track-name');
      if (trackName) trackName.textContent = cancion.titulo;

      console.log(`🎵 ${cancion.titulo} (${this.currentCategoria})`);
    }

    togglePlay() {
      if (!this.audio.src) {
        this.cargarCancion();
      }

      if (this.isPlaying) {
        this.fadeOut();
      } else {
        this.fadeIn();
      }
    }

    fadeIn() {
      if (!this.audio.src) return;

      this.audio.volume = 0;
      this.audio.play().then(() => {
        this.isPlaying = true;
        
        let vol = 0;
        this.fadeInterval = setInterval(() => {
          if (vol < this.volume) {
            vol += 0.03;
            this.audio.volume = Math.min(vol, this.volume);
          } else {
            clearInterval(this.fadeInterval);
          }
        }, 50);

        this.actualizarUI(true);
      }).catch(err => {
        console.error('Error:', err);
        this.audio.volume = this.volume;
        this.audio.play();
      });
    }

    fadeOut() {
      let vol = this.audio.volume;
      this.fadeInterval = setInterval(() => {
        if (vol > 0) {
          vol -= 0.03;
          this.audio.volume = Math.max(vol, 0);
        } else {
          clearInterval(this.fadeInterval);
          this.audio.pause();
          this.isPlaying = false;
          this.actualizarUI(false);
        }
      }, 50);
    }

    actualizarUI(playing) {
      const playBtn = document.getElementById('sp-play-btn') || 
                      document.getElementById('divine-play-btn');
      if (playBtn) {
        const icon = playBtn.querySelector('.sp-icon, .play-icon, span');
        if (icon) icon.textContent = playing ? '⏸' : '▶';
      }
    }

    siguiente() {
      this.currentIndex++;
      this.cargarCancion();
      this.fadeIn();
    }

    seek(e) {
      const bar = e.target.closest('.sp-progress-bar') || 
                   e.target.closest('.divine-progress-bar');
      if (!bar) return;
      
      const rect = bar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      if (this.audio.duration) {
        this.audio.currentTime = percent * this.audio.duration;
      }
    }

    actualizarProgreso() {
      if (!this.audio.duration) return;
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      
      const fill = document.querySelector('.sp-progress-fill') || 
                   document.querySelector('.divine-progress-fill');
      if (fill) fill.style.width = `${percent}%`;

      const timeEl = document.getElementById('sp-current-time') || 
                     document.getElementById('divine-current-time');
      if (timeEl) timeEl.textContent = this.formatearTiempo(this.audio.currentTime);
    }

    actualizarDuracion() {
      const durEl = document.getElementById('sp-duration') || 
                    document.getElementById('divine-duration');
      if (durEl) durEl.textContent = this.formatearTiempo(this.audio.duration);
    }

    setVolume(valor) {
      this.volume = parseFloat(valor);
      this.audio.volume = this.volume;
      localStorage.setItem('sacroVolume', this.volume);
    }

    formatearTiempo(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    actualizarFrase(frase) {
      const fraseEl = document.querySelector('.sp-frase-text') || 
                      document.querySelector('.divine-spiritual-phrase .phrase-text');
      if (fraseEl) fraseEl.textContent = frase;
    }

    conectarControles() {
      // Play button
      const playBtn = document.getElementById('sp-play-btn') || 
                      document.getElementById('divine-play-btn');
      if (playBtn) {
        playBtn.onclick = () => this.togglePlay();
      }

      // Progress bar
      const progressBar = document.getElementById('sp-progress-bar') || 
                         document.querySelector('.sp-progress-bar');
      if (progressBar) {
        progressBar.onclick = (e) => this.seek(e);
      }

      // Volume
      const volumeSlider = document.getElementById('sp-volume') || 
                           document.getElementById('divine-volume');
      if (volumeSlider) {
        volumeSlider.oninput = (e) => this.setVolume(e.target.value);
        volumeSlider.value = this.volume;
      }

      // Mute button
      const muteBtn = document.getElementById('sp-mute-btn') || 
                      document.getElementById('divine-mute-btn');
      if (muteBtn) {
        muteBtn.onclick = () => {
          if (this.audio.volume > 0) {
            this.audio.volume = 0;
          } else {
            this.audio.volume = this.volume;
          }
        };
      }
    }

    configurarNavegacion() {
      const originalPushState = history.pushState;
      history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(() => this.detectarSeccion?.(), 200);
      }.bind(this);

      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes('.html')) {
          setTimeout(() => this.detectarSeccion(), 300);
        }
      });
    }
  }

  // ============================================================
  // 4. INICIALIZACIÓN
  // ============================================================

  document.addEventListener('DOMContentLoaded', () => {
    window.sacroAudio = new SacroAudio();
    window.sacroAudio.init();
  });

  // Conexión延迟 para asegurar que el DOM esté listo
  setTimeout(() => {
    const audio = window.sacroAudio;
    if (!audio) return;

    // Botón play
    const playBtns = document.querySelectorAll('#sp-play-btn, #divine-play-btn, .sp-play-btn');
    playBtns.forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        audio.togglePlay();
      };
    });

    // Progress bar
    const progressBars = document.querySelectorAll('#sp-progress-bar, .sp-progress-bar');
    progressBars.forEach(bar => {
      bar.onclick = function(e) {
        audio.seek(e);
      };
    });

    // Volume
    const volumes = document.querySelectorAll('#sp-volume, #divine-volume, .sp-volume');
    volumes.forEach(vol => {
      vol.oninput = function() {
        audio.setVolume(this.value);
      };
      vol.value = audio.volume;
    });

    // Mute
    const mutes = document.querySelectorAll('#sp-mute-btn, #divine-mute-btn');
    mutes.forEach(mute => {
      mute.onclick = function() {
        if (audio.audio.volume > 0) {
          audio.audio.volume = 0;
        } else {
          audio.audio.volume = audio.volume;
        }
      };
    });

    // Download
    const downloads = document.querySelectorAll('#sp-download, #divine-download');
    downloads.forEach(dl => {
      dl.onclick = function(e) {
        e.preventDefault();
        if (audio.audio.src) {
          const link = document.createElement('a');
          link.href = audio.audio.src;
          link.download = audio.audio.src.split('/').pop();
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
    });

    console.log('🎵 Controles conectados correctamente');
  }, 1000);

})();