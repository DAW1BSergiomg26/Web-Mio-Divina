/**
 * Partículas Sacras - Sistema de Partículas Ligero
 * Canvas HTML5 para partículas de luz dorada
 * Solo activo en secciones específicas
 */
(function() {
  'use strict';

  const PARTICLES_CONFIG = {
    maxParticles: 15,
    particleSize: { min: 2, max: 3 },
    speed: { min: 0.3, max: 0.8 },
    opacity: { min: 0.3, max: 0.8 },
    colors: ['rgba(212,175,55,', 'rgba(244,226,161,', 'rgba(250,247,240,'],
    sections: ['index', 'musica-sacra', 'devociones-marianas', 'maria'],
    frameBudget: 2 // ms por frame máximo
  };

  const SacredParticles = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    lastFrameTime: 0,
    enabled: false,

    init() {
      // Verificar si está habilitado para esta sección
      const path = window.location.pathname.toLowerCase();
      const isEnabledSection = PARTICLES_CONFIG.sections.some(s => path.includes(s));
      
      if (!isEnabledSection) return;
      if (window.matchMedia('(max-width: 768px)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.enabled = true;
      this.create();
      this.animate();
    },

    create() {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'sacred-particles';
      this.canvas.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: -1;
      `;
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.resize();
      this.createParticles();

      window.addEventListener('resize', () => this.resize());
    },

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createParticles() {
      this.particles = [];
      
      for (let i = 0; i < PARTICLES_CONFIG.maxParticles; i++) {
        this.particles.push(this.createParticle());
      }
    },

    createParticle() {
      const size = this.random(PARTICLES_CONFIG.particleSize.min, PARTICLES_CONFIG.particleSize.max);
      return {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height + this.canvas.height,
        size: size,
        speedY: -this.random(PARTICLES_CONFIG.speed.min, PARTICLES_CONFIG.speed.max),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: this.random(PARTICLES_CONFIG.opacity.min, PARTICLES_CONFIG.opacity.max),
        color: PARTICLES_CONFIG.colors[Math.floor(Math.random() * PARTICLES_CONFIG.colors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.02
      };
    },

    random(min, max) {
      return Math.random() * (max - min) + min;
    },

    animate(currentTime = 0) {
      if (!this.enabled) return;

      // Control de frame budget
      const deltaTime = currentTime - this.lastFrameTime;
      if (deltaTime < 16) { // ~60fps
        this.animationId = requestAnimationFrame((t) => this.animate(t));
        return;
      }
      this.lastFrameTime = currentTime;

      // Limpiar canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Actualizar y dibujar partículas
      this.particles.forEach(p => {
        // Movimiento
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.2;
        p.wobble += p.wobbleSpeed;

        // Reiniciar cuando sale por arriba
        if (p.y < -10) {
          p.y = this.canvas.height + 10;
          p.x = Math.random() * this.canvas.width;
        }

        // Dibujar
        this.ctx.beginPath();
        const gradient = this.ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 2
        );
        gradient.addColorStop(0, p.color + p.opacity + ')');
        gradient.addColorStop(1, p.color + '0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.animationId = requestAnimationFrame((t) => this.animate(t));
    },

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
      this.enabled = false;
    }
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SacredParticles.init());
  } else {
    SacredParticles.init();
  }

  window.SacredParticles = SacredParticles;
})();
