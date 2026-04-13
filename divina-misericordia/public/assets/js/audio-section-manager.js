/**
 * Audio Section Manager - Activación de música por sección
 * Sistema de curaduría musical para Divina Misericordia
 */

const AudioSectionManager = {
  currentSection: null,
  autoPlayEnabled: false,
  player: null,

  init(player) {
    this.player = player;
    this.detectSection();
    console.log('[AudioSection] Sección detectada:', this.currentSection);
  },

  detectSection() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    this.currentSection = filename || 'index';
    return this.currentSection;
  },

  playForSection(sectionName) {
    const tracks = AudioCatalog.getTrackBySection(sectionName);
    if (tracks.length > 0) {
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      console.log('[AudioSection] Reproduciendo para', sectionName + ':', randomTrack.title);
      if (this.player) {
        this.player.loadTrack(randomTrack, sectionName, true);
      }
      return randomTrack;
    }
    console.log('[AudioSection] No hay pistas para sección:', sectionName);
    return null;
  },

  playForCurrentSection() {
    return this.playForSection(this.currentSection);
  },

  getAvailableSections() {
    return AudioCatalog.getAllSections();
  },

  hasMusicForSection(sectionName) {
    const tracks = AudioCatalog.getTrackBySection(sectionName);
    return tracks.length > 0;
  },

  enableAutoPlay() {
    this.autoPlayEnabled = true;
    this.playForCurrentSection();
  },

  disableAutoPlay() {
    this.autoPlayEnabled = false;
  }
};

window.AudioSectionManager = AudioSectionManager;
