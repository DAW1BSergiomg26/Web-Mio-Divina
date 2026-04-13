/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    AUDIO INTELLIGENCE SYSTEM                   │
 * │              Sistema inteligente de recomendación musical        │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * Implementación paso a paso según especificación
 */

import { getProfile } from "./spiritual-profile.js";

// ═══════════════════════════════════════════════════════════════════
// INTEGRACIÓN CON SISTEMA LITÚRGICO
// ═══════════════════════════════════════════════════════════════════

let liturgicalModule = null;
let feastDaysModule = null;

function loadLiturgicalModules() {
  try {
    if (window.LiturgicalCalendar && window.LiturgicalCalendar.getCurrentLiturgicalTime) {
      liturgicalModule = window.LiturgicalCalendar;
      console.log('[AudioIntelligence] LiturgicalCalendar cargado');
    }
    if (window.FEAST_DAYS) {
      feastDaysModule = window.FEAST_DAYS;
      console.log('[AudioIntelligence] FEAST_DAYS cargado');
    }
  } catch(e) {
    console.log('[AudioIntelligence] Módulos litúrgicos no disponibles');
  }
}

loadLiturgicalModules();

/**
 * Obtener contexto litúrgico actual
 */
function getLiturgicalContext() {
  const today = new Date();
  let liturgy = null;
  let feast = null;

  if (liturgicalModule && liturgicalModule.getCurrentLiturgicalTime) {
    liturgy = liturgicalModule.getCurrentLiturgicalTime(today);
  }

  if (feastDaysModule) {
    feast = feastDaysModule.find(f =>
      f.day === today.getDate() &&
      f.month === today.getMonth() + 1
    );
  }

  return { liturgy, feast };
}

/**
 * Buscar pista para fiesta del día (TOP PRIORIDAD)
 */
function findFeastTrack(catalog, feast) {
  if (!feast || !catalog) return null;

  const track = catalog.find(track =>
    track.tags?.includes(feast.category) ||
    track.tags?.includes("solemnidad") ||
    track.tags?.includes(feast.name?.toLowerCase())
  );

  if (track) {
    return {
      ...track,
      reason: "feast",
      label: `Hoy celebramos ${feast.name}`
    };
  }

  return null;
}

/**
 * Buscar pistas por tiempo litúrgico
 */
function findLiturgicalTracks(catalog, liturgy) {
  if (!liturgy || !catalog || !liturgy.season) return [];

  return catalog.filter(track =>
    track.tags?.includes(liturgy.season)
  );
}

// ═══════════════════════════════════════════════════════════════════
// INTEGRACIÓN CON AUDIO-MEMORY
// ═══════════════════════════════════════════════════════════════════

let audioMemory = null;

function loadAudioMemory() {
  try {
    if (window.AudioMemory) {
      audioMemory = window.AudioMemory;
      console.log('[AudioIntelligence] AudioMemory cargado');
    }
  } catch(e) {
    console.log('[AudioIntelligence] AudioMemory no disponible');
  }
}

loadAudioMemory();

// ═══════════════════════════════════════════════════════════════════
// ESTADO
// ═══════════════════════════════════════════════════════════════════

let state = {
  currentSection: 'inicio',
  lastPlayed: [],
  lastReason: null
};

// ═══════════════════════════════════════════════════════════════════
// GETNEXTTRACK - FUNCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

export function getNextTrack({ section, catalog, liturgy, useMemory = true }) {
  const profile = getProfile();

  // Obtener contexto litúrgico
  const { liturgy: autoLiturgy, feast } = getLiturgicalContext();
  const effectiveLiturgy = liturgy || autoLiturgy;

  // Actualizar sección actual
  if (section) {
    state.currentSection = section;
  }

  let candidates = [];
  
  // 1. FIESTA DEL DÍA (TOP PRIORIDAD)
  const feastTrack = findFeastTrack(catalog, feast);
  if (feastTrack) {
    trackPlayed(feastTrack.file, feastTrack.reason);
    return feastTrack;
  }

  // 2. TIEMPO LITÚRGICO
  const liturgicalTracks = findLiturgicalTracks(catalog, effectiveLiturgy);
  if (liturgicalTracks.length > 0) {
    // Usar pickTrack para seleccionar con anti-repetición
    const selected = audioMemory && audioMemory.pickTrack 
      ? audioMemory.pickTrack(liturgicalTracks)
      : liturgicalTracks[Math.floor(Math.random() * liturgicalTracks.length)];
    
    if (selected) {
      const result = {
        ...selected,
        reason: "liturgical",
        label: effectiveLiturgy?.season ? `Tiempo de ${effectiveLiturgy.season}` : "Música litúrgica"
      };
      trackPlayed(selected.file, result.reason);
      return result;
    }
  }

  // 3. Sección
  const sectionTrack = findSectionTrack(catalog, section || state.currentSection);
  if (sectionTrack) {
    const result = { ...sectionTrack, reason: "section" };
    trackPlayed(sectionTrack.file, result.reason);
    return result;
  }

  // 4. Perfil
  const profileTrack = findProfileTrack(catalog, profile);
  if (profileTrack) {
    const result = { 
      ...profileTrack, 
      reason: "profile",
      label: "Recomendada para tu momento de oración"
    };
    trackPlayed(profileTrack.file, result.reason);
    return result;
  }

  // 5. Fallback (añadir más opciones del catálogo)
  if (catalog && catalog.length > 0) {
    const randomTrack = catalog[Math.floor(Math.random() * catalog.length)];
    const result = { ...randomTrack, reason: "fallback" };
    trackPlayed(randomTrack.file, result.reason);
    return result;
  }

  // Fallback final
  const fallback = getRandomTrack(catalog);
  const result = { ...fallback, reason: "fallback" };
  trackPlayed(fallback.file, result.reason);
  return result;
}

// ═══════════════════════════════════════════════════════════════════
// LÓGICA POR SECCIÓN
// ═══════════════════════════════════════════════════════════════════

function findSectionTrack(catalog, section) {
  if (!section) return null;
  
  const filtered = catalog.filter(track =>
    track.sections?.includes(section)
  );

  if (filtered.length === 0) return null;

  return weightedRandom(filtered);
}

// ═══════════════════════════════════════════════════════════════════
// LÓGICA POR PERFIL
// ═══════════════════════════════════════════════════════════════════

function findProfileTrack(catalog, profile) {
  if (!profile || !profile.preferredAudio || profile.preferredAudio.length === 0) {
    return null;
  }

  const filtered = catalog.filter(track =>
    profile.preferredAudio.includes(track.file)
  );

  if (filtered.length === 0) return null;

  return weightedRandom(filtered);
}

// ═══════════════════════════════════════════════════════════════════
// LÓGICA LITÚRGICA
// ═══════════════════════════════════════════════════════════════════

function findLiturgicalTrack(catalog, liturgy) {
  if (!liturgy || !liturgy.season) return null;

  const seasonTrack = catalog.find(track =>
    track.tags?.includes(liturgy.season)
  );

  if (seasonTrack) return seasonTrack;

  // Buscar por tipo de fiesta si existe
  if (liturgy.type) {
    const typeTrack = catalog.find(track =>
      track.tags?.includes(liturgy.type)
    );
    if (typeTrack) return typeTrack;
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// WEIGHTED RANDOM
// ═══════════════════════════════════════════════════════════════════

function weightedRandom(tracks) {
  if (tracks.length === 0) return null;
  if (tracks.length === 1) return tracks[0];

  // Usar pickTrack de audio-memory si está disponible
  if (audioMemory && audioMemory.pickTrack) {
    return audioMemory.pickTrack(tracks);
  }

  // Fallback: filtrar recientemente reproducidas
  const recent = state.lastPlayed.slice(0, 3);
  const available = tracks.filter(t => !recent.includes(t.file));

  if (available.length > 0) {
    const index = Math.floor(Math.random() * available.length);
    return available[index];
  }

  // Si todas fueron reproducidas recently, usar aleatorio simple
  const index = Math.floor(Math.random() * tracks.length);
  return tracks[index];
}

// ═══════════════════════════════════════════════════════════════════
// RANDOM TRACK
// ═══════════════════════════════════════════════════════════════════

function getRandomTrack(catalog) {
  if (!catalog || catalog.length === 0) {
    return {
      file: 'gregoriano-1',
      title: 'Gregoriano Contemplativo',
      src: '/mp3/gregoriano-1.mp3'
    };
  }

  const recent = state.lastPlayed.slice(0, 5);
  const available = catalog.filter(t => !recent.includes(t.file));
  
  const pool = available.length > 0 ? available : catalog;
  const index = Math.floor(Math.random() * pool.length);
  
  return pool[index];
}

// ═══════════════════════════════════════════════════════════════════
// TRACKING
// ═══════════════════════════════════════════════════════════════════

function trackPlayed(trackId, reason) {
  state.lastPlayed.push(trackId);
  state.lastReason = reason || 'fallback';
  
  if (state.lastPlayed.length > 20) {
    state.lastPlayed = state.lastPlayed.slice(-20);
  }
  
  // Sincronizar con AudioMemory
  if (audioMemory && audioMemory.addToHistory) {
    audioMemory.addToHistory({
      file: trackId,
      reason: reason
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// API ADICIONAL
// ═══════════════════════════════════════════════════════════════════

export function setSection(section) {
  state.currentSection = section;
}

export function getLastPlayed() {
  return state.lastPlayed;
}

export function getState() {
  return { ...state };
}

// ═══════════════════════════════════════════════════════════════════
// EJEMPLOS DE USO
// ═══════════════════════════════════════════════════════════════════
// 
// import { getNextTrack, setSection } from "./audio-intelligence.js";
// 
// // En el reproductor de audio:
// const track = getNextTrack({ 
//   section: 'maria', 
//   catalog: audioCatalog, 
//   liturgy: { season: 'pascua', type: 'solemnidad' } 
// });
// 
// console.log(track);
// // { 
// //   file: 'ave-maria-1',
// //   title: 'Ave María',
// //   src: '/mp3/ave-maria-1.mp3',
// //   reason: 'section'
// // }
// 
// // Al cambiar de sección:
// setSection('coronilla');
// const nextForSection = getNextTrack({ section: 'coronilla', catalog: audioCatalog });
// 
// // Al completar pista:
// const afterComplete = getNextTrack({ catalog: audioCatalog });
// 
// // Obtener estado:
// console.log(getState()); // { currentSection, lastPlayed, lastReason }