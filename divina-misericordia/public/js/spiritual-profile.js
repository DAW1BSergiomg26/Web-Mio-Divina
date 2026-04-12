/**
 * Sistema de Perfil Espiritual - Spiritual Profile
 * Aprende del usuario y adapta la experiencia espiritual en tiempo real
 * Sin backend - todo basado en localStorage
 */
(function() {
  'use strict';

  const SpiritualProfile = {
    config: {
      storageKey: 'santuario_perfil',
      sectionsKey: 'santuario_secciones',
      audioKey: 'santuario_audio',
      activityKey: 'santuario_actividad',
      minTimeToTrack: 5000,
      profileVersion: '1.0'
    },
    profile: {
      type: 'contemplativo',
      preferredSections: [],
      preferredAudio: [],
      activityLevel: 'medio',
      lastVisit: null,
      lastSection: null,
      lastPrayer: null,
      totalVisits: 0,
      createdAt: null
    },
    sessionData: {
      currentSection: null,
      sectionStartTime: null,
      sectionsVisited: [],
      audioPlayed: [],
      rosaryCount: 0,
      candleCount: 0,
      prayersShared: 0
    },

    init() {
      this.loadProfile();
      this.startSessionTracking();
      this.bindEvents();
      this.applyProfileToExperience();
      this.renderContinuePath();
      console.log('🧭 Spiritual Profile initialized:', this.profile.type);
    },

    loadProfile() {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.profile = { ...this.profile, ...parsed };
      } else {
        this.profile.createdAt = Date.now();
        this.saveProfile();
      }
    },

    saveProfile() {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.profile));
    },

    startSessionTracking() {
      this.sessionData.sectionStartTime = Date.now();
      this.trackCurrentSection();
    },

    trackCurrentSection() {
      const path = window.location.pathname;
      const section = this.extractSectionFromPath(path);
      
      if (section && section !== this.sessionData.currentSection) {
        this.sessionData.currentSection = section;
        this.sessionData.sectionStartTime = Date.now();
        
        if (!this.sessionData.sectionsVisited.includes(section)) {
          this.sessionData.sectionsVisited.push(section);
        }
      }
    },

    extractSectionFromPath(path) {
      const cleanPath = path.replace(/^\//, '').replace(/\.html$/, '');
      if (!cleanPath || cleanPath === 'index') return 'inicio';
      
      const sectionMap = {
        'divina-misericordia': 'divina-misericordia',
        'coronilla': 'coronilla',
        'novena': 'novena',
        'hora-misericordia': 'hora-misericordia',
        'rosario': 'rosario',
        'maria': 'maria',
        'caacupe': 'caacupe',
        'lujan': 'lujan',
        'jose': 'jose',
        'musica': 'musica',
        'multimedia': 'multimedia',
        'oraciones': 'oraciones',
        'contacto': 'contacto',
        'blog': 'blog',
        'donar': 'donar'
      };
      
      return sectionMap[cleanPath] || cleanPath;
    },

    recordSectionVisit(section, duration) {
      if (duration < this.config.minTimeToTrack) return;

      const sectionsData = JSON.parse(localStorage.getItem(this.config.sectionsKey) || '{}');
      
      if (!sectionsData[section]) {
        sectionsData[section] = { visits: 0, totalTime: 0 };
      }
      
      sectionsData[section].visits++;
      sectionsData[section].totalTime += duration;
      
      localStorage.setItem(this.config.sectionsKey, JSON.stringify(sectionsData));
    },

    recordAudioPlayed(trackId, trackData) {
      const audioData = JSON.parse(localStorage.getItem(this.config.audioKey) || '[]');
      
      audioData.push({
        id: trackId,
        title: trackData.title || trackId,
        playedAt: Date.now(),
        section: this.sessionData.currentSection
      });
      
      const maxAudioHistory = 100;
      if (audioData.length > maxAudioHistory) {
        audioData.slice(-maxAudioHistory);
      }
      
      localStorage.setItem(this.config.audioKey, JSON.stringify(audioData));
      
      if (!this.sessionData.audioPlayed.includes(trackId)) {
        this.sessionData.audioPlayed.push(trackId);
      }
    },

    recordRosaryUse() {
      this.sessionData.rosaryCount++;
      this.updateProfile();
    },

    recordCandleLit() {
      this.sessionData.candleCount++;
      this.updateProfile();
    },

    recordPrayerShared() {
      this.sessionData.prayersShared++;
      this.updateProfile();
    },

    updateProfile() {
      const sectionsData = JSON.parse(localStorage.getItem(this.config.sectionsKey) || '{}');
      const audioData = JSON.parse(localStorage.getItem(this.config.audioKey) || '[]');
      
      const totalVisits = Object.values(sectionsData).reduce((sum, s) => sum + s.visits, 0);
      const totalTime = Object.values(sectionsData).reduce((sum, s) => sum + s.totalTime, 0);
      
      const sortedSections = Object.entries(sectionsData)
        .sort((a, b) => b[1].visits - a[1].visits)
        .slice(0, 5)
        .map(([name]) => name);
      
      const sortedAudio = this.getMostPlayedAudio(audioData, 5);
      
      this.profile.preferredSections = sortedSections;
      this.profile.preferredAudio = sortedAudio;
      this.profile.totalVisits = totalVisits + this.sessionData.sectionsVisited.length;
      this.profile.lastVisit = Date.now();
      this.profile.activityLevel = this.calculateActivityLevel(totalVisits, totalTime);
      this.profile.type = this.calculateProfileType(sectionsData, audioData);
      
      this.saveProfile();
    },

    getMostPlayedAudio(audioData, limit) {
      const counts = {};
      audioData.forEach(a => {
        counts[a.id] = (counts[a.id] || 0) + 1;
      });
      
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => id);
    },

    calculateActivityLevel(visits, time) {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      const daysActive = this.profile.createdAt 
        ? Math.max(1, Math.floor((now - this.profile.createdAt) / dayMs)) 
        : 1;
      
      const visitsPerDay = visits / daysActive;
      const timePerDay = time / daysActive;
      
      if (visitsPerDay > 5 || timePerDay > 300000) return 'alto';
      if (visitsPerDay > 2 || timePerDay > 60000) return 'medio';
      return 'bajo';
    },

    calculateProfileType(sectionsData, audioData) {
      const devocionalSections = ['coronilla', 'rosario', 'novena', 'hora-misericordia'];
      const musicalSections = ['musica', 'multimedia'];
      const contemplativoSections = ['divina-misericordia', 'maria', 'inicio'];
      
      let devocionalScore = 0;
      let musicalScore = 0;
      let contemplativoScore = 0;
      
      Object.keys(sectionsData).forEach(section => {
        if (devocionalSections.includes(section)) devocionalScore += sectionsData[section].visits;
        if (musicalSections.includes(section)) musicalScore += sectionsData[section].visits;
        if (contemplativoSections.includes(section)) contemplativoScore += sectionsData[section].visits;
      });
      
      const audioScore = audioData.length;
      musicalScore += audioScore;
      
      const total = devocionalScore + musicalScore + contemplativoScore;
      if (total === 0) return 'contemplativo';
      
      const devocionalRatio = devocionalScore / total;
      const musicalRatio = musicalScore / total;
      
      if (devocionalRatio > 0.4) return 'devocional';
      if (musicalRatio > 0.4) return 'musical';
      if (devocionalRatio > 0.2 && musicalRatio > 0.2) return 'mixto';
      return 'contemplativo';
    },

    applyProfileToExperience() {
      this.adaptAnimations();
      this.highlightPreferredSections();
      this.suggestMusicBasedOnProfile();
    },

    adaptAnimations() {
      const profile = this.profile;
      
      let animationSpeed = 1;
      let particleDensity = 'medium';
      
      if (profile.type === 'contemplativo') {
        animationSpeed = 0.6;
        particleDensity = 'low';
      } else if (profile.type === 'devocional') {
        animationSpeed = 0.8;
        particleDensity = 'medium';
      } else if (profile.type === 'musical') {
        animationSpeed = 1.2;
        particleDensity = 'high';
      }
      
      document.documentElement.style.setProperty('--animation-speed', animationSpeed);
      document.documentElement.style.setProperty('--particle-density', particleDensity);
      
      if (profile.activityLevel === 'bajo') {
        this.reduceMotion();
      }
    },

    reduceMotion() {
      const style = document.createElement('style');
      style.id = 'profile-motion-reduce';
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      `;
      if (!document.getElementById('profile-motion-reduce')) {
        document.head.appendChild(style);
      }
    },

    highlightPreferredSections() {
      if (this.profile.preferredSections.length === 0) return;
      
      const navLinks = document.querySelectorAll('.main-nav a, nav a');
      const preferred = this.profile.preferredSections.slice(0, 3);
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const section = this.extractSectionFromPath(href);
        
        if (preferred.includes(section)) {
          link.classList.add('preferred-section');
        }
      });
      
      this.createHighlightStyles();
    },

    createHighlightStyles() {
      if (document.getElementById('profile-highlight-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'profile-highlight-styles';
      style.textContent = `
        .preferred-section::after {
          content: ' ·';
          color: #d4af37;
        }
        .preferred-section {
          position: relative;
        }
      `;
      document.head.appendChild(style);
    },

    suggestMusicBasedOnProfile() {
      const suggestions = this.getMusicSuggestions();
      if (suggestions.length === 0) return;
      
      const audioPlayer = document.querySelector('.audio-player, #audio-player');
      if (!audioPlayer) return;
      
      const suggestionContainer = document.createElement('div');
      suggestionContainer.className = 'profile-music-suggestion';
      suggestionContainer.innerHTML = `
        <p>Basado en tu camino espiritual:</p>
        <div class="suggestion-tracks">
          ${suggestions.map(t => `
            <button class="suggestion-track" data-track="${t.id}">
              🎵 ${t.title}
            </button>
          `).join('')}
        </div>
      `;
      
      this.createSuggestionStyles();
      
      const existing = document.querySelector('.profile-music-suggestion');
      if (!existing) {
        audioPlayer.insertAdjacentElement('beforebegin', suggestionContainer);
        
        suggestionContainer.querySelectorAll('.suggestion-track').forEach(btn => {
          btn.addEventListener('click', () => {
            if (window.AudioController) {
              window.AudioController.playTrack(btn.dataset.track);
            }
          });
        });
      }
    },

    getMusicSuggestions() {
      const profile = this.profile;
      const suggestions = [];
      
      const allTracks = {
        'gregoriano-1': { title: 'Gregoriano Contemplativo', type: 'contemplativo' },
        'misericordia-1': { title: 'Coronilla de la Misericordia', type: 'devocional' },
        'rosario-1': { title: 'Santo Rosario', type: 'devocional' },
        'advent-1': { title: 'Advent Meditación', type: 'contemplativo' },
        'pasion-1': { title: 'Música de Pasión', type: 'penitencial' },
        'pascua-1': { title: 'Aleluya Pascual', type: 'alegre' },
        'marian-1': { title: 'Ave María', type: 'mariano' }
      };
      
      if (profile.preferredAudio.length > 0) {
        profile.preferredAudio.slice(0, 3).forEach(id => {
          if (allTracks[id]) suggestions.push({ id, ...allTracks[id] });
        });
      }
      
      const typeMap = {
        'contemplativo': 'gregoriano-1',
        'devocional': 'misericordia-1',
        'musical': 'rosario-1',
        'mixto': 'marian-1'
      };
      
      const defaultId = typeMap[profile.type];
      if (defaultId && !suggestions.find(s => s.id === defaultId) && allTracks[defaultId]) {
        suggestions.push({ id: defaultId, ...allTracks[defaultId] });
      }
      
      return suggestions.slice(0, 3);
    },

    renderContinuePath() {
      if (!this.profile.lastSection) return;
      
      let container = document.querySelector('.continue-path');
      if (container) return;
      
      container = document.createElement('div');
      container.className = 'continue-path';
      
      const lastSectionName = this.getSectionDisplayName(this.profile.lastSection);
      const lastPrayerText = this.getLastPrayerText();
      
      container.innerHTML = `
        <div class="continue-card">
          <div class="continue-icon">🧭</div>
          <div class="continue-content">
            <h3>Continuar tu camino espiritual</h3>
            <p>Última sección: <strong>${lastSectionName}</strong></p>
            ${lastPrayerText ? `<p class="continue-prayer">${lastPrayerText}</p>` : ''}
            <button class="continue-btn">Continuar</button>
          </div>
        </div>
      `;
      
      this.createContinuePathStyles();
      
      const hero = document.querySelector('.hero, .main-hero, header');
      if (hero) {
        hero.insertAdjacentElement('afterend', container);
      }
      
      container.querySelector('.continue-btn').addEventListener('click', () => {
        this.navigateToLastSection();
      });
    },

    getSectionDisplayName(section) {
      const names = {
        'inicio': 'Inicio',
        'divina-misericordia': 'Divina Misericordia',
        'coronilla': 'Coronilla',
        'novena': 'Novena',
        'hora-misericordia': 'Hora de la Misericordia',
        'rosario': 'Santo Rosario',
        'maria': 'María',
        'caacupe': 'Virgen de Caacupé',
        'lujan': 'Virgen de Luján',
        'jose': 'San José',
        'musica': 'Música Sacra',
        'multimedia': 'Multimedia',
        'oraciones': 'Oraciones',
        'contacto': 'Contacto',
        'blog': 'Blog',
        'donar': 'Donar'
      };
      return names[section] || section;
    },

    getLastPrayerText() {
      const rosary = localStorage.getItem('rosario_progreso');
      const candle = localStorage.getItem('mis_velas');
      
      if (rosary) {
        const data = JSON.parse(rosary);
        if (data.currentHail > 0) {
          return `Rosario: ${data.currentHail} Ave Marías`;
        }
      }
      
      if (candle) {
        const candles = JSON.parse(candle);
        if (candles.length > 0) {
          return `Última vela encendida`;
        }
      }
      
      return null;
    },

    navigateToLastSection() {
      const lastSection = this.profile.lastSection;
      if (!lastSection) return;
      
      const sectionToPath = {
        'inicio': '/index.html',
        'divina-misericordia': '/divina-misericordia.html',
        'coronilla': '/coronilla.html',
        'novena': '/novena.html',
        'hora-misericordia': '/hora-misericordia.html',
        'rosario': '/rosario.html',
        'maria': '/maria.html',
        'caacupe': '/caacupe.html',
        'lujan': '/lujan.html',
        'jose': '/jose.html',
        'musica': '/musica.html',
        'multimedia': '/multimedia.html',
        'oraciones': '/oraciones.html',
        'contacto': '/contacto.html',
        'blog': '/blog.html',
        'donar': '/donar.html'
      };
      
      const path = sectionToPath[lastSection] || '/index.html';
      window.location.href = path;
    },

    createContinuePathStyles() {
      if (document.getElementById('continue-path-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'continue-path-styles';
      style.textContent = `
        .continue-path {
          max-width: 600px;
          margin: 1rem auto;
          padding: 0 1rem;
        }
        .continue-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: linear-gradient(135deg, rgba(20,18,15,0.9), rgba(35,30,25,0.9));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 12px;
          padding: 1rem 1.5rem;
        }
        .continue-icon {
          font-size: 2rem;
        }
        .continue-content h3 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 1rem;
          margin: 0 0 5px 0;
        }
        .continue-content p {
          color: rgba(250,247,240,0.7);
          font-size: 0.85rem;
          margin: 3px 0;
        }
        .continue-content strong {
          color: #faf7f0;
        }
        .continue-prayer {
          font-style: italic;
          color: #d4af37 !important;
        }
        .continue-btn {
          background: rgba(212,175,55,0.2);
          border: 1px solid rgba(212,175,55,0.4);
          color: #faf7f0;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.3s;
        }
        .continue-btn:hover {
          background: rgba(212,175,55,0.4);
        }
      `;
      document.head.appendChild(style);
    },

    createSuggestionStyles() {
      if (document.getElementById('profile-suggestion-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'profile-suggestion-styles';
      style.textContent = `
        .profile-music-suggestion {
          background: rgba(212,175,55,0.1);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .profile-music-suggestion p {
          color: rgba(250,247,240,0.7);
          font-size: 0.85rem;
          margin: 0 0 10px 0;
        }
        .suggestion-tracks {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .suggestion-track {
          background: rgba(212,175,55,0.2);
          border: 1px solid rgba(212,175,55,0.3);
          color: #faf7f0;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .suggestion-track:hover {
          background: rgba(212,175,55,0.4);
          transform: scale(1.02);
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      window.addEventListener('beforeunload', () => {
        this.endSession();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.endSession();
        } else {
          this.startSessionTracking();
        }
      });

      setInterval(() => {
        this.trackCurrentSection();
      }, 5000);
    },

    endSession() {
      if (this.sessionData.currentSection && this.sessionData.sectionStartTime) {
        const duration = Date.now() - this.sessionData.sectionStartTime;
        this.recordSectionVisit(this.sessionData.currentSection, duration);
      }
      
      this.profile.lastSection = this.sessionData.currentSection;
      this.updateProfile();
    },

    getProfile() {
      return { ...this.profile };
    },

    resetProfile() {
      localStorage.removeItem(this.config.storageKey);
      localStorage.removeItem(this.config.sectionsKey);
      localStorage.removeItem(this.config.audioKey);
      localStorage.removeItem(this.config.activityKey);
      
      this.profile = {
        type: 'contemplativo',
        preferredSections: [],
        preferredAudio: [],
        activityLevel: 'medio',
        lastVisit: null,
        lastSection: null,
        lastPrayer: null,
        totalVisits: 0,
        createdAt: Date.now()
      };
      
      this.saveProfile();
      console.log('🧭 Profile reset');
    },

    updateLastPrayer(prayerType) {
      this.profile.lastPrayer = {
        type: prayerType,
        at: Date.now()
      };
      this.saveProfile();
    }
  };

  window.SpiritualProfile = SpiritualProfile;
  console.log('🧭 Spiritual Profile loaded');
})();