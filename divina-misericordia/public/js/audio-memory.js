/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                      AUDIO MEMORY SYSTEM                      │
 * │              Sistema de memoria musical y anti-repetición       │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * BLOQUE A - Historial en localStorage
 * BLOQUE B - Reglas de penalización
 * BLOQUE C - API para integración
 */

const AUDIO_MEMORY_KEY = 'audioMemory';

const CONFIG = {
  maxHistory: 20,
  hardRuleSkip: 5,
  softRuleThreshold: 5,
  timeRuleMinutes: 30,
  decayWeight: 0.8,
  recentBoost: 0.5
};

// ═══════════════════════════════════════════════════════════════════
// BLOQUE A - HISTORIAL (localStorage)
// ═══════════════════════════════════════════════════════════════════

function loadState() {
  try {
    const stored = localStorage.getItem(AUDIO_MEMORY_KEY);
    return stored ? JSON.parse(stored) : {
      history: [],
      counts: {}
    };
  } catch (e) {
    console.error('[AudioMemory] Error al cargar:', e);
    return { history: [], counts: {} };
  }
}

function saveState() {
  try {
    localStorage.setItem(AUDIO_MEMORY_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[AudioMemory] Error al guardar:', e);
  }
}

let state = loadState();

// ═══════════════════════════════════════════════════════════════════
// BLOQUE C - API PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

/**
 * Añadir pista al historial
 * @param {object} track - {file, title, src, reason}
 */
function addToHistory(track) {
  if (!track || !track.file) return;
  
  const entry = {
    file: track.file,
    title: track.title || 'Sin título',
    src: track.src || '',
    reason: track.reason || 'unknown',
    timestamp: Date.now()
  };
  
  // Añadir al inicio del historial
  state.history.unshift(entry);
  
  // Limitar tamaño
  if (state.history.length > CONFIG.maxHistory) {
    state.history = state.history.slice(0, CONFIG.maxHistory);
  }
  
  // Incrementar contador global
  state.counts[track.file] = (state.counts[track.file] || 0) + 1;
  
  saveState();
  
  console.log('[AudioMemory] Añadido:', track.title || track.file, '(total:', state.counts[track.file] + ')');
}

/**
 * Obtener últimas N pistas
 * @param {number} n - Número de pistas
 */
function getRecentTracks(n = 5) {
  return state.history.slice(0, n);
}

/**
 * Obtener IDs de las últimas N pistas (para filtrado)
 * @param {number} limit - Número de IDs a obtener
 */
function getRecentTrackIds(limit = 5) {
  return state.history.slice(0, limit).map(t => t.file);
}

/**
 * Obtener historial completo
 */
function getHistory() {
  return [...state.history];
}

/**
 * Obtener contador de una pista
 * @param {string} file - ID de la pista
 */
function getPlayCount(file) {
  return state.counts[file] || 0;
}

/**
 * Obtener todos los contadores
 */
function getAllCounts() {
  return { ...state.counts };
}

// ═══════════════════════════════════════════════════════════════════
// BLOQUE B - REGLAS DE FILTRADO
// ═══════════════════════════════════════════════════════════════════

/**
 * Filtrar candidatos aplicando reglas anti-repetición
 * @param {array} tracks - Array de pistas candidatas
 * @returns {array} - Pistas filtradas y ordenadas por puntuación
 */
function filterCandidates(tracks) {
  if (!tracks || tracks.length === 0) return [];
  
  // HARD RULE: Excluir últimas 5 canciones
  const recentFiles = getRecentTracks(CONFIG.hardRuleSkip).map(t => t.file);
  
  let filtered = tracks.filter(track => !recentFiles.includes(track.file));
  
  // Si filtering vacío, volver a las originales (regla suave)
  if (filtered.length === 0) {
    filtered = [...tracks];
  }
  
  // Aplicar scoring
  const scored = scoreTracks(filtered);
  
  // Ordenar por puntuación (mayor = mejor)
  scored.sort((a, b) => b._score - a._score);
  
  return scored;
}

/**
 * Calcular puntuación para cada pista
 * @param {array} tracks - Array de pistas
 * @returns {array} - Pistas con propiedad _score
 */
function scoreTracks(tracks) {
  return tracks.map(track => {
    let score = 100;
    
    const playCount = getPlayCount(track.file);
    const timeSinceLast = getTimeSinceLastPlayed(track.file);
    
    // SOFT RULE: Penalizar canciones muy usadas
    if (playCount >= CONFIG.softRuleThreshold) {
      const penalty = (playCount - CONFIG.softRuleThreshold) * 10;
      score -= penalty;
      console.log('[AudioMemory] Penalización por uso:', track.title, '-', penalty, 'puntos');
    }
    
    // TIME RULE: Boost si ha pasado tiempo suficiente
    if (timeSinceLast > CONFIG.timeRuleMinutes * 60 * 1000) {
      score += CONFIG.recentBoost * 10;
    }
    
    // Bonus por variedad (pocas reproducciones = bonus)
    if (playCount === 0) {
      score += 20;
    } else if (playCount === 1) {
      score += 10;
    }
    
    // Guardar score en pista para ordenación
    track._score = Math.max(0, score);
    
    return track;
  });
}

/**
 * Obtener tiempo desde última reproducción
 * @param {string} file - ID de la pista
 * @returns {number} - Milisegundos
 */
function getTimeSinceLastPlayed(file) {
  const entry = state.history.find(t => t.file === file);
  if (!entry) return Infinity;
  return Date.now() - entry.timestamp;
}

/**
 * Verificar si una pista es muy reciente (últimos 10 minutos)
 * @param {string} file - ID de la pista
 * @returns {boolean} - true si es muy reciente
 */
function isTooRecent(file) {
  const entry = state.history.find(t => t.file === file);
  if (!entry) return false;
  
  const TIME_LIMIT = 10 * 60 * 1000; // 10 minutos
  return Date.now() - entry.timestamp < TIME_LIMIT;
}

/**
 * Verificar si una pista puede reproducirse
 * @param {string} file - ID de la pista
 * @param {boolean} force - Forzar reproducción ignorando reglas
 */
function canPlay(file, force = false) {
  if (force) return true;
  
  const recentFiles = getRecentTrackIds(CONFIG.hardRuleSkip);
  
  // HARD RULE
  if (recentFiles.includes(file)) {
    console.log('[AudioMemory] Bloqueado por HARD RULE:', file);
    return false;
  }
  
  // TIME RULE
  const timeSince = getTimeSinceLastPlayed(file);
  if (timeSince < CONFIG.timeRuleMinutes * 60 * 1000 && getPlayCount(file) > 0) {
    console.log('[AudioMemory] Bloqueado por TIME RULE:', file, '(', Math.round(timeSince/60000), 'min)');
    return false;
  }
  
  return true;
}

/**
 * SELECCIÓN FINAL - pickTrack
 * Función principal que combina filtrado y scoring
 * @param {array} tracks - Array de pistas candidatas
 * @returns {object} - Mejor pista seleccionada
 */
function pickTrack(tracks) {
  if (!tracks || tracks.length === 0) return null;
  
  const recentIds = getRecentTrackIds(5);
  
  // Filtrar anti-repetición: excluir últimas 5 Y pistas muy recientes (10 min)
  let filtered = tracks.filter(track => {
    const inRecent = recentIds.includes(track.file);
    const tooRecent = isTooRecent(track.file);
    return !inRecent && !tooRecent;
  });
  
  // Si no quedan pistas, usar las originales
  if (filtered.length === 0) {
    filtered = [...tracks];
  }
  
  // Aplicar scoring
  const scored = scoreTracks(filtered);
  
  // Ordenar por puntuación
  scored.sort((a, b) => b._score - a._score);
  
  return scored[0] || null;
}

// ═══════════════════════════════════════════════════════════════════
// INTEGRACIÓN CON AUDIO-INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════

/**
 * Versión de getNextTrack con memoria
 * @param {object} context - {section, catalog, liturgy}
 * @returns {object} - Pista seleccionada
 */
function getNextTrackWithMemory(context) {
  const { section, catalog, liturgy } = context;
  
  // Obtener candidatos normales
  let candidates = getCandidates(context);
  
  if (candidates.length === 0) {
    return getFallbackTrack(catalog);
  }
  
  // Aplicar filtro de memoria
  candidates = filterCandidates(candidates);
  
  // Seleccionar mejor puntuación
  const selected = candidates[0];
  
  if (selected) {
    // Añadir al historial
    addToHistory(selected);
    
    return {
      ...selected,
      reason: selected.reason + '_memory'
    };
  }
  
  return getFallbackTrack(catalog);
}

/**
 * Obtener candidatos usando lógica de audio-intelligence
 * (Simula las funciones de audio-intelligence.js)
 */
function getCandidates(context) {
  const { section, catalog, liturgy } = context;
  let candidates = [];
  
  // 1. Litúrgico
  if (liturgy && liturgy.season) {
    const liturgical = catalog.filter(t => 
      t.tags && t.tags.includes(liturgy.season)
    );
    if (liturgical.length > 0) {
      candidates = [...candidates, ...liturgical.map(t => ({...t, reason: 'liturgical'}))];
    }
  }
  
  // 2. Sección
  if (section) {
    const sectionTracks = catalog.filter(t => 
      t.sections && t.sections.includes(section)
    );
    if (sectionTracks.length > 0) {
      candidates = [...candidates, ...sectionTracks.map(t => ({...t, reason: 'section'}))];
    }
  }
  
  // 3. Perfil espiritual
  if (window.getProfile) {
    const profile = window.getProfile();
    if (profile && profile.preferredAudio) {
      const profileTracks = catalog.filter(t => 
        profile.preferredAudio.includes(t.file)
      );
      if (profileTracks.length > 0) {
        candidates = [...candidates, ...profileTracks.map(t => ({...t, reason: 'profile'}))];
      }
    }
  }
  
  // Si no hay candidatos, usar catálogo completo
  if (candidates.length === 0) {
    candidates = catalog.map(t => ({...t, reason: 'fallback'}));
  }
  
  return candidates;
}

/**
 * Pista fallback
 */
function getFallbackTrack(catalog) {
  const track = catalog && catalog.length > 0 
    ? catalog[Math.floor(Math.random() * catalog.length)]
    : { file: 'gregoriano-1', title: 'Gregoriano Contemplativo', src: '/mp3/gregoriano-1.mp3', reason: 'fallback' };
  
  addToHistory(track);
  return track;
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTAR API
// ═══════════════════════════════════════════════════════════════════

window.AudioMemory = {
  addToHistory,
  getRecentTracks,
  getRecentTrackIds,
  getHistory,
  getPlayCount,
  getAllCounts,
  filterCandidates,
  scoreTracks,
  canPlay,
  isTooRecent,
  getTimeSinceLastPlayed,
  pickTrack,
  getNextTrackWithMemory,
  getState: () => ({ ...state }),
  clearHistory: () => {
    state = { history: [], counts: {} };
    saveState();
    console.log('[AudioMemory] Historial limpiado');
  }
};

// Alias para compatibilidad
window.addToHistory = addToHistory;
window.getRecentTracks = getRecentTracks;
window.getRecentTrackIds = getRecentTrackIds;
window.filterCandidates = filterCandidates;
window.scoreTracks = scoreTracks;
window.canPlay = canPlay;
window.isTooRecent = isTooRecent;
window.getTimeSinceLastPlayed = getTimeSinceLastPlayed;
window.pickTrack = pickTrack;

// ═══════════════════════════════════════════════════════════════════
// EJEMPLOS DE USO
// ═══════════════════════════════════════════════════════════════════
// 
// // Añadir pista reproducida
// AudioMemory.addToHistory({ file: 'ave-maria-1', title: 'Ave María', src: '/mp3/...' });
//
// // Ver últimas 5
// const recent = AudioMemory.getRecentTracks(5);
//
// // Verificar si puede reproducirse
// if (AudioMemory.canPlay('ave-maria-1')) {
//   player.play();
// }
//
// // Filtrar candidatos con anti-repetición
// const candidates = AudioMemory.filterCandidates(audioCatalog);
// const best = candidates[0];
//
// // Estado actual
// console.log(AudioMemory.getState());
//
// // Limpiar historial
// AudioMemory.clearHistory();