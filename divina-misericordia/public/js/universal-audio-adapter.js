/**
 * Universal Audio Adapter - Convierte reproductores antiguos al sistema unificado
 * Esto permite que todas las páginas usen el mismo reproductor premium
 */

(function() {
  'use strict';
  
  console.log('[UniversalAudioAdapter] Iniciando...');
  
  // Esperar a que el DOM esté listo
  function init() {
    // Buscar todos los reproductores antiguos
    const oldPlayers = document.querySelectorAll('.reproductor-sagrado');
    
    if (oldPlayers.length === 0) {
      console.log('[UniversalAudioAdapter] No hay reproductores antiguos');
      return;
    }
    
    console.log('[UniversalAudioAdapter] Encontrados', oldPlayers.length, 'reproductores');
    
    // Obtener sección actual del nombre de la página
    const currentSection = getCurrentSection();
    console.log('[UniversalAudioAdapter] Sección actual:', currentSection);
    
    // Obtener pistas de esta sección
    let tracks = [];
    if (typeof AudioCatalog !== 'undefined') {
      tracks = AudioCatalog.getTrackBySection(currentSection);
    }
    
    // Si no hay pistas específicas, usar las de los reproductores antiguos
    if (tracks.length === 0) {
      tracks = extractTracksFromOldPlayers(oldPlayers);
    }
    
    // Si hay pistas, inicializar el reproductor unificado
    if (tracks.length > 0) {
      initUnifiedPlayer(tracks, oldPlayers);
    }
  }
  
  function getCurrentSection() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    
    // Mapeo de páginas a secciones
    const sectionMap = {
      'index': 'index',
      'musica-sacra': 'musica-sacra',
      'via-crucis': 'via-crucis',
      'santo-rosario': 'santo-rosario',
      'santa-faustina': 'santa-faustina',
      'quienes-somos': 'quienes-somos',
      'novena': 'novena',
      'hora-de-la-misericordia': 'hora-de-la-misericordia',
      'estudios-biblicos': 'estudios-biblicos',
      'coronilla': 'coronilla',
      'maria': 'maria',
      'virgen-lujan': 'virgen-lujan',
      'virgen-caacupe': 'virgen-caacupe',
      'san-jose': 'san-jose',
      'san-francisco': 'san-francisco',
      'oraciones': 'oraciones',
      'consagracion': 'consagracion',
      'noticias': 'noticias',
      'galeria': 'galeria',
      'espacio-jovenes': 'espacio-jovenes'
    };
    
    return sectionMap[page] || page;
  }
  
  function extractTracksFromOldPlayers(players) {
    const tracks = [];
    players.forEach((player, index) => {
      const src = player.dataset.src;
      const title = player.dataset.title || 'Pista ' + (index + 1);
      
      if (src) {
        // Extraer nombre del artista del título o usar默认值
        let artist = 'Artista';
        if (title.includes('Bach')) artist = 'J.S. Bach';
        else if (title.includes('Handel')) artist = 'G.F. Handel';
        else if (title.includes('Vivaldi')) artist = 'A. Vivaldi';
        else if (title.includes('Pachelbel')) artist = 'Pachelbel';
        else if (title.includes('Gladiator')) artist = 'Hans Zimmer';
        else if (title.includes('Braveheart')) artist = 'James Horner';
        
        tracks.push({
          title: title,
          artist: artist,
          src: src,
          tempo: 'moderada',
          caracter: 'sagrado',
          instrumentacion: 'orquestal',
          sections: [getCurrentSection()]
        });
      }
    });
    return tracks;
  }
  
  function initUnifiedPlayer(tracks, oldPlayers) {
    // Crear estructura de biblioteca para el reproductor
    const library = [{
      category: '🎵 Reproducciones',
      icon: '🎵',
      tracks: tracks.map(t => ({
        ...t,
        src: 'mp3/' + t.src.split('/').pop()
      }))
    }];
    
    console.log('[UniversalAudioAdapter] Inicializando reproductor con', tracks.length, 'pistas');
    
    // Ocultar reproductores antiguos
    oldPlayers.forEach(p => {
      p.style.display = 'none';
    });
    
    // Verificar si ya existe el reproductor
    if (!window.AudioPlayerPremium.instance) {
      // Crear contenedor para las pistas
      const trackContainer = createTrackContainer(library);
      
      // Insertar después del primer player o al final del body
      const firstPlayer = document.querySelector('.reproductor-sagrado, .section-music');
      if (firstPlayer) {
        firstPlayer.parentNode.insertBefore(trackContainer, firstPlayer.nextSibling);
      }
      
      // Inicializar reproductor después de un pequeño delay
      setTimeout(() => {
        if (typeof AudioPlayerPremium !== 'undefined') {
          window.AudioPlayerPremium.init(library, {
            defaultVolume: 0.7,
            fadeDuration: 1500,
            autoPlay: false
          });
          console.log('[UniversalAudioAdapter] Reproductor inicializado');
        }
      }, 100);
    }
  }
  
  function createTrackContainer(library) {
    const container = document.createElement('div');
    container.className = 'unified-player-tracks';
    container.innerHTML = `
      <style>
        .unified-player-tracks {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .unified-tracks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }
        .track-card {
          background: rgba(10, 22, 40, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .track-card:hover {
          background: rgba(20, 35, 60, 0.9);
          border-color: var(--gold);
          transform: translateY(-2px);
        }
        .track-card.playing {
          border-color: var(--gold);
          background: rgba(212, 175, 55, 0.15);
        }
        .track-card-title {
          color: var(--gold);
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          margin-bottom: 5px;
        }
        .track-card-artist {
          color: rgba(250, 247, 240, 0.7);
          font-size: 0.85rem;
        }
        .track-play-icon {
          float: right;
          font-size: 1.5rem;
          color: var(--gold);
        }
      </style>
      <h3 style="color: var(--gold); font-family: 'Cinzel', serif; text-align: center;">
        🎵 Selecciona una pista para reproducir
      </h3>
      <div class="unified-tracks-grid">
        ${library[0].tracks.map((track, idx) => `
          <div class="track-card" data-category="0" data-track="${idx}" onclick="playUnifiedTrack(${idx})">
            <span class="track-play-icon">▶</span>
            <div class="track-card-title">${track.title}</div>
            <div class="track-card-artist">${track.artist}</div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Agregar función global para reproducir
    window.playUnifiedTrack = function(idx) {
      if (window.AudioPlayerPremium.instance) {
        const track = library[0].tracks[idx];
        window.AudioPlayerPremium.instance.loadTrack(track, 0, true);
        
        // Actualizar UI
        document.querySelectorAll('.track-card').forEach((c, i) => {
          c.classList.toggle('playing', i === idx);
        });
      }
    };
    
    return container;
  }
  
  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Ya cargado, iniciar después de un pequeño delay para asegurar que audio-player.js esté cargado
    setTimeout(init, 200);
  }
  
})();
