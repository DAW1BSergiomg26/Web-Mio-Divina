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

  // Actualizar sección actual
  if (section) {
    state.currentSection = section;
  }

  // Obtener candidatos usando lógica original
  let candidates = [];
  
  // 1. Litúrgico
  const liturgicalTrack = findLiturgicalTrack(catalog, liturgy);
  if (liturgicalTrack) {
    candidates.push({ ...liturgicalTrack, reason: "liturgical" });
  }

  // 2. Sección
  const sectionTrack = findSectionTrack(catalog, section || state.currentSection);
  if (sectionTrack) {
    candidates.push({ ...sectionTrack, reason: "section" });
  }

  // 3. Perfil
  const profileTrack = findProfileTrack(catalog, profile);
  if (profileTrack) {
    candidates.push({ ...profileTrack, reason: "profile" });
  }

  // 4. Fallback (añadir más opciones del catálogo)
  if (candidates.length === 0 && catalog && catalog.length > 0) {
    const randomTracks = catalog.slice(0, 5).map(t => ({ ...t, reason: "fallback" }));
    candidates = [...candidates, ...randomTracks];
  }

  // Si hay candidatos, aplicar filtro de memoria
  if (useMemory && audioMemory && audioMemory.filterCandidates && candidates.length > 0) {
    const filtered = audioMemory.filterCandidates(candidates);
    if (filtered && filtered.length > 0) {
      const selected = filtered[0];
      trackPlayed(selected.file, selected.reason);
      return selected;
    }
  }

  // Si no hay memoria o falló el filtro, usar el primer candidato
  if (candidates.length > 0) {
    const selected = candidates[0];
    trackPlayed(selected.file, selected.reason);
    return selected;
  }

  // Fallback final
  const fallback = getRandomTrack(catalog);
  const result = { ...fallback, reason: "fallback" };
  trackPlayed(fallback.file, "fallback");
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