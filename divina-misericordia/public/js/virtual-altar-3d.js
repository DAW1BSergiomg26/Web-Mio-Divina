/**
 * Altar Virtual 3D - Experiencia Inmersiva de Espacio Sagrado
 * Three.js con shaders avanzados e interactividad completa
 * Versión optimizada y corregida
 */
(function() {
  'use strict';

  let THREE = window.THREE;
  let scene, camera, renderer, controls;
  let altarGroup, crossGroup, candles = [], flowers = [];
  let isInitialized = false;
  let animationId = null;
  let audioContext = null;
  let isAdorationMode = false;

  const verses = [
    'Jn 3:16 - "Porque tanto amó Dios al mundo que dio a su Hijo único"',
    'Jn 1:1 - "En el principio existía la Palabra"',
    'Jn 1:14 - "La Palabra se hizo carne"',
    'Lc 22:19 - "Esto es mi cuerpo que se da por vosotros"',
    'Lc 22:20 - "Esta copa es la nueva alianza en mi sangre"',
    'Mt 26:26 - "Tomad y comed, esto es mi cuerpo"',
    'Jn 6:54 - "El que come mi carne y bebe mi sangre tiene vida eterna"',
    'Mt 28:20 - "Yo estaré con ustedes todos los días"',
    'Sal 23:1 - "El Señor es mi pastor, nada me falta"',
    'Sal 23:4 - "Aunque marche por valle de sombra muerte, no temeré"'
  ];

  const candleStates = [true, true, true, true];

  // Cargar THREE.js si no existe
  function loadThreeJS() {
    return new Promise((resolve, reject) => {
      if (window.THREE && window.THREE.OrbitControls) {
        THREE = window.THREE;
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
        orbitScript.onload = () => {
          THREE = window.THREE;
          resolve();
        };
        orbitScript.onerror = reject;
        document.head.appendChild(orbitScript);
      };
      threeScript.onerror = reject;
      document.head.appendChild(threeScript);
    });
  }

  // Inicializar escena
  function initScene() {
    const container = document.getElementById('altar-3d-container');
    if (!container) {
      console.error('Contenedor no encontrado');
      return false;
    }

    // Crear escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050d1a);
    scene.fog = new THREE.Fog(0x050d1a, 3, 15);

    // Cámara
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    camera.position.set(0, 1.5, 3.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Controls
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 1.5;
      controls.maxDistance = 6;
      controls.maxPolarAngle = Math.PI / 2 + 0.2;
      controls.target.set(0, 0.5, 0);
      controls.autoRotateSpeed = 0.5;
    }

    // Evento resize
    window.addEventListener('resize', onResize);

    return true;
  }

  // Configurar luces
  function setupLights() {
    // Luz ambiental
    const ambient = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambient);

    // Luz principal
    const mainLight = new THREE.DirectionalLight(0xfff5e0, 0.8);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 30;
    scene.add(mainLight);

    // Luz fill
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Spot para cruz
    const spot = new THREE.SpotLight(0xffdd88, 0.6);
    spot.position.set(0, 6, 2);
    spot.angle = Math.PI / 5;
    spot.penumbra = 0.4;
    spot.target.position.set(0, 0.5, 0);
    scene.add(spot);
    scene.add(spot.target);
  }

  // Crear altar base
  function createAltar() {
    altarGroup = new THREE.Group();

    // Mesa del altar
    const tableGeom = new THREE.BoxGeometry(3.5, 0.25, 1.6);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1a1208,
      roughness: 0.4,
      metalness: 0.1
    });
    const table = new THREE.Mesh(tableGeom, tableMat);
    table.position.y = 0.125;
    table.receiveShadow = true;
    altarGroup.add(table);

    // Panel frontal
    const frontGeom = new THREE.BoxGeometry(3.4, 0.3, 0.04);
    const frontMat = new THREE.MeshStandardMaterial({
      color: 0x2a1810,
      roughness: 0.5,
      metalness: 0.2
    });
    const front = new THREE.Mesh(frontGeom, frontMat);
    front.position.set(0, 0.15, 0.82);
    altarGroup.add(front);

    // Borde dorado
    const goldGeom = new THREE.BoxGeometry(3.5, 0.02, 0.02);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x221100,
      emissiveIntensity: 0.3
    });
    const gold = new THREE.Mesh(goldGeom, goldMat);
    gold.position.set(0, 0.265, 0.82);
    altarGroup.add(gold);

    // Paño rojo
    const clothGeom = new THREE.BoxGeometry(3.3, 0.06, 1.4);
    const clothMat = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      roughness: 0.85,
      metalness: 0
    });
    const cloth = new THREE.Mesh(clothGeom, clothMat);
    cloth.position.set(0, 0.28, 0);
    altarGroup.add(cloth);

    scene.add(altarGroup);
  }

  // Crear cruz
  function createCross() {
    crossGroup = new THREE.Group();

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x6b3a1f,
      roughness: 0.7,
      metalness: 0.05
    });

    // Poste vertical
    const postGeom = new THREE.CylinderGeometry(0.04, 0.055, 1.4, 12);
    const post = new THREE.Mesh(postGeom, woodMat);
    post.position.y = 0.7;
    post.castShadow = true;
    crossGroup.add(post);

    // Brazo horizontal
    const armGeom = new THREE.CylinderGeometry(0.035, 0.045, 0.8, 12);
    const arm = new THREE.Mesh(armGeom, woodMat.clone());
    arm.rotation.z = Math.PI / 2;
    arm.position.y = 1.15;
    arm.castShadow = true;
    crossGroup.add(arm);

    // Cuerpo de Cristo (simplificado)
    const bodyGeom = new THREE.CylinderGeometry(0.05, 0.04, 0.35, 8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xe8dcc8,
      roughness: 0.75
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(0, 0.85, 0.04);
    body.rotation.x = Math.PI / 8;
    body.castShadow = true;
    crossGroup.add(body);

    // Cabeza
    const headGeom = new THREE.SphereGeometry(0.055, 8, 8);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.set(0, 1.1, 0.04);
    crossGroup.add(head);

    // Piernas
    const legGeom = new THREE.CylinderGeometry(0.025, 0.03, 0.18, 6);
    const leftLeg = new THREE.Mesh(legGeom, bodyMat);
    leftLeg.position.set(-0.04, 0.6, 0.04);
    leftLeg.rotation.z = 0.35;
    crossGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, bodyMat.clone());
    rightLeg.position.set(0.04, 0.6, 0.04);
    rightLeg.rotation.z = -0.35;
    crossGroup.add(rightLeg);

    //userData para interacción
    crossGroup.userData = { name: 'cross' };
    crossGroup.position.set(0, 0.55, 0);
    crossGroup.scale.set(1.2, 1.2, 1.2);

    scene.add(crossGroup);
  }

  // Crear velas
  function createCandles() {
    const positions = [
      { x: -1.1, z: 0.3 },
      { x: 1.1, z: 0.3 },
      { x: -1.1, z: -0.2 },
      { x: 1.1, z: -0.2 }
    ];

    positions.forEach((pos, index) => {
      // Portavela
      const holderGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 16);
      const holderMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.2
      });
      const holder = new THREE.Mesh(holderGeom, holderMat);
      holder.position.set(pos.x, 0.31, pos.z);
      scene.add(holder);

      // Vela
      const candleGeom = new THREE.CylinderGeometry(0.045, 0.055, 0.4, 12);
      const candleMat = new THREE.MeshStandardMaterial({
        color: 0xfffef5,
        roughness: 0.9
      });
      const candle = new THREE.Mesh(candleGeom, candleMat);
      candle.position.set(pos.x, 0.18, pos.z);
      candle.castShadow = true;
      scene.add(candle);

      // Llama con shader
      const flameGeom = new THREE.ConeGeometry(0.035, 0.12, 8);
      const flameMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uLit: { value: 1.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave = sin(uTime * 12.0 + pos.y * 8.0) * 0.01;
            pos.x += wave;
            pos.z += wave * 0.5;
            float flicker = sin(uTime * 20.0) * 0.008;
            pos.y += flicker;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uLit;
          void main() {
            vec3 core = vec3(1.0, 0.95, 0.85);
            vec3 mid = vec3(1.0, 0.65, 0.25);
            vec3 outer = vec3(1.0, 0.25, 0.05);
            float dist = length(vUv - 0.5) * 2.0;
            vec3 color = mix(core, mid, dist);
            color = mix(color, outer, smoothstep(0.3, 1.0, dist));
            float alpha = (1.0 - dist * 0.8) * uLit;
            float glow = (1.0 - dist) * 0.4 * uLit;
            gl_FragColor = vec4(color + glow, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const flame = new THREE.Mesh(flameGeom, flameMat);
      flame.position.set(pos.x, 0.44, pos.z);
      flame.userData = { name: 'flame', candleIndex: index, isLit: true };
      candles.push(flame);
      scene.add(flame);

      // Luz de vela
      const light = new THREE.PointLight(0xffaa33, 0.6, 2.5);
      light.position.set(pos.x, 0.48, pos.z);
      light.castShadow = true;
      light.userData = { name: 'candleLight', candleIndex: index };
      candles.push(light);
      scene.add(light);
    });
  }

  // Crear flores
  function createFlowers() {
    const configs = [
      { x: -1.35, z: -0.3, color: 0xff69b4 },
      { x: 1.35, z: -0.3, color: 0xffffff },
      { x: -1.35, z: 0.1, color: 0xffb6c1 },
      { x: 1.35, z: 0.1, color: 0xe6e6fa }
    ];

    configs.forEach((cfg, index) => {
      const group = new THREE.Group();

      // Tallo
      const stemGeom = new THREE.CylinderGeometry(0.012, 0.015, 0.35, 6);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
      const stem = new THREE.Mesh(stemGeom, stemMat);
      stem.position.y = 0.175;
      group.add(stem);

      // Pétalos
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const petalGeom = new THREE.SphereGeometry(0.06, 6, 6);
        petalGeom.scale(1, 0.25, 1);
        const petalMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.6,
          transparent: true,
          opacity: 0.9
        });
        const petal = new THREE.Mesh(petalGeom, petalMat);
        petal.position.set(Math.cos(angle) * 0.045, 0.35, Math.sin(angle) * 0.045);
        group.add(petal);
      }

      // Centro
      const centerGeom = new THREE.SphereGeometry(0.03, 6, 6);
      const centerMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.3 });
      const center = new THREE.Mesh(centerGeom, centerMat);
      center.position.y = 0.35;
      group.add(center);

      group.position.set(cfg.x, 0.31, cfg.z);
      group.userData = { name: 'flower', flowerIndex: index };
      flowers.push(group);
      scene.add(group);
    });
  }

  // Crear Biblia
  function createBible() {
    const group = new THREE.Group();

    // Cover
    const coverGeom = new THREE.BoxGeometry(0.4, 0.06, 0.28);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x1a0a0a,
      roughness: 0.8
    });
    const cover = new THREE.Mesh(coverGeom, coverMat);
    cover.castShadow = true;
    group.add(cover);

    // Páginas
    const pagesGeom = new THREE.BoxGeometry(0.36, 0.04, 0.24);
    const pagesMat = new THREE.MeshStandardMaterial({ color: 0xfffef0 });
    const pages = new THREE.Mesh(pagesGeom, pagesMat);
    pages.position.y = 0.005;
    group.add(pages);

    // Cruz dorada
    const crossV = new THREE.BoxGeometry(0.06, 0.045, 0.008);
    const crossMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2
    });
    const vBar = new THREE.Mesh(crossV, crossMat);
    vBar.position.set(0, 0, 0.144);
    group.add(vBar);

    const crossH = new THREE.BoxGeometry(0.03, 0.015, 0.008);
    const hBar = new THREE.Mesh(crossH, crossMat);
    hBar.position.set(0, 0.015, 0.144);
    group.add(hBar);

    group.position.set(-0.5, 0.34, -0.15);
    group.userData = { name: 'bible' };
    scene.add(group);
  }

  // Crear agua bendita
  function createHolyWater() {
    const fontGeom = new THREE.CylinderGeometry(0.05, 0.055, 0.12, 12);
    const fontMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15
    });
    const font = new THREE.Mesh(fontGeom, fontMat);
    font.position.set(0.8, 0.37, -0.4);
    font.userData = { name: 'holyWater' };
    scene.add(font);

    const waterGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1
    });
    const water = new THREE.Mesh(waterGeom, waterMat);
    water.position.set(0.8, 0.37, -0.4);
    scene.add(water);
  }

  // Configurar interacciones
  function setupInteractions() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length === 0) return;

      let obj = intersects[0].object;
      while (obj && (!obj.userData || !obj.userData.name)) {
        obj = obj.parent;
      }

      if (!obj || !obj.userData?.name) return;

      const name = obj.userData.name;

      if (name === 'cross') {
        onCrossClick();
      } else if (name === 'flame') {
        onCandleClick(obj.userData.candleIndex);
      } else if (name === 'flower') {
        onFlowerClick(obj.userData.flowerIndex);
      } else if (name === 'bible') {
        onBibleClick();
      } else if (name === 'holyWater') {
        onHolyWaterClick();
      }
    });

    // Doble clic para reset
    renderer.domElement.addEventListener('dblclick', () => {
      if (controls) {
        camera.position.set(0, 1.5, 3.5);
        controls.target.set(0, 0.5, 0);
      }
    });
  }

  // Manejadores de clicks
  function onCrossClick() {
    // Efecto visual
    crossGroup.children.forEach(child => {
      if (child.material?.emissive) {
        child.material.emissive = new THREE.Color(0xffdd44);
        child.material.emissiveIntensity = 0.4;
      }
    });

    setTimeout(() => {
      crossGroup.children.forEach(child => {
        if (child.material?.emissive) {
          child.material.emissiveIntensity = 0;
        }
      });
    }, 1500);

    // Versículo
    const verse = verses[Math.floor(Math.random() * verses.length)];
    showModal(verse, '✝ Versículo del Día');
    playChime();
  }

  function onCandleClick(index) {
    const flame = candles.find(c => c.userData?.candleIndex === index && c.userData?.name === 'flame');
    const light = candles.find(c => c.userData?.candleIndex === index && c.userData?.name === 'candleLight');

    if (!flame || !light) return;

    candleStates[index] = !candleStates[index];
    const isLit = candleStates[index];

    flame.material.uniforms.uLit.value = isLit ? 1.0 : 0.0;
    light.intensity = isLit ? 0.6 : 0;

    showToast(isLit ? 'La vela se enciende... 🔥' : 'La vela se apaga... ✨');
    
    if (isLit) playFlameSound();
  }

  function onFlowerClick(index) {
    const flower = flowers[index];
    if (!flower) return;

    playChime();

    // Animación de ascenso
    const startY = flower.position.y;
    const startTime = Date.now();

    function animateFlower() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 2500, 1);

      flower.position.y = startY + progress * 2.5;
      flower.position.x += Math.sin(progress * Math.PI * 3) * 0.003;
      flower.rotation.y += 0.02;

      flower.traverse(child => {
        if (child.material?.opacity !== undefined) {
          child.material.opacity = 1 - progress;
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animateFlower);
      } else {
        flower.visible = false;
      }
    }

    animateFlower();

    const msgs = [
      'Has ofrecido estas flores a María 💐',
      'María acepta tu ofrenda con amor 🌸',
      'Tu devoción sube hacia el cielo ✨'
    ];
    showToast(msgs[Math.floor(Math.random() * msgs.length)]);
  }

  function onBibleClick() {
    const verse = verses[Math.floor(Math.random() * verses.length)];
    showModal(verse, '📖 Sagrada Escritura');
    playChime();
  }

  function onHolyWaterClick() {
    playWaterSound();
    showToast('Te has santificado con agua bendita ✨');
  }

  // Mostrar modal
  function showModal(text, title) {
    const existing = document.querySelector('.altar-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'altar-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Cerrar">&times;</button>
        <h3 class="modal-title">${title}</h3>
        <p class="modal-text">${text}</p>
      </div>
    `;
    document.body.appendChild(modal);

    // Estilos del modal
    const style = document.createElement('style');
    style.textContent = `
      .altar-modal { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.3s; }
      .modal-backdrop { position: absolute; inset: 0; background: rgba(5,13,26,0.92); }
      .modal-content { position: relative; background: linear-gradient(135deg, #1a0a0a, #0d1a2a); border: 2px solid #d4af37; border-radius: 12px; padding: 2rem; max-width: 500px; text-align: center; box-shadow: 0 0 40px rgba(212,175,55,0.4); animation: modalIn 0.4s; }
      .modal-title { color: #d4af37; font-family: 'Cinzel', serif; margin-bottom: 1rem; font-size: 1.4rem; }
      .modal-text { color: #f4e2a1; font-size: 1.1rem; font-style: italic; line-height: 1.6; }
      .modal-close { position: absolute; top: 0.75rem; right: 0.75rem; width: 32px; height: 32px; background: transparent; border: 1px solid rgba(212,175,55,0.4); border-radius: 50%; color: #f4e2a1; font-size: 1.25rem; cursor: pointer; transition: all 0.2s; }
      .modal-close:hover { background: rgba(212,175,55,0.2); border-color: #d4af37; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes modalIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    `;
    document.head.appendChild(style);

    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  }

  // Mostrar toast
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'altar-toast';
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
      .altar-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #1a0a0a, #0d1a2a); border: 1px solid #d4af37; color: #f4e2a1; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.95rem; z-index: 10001; animation: toastIn 0.3s, toastOut 0.3s 2.7s forwards; }
      @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      @keyframes toastOut { from { opacity: 1; } to { opacity: 0; } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  // Audio
  function initAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  function playChime() {
    initAudio();
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, i) => {
      setTimeout(() => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        gain.gain.setValueAtTime(0.06, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2.5);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + 2.5);
      }, i * 120);
    });
  }

  function playFlameSound() {
    initAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(420, audioContext.currentTime + 0.2);
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.8);
  }

  function playWaterSound() {
    initAudio();
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700 + Math.random() * 300, audioContext.currentTime);
        gain.gain.setValueAtTime(0.04, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + 0.4);
      }, i * 80);
    }
  }

  // Resize
  function onResize() {
    const container = document.getElementById('altar-3d-container');
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  // Animación principal
  function animate() {
    animationId = requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    // Actualizar llamas
    candles.forEach(candle => {
      if (candle.material?.uniforms?.uTime) {
        candle.material.uniforms.uTime.value = time;
      }
    });

    // Modo adoración
    if (controls && isAdorationMode) {
      controls.autoRotate = true;
    }

    if (controls) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  //API pública
  window.Altar3D = {
    toggleAdoration: function() {
      isAdorationMode = !isAdorationMode;
      if (controls) {
        controls.autoRotate = isAdorationMode;
      }
    },
    toggleCandle: function(index) {
      onCandleClick(index);
    },
    resetCamera: function() {
      if (camera && controls) {
        camera.position.set(0, 1.5, 3.5);
        controls.target.set(0, 0.5, 0);
      }
    }
  };

  // Inicializar
  async function init() {
    try {
      console.log('✝ Cargando THREE.js...');
      await loadThreeJS();
      
      console.log('✝ Iniciando escena...');
      if (!initScene()) return;
      
      console.log('✝ Creando altar...');
      setupLights();
      createAltar();
      createCross();
      createCandles();
      createFlowers();
      createBible();
      createHolyWater();
      setupInteractions();
      
      console.log('✝ Iniciando animación...');
      animate();
      
      isInitialized = true;
      console.log('✝ Altar Virtual 3D listo!');
      
      // Ocultar loader
      const loader = document.getElementById('viewer-loader');
      if (loader) loader.style.display = 'none';
      
    } catch (error) {
      console.error('✝ Error al inicializar:', error);
    }
  }

  // Iniciar cuando DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
