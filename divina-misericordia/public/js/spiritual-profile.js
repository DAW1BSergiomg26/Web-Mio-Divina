/**
 * Sistema de Perfil Espiritual - Spiritual Profile v2
 * Aprende del usuario y adapta la experiencia espiritual en tiempo real
 * API pública para que otros módulos adapten UI, audio y contenido
 */
(function() {
  'use strict';

  const SpiritualProfile = {
    config: {
      storageKey: 'santuario_perfil_v2',
      minTimeToTrack: 5000,
      saveInterval: 30000
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
      lastVisit: null
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

    init() {
      this.loadData();
      this.startTracking();
      this.bindEvents();
      this.recalculateProfile();
      console.log('🧭 Spiritual Profile v2 initialized');
    },

    loadData() {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        this.data = { ...this.data, ...JSON.parse(saved) };
      } else {
        this.data.createdAt = Date.now();
        this.saveData();
      }
    },

    saveData() {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.data));
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

    trackAudioPlay(trackId) {
      if (!this.data.audio[trackId]) {
        this.data.audio[trackId] = 0;
      }
      this.data.audio[trackId]++;
      this.saveData();
      
      this.recalculateProfile();
    },

    trackRosaryStep() {
      this.data.interactions.rosary++;
      this.saveData();
      this.recalculateProfile();
    },

    trackCandleLit() {
      this.data.interactions.candles++;
      this.saveData();
      this.recalculateProfile();
    },

    trackPrayer() {
      this.data.interactions.prayers++;
      this.saveData();
    },

    trackIntention() {
      this.data.interactions.intentions++;
      this.saveData();
      this.recalculateProfile();
    },

    recalculateProfile() {
      const visits = Object.values(this.data.visits).reduce((a, b) => a + b, 0);
      const time = Object.values(this.data.timeSpent).reduce((a, b) => a + b, 0);
      
      this.profile.totalVisits = visits;
      this.profile.preferredSections = this.getTopSections(5);
      this.profile.preferredAudio = this.getTopAudio(5);
      this.profile.activityLevel = this.calculateActivityLevel(visits, time);
      this.profile.type = this.calculateProfileType();
      
      this.saveData();
    },

    getTopSections(limit) {
      return Object.entries(this.data.visits)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([section]) => section);
    },

    getTopAudio(limit) {
      return Object.entries(this.data.audio)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([track]) => track);
    },

    calculateActivityLevel(visits, timeSeconds) {
      const dayMs = 24 * 60 * 60 * 1000;
      const daysActive = this.data.createdAt 
        ? Math.max(1, Math.floor((Date.now() - this.data.createdAt) / dayMs)) 
        : 1;
      
      const visitsPerDay = visits / daysActive;
      const timePerDay = timeSeconds / daysActive;
      
      if (visitsPerDay > 5 || timePerDay > 300) return 'alto';
      if (visitsPerDay > 2 || timePerDay > 60) return 'medio';
      return 'bajo';
    },

    calculateProfileType() {
      const devocional = ['coronilla', 'rosario', 'novena', 'hora-misericordia'];
      const musical = ['musica', 'multimedia'];
      const contemplativo = ['inicio', 'divina-misericordia', 'maria'];
      
      let scores = { devocional: 0, musical: 0, contemplativo: 0 };
      
      Object.keys(this.data.visits).forEach(section => {
        if (devocional.includes(section)) scores.devocional += this.data.visits[section];
        if (musical.includes(section)) scores.musical += this.data.visits[section];
        if (contemplativo.includes(section)) scores.contemplativo += this.data.visits[section];
      });
      
      const audioCount = Object.values(this.data.audio).reduce((a, b) => a + b, 0);
      scores.musical += audioCount;
      
      const total = scores.devocional + scores.musical + scores.contemplativo;
      if (total === 0) return 'contemplativo';
      
      const devocionalRatio = scores.devocional / total;
      const musicalRatio = scores.musical / total;
      
      if (devocionalRatio > 0.4) return 'devocional';
      if (musicalRatio > 0.4) return 'musical';
      if (devocionalRatio > 0.2 && musicalRatio > 0.2) return 'mixto';
      return 'contemplativo';
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

      document.addEventListener('rosary-step', () => this.trackRosaryStep());
      document.addEventListener('candle-lit', () => this.trackCandleLit());
      document.addEventListener('prayer-complete', () => this.trackPrayer());
      document.addEventListener('intention-shared', () => this.trackIntention());
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
      return {
        type: this.profile.type,
        activityLevel: this.profile.activityLevel,
        preferredSections: this.profile.preferredSections,
        preferredAudio: this.profile.preferredAudio,
        totalVisits: this.profile.totalVisits
      };
    },

    getSuggestedAudio() {
      const typeMap = {
        'contemplativo': ['gregoriano-1', 'silencio-1', 'misericordia-1'],
        'devocional': ['coronilla-1', 'rosario-1', 'novena-1'],
        'musical': ['maria-1', 'gregoriano-1', 'musica-sacra-1'],
        'mixto': ['misericordia-1', 'maria-1', 'rosario-1']
      };
      
      const suggestions = typeMap[this.profile.type] || typeMap.contemplativo;
      
      return suggestions.filter(track => 
        !this.profile.preferredAudio.includes(track)
      ).slice(0, 3);
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

    reset() {
      localStorage.removeItem(this.config.storageKey);
      this.data = {
        visits: {},
        timeSpent: {},
        audio: {},
        interactions: { rosary: 0, candles: 0, prayers: 0, intentions: 0 },
        lastVisit: null,
        createdAt: Date.now()
      };
      this.saveData();
      console.log('🧭 Profile reset');
    }
  };

  window.SpiritualProfile = SpiritualProfile;
  console.log('🧭 Spiritual Profile v2 loaded');
})();