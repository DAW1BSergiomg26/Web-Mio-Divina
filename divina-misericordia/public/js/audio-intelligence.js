/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    AUDIO INTELLIGENCE SYSTEM                   │
 * │          Sistema inteligente de recomendación musical            │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * Motor de decisión que selecciona pistas según:
 * 1. Fiesta litúrgica (prioridad máxima)
 * 2. Sección actual
 * 3. Perfil del usuario
 * 4. Aleatorio ponderado
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURACIÓN
  // ═══════════════════════════════════════════════════════════════

  const AUDIO_INTEL = {
    config: {
      STORAGE_KEY: 'audio_intel_cache',
      CACHE_DURATION: 3600000,
      DEFAULT_TRACK: 'gregoriano-1',
      TRANSITION_FADE: 1500
    },

    // Categorías por sección
    sectionCategories: {
      'inicio': ['contemplativo', 'gregoriano'],
      'divina-misericordia': ['misericordia', 'contemplativo'],
      'coronilla': ['coronilla', 'misericordia'],
      'novena': ['novena', 'oracion'],
      'hora-misericordia': ['misericordia', 'oracion'],
      'rosario': ['rosario', 'mariano'],
      'maria': ['mariano', 'gregoriano'],
      'caacupe': ['mariano', 'regional'],
      'lujan': ['mariano', 'regional'],
      'jose': ['mariano', 'oracion'],
      'musica': ['gregoriano', 'clasica'],
      'multimedia': ['clasica', 'gregoriano'],
      'oraciones': ['oracion', 'contemplativo'],
      'blog': ['lectura', 'contemplativo'],
      'contacto': [],
      'donar': []
    },

    // Categorías por tiempo litúrgico
    liturgicalCategories: {
      'adviento': ['adviento', 'contemplativo', 'espera'],
      'navidad': ['navidad', 'alegre', 'pascual'],
      'cuaresma': ['cuaresma', 'penitencial', 'reflexion'],
      'semana_santa': ['pasion', 'penitencial', 'duelo'],
      'pascua': ['pascual', 'alegre', 'aleluya'],
      'tiempo_ordinario': ['gregoriano', 'contemplativo'],
      'pentecostes': ['pentecostes', 'espiritu'],
      'festejo': ['alegre', 'celebracion']
    },

    // Tracks por categoría
    categoryTracks: {
      'gregoriano': ['gregoriano-1', 'gregoriano-2', 'gregoriano-3', 'gregoriano-4', 'gregoriano-5'],
      'contemplativo': ['silencio-1', 'contemplativo-1', 'misericordia-1'],
      'misericordia': ['misericordia-1', 'misericordia-2', 'coronilla-1'],
      'coronilla': ['coronilla-1', 'coronilla-2', 'coronilla-3'],
      'rosario': ['rosario-1', 'rosario-2', 'rosario-misterios'],
      'mariano': ['ave-maria-1', 'salve-1', 'magnificat-1'],
      'oracion': ['oracion-1', 'oracion-2', 'padre-nuestro-1'],
      'adviento': ['adviento-1', 'adviento-2', 'espera-1'],
      'navidad': ['navidad-1', 'navidad-2', 'pascua-nazul'],
      'cuaresma': ['cuaresma-1', 'cuaresma-2', 'reflexion-1'],
      'semana_santa': ['pasion-1', 'pasion-2', 'viacrucis-1'],
      'pascual': ['pascual-1', 'aleluya-1', 'resurreccion-1'],
      'penitencial': ['penitencial-1', 'santo-1', 'miserere-1'],
      'alegre': ['alegre-1', 'celebracion-1', 'fiesta-1'],
      'clasica': ['clasica-1', 'clasica-2', 'mozart-1', 'bach-1']
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ESTADO
  // ═══════════════════════════════════════════════════════════════

  let state = {
    currentSection: 'inicio',
    lastPlayed: [],
    recommendationHistory: [],
    cache: null
  };

  // ═══════════════════════════════════════════════════════════════
  // FUNCIONES PRINCIPALES
  // ═══════════════════════════════════════════════════════════════

  function getLiturgicalCategories() {
    try {
      if (typeof LiturgicalClock !== 'undefined' && LiturgicalClock.getLiturgicalTime) {
        const time = LiturgicalClock.getLiturgicalTime();
        return AUDIO_INTEL.liturgicalCategories[time] || [];
      }
    } catch (e) {
      console.warn('[AudioIntel] Error getting liturgical time:', e);
    }
    return [];
  }

  function getSectionCategories() {
    return AUDIO_INTEL.sectionCategories[state.currentSection] || ['gregoriano'];
  }

  function getProfileCategories() {
    try {
      const profile = window.SpiritualProfile?.getProfile() || window.getProfile?.();
      if (!profile) return [];
      
      const typeToCategories = {
        'contemplativo': ['contemplativo', 'silencio'],
        'devocional': ['misericordia', 'coronilla', 'rosario'],
        'musical': ['gregoriano', 'clasica', 'mariano'],
        'mixto': ['contemplativo', 'mariano', 'gregoriano']
      };
      
      return typeToCategories[profile.type] || [];
    } catch (e) {
      return [];
    }
  }

  function getTodayFeastCategory() {
    try {
      if (typeof LiturgicalWidgets !== 'undefined' && LiturgicalWidgets.getTodayFeast) {
        const feast = LiturgicalWidgets.getTodayFeast();
        if (feast) {
          const typeToCategory = {
            'solemnidad': ['alegre', 'festejo'],
            'fiesta': ['alegre', 'celebracion'],
            'memoria': ['contemplativo', 'oracion']
          };
          return typeToCategory[feast.type] || [];
        }
      }
    } catch (e) {}
    return [];
  }

  function mergeCategories(feastCats, sectionCats, profileCats) {
    const weights = {
      feast: 3,
      section: 2,
      profile: 1
    };
    
    const categoryCount = {};
    
    feastCats.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + weights.feast;
    });
    
    sectionCats.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + weights.section;
    });
    
    profileCats.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + weights.profile;
    });
    
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }

  function getTracksForCategory(category) {
    return AUDIO_INTEL.categoryTracks[category] || [];
  }

  function filterPlayedTracks(tracks) {
    const recentlyPlayed = state.lastPlayed.slice(0, 5);
    return tracks.filter(t => !recentlyPlayed.includes(t));
  }

  function selectTrack(categories) {
    const allTracks = [];
    
    categories.forEach(cat => {
      const tracks = getTracksForCategory(cat);
      const available = filterPlayedTracks(tracks);
      allTracks.push(...available);
    });
    
    if (allTracks.length === 0) {
      categories.forEach(cat => {
        allTracks.push(...(AUDIO_INTEL.categoryTracks[cat] || []));
      });
    }
    
    if (allTracks.length === 0) {
      return AUDIO_INTEL.config.DEFAULT_TRACK;
    }
    
    const randomIndex = Math.floor(Math.random() * allTracks.length);
    return allTracks[randomIndex];
  }

  function getRecommendations(count = 3) {
    const feastCats = getTodayFeastCategory();
    const sectionCats = getSectionCategories();
    const profileCats = getProfileCategories();
    
    const prioritizedCategories = mergeCategories(feastCats, sectionCats, profileCats);
    
    const recommendations = [];
    const usedCategories = new Set();
    
    for (let i = 0; i < count && i < prioritizedCategories.length; i++) {
      const cat = prioritizedCategories[i];
      if (usedCategories.has(cat)) continue;
      
      const tracks = filterPlayedTracks(getTracksForCategory(cat));
      if (tracks.length > 0) {
        recommendations.push(tracks[Math.floor(Math.random() * tracks.length)]);
        usedCategories.add(cat);
      }
    }
    
    while (recommendations.length < count) {
      recommendations.push(AUDIO_INTEL.config.DEFAULT_TRACK);
    }
    
    return recommendations;
  }

  function getCurrentRecommendation() {
    const recommendations = getRecommendations(1);
    return recommendations[0] || AUDIO_INTEL.config.DEFAULT_TRACK;
  }

  function setCurrentSection(section) {
    state.currentSection = section;
  }

  function trackPlayed(trackId) {
    state.lastPlayed.push(trackId);
    if (state.lastPlayed.length > 20) {
      state.lastPlayed = state.lastPlayed.slice(-20);
    }
    
    state.recommendationHistory.push({
      track: trackId,
      section: state.currentSection,
      at: Date.now()
    });
    
    if (state.recommendationHistory.length > 50) {
      state.recommendationHistory = state.recommendationHistory.slice(-50);
    }
  }

  function getAdaptiveSettings() {
    const profile = (window.SpiritualProfile?.getProfile || window.getProfile)?.() || {};
    
    const settings = {
      volume: 0.7,
      fadeDuration: AUDIO_INTEL.config.TRANSITION_FADE,
      autoPlay: true,
      loop: false
    };
    
    if (profile.type === 'contemplativo') {
      settings.volume = 0.5;
      settings.fadeDuration = 3000;
    } else if (profile.type === 'musical') {
      settings.volume = 0.8;
      settings.fadeDuration = 1000;
    }
    
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 6) {
      settings.volume = Math.min(settings.volume, 0.5);
    }
    
    return settings;
  }

  function generateSmartPlaylist(options = {}) {
    const { length = 10, shuffle = true } = options;
    
    const feastCats = getTodayFeastCategory();
    const sectionCats = getSectionCategories();
    const profileCats = getProfileCategories();
    const prioritizedCategories = mergeCategories(feastCats, sectionCats, profileCats);
    
    const playlist = [];
    const usedCategories = new Set();
    
    while (playlist.length < length) {
      for (const cat of prioritizedCategories) {
        if (playlist.length >= length) break;
        
        const tracks = filterPlayedTracks(getTracksForCategory(cat));
        if (tracks.length > 0) {
          const track = tracks[Math.floor(Math.random() * tracks.length)];
          playlist.push(track);
        }
      }
      
      if (playlist.length < length) {
        prioritizedCategories.forEach(cat => {
          if (playlist.length >= length) return;
          const tracks = AUDIO_INTEL.categoryTracks[cat] || [];
          tracks.forEach(t => {
            if (playlist.length >= length) return;
            if (!playlist.includes(t)) {
              playlist.push(t);
            }
          });
        });
      }
      
      if (playlist.length === 0) {
        playlist.push(AUDIO_INTEL.config.DEFAULT_TRACK);
        break;
      }
    }
    
    if (shuffle) {
      for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
      }
    }
    
    return playlist;
  }

  // ═══════════════════════════════════════════════════════════════
  // API PÚBLICA
  // ═══════════════════════════════════════════════════════════════

  const AudioIntelligence = Object.freeze({
    /**
     * Obtener recomendación actual (1 pista)
     */
    getCurrentRecommendation: function() {
      return getCurrentRecommendation();
    },

    /**
     * Obtener lista de recomendaciones
     * @param {number} count - Número de recomendaciones
     */
    getRecommendations: function(count) {
      return getRecommendations(count);
    },

    /**
     * Establecer sección actual
     * @param {string} section - Nombre de la sección
     */
    setCurrentSection: function(section) {
      setCurrentSection(section);
    },

    /**
     * Registrar reproducción de pista
     * @param {string} trackId - ID de la pista
     */
    trackPlayed: function(trackId) {
      trackPlayed(trackId);
    },

    /**
     * Obtener configuración adaptativa
     */
    getAdaptiveSettings: function() {
      return getAdaptiveSettings();
    },

    /**
     * Generar playlist inteligente
     * @param {Object} options - Opciones { length, shuffle }
     */
    generateSmartPlaylist: function(options) {
      return generateSmartPlaylist(options);
    },

    /**
     * Obtener categorías actuales
     */
    getCurrentCategories: function() {
      return {
        liturgical: getLiturgicalCategories(),
        section: getSectionCategories(),
        profile: getProfileCategories(),
        feast: getTodayFeastCategory()
      };
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // EXPONER
  // ═══════════════════════════════════════════════════════════════

  window.AudioIntelligence = AudioIntelligence;
  console.log('🎵 Audio Intelligence loaded');

})();

/**
 * ═══════════════════════════════════════════════════════════════════
 * EJEMPLOS DE USO
 * ═══════════════════════════════════════════════════════════════════
 * 
 * // Obtener recomendación actual
 * const track = AudioIntelligence.getCurrentRecommendation();
 * console.log(track); // 'gregoriano-1'
 * 
 * // Obtener 3 recomendaciones
 * const recs = AudioIntelligence.getRecommendations(3);
 * console.log(recs); // ['gregoriano-1', 'misericordia-1', 'rosario-1']
 * 
 * // Establecer sección actual
 * AudioIntelligence.setCurrentSection('maria');
 * 
 * // Después de reproducir
 * AudioIntelligence.trackPlayed('gregoriano-1');
 * 
 * // Obtener configuración adaptativa
 * const settings = AudioIntelligence.getAdaptiveSettings();
 * // { volume: 0.7, fadeDuration: 1500, autoPlay: true }
 * 
 * // Generar playlist inteligente
 * const playlist = AudioIntelligence.generateSmartPlaylist({ length: 10, shuffle: true });
 * 
 * // Ver categorías actuales
 * const cats = AudioIntelligence.getCurrentCategories();
 * // { liturgical: ['pascual'], section: ['mariano'], profile: ['contemplativo'], feast: [] }
 */