/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    SPIRITUAL PROFILE SYSTEM                     │
 * │              Perfil Espiritual - Persistencia Local             │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * Sistema de perfil espiritual que aprende del comportamiento
 * del usuario y adapta la experiencia en tiempo real.
 * 
 * @version 4.0.0
 * @author Sistema de Personalización Espiritual
 * @license MIT
 */

(function(global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURACIÓN
  // ═══════════════════════════════════════════════════════════════

  const CONFIG = Object.freeze({
    STORAGE_KEY: 'spiritualProfile',
    MIN_TIME_TO_TRACK: 5000,
    SAVE_INTERVAL: 30000,
    DEBOUNCE_TIME: 300,
    MAX_AUDIO_HISTORY: 100,
    MAX_SECTIONS: 20
  });

  // ═══════════════════════════════════════════════════════════════
  // MAPA DE SECCIONES
  // ═══════════════════════════════════════════════════════════════

  const SECTION_MAP = Object.freeze({
    '': 'inicio',
    'index': 'inicio',
    'index.html': 'inicio',
    'divina-misericordia': 'divina-misericordia',
    'divina-misericordia.html': 'divina-misericordia',
    'coronilla': 'coronilla',
    'coronilla.html': 'coronilla',
    'novena': 'novena',
    'novena.html': 'novena',
    'hora-misericordia': 'hora-misericordia',
    'hora-misericordia.html': 'hora-misericordia',
    'rosario': 'rosario',
    'rosario.html': 'rosario',
    'maria': 'maria',
    'maria.html': 'maria',
    'caacupe': 'caacupe',
    'caacupe.html': 'caacupe',
    'lujan': 'lujan',
    'lujan.html': 'lujan',
    'jose': 'jose',
    'jose.html': 'jose',
    'musica': 'musica',
    'musica.html': 'musica',
    'multimedia': 'multimedia',
    'multimedia.html': 'multimedia',
    'oraciones': 'oraciones',
    'oraciones.html': 'oraciones',
    'contacto': 'contacto',
    'contacto.html': 'contacto',
    'blog': 'blog',
    'blog.html': 'blog',
    'donar': 'donar',
    'donar.html': 'donar'
  });

  // ═══════════════════════════════════════════════════════════════
  // ESTADO INICIAL
  // ═══════════════════════════════════════════════════════════════

  function getDefaultState() {
    return Object.freeze({
      visits: Object.create(null),
      timeSpent: Object.create(null),
      audio: Object.create(null),
      interactions: Object.freeze({
        rosary: 0,
        candles: 0,
        prayers: 0,
        intentions: 0
      }),
      lastVisit: null,
      lastSection: null,
      createdAt: Date.now()
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CARGAR / GUARDAR ESTADO
  // ═══════════════════════════════════════════════════════════════

  function loadState() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!stored) return getDefaultState();
      
      const parsed = JSON.parse(stored);
      return validateState(parsed) ? parsed : getDefaultState();
    } catch (e) {
      console.warn('[SpiritualProfile] Error loading state:', e);
      return getDefaultState();
    }
  }

  function validateState(state) {
    return state && 
           typeof state === 'object' && 
           state.visits !== undefined &&
           state.interactions !== undefined;
  }

  let state = loadState();
  let saveTimeout = null;
  let session = {
    currentSection: null,
    sectionStartTime: null,
    isTracking: false
  };

  function saveState() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('[SpiritualProfile] Error saving state:', e);
      }
    }, CONFIG.DEBOUNCE_TIME);
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════════════════════════

  function extractSectionFromPath(path) {
    if (!path) return 'inicio';
    
    const cleanPath = path
      .replace(/^\//, '')
      .replace(/\.html$/, '')
      .toLowerCase();
    
    return SECTION_MAP[cleanPath] || cleanPath;
  }

  function safeGet(obj, path, defaultValue) {
    try {
      const keys = path.split('.');
      let result = obj;
      for (const key of keys) {
        if (result === null || result === undefined) return defaultValue;
        result = result[key];
      }
      return result !== null && result !== undefined ? result : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TRACKING DE EVENTOS
  // ═══════════════════════════════════════════════════════════════

  function detectCurrentSection() {
    const path = window.location.pathname;
    const section = extractSectionFromPath(path);
    
    if (section && section !== session.currentSection) {
      onSectionChange(section);
    }
  }

  function onSectionChange(newSection) {
    if (session.currentSection && session.sectionStartTime) {
      recordTimeSpent(session.currentSection);
    }

    session.currentSection = newSection;
    session.sectionStartTime = Date.now();
    state.lastSection = newSection;
    recordPageView(newSection);
  }

  function recordPageView(section) {
    if (!state.visits[section]) {
      state.visits[section] = 0;
    }
    state.visits[section]++;
    state.lastVisit = new Date().toISOString();
    saveState();
  }

  function recordTimeSpent(section) {
    if (!session.sectionStartTime) return;
    
    const duration = Date.now() - session.sectionStartTime;
    if (duration < CONFIG.MIN_TIME_TO_TRACK) return;
    
    const seconds = Math.floor(duration / 1000);
    
    if (!state.timeSpent[section]) {
      state.timeSpent[section] = 0;
    }
    state.timeSpent[section] += seconds;
    saveState();
  }

  function trackAudioPlay(trackId) {
    if (!trackId) return;
    
    if (!state.audio[trackId]) {
      state.audio[trackId] = 0;
    }
    state.audio[trackId]++;
    
    // Limpiar historial si excede el máximo
    const audioKeys = Object.keys(state.audio);
    if (audioKeys.length > CONFIG.MAX_AUDIO_HISTORY) {
      const sorted = audioKeys
        .map(k => [k, state.audio[k]])
        .sort((a, b) => b[1] - a[1])
        .slice(0, CONFIG.MAX_AUDIO_HISTORY);
      
      state.audio = Object.create(null);
      sorted.forEach(([k, v]) => { state.audio[k] = v; });
    }
    
    saveState();
    generateProfile();
  }

  function trackEvent(type, payload) {
    switch (type) {
      case "page_view":
        state.visits[payload] = (state.visits[payload] || 0) + 1;
        state.lastVisit = payload;
        break;

      case "audio_play":
        state.audio[payload] = (state.audio[payload] || 0) + 1;
        break;

      case "rosary":
        state.interactions.rosary++;
        break;

      case "candle":
        state.interactions.candles++;
        break;

      case "prayer":
        state.interactions.prayers++;
        break;

      case "intention":
        state.interactions.intentions++;
        break;
    }

    saveState();
  }

  // ═══════════════════════════════════════════════════════════════
  // GENERACIÓN DE PERFIL
  // ═══════════════════════════════════════════════════════════════

  let currentProfile = {
    type: 'contemplativo',
    activityLevel: 'medio',
    preferredSections: [],
    preferredAudio: [],
    totalVisits: 0
  };

  function calculateTotalVisits() {
    return Object.values(state.visits).reduce((sum, v) => sum + v, 0);
  }

  function calculateTotalTime() {
    return Object.values(state.timeSpent).reduce((sum, v) => sum + v, 0);
  }

  function calculateTotalAudioPlays() {
    return Object.values(state.audio).reduce((sum, v) => sum + v, 0);
  }

  function calculateProfileType() {
    const visits = Object.keys(state.visits);
    const devocionalSections = ['coronilla', 'rosario', 'novena', 'hora-misericordia'];
    const musicalSections = ['musica', 'multimedia'];
    const contemplativoSections = ['inicio', 'divina-misericordia', 'maria'];
    
    let devocionalScore = 0;
    let musicalScore = 0;
    let contemplativoScore = 0;
    
    visits.forEach(section => {
      if (devocionalSections.includes(section)) {
        devocionalScore += state.visits[section];
      }
      if (musicalSections.includes(section)) {
        musicalScore += state.visits[section];
      }
      if (contemplativoSections.includes(section)) {
        contemplativoScore += state.visits[section];
      }
    });
    
    const audioPlays = calculateTotalAudioPlays();
    musicalScore += audioPlays;
    
    const total = devocionalScore + musicalScore + contemplativoScore;
    if (total === 0) return 'contemplativo';
    
    const devocionalRatio = devocionalScore / total;
    const musicalRatio = musicalScore / total;
    const { rosary, candles, intentions } = state.interactions;
    const devocionalActions = rosary + candles + intentions;
    
    if (devocionalActions > 10 && musicalRatio < 0.3) {
      return 'devocional';
    }
    if (audioPlays > 8 && audioPlays > devocionalActions) {
      return 'musical';
    }
    if (devocionalActions > 3 && audioPlays > 3) {
      return 'mixto';
    }
    
    const avgTimePerVisit = calculateTotalVisits() > 0 
      ? calculateTotalTime() / calculateTotalVisits() 
      : 0;
    
    if (avgTimePerVisit > 120 && devocionalActions < 3) {
      return 'contemplativo';
    }
    
    return 'contemplativo';
  }

  function calculateActivityLevel() {
    const dayMs = 24 * 60 * 60 * 1000;
    const daysActive = state.createdAt 
      ? Math.max(1, Math.floor((Date.now() - state.createdAt) / dayMs)) 
      : 1;
    
    const visits = calculateTotalVisits();
    const time = calculateTotalTime();
    const visitsPerDay = visits / daysActive;
    const timePerDay = time / daysActive;
    
    if (visitsPerDay > 5 || timePerDay > 300) {
      return 'alto';
    }
    if (visitsPerDay > 2 || timePerDay > 60) {
      return 'medio';
    }
    return 'bajo';
  }

  function getTopItems(obj, limit) {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key]) => key);
  }

  function generateProfile() {
    const totalVisits = calculateTotalVisits();
    
    currentProfile = Object.freeze({
      type: calculateProfileType(),
      activityLevel: calculateActivityLevel(),
      preferredSections: Object.freeze(getTopItems(state.visits, 5)),
      preferredAudio: Object.freeze(getTopItems(state.audio, 5)),
      totalVisits: totalVisits
    });
    
    saveState();
    return currentProfile;
  }

  // ═══════════════════════════════════════════════════════════════
  // CONTROL DE SESIÓN
  // ═══════════════════════════════════════════════════════════════

  function startTracking() {
    detectCurrentSection();
    session.isTracking = true;
  }

  function endTracking() {
    if (session.currentSection && session.sectionStartTime) {
      recordTimeSpent(session.currentSection);
    }
    session.isTracking = false;
  }

  function bindEvents() {
    window.addEventListener('beforeunload', endTracking);
    
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        endTracking();
      } else {
        startTracking();
      }
    });
    
    setInterval(detectCurrentSection, 5000);
    
    setInterval(function() {
      if (session.currentSection && session.sectionStartTime) {
        recordTimeSpent(session.currentSection);
      }
    }, CONFIG.SAVE_INTERVAL);
  }

  // ═══════════════════════════════════════════════════════════════
  // API PÚBLICA
  // ═══════════════════════════════════════════════════════════════

  const SpiritualProfile = Object.freeze({
    /**
     * Inicializar el sistema de perfil
     */
    init: function() {
      generateProfile();
      startTracking();
      bindEvents();
      console.log('🧭 Spiritual Profile v4 initialized:', currentProfile.type);
      return this;
    },

    /**
     * Obtener el perfil actual
     * @returns {Object} Perfil con type, activityLevel, preferredSections, preferredAudio, totalVisits
     */
    getProfile: function() {
      return Object.assign({}, currentProfile);
    },

    /**
     * Obtener última sección visitada
     * @returns {string}
     */
    getLastSection: function() {
      return state.lastSection || 'inicio';
    },

    /**
     * Obtener recomendaciones personalizadas
     * @returns {Object} { sections: [], audio: [], actions: [] }
     */
    getRecommendations: function() {
      const type = currentProfile.type;
      const profile = currentProfile;
      
      const sectionNames = {
        'inicio': 'Inicio',
        'divina-misericordia': 'Divina Misericordia',
        'coronilla': 'Coronilla',
        'novena': 'Novena',
        'hora-misericordia': 'Hora de la Misericordia',
        'rosario': 'Santo Rosario',
        'maria': 'María',
        'caacupe': 'Virgen de Caacupé',
        'lujan': 'Virgen de Luján',
        'musica': 'Música Sacra'
      };
      
      const audioByType = {
        contemplativo: ['gregoriano-1', 'silencio-1', 'misericordia-1'],
        devocional: ['coronilla-1', 'rosario-1', 'novena-1'],
        musical: ['maria-1', 'gregoriano-1', 'musica-sacra-1'],
        mixto: ['misericordia-1', 'maria-1', 'rosario-1']
      };
      
      const actionMessages = {
        contemplativo: ['Medita en silencio', 'Lee sobre la Divina Misericordia'],
        devocional: ['Enciende una vela', 'Reza el Rosario'],
        musical: ['Escucha música sacra', 'Explora el catálogo'],
        mixto: ['Explora nuevas devociones', 'Escucha una meditación']
      };
      
      return Object.freeze({
        sections: profile.preferredSections
          .slice(0, 3)
          .map(s => ({ id: s, name: sectionNames[s] || s })),
        audio: (audioByType[type] || audioByType.contemplativo)
          .filter(t => !profile.preferredAudio.includes(t))
          .slice(0, 3),
        actions: actionMessages[type] || actionMessages.contemplativo
      });
    },

    /**
     * Obtener configuración de animaciones
     * @returns {Object}
     */
    getAnimationConfig: function() {
      const configs = {
        contemplativo: { speed: 0.6, particles: 'low', motion: 'reduced' },
        devocional: { speed: 0.8, particles: 'medium', motion: 'normal' },
        musical: { speed: 1.2, particles: 'high', motion: 'normal' },
        mixto: { speed: 1.0, particles: 'medium', motion: 'normal' }
      };
      return configs[currentProfile.type] || configs.contemplativo;
    },

    /**
     * Obtener mensaje contextual según perfil
     * @returns {string}
     */
    getContextualMessage: function() {
      const messages = {
        contemplativo: 'El silencio es oración. ¿Necesitas un momento de paz?',
        devocional: 'La fe se fortalece con la práctica. ¿Quieres rezar?',
        musical: 'La música eleva el alma. ¿Oyes alguna canción?',
        mixto: 'Tu camino espiritual es único. ¿Qué te trae hoy?'
      };
      return messages[currentProfile.type] || messages.contemplativo;
    },

    /**
     * Trackear un evento
     * @param {string} type - Tipo de evento
     * @param {Object} payload - Datos del evento
     */
    trackEvent: function(type, payload) {
      trackEvent(type, payload);
    },

    /**
     * Obtener datos crudos del estado
     * @returns {Object}
     */
    getData: function() {
      return JSON.parse(JSON.stringify(state));
    },

    /**
     * Reiniciar el perfil
     */
    reset: function() {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      state = getDefaultState();
      currentProfile = {
        type: 'contemplativo',
        activityLevel: 'medio',
        preferredSections: [],
        preferredAudio: [],
        totalVisits: 0
      };
      console.log('🧭 Profile reset');
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // EXPONER AL OBJETO GLOBAL
  // ═══════════════════════════════════════════════════════════════

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpiritualProfile;
  } else {
    global.SpiritualProfile = SpiritualProfile;
  }

})(typeof window !== 'undefined' ? window : this);

/**
 * ═══════════════════════════════════════════════════════════════════
 * EJEMPLOS DE INTEGRACIÓN
 * ═══════════════════════════════════════════════════════════════════
 * 
 * // Inicializar (llamar una vez al cargar la página)
 * SpiritualProfile.init();
 * 
 * // Obtener perfil
 * const profile = SpiritualProfile.getProfile();
 * console.log(profile.type); // 'contemplativo' | 'devocional' | 'musical' | 'mixto'
 * console.log(profile.activityLevel); // 'bajo' | 'medio' | 'alto'
 * console.log(profile.preferredSections); // ['maria', 'coronilla', ...]
 * 
 * // Obtener última sección
 * const lastSection = SpiritualProfile.getLastSection();
 * 
 * // Obtener recomendaciones
 * const recs = SpiritualProfile.getRecommendations();
 * console.log(recs.sections); // [{ id: 'maria', name: 'María' }, ...]
 * console.log(recs.audio); // ['gregoriano-1', ...]
 * console.log(recs.actions); // ['Medita en silencio', ...]
 * 
 * // Trackear eventos desde otros módulos
 * SpiritualProfile.trackEvent('audio_play', { trackId: 'ave-maria.mp3' });
 * SpiritualProfile.trackEvent('candle_lit', {});
 * SpiritualProfile.trackEvent('rosary_step', {});
 * SpiritualProfile.trackEvent('intention_shared', {});
 * 
 * // Configurar animaciones según perfil
 * const animConfig = SpiritualProfile.getAnimationConfig();
 * document.documentElement.style.setProperty('--anim-speed', animConfig.speed);
 * document.documentElement.style.setProperty('--particle-density', animConfig.particles);
 */