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
  let startTime = Date.now();
  let currentSection = "inicio";

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

  function startTracking(section) {
    currentSection = section;
    startTime = Date.now();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      const time = Math.floor((Date.now() - startTime) / 1000);
      state.timeSpent[currentSection] =
        (state.timeSpent[currentSection] || 0) + time;
      saveState();
    }
  });

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
    
    if (section && section !== currentSection) {
      onSectionChange(section);
    }
  }

  function onSectionChange(newSection) {
    if (currentSection && startTime) {
      const duration = Date.now() - startTime;
      if (duration >= CONFIG.MIN_TIME_TO_TRACK) {
        const seconds = Math.floor(duration / 1000);
        state.timeSpent[currentSection] = (state.timeSpent[currentSection] || 0) + seconds;
      }
    }

    currentSection = newSection;
    startTime = Date.now();
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

  function getTop(obj, limit = 3) {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key]) => key);
  }

  function generateProfile() {
    const totalTime = Object.values(state.timeSpent).reduce((a, b) => a + b, 0);
    const totalAudio = Object.values(state.audio).reduce((a, b) => a + b, 0);
    const { rosary, candles } = state.interactions;

    let type = "mixto";

    if (totalAudio > rosary + candles) type = "musical";
    else if (rosary + candles > totalAudio) type = "devocional";
    else if (totalTime > 600 && totalAudio < 3) type = "contemplativo";

    currentProfile = Object.freeze({
      type,
      preferredSections: getTop(state.visits, 3),
      preferredAudio: getTop(state.audio, 3),
      activityLevel: totalTime > 1000 ? "alto" : totalTime > 300 ? "medio" : "bajo"
    });

    saveState();
    return currentProfile;
  }

  function getProfile() {
    return generateProfile();
  }

  // ═══════════════════════════════════════════════════════════════
  // CONTROL DE SESIÓN
  // ═══════════════════════════════════════════════════════════════

  function startTrackingFn() {
    detectCurrentSection();
  }

  function endTracking() {
    if (currentSection && startTime) {
      const duration = Date.now() - startTime;
      if (duration >= CONFIG.MIN_TIME_TO_TRACK) {
        const seconds = Math.floor(duration / 1000);
        state.timeSpent[currentSection] = (state.timeSpent[currentSection] || 0) + seconds;
        saveState();
      }
    }
  }

  function bindEvents() {
    window.addEventListener('beforeunload', endTracking);
    
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        endTracking();
      } else {
        startTrackingFn();
      }
    });
    
    setInterval(detectCurrentSection, 5000);
    
    setInterval(function() {
      if (currentSection && startTime) {
        const duration = Date.now() - startTime;
        if (duration >= CONFIG.MIN_TIME_TO_TRACK) {
          const seconds = Math.floor(duration / 1000);
          state.timeSpent[currentSection] = (state.timeSpent[currentSection] || 0) + seconds;
          saveState();
        }
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