/**
 * Spatial Audio Engine - Audio 3D con Reverb de Catedral
 * Web Audio API con PannerNodes y Convolution Reverb
 */
(function() {
  'use strict';

  const SpatialAudio = {
    audioContext: null,
    masterGain: null,
    reverbNode: null,
    currentZone: 'inicio',
    isInitialized: false,
    sources: {},
    
    zones: {
      inicio: { reverb: 3.5, name: 'Catedral Grande', position: { x: 0, y: 0, z: 0 } },
      devociones: { reverb: 1.2, name: 'Capilla Íntima', position: { x: 2, y: 0, z: 2 } },
      'musica-sacra': { reverb: 2.0, name: 'Sala de Concerto', position: { x: 0, y: 1, z: 0 } },
      oraciones: { reverb: 0.4, name: 'Cámara Silenciosa', position: { x: 0, y: 0, z: 3 } }
    },

    init() {
      if (this.isInitialized) return;
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.7;
      this.masterGain.connect(this.audioContext.destination);
      
      this.createReverb(3.5);
      this.setupListener();
      
      this.isInitialized = true;
      console.log('🎚️ Spatial Audio inicializado');
    },

    setupListener() {
      if (!this.audioContext.listener.positionX) {
        this.audioContext.listener.positionX.value = 0;
        this.audioContext.listener.positionY.value = 0;
        this.audioContext.listener.positionZ.value = 0;
        this.audioContext.listener.forwardX.value = 0;
        this.audioContext.listener.forwardY.value = 0;
        this.audioContext.listener.forwardZ.value = -1;
        this.audioContext.listener.upX.value = 0;
        this.audioContext.listener.upY.value = 1;
        this.audioContext.listener.upZ.value = 0;
      }
    },

    createReverb(duration = 3.5) {
      if (this.reverbNode) {
        this.reverbNode.disconnect();
      }

      const sampleRate = this.audioContext.sampleRate;
      const length = sampleRate * duration;
      const impulse = this.audioContext.createBuffer(2, length, sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const earlyReflections = i < sampleRate * 0.08 ? 
            (Math.random() * 2 - 1) * Math.exp(-t * 8) : 0;
          const lateReverb = (Math.random() * 2 - 1) * 
            Math.exp(-t * (3 / duration)) * 0.5;
          const preDelay = Math.sin(t * 20) * 0.1 * Math.exp(-t * 2);
          
          channelData[i] = earlyReflections + lateReverb + preDelay;
        }
      }

      this.reverbNode = this.audioContext.createConvolver();
      this.reverbNode.buffer = impulse;
      this.reverbNode.connect(this.masterGain);
    },

    setZone(zoneName) {
      if (!this.zones[zoneName]) return;
      
      const zone = this.zones[zoneName];
      const oldZone = this.zones[this.currentZone];
      
      if (oldZone && oldZone.reverb !== zone.reverb) {
        const now = this.audioContext.currentTime;
        this.reverbNode.disconnect();
        
        const newReverb = this.audioContext.createConvolver();
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * zone.reverb;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let ch = 0; ch < 2; ch++) {
          const data = impulse.getChannelData(ch);
          for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            data[i] = (Math.random() * 2 - 1) * Math.exp(-t * (3 / zone.reverb));
          }
        }
        
        newReverb.buffer = impulse;
        newReverb.connect(this.masterGain);
        this.reverbNode = newReverb;
      }

      this.currentZone = zoneName;
      console.log(`🎚️ Zona acústica: ${zone.name} (reverb: ${zone.reverb}s)`);
    },

    createSpatialSource(audioElement, position = { x: 0, y: 0, z: -5 }) {
      if (!this.isInitialized) this.init();

      const source = this.audioContext.createMediaElementSource(audioElement);
      const panner = this.audioContext.createPanner();
      
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 50;
      panner.rolloffFactor = 1;
      panner.coneInnerAngle = 360;
      panner.coneOuterAngle = 360;
      panner.coneOuterGain = 0;
      
      panner.positionX.value = position.x;
      panner.positionY.value = position.y;
      panner.positionZ.value = position.z;

      source.connect(panner);
      panner.connect(this.reverbNode);
      panner.connect(this.masterGain);

      this.sources[audioElement.src] = panner;
      
      return panner;
    },

    updateListenerPosition(x, y, z) {
      if (!this.audioContext) return;
      
      if (this.audioContext.listener.positionX) {
        this.audioContext.listener.positionX.value = x;
        this.audioContext.listener.positionY.value = y;
        this.audioContext.listener.positionZ.value = z;
      }
    },

    setVolume(value) {
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(value, this.audioContext.currentTime, 0.1);
      }
    },

    resume() {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    },

    suspend() {
      if (this.audioContext && this.audioContext.state === 'running') {
        this.audioContext.suspend();
      }
    }
  };

  window.SpatialAudio = SpatialAudio;
  console.log('🎚️ SpatialAudio module loaded');
})();