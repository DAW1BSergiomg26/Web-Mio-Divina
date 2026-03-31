/**
 * WebGL Hero - Cielo Nocturno Sagrado
 * Three.js con shaders GLSL para experiencia espiritual inmersiva
 */
(function() {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('THREE.js no está cargado, cargando desde CDN...');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => initSacredHero();
    document.head.appendChild(script);
  } else {
    initSacredHero();
  }

  function initSacredHero() {
    const SacredHero = {
      scene: null,
      camera: null,
      renderer: null,
      stars: null,
      nebula: null,
      lightBeam: null,
      crossParticles: null,
      container: null,
      animationId: null,
      mouseX: 0,
      mouseY: 0,
      targetRotationX: 0,
      targetRotationY: 0,
      isVisible: true,
      isMobile: false,
      clock: null,

      init(containerSelector = '#hero-canvas-container') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
          // Crear contenedor si no existe
          const hero = document.querySelector('.hero, section');
          if (hero) {
            this.container = document.createElement('div');
            this.container.id = 'hero-canvas-container';
            this.container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
            hero.style.position = 'relative';
            hero.insertBefore(this.container, hero.firstChild);
          }
        }
        if (!this.container) return;

        this.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.clock = new THREE.Clock();
        
        this.createScene();
        this.createStarField();
        this.createNebula();
        this.createLightBeam();
        this.createCrossParticles();
        this.setupMouseTracking();
        this.setupIntersectionObserver();
        this.animate();

        console.log('✝ Cielo nocturno sagrado inicializado');
      },

      createScene() {
        // Escena
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050814, 0.001);

        // Cámara
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.z = 500;

        // Renderizador
        this.renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.container.appendChild(this.renderer.domElement);

        // Luces
        const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
        this.scene.add(ambientLight);

        // Evento resize
        window.addEventListener('resize', () => this.onResize());
      },

      createStarField() {
        const starCount = this.isMobile ? 1500 : 3000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const sizes = [];
        const twinkleSpeeds = [];
        const colors = [];

        for (let i = 0; i < starCount; i++) {
          // Posición aleatoria en esfera
          const radius = 500 + Math.random() * 1000;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          positions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          );

          // Tamaño variable
          sizes.push(1 + Math.random() * 3);
          
          // Velocidad de parpadeo única
          twinkleSpeeds.push(0.5 + Math.random() * 2);

          // Color: blanco cálido a dorado
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            colors.push(1, 1, 1); // Blanco
          } else if (colorChoice < 0.9) {
            colors.push(1, 0.95, 0.8); // Blanco cálido
          } else {
            colors.push(1, 0.85, 0.5); // Dorado
          }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('twinkleSpeed', new THREE.Float32BufferAttribute(twinkleSpeeds, 1));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
          },
          vertexShader: `
            attribute float size;
            attribute float twinkleSpeed;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vTwinkleSpeed;
            uniform float uTime;
            uniform float uPixelRatio;
            
            void main() {
              vColor = color;
              vTwinkleSpeed = twinkleSpeed;
              
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vTwinkleSpeed;
            uniform float uTime;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
              float twinkle = sin(uTime * vTwinkleSpeed) * 0.3 + 0.7;
              
              gl_FragColor = vec4(vColor, alpha * twinkle);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
      },

      createNebula() {
        const geometry = new THREE.PlaneGeometry(1500, 1500);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(0xd4af37) }, // Dorado
            uColor2: { value: new THREE.Color(0x4a7db8) }  // Azul celestial
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            varying vec2 vUv;
            
            // Simplex noise function
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            
            float snoise(vec2 v) {
              const vec4 C = vec4(0.195, 0.495, 0.635, 0.195);
              vec2 i = floor(v + dot(v, C.yy));
              vec2 x0 = v - i + dot(i, C.xx);
              vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
              vec4 x12 = x0.xyxy + C.xxzz;
              x12.xy -= i1;
              i = mod289(i);
              vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
              vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
              m = m*m; m = m*m;
              vec3 x = 2.0 * fract(p * C.www) - 1.0;
              vec3 h = abs(x) - 0.5;
              vec3 ox = floor(x + 0.5);
              vec3 a0 = x - ox;
              m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
              vec3 g;
              g.x = a0.x * x0.x + h.x * x0.y;
              g.yz = a0.yz * x12.xz + h.yz * x12.yw;
              return 130.0 * dot(m, g);
            }
            
            void main() {
              vec2 uv = vUv - 0.5;
              float t = uTime * 0.02;
              
              float n1 = snoise(uv * 2.0 + t) * 0.5 + 0.5;
              float n2 = snoise(uv * 3.0 - t * 0.5) * 0.5 + 0.5;
              float n = (n1 + n2) * 0.5;
              
              // Gradiente radial
              float dist = length(uv);
              float fade = 1.0 - smoothstep(0.0, 0.7, dist);
              
              vec3 color = mix(uColor1, uColor2, n);
              
              gl_FragColor = vec4(color, n * fade * 0.15);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide
        });

        this.nebula = new THREE.Mesh(geometry, material);
        this.nebula.position.z = -800;
        this.scene.add(this.nebula);
      },

      createLightBeam() {
        // Rayo de luz cenital
        const geometry = new THREE.CylinderGeometry(5, 80, 600, 32, 1, true);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 }
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
              vUv = uv;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
              float gradient = 1.0 - vUv.y;
              float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
              
              // Efecto de luz pulsante
              float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
              
              // Polvo floating
              float dust = sin(vPosition.y * 0.1 + uTime * 2.0) * 0.5 + 0.5;
              
              float alpha = gradient * edge * pulse * 0.15 * (0.5 + dust * 0.5);
              
              vec3 color = vec3(1.0, 0.95, 0.8); // Luz cálida dorada
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide
        });

        this.lightBeam = new THREE.Mesh(geometry, material);
        this.lightBeam.position.set(0, 200, -300);
        this.scene.add(this.lightBeam);
      },

      createCrossParticles() {
        // Partículas formando una cruz
        const particleCount = this.isMobile ? 100 : 200;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const sizes = [];
        
        // Crear forma de cruz
        for (let i = 0; i < particleCount; i++) {
          const t = i / particleCount;
          
          // brazo vertical
          if (t < 0.5) {
            positions.push(
              (Math.random() - 0.5) * 5,
              (t - 0.25) * 400,
              0
            );
          } else {
            // brazo horizontal
            positions.push(
              (t - 0.75) * 400,
              (Math.random() - 0.5) * 5,
              0
            );
          }
          
          sizes.push(2 + Math.random() * 4);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uScrollY: { value: 0 }
          },
          vertexShader: `
            attribute float size;
            varying float vSize;
            uniform float uTime;
            uniform float uScrollY;
            
            void main() {
              vSize = size;
              vec3 pos = position;
              
              // Elevar con scroll
              pos.y += uScrollY;
              
              // Rotación suave
              float angle = uTime * 0.1;
              float cos = cos(angle);
              float sin = sin(angle);
              pos.x = pos.x * cos - pos.z * sin;
              pos.z = pos.x * sin + pos.z * cos;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying float vSize;
            uniform float uTime;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
              float pulse = sin(uTime * 2.0 + vSize) * 0.3 + 0.7;
              
              vec3 color = vec3(1.0, 0.9, 0.6); // Dorado cálido
              gl_FragColor = vec4(color, alpha * pulse * 0.8);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        this.crossParticles = new THREE.Points(geometry, material);
        this.crossParticles.position.set(0, 100, 100);
        this.scene.add(this.crossParticles);
      },

      setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
          this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
      },

      setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
            if (!this.isVisible) {
              this.pause();
            } else {
              this.resume();
            }
          });
        }, { threshold: 0.1 });

        if (this.container) {
          observer.observe(this.container);
        }

        // Detectar scroll para elevar cruz
        window.addEventListener('scroll', () => {
          const scrollY = window.scrollY;
          if (this.crossParticles && this.crossParticles.material.uniforms) {
            this.crossParticles.material.uniforms.uScrollY.value = Math.min(scrollY * 2, 400);
          }
        });
      },

      onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (this.stars && this.stars.material.uniforms) {
          this.stars.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
        }
      },

      pause() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
      },

      resume() {
        if (!this.animationId) {
          this.animate();
        }
      },

      animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.isVisible) return;

        const time = this.clock.getElapsedTime();

        // Actualizar shaders
        if (this.stars && this.stars.material.uniforms) {
          this.stars.material.uniforms.uTime.value = time;
        }
        if (this.nebula && this.nebula.material.uniforms) {
          this.nebula.material.uniforms.uTime.value = time;
        }
        if (this.lightBeam && this.lightBeam.material.uniforms) {
          this.lightBeam.material.uniforms.uTime.value = time;
        }
        if (this.crossParticles && this.crossParticles.material.uniforms) {
          this.crossParticles.material.uniforms.uTime.value = time;
        }

        // Parallax con mouse (limitado a ±15deg)
        this.targetRotationX = this.mouseY * 0.26; // ~15 degrees
        this.targetRotationY = this.mouseX * 0.26;
        
        this.camera.rotation.x += (this.targetRotationX - this.camera.rotation.x) * 0.02;
        this.camera.rotation.y += (this.targetRotationY - this.camera.rotation.y) * 0.02;

        this.renderer.render(this.scene, this.camera);
      },

      // Método para destruir y limpiar
      dispose() {
        this.pause();
        
        if (this.renderer) {
          this.renderer.dispose();
          this.container.removeChild(this.renderer.domElement);
        }
        
        if (this.stars) {
          this.stars.geometry.dispose();
          this.stars.material.dispose();
        }
        if (this.nebula) {
          this.nebula.geometry.dispose();
          this.nebula.material.dispose();
        }
        if (this.lightBeam) {
          this.lightBeam.geometry.dispose();
          this.lightBeam.material.dispose();
        }
        if (this.crossParticles) {
          this.crossParticles.geometry.dispose();
          this.crossParticles.material.dispose();
        }
      }
    };

    // Inicializar automáticamente
    SacredHero.init();

    // Exportar
    window.SacredHero = SacredHero;
  }

})();