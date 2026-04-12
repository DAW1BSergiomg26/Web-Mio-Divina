/**
 * Sistema de Perfil Espiritual - Spiritual Profile v3
 * API completa para personalización en tiempo real
 * Sin backend - todo basado en localStorage optimizado
 */
(function() {
  'use strict';

  const SpiritualProfile = {
    config: {
      storageKey: 'santuario_perfil_v3',
      minTimeToTrack: 5000,
      saveInterval: 30000,
      debounceTime: 300
    },

    data: {
      visits: {},
      timeSpent: {},
      audio: {},
      interactions: {
        rosary: 0,
        candles: 0,
        prayers: 0,
        intentions: 0
      },
      lastVisit: null,
      lastSection: null
    },

    session: {
      currentSection: null,
      sectionStartTime: null,
      isTracking: false
    },

    profile: {
      type: 'contemplativo',
      activityLevel: 'medio',
      preferredSections: [],
      preferredAudio: [],
      totalVisits: 0,
      createdAt: null
    },

    pendingSave: null,

    init() {
      this.loadData();
      this.startTracking();
      this.bindEvents();
      this.generateProfile();
      this.renderContinuePath();
      console.log('🧭 Spiritual Profile v3 initialized');
    },

    loadData() {
      try {
        const saved = localStorage.getItem(this.config.storageKey);
        if (saved) {
          this.data = { ...this.data, ...JSON.parse(saved) };
        } else {
          this.data.createdAt = Date.now();
        }
      } catch (e) {
        console.warn('Error loading profile data:', e);
        this.data.createdAt = Date.now();
      }
    },

    saveData() {
      if (this.pendingSave) {
        clearTimeout(this.pendingSave);
      }

      const save = () => {
        try {
          localStorage.setItem(this.config.storageKey, JSON.stringify(this.data));
        } catch (e) {
          console.warn('Error saving profile data:', e);
        }
      };

      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => save(), { timeout: 2000 });
      } else {
        this.pendingSave = setTimeout(save, this.config.debounceTime);
      }
    },

    startTracking() {
      this.detectCurrentSection();
      this.session.isTracking = true;
    },

    detectCurrentSection() {
      const path = window.location.pathname;
      const section = this.extractSectionFromPath(path);
      
      if (section && section !== this.session.currentSection) {
        this.onSectionChange(section);
      }
    },

    extractSectionFromPath(path) {
      const cleanPath = path.replace(/^\//, '').replace(/\.html$/, '') || 'index';
      
      const sectionMap = {
        'index': 'inicio',
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

    onSectionChange(newSection) {
      if (this.session.currentSection && this.session.sectionStartTime) {
        this.recordTimeSpent(this.session.currentSection);
      }

      this.session.currentSection = newSection;
      this.session.sectionStartTime = Date.now();
      this.data.lastSection = newSection;
      this.recordPageView(newSection);
    },

    recordPageView(section) {
      if (!this.data.visits[section]) {
        this.data.visits[section] = 0;
      }
      this.data.visits[section]++;
      this.data.lastVisit = new Date().toISOString();
      this.saveData();
    },

    recordTimeSpent(section) {
      if (!this.session.sectionStartTime) return;
      
      const duration = Date.now() - this.session.sectionStartTime;
      if (duration < this.config.minTimeToTrack) return;
      
      if (!this.data.timeSpent[section]) {
        this.data.timeSpent[section] = 0;
      }
      this.data.timeSpent[section] += Math.floor(duration / 1000);
      this.saveData();
    },

    trackEvent(type, payload = {}) {
      switch (type) {
        case 'page_view':
          if (payload.section) {
            this.data.lastSection = payload.section;
            this.recordPageView(payload.section);
          }
          break;
        case 'time_spent':
          if (payload.section && payload.seconds) {
            if (!this.data.timeSpent[payload.section]) {
              this.data.timeSpent[payload.section] = 0;
            }
            this.data.timeSpent[payload.section] += payload.seconds;
            this.saveData();
          }
          break;
        case 'audio_play':
          if (payload.trackId) {
            this.trackAudioPlay(payload.trackId);
          }
          break;
        case 'rosary_step':
          this.data.interactions.rosary++;
          this.saveData();
          this.generateProfile();
          break;
        case 'candle_lit':
          this.data.interactions.candles++;
          this.saveData();
          this.generateProfile();
          break;
        case 'prayer_complete':
          this.data.interactions.prayers++;
          this.saveData();
          break;
        case 'intention_shared':
          this.data.interactions.intentions++;
          this.saveData();
          this.generateProfile();
          break;
      }
    },

    trackAudioPlay(trackId) {
      if (!this.data.audio[trackId]) {
        this.data.audio[trackId] = 0;
      }
      this.data.audio[trackId]++;
      this.saveData();
      this.generateProfile();
    },

    generateProfile() {
      const visits = Object.values(this.data.visits).reduce((a, b) => a + b, 0);
      const time = Object.values(this.data.timeSpent).reduce((a, b) => a + b, 0);
      const audioPlays = Object.values(this.data.audio).reduce((a, b) => a + b, 0);
      const { rosary, candles, prayers, intentions } = this.data.interactions;

      const avgTimePerVisit = visits > 0 ? time / visits : 0;
      const devocionalScore = rosary + candles + intentions;
      const musicalScore = audioPlays;

      let type = 'contemplativo';
      
      if (devocionalScore > 10 && musicalScore < devocionalScore * 0.3) {
        type = 'devocional';
      } else if (musicalScore > 8 && musicalScore > devocionalScore) {
        type = 'musical';
      } else if (devocionalScore > 3 && musicalScore > 3) {
        type = 'mixto';
      } else if (avgTimePerVisit > 120 && rosary + candles < 3) {
        type = 'contemplativo';
      }

      const dayMs = 24 * 60 * 60 * 1000;
      const daysActive = this.data.createdAt 
        ? Math.max(1, Math.floor((Date.now() - this.data.createdAt) / dayMs)) 
        : 1;
      
      const visitsPerDay = visits / daysActive;
      const timePerDay = time / daysActive;
      
      let activityLevel = 'bajo';
      if (visitsPerDay > 5 || timePerDay > 300) {
        activityLevel = 'alto';
      } else if (visitsPerDay > 2 || timePerDay > 60) {
        activityLevel = 'medio';
      }

      const sortedSections = Object.entries(this.data.visits)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([section]) => section);

      const sortedAudio = Object.entries(this.data.audio)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([track]) => track);

      this.profile = {
        type,
        activityLevel,
        preferredSections: sortedSections,
        preferredAudio: sortedAudio,
        totalVisits: visits
      };

      this.saveData();
      return this.profile;
    },

    bindEvents() {
      window.addEventListener('beforeunload', () => {
        this.endTracking();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.endTracking();
        } else {
          this.startTracking();
        }
      });

      setInterval(() => {
        this.detectCurrentSection();
      }, 5000);

      setInterval(() => {
        if (this.session.currentSection && this.session.sectionStartTime) {
          this.recordTimeSpent(this.session.currentSection);
        }
      }, this.config.saveInterval);
    },

    endTracking() {
      if (this.session.currentSection && this.session.sectionStartTime) {
        this.recordTimeSpent(this.session.currentSection);
      }
      this.session.isTracking = false;
    },

    getData() {
      return JSON.parse(JSON.stringify(this.data));
    },

    getProfile() {
      return { ...this.profile };
    },

    getLastSection() {
      return this.data.lastSection || 'inicio';
    },

    getRecommendations() {
      const profile = this.getProfile();
      const recommendations = {
        sections: [],
        audio: [],
        actions: []
      };

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

      recommendations.sections = profile.preferredSections
        .slice(0, 3)
        .map(s => ({ id: s, name: sectionNames[s] || s }));

      recommendations.audio = (audioByType[profile.type] || audioByType.contemplativo)
        .filter(t => !profile.preferredAudio.includes(t))
        .slice(0, 3);

      const actionMessages = {
        contemplativo: ['Medita en silencio', 'Lee sobre la Divina Misericordia'],
        devocional: ['Enciende una vela', 'Reza el Rosario'],
        musical: ['Escucha música sacra', 'Explora el catálogo'],
        mixto: ['Explora nuevas devociones', 'Escucha una meditación']
      };

      recommendations.actions = actionMessages[profile.type] || actionMessages.contemplativo;

      return recommendations;
    },

    getAnimationConfig() {
      const configs = {
        contemplativo: { speed: 0.6, particles: 'low', motion: 'reduced' },
        devocional: { speed: 0.8, particles: 'medium', motion: 'normal' },
        musical: { speed: 1.2, particles: 'high', motion: 'normal' },
        mixto: { speed: 1.0, particles: 'medium', motion: 'normal' }
      };
      
      return configs[this.profile.type] || configs.contemplativo;
    },

    getContextualMessage() {
      const messages = {
        contemplativo: 'El silencio es oración. ¿Necesitas un momento de paz?',
        devocional: 'La fe se fortalece con la práctica. ¿Quieres rezar?',
        musical: 'La música eleva el alma. ¿Oyes alguna canción?',
        mixto: 'Tu camino espiritual es único. ¿Qué te trae hoy?'
      };
      
      return messages[this.profile.type] || messages.contemplativo;
    },

    renderContinuePath() {
      const lastSection = this.getLastSection();
      if (!lastSection) return;
      
      let container = document.querySelector('.continue-path');
      if (container) return;
      
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
      
      container = document.createElement('div');
      container.className = 'continue-path';
      container.innerHTML = `
        <div class="continue-card">
          <div class="continue-icon">🧭</div>
          <div class="continue-content">
            <h3>Continuar tu camino espiritual</h3>
            <p>Última sección: <strong>${sectionNames[lastSection] || lastSection}</strong></p>
            <button class="continue-btn">Continuar</button>
          </div>
        </div>
      `;
      
      this.createStyles();
      
      const hero = document.querySelector('.hero, .main-hero, header');
      if (hero) {
        hero.insertAdjacentElement('afterend', container);
      }
      
      const sectionPaths = {
        'inicio': '/index.html',
        'divina-misericordia': '/divina-misericordia.html',
        'coronilla': '/coronilla.html',
        'novena': '/novena.html',
        'hora-misericordia': '/hora-misericordia.html',
        'rosario': '/rosario.html',
        'maria': '/maria.html',
        'caacupe': '/caacupe.html',
        'lujan': '/lujan.html',
        'musica': '/musica.html'
      };
      
      container.querySelector('.continue-btn').addEventListener('click', () => {
        const path = sectionPaths[lastSection] || '/index.html';
        window.location.href = path;
      });
    },

    createStyles() {
      if (document.getElementById('profile-continue-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'profile-continue-styles';
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

    reset() {
      localStorage.removeItem(this.config.storageKey);
      this.data = {
        visits: {},
        timeSpent: {},
        audio: {},
        interactions: { rosary: 0, candles: 0, prayers: 0, intentions: 0 },
        lastVisit: null,
        lastSection: null,
        createdAt: Date.now()
      };
      console.log('🧭 Profile reset');
    }
  };

  window.SpiritualProfile = SpiritualProfile;
  console.log('🧭 Spiritual Profile v3 loaded');
})();

/**
 * EJEMPLOS DE INTEGRACIÓN
 * ======================
 * 
 * 1. Audio Player - Sugerencias dinámicas:
 * 
 *   const profile = SpiritualProfile.getProfile();
 *   const recommendations = SpiritualProfile.getRecommendations();
 *   // Mostrar suggestions.audio en el reproductor
 * 
 * 2. Scroll / Secciones - Contenido relevante:
 * 
 *   document.querySelectorAll('.nav-link').forEach(link => {
 *     const section = link.getAttribute('href').replace('.html','');
 *     if (profile.preferredSections.includes(section)) {
 *       link.classList.add('preferred-section');
 *     }
 *   });
 * 
 * 3. Home - Continuar camino:
 * 
 *   const lastSection = SpiritualProfile.getLastSection();
 *   // Mostrar card "Continuar tu camino espiritual"
 * 
 * 4. Tracking de eventos desde otros módulos:
 * 
 *   SpiritualProfile.trackEvent('audio_play', { trackId: 'ave-maria.mp3' });
 *   SpiritualProfile.trackEvent('candle_lit', {});
 *   SpiritualProfile.trackEvent('rosary_step', {});
 */