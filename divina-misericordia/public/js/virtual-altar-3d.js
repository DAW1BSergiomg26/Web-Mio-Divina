/**
 * Altar Virtual 3D - Experiencia inmersiva de espacio sagrado
 * Three.js con OrbitControls y audio sincrónico
 */
(function() {
  'use strict';

  // Cargar Three.js y OrbitControls si no existen
  const loadThreeJS = () => {
    return new Promise((resolve) => {
      if (typeof THREE !== 'undefined') {
        resolve();
        return;
      }

      // Cargar Three.js
      const threeScript = document.createElement('script');
      threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      threeScript.onload = () => {
        // Cargar OrbitControls
        const orbitScript = document.createElement('script');
        orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
        orbitScript.onload = resolve;
        document.head.appendChild(orbitScript);
      };
      document.head.appendChild(threeScript);
    });
  };

  const Altar3D = {
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    altar: null,
    cross: null,
    candles: [],
    flowers: [],
    altarCloth: null,
    audioContext: null,
    ambientAudio: null,
    isPlaying: false,
    isAutoRotate: false,
    isVisible: false,
    audioInitialized: false,

    /**
     * Inicializar Altar 3D
     */
    async init(containerSelector = '#altar-3d-container') {
      await loadThreeJS();

      this.container = document.querySelector(containerSelector);
      if (!this.container) {
        this.createContainer(containerSelector);
      }

      this.createScene();
      this.createAltar();
      this.createCross();
      this.createCandles();
      this.createFlowers();
      this.createAltarCloth();
      this.setupLights();
      this.setupControls();
      this.setupInteractions();
      this.setupVisibilityObserver();
      this.animate();

      console.log('✝ Altar Virtual 3D inicializado');
    },

    /**
     * Crear contenedor si no existe
     */
    createContainer(selector) {
      const hero = document.querySelector('.hero, section');
      if (hero) {
        this.container = document.createElement('div');
        this.container.id = selector.replace('#', '');
        this.container.style.cssText = 'position:relative;width:100%;height:100vh;';
        hero.parentNode.insertBefore(this.container, hero.nextSibling);
      }
    },

    /**
     * Crear escena Three.js
     */
    createScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x050814);
      this.scene.fog = new THREE.FogExp2(0x050814, 0.02);

      // Cámara
      this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
      this.camera.position.set(0, 2, 8);

      // Renderizador
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.container.appendChild(this.renderer.domElement);

      // Resize
      window.addEventListener('resize', () => this.onResize());
    },

    /**
     * Crear mesa del altar
     */
    createAltar() {
      // Mesa de altar - cubo allongado
      const geometry = new THREE.BoxGeometry(4, 0.8, 2);
      
      // Textura procedimental de mármol
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Fondo mármol
      ctx.fillStyle = '#f5f5f0';
      ctx.fillRect(0, 0, 512, 512);
      
      // Vetas
      ctx.strokeStyle = 'rgba(180, 180, 180, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.quadraticCurveTo(
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512
        );
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1
      });

      this.altar = new THREE.Mesh(geometry, material);
      this.altar.position.y = -0.5;
      this.altar.receiveShadow = true;
      this.altar.castShadow = true;
      this.scene.add(this.altar);
    },

    /**
     * Crear cruz
     */
    createCross() {
      const crossGroup = new THREE.Group();

      // Material emissive para luz propia
      const crossMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        emissive: 0xd4af37,
        emissiveIntensity: 0.3,
        roughness: 0.4,
        metalness: 0.6
      });

      // Columna vertical
      const verticalGeom = new THREE.BoxGeometry(0.15, 1.5, 0.15);
      const vertical = new THREE.Mesh(verticalGeom, crossMaterial);
      vertical.position.y = 1.5;
      crossGroup.add(vertical);

      // Barra horizontal
      const horizontalGeom = new THREE.BoxGeometry(0.8, 0.1, 0.1);
      const horizontal = new THREE.Mesh(horizontalGeom, crossMaterial);
      horizontal.position.y = 1.9;
      crossGroup.add(horizontal);

      // Base
      const baseGeom = new THREE.BoxGeometry(0.3, 0.1, 0.3);
      const base = new THREE.Mesh(baseGeom, crossMaterial);
      base.position.y = 0.65;
      crossGroup.add(base);

      crossGroup.position.set(0, 0.9, 0);
      crossGroup.userData.name = 'cross';
      this.cross = crossGroup;
      this.scene.add(crossGroup);
    },

    /**
     * Crear velas
     */
    createCandles() {
      const candlePositions = [
        { x: -1.2, z: 0.3 },
        { x: 1.2, z: 0.3 }
      ];

      candlePositions.forEach((pos, index) => {
        // Vela
        const candleGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 16);
        const candleMat = new THREE.MeshStandardMaterial({
          color: 0xfff8e7,
          roughness: 0.8
        });
        const candle = new THREE.Mesh(candleGeom, candleMat);
        candle.position.set(pos.x, 0.25, pos.z);
        candle.castShadow = true;
        this.scene.add(candle);

        // Llama (cono con shader)
        const flameGeom = new THREE.ConeGeometry(0.06, 0.15, 8);
        const flameMat = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 }
          },
          vertexShader: `
            varying vec2 vUv;
            uniform float uTime;
            void main() {
              vUv = uv;
              vec3 pos = position;
              // Animación de llama
              pos.x += sin(uTime * 10.0 + pos.y * 5.0) * 0.02;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            void main() {
              float gradient = 1.0 - vUv.y;
              vec3 color = mix(vec3(1.0, 0.5, 0.0), vec3(1.0, 0.9, 0.5), gradient);
              float alpha = 1.0 - vUv.y * 0.5;
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide
        });
        const flame = new THREE.Mesh(flameGeom, flameMat);
        flame.position.set(pos.x, 0.65, pos.z);
        flame.userData.isFlame = true;
        flame.userData.candleIndex = index;
        this.candles.push(flame);
        this.scene.add(flame);

        // PointLight para cada vela
        const candleLight = new THREE.PointLight(0xffaa33, 0.5, 3);
        candleLight.position.set(pos.x, 0.7, pos.z);
        candleLight.castShadow = true;
        candleLight.userData.candleIndex = index;
        candleLight.visible = true;
        this.scene.add(candleLight);
        this.candles.push(candleLight);
      });
    },

    /**
     * Crear flores
     */
    createFlowers() {
      const flowerPositions = [
        { x: -1.5, z: -0.5 },
        { x: 1.5, z: -0.5 }
      ];

      flowerPositions.forEach((pos, index) => {
        // Tallos
        const stemGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const stem = new THREE.Mesh(stemGeom, stemMat);
        stem.position.set(pos.x, 0.3, pos.z);
        this.scene.add(stem);

        // Flores (esferas simplificadas)
        const flowerGeom = new THREE.SphereGeometry(0.12, 8, 8);
        const flowerMat = new THREE.MeshStandardMaterial({
          color: index === 0 ? 0xff69b4 : 0xffb6c1,
          roughness: 0.6,
          transparent: true,
          opacity: 0.9
        });
        const flower = new THREE.Mesh(flowerGeom, flowerMat);
        flower.position.set(pos.x, 0.55, pos.z);
        flower.userData.name = 'flower';
        flower.userData.flowerIndex = index;
        flower.userData.originalPos = { x: pos.x, y: 0.55, z: pos.z };
        this.flowers.push(flower);
        this.scene.add(flower);
      });
    },

    /**
     * Crear pano del altar
     */
    createAltarCloth() {
      const clothGeom = new THREE.PlaneGeometry(3.5, 1.8);
      const clothMat = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.7,
        side: THREE.DoubleSide
      });

      this.altarCloth = new THREE.Mesh(clothGeom, clothMat);
      this.altarCloth.rotation.x = -Math.PI / 2;
      this.altarCloth.position.set(0, 0.01, 0);
      this.scene.add(this.altarCloth);
    },

    /**
     * Configurar luces
     */
    setupLights() {
      // Luz ambiental
      const ambient = new THREE.AmbientLight(0x404060, 0.4);
      this.scene.add(ambient);

      // Luz de ventana (azul-blanco desde arriba)
      const windowLight = new THREE.DirectionalLight(0xaaccff, 0.6);
      windowLight.position.set(0, 10, 2);
      windowLight.castShadow = true;
      windowLight.shadow.mapSize.width = 1024;
      windowLight.shadow.mapSize.height = 1024;
      this.scene.add(windowLight);

      // Luz suave frontal
      const frontLight = new THREE.DirectionalLight(0xffffff, 0.3);
      frontLight.position.set(0, 2, 10);
      this.scene.add(frontLight);
    },

    /**
     * Configurar controles de órbita
     */
    setupControls() {
      if (typeof THREE.OrbitControls === 'undefined') return;

      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enableZoom = false;
      this.controls.enablePan = false;
      this.controls.minPolarAngle = Math.PI / 3;
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minAzimuthAngle = -Math.PI / 4;
      this.controls.maxAzimuthAngle = Math.PI / 4;
      this.controls.autoRotate = false;
      this.controls.autoRotateSpeed = 0.5;
    },

    /**
     * Configurar interacciones click
     */
    setupInteractions() {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      this.renderer.domElement.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children, true);

        intersects.forEach(intersect => {
          const obj = intersect.object;

          // Click en cruz
          if (obj.userData.name === 'cross') {
            this.animateCrossGlow();
          }

          // Click en vela
          if (obj.userData.isFlame) {
            this.toggleCandle(obj.userData.candleIndex);
          }

          // Click en flor
          if (obj.userData.name === 'flower') {
            this.offerFlowers(obj.userData.flowerIndex);
          }
        });
      });
    },

    /**
     * Animación de resplandor de cruz
     */
    animateCrossGlow() {
      const originalEmissive = this.cross.children[0].material.emissiveIntensity;
      
      // Aumentar brillo
      this.cross.children.forEach(child => {
        if (child.material.emissive) {
          child.material.emissiveIntensity = 1;
        }
      });

      // Mostrar cita
      this.showCitation('"Yo estaba en el jardín y tenía una misión que cumplir..." - Juan 18:1');

      // Restaurar
      setTimeout(() => {
        this.cross.children.forEach(child => {
          if (child.material.emissive) {
            child.material.emissiveIntensity = originalEmissive;
          }
        });
      }, 2000);
    },

    /**
     * Mostrar cita del Evangelista
     */
    showCitation(text) {
      const citation = document.createElement('div');
      citation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        color: #f4e2a1;
        background: rgba(5,13,26,0.95);
        padding: 1.5rem 2rem;
        border-radius: 8px;
        border: 1px solid rgba(212,175,55,0.5);
        text-align: center;
        max-width: 400px;
        animation: citationFade 4s ease-out forwards;
        z-index: 10000;
      `;
      citation.textContent = text;
      document.body.appendChild(citation);

      // Animación
      if (!document.getElementById('citation-style')) {
        const style = document.createElement('style');
        style.id = 'citation-style';
        style.textContent = `
          @keyframes citationFade {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            70% { opacity: 1; }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
          }
        `;
        document.head.appendChild(style);
      }

      setTimeout(() => citation.remove(), 4000);
    },

    /**
     * Alternar vela encendida/apagada
     */
    toggleCandle(index) {
      // Buscar la luz de esta vela
      const light = this.scene.children.find(child => 
        child.userData && child.userData.candleIndex === index && 
        child.type === 'PointLight'
      );

      if (light) {
        light.visible = !light.visible;
        
        // Sonido de vela
        if (light.visible) {
          this.playCandleSound();
        }
      }

      // Ocultar/mostrar llama
      const flame = this.candles.find(c => 
        c.userData && c.userData.candleIndex === index && c.userData.isFlame
      );
      if (flame) {
        flame.visible = light.visible;
      }
    },

    /**
     * Ofrecer flores a María
     */
    offerFlowers(flowerIndex) {
      const flower = this.flowers[flowerIndex];
      if (!flower) return;

      // Animación de ascenso en espiral
      const startY = flower.position.y;
      const duration = 3000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ascenso con espiral
        flower.position.y = startY + progress * 3;
        flower.position.x = flower.userData.originalPos.x + Math.sin(progress * Math.PI * 4) * 0.3;
        flower.position.z = flower.userData.originalPos.z + Math.cos(progress * Math.PI * 4) * 0.3;
        flower.material.opacity = 1 - progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          flower.visible = false;
        }
      };

      animate();

      // Sonido de campanilla
      this.playBellSound();

      // Mensaje
      this.showCitation('Has ofrecido estas flores a María, Madre del cielo');
    },

    /**
     * Configurar observador de visibilidad
     */
    setupVisibilityObserver() {
      const observer = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
        if (this.isVisible) {
          this.resume();
        } else {
          this.pause();
        }
      }, { threshold: 0.5 });

      observer.observe(this.container);
    },

    /**
     * Inicializar audio
     */
    initAudio() {
      if (this.audioInitialized) return;
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioInitialized = true;
    },

    /**
     * Reproducir audio ambiental
     */
    playAmbient() {
      this.initAudio();
      if (this.ambientAudio || this.isPlaying) return;

      // Crear oscilador para sonido ambiente de catedral
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(110, this.audioContext.currentTime);
      
      // Múltiples armónicos para efecto de catedral
      const osc2 = this.audioContext.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(165, this.audioContext.currentTime);

      const gain2 = this.audioContext.createGain();
      gain2.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);

      // Efecto de reverberación simple
      const convolver = this.audioContext.createConvolver();
      // (simplificado sin impulso)

      oscillator.connect(gainNode);
      osc2.connect(gain2);
      gainNode.connect(this.audioContext.destination);
      gain2.connect(this.audioContext.destination);

      oscillator.start();
      osc2.start();

      this.ambientAudio = { oscillator, osc2, gainNode };
      this.isPlaying = true;
    },

    /**
     * Sonido de vela (crackling)
     */
    playCandleSound() {
      this.initAudio();
      
      // Crear ruido para crackling
      const bufferSize = this.audioContext.sampleRate * 0.5;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;

      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

      noise.connect(gain);
      gain.connect(this.audioContext.destination);
      noise.start();
    },

    /**
     * Sonido de campanilla
     */
    playBellSound() {
      this.initAudio();
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 1);

      gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + 2);
    },

    /**
     * Modo adoración (cámara automática)
     */
    toggleAdoration() {
      if (this.controls) {
        this.isAutoRotate = !this.isAutoRotate;
        this.controls.autoRotate = this.isAutoRotate;
        
        if (this.isAutoRotate && !this.isPlaying) {
          this.playAmbient();
        }
      }
    },

    /**
     * Pausar renderizado
     */
    pause() {
      this.renderer.setAnimationLoop(null);
    },

    /**
     * Reanudar renderizado
     */
    resume() {
      this.renderer.setAnimationLoop(() => this.animate());
    },

    /**
     * 节流 en modo bajo consumo
     */
    throttle() {
      // Reducir calidad de sombras y limitar fps
      if (this.renderer) {
        this.renderer.setPixelRatio(1);
        this.scene.traverse(obj => {
          if (obj.isMesh && obj.material) {
            obj.material.needsUpdate = true;
          }
        });
      }
    },

    /**
     * Animación principal
     */
    animate() {
      if (!this.isVisible) return;

      const time = Date.now() * 0.001;

      // Actualizar llamas
      this.candles.forEach(candle => {
        if (candle.userData.isFlame && candle.material.uniforms) {
          candle.material.uniforms.uTime.value = time;
        }
      });

      if (this.controls) {
        this.controls.update();
      }

      this.renderer.render(this.scene, this.camera);
    },

    /**
     * Resize handler
     */
    onResize() {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    },

    /**
     * Limpiar recursos
     */
    dispose() {
      this.pause();
      if (this.renderer) {
        this.renderer.dispose();
      }
      if (this.audioContext) {
        this.audioContext.close();
      }
    }
  };

  // Auto-inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // No inicializar automáticamente, solo bajo demanda
      window.Altar3D = Altar3D;
    });
  } else {
    window.Altar3D = Altar3D;
  }

})();