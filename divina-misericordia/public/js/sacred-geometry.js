/**
 * Geometría Sagrada Generativa
 * Canvas 2D con algoritmos de Flor de la Vida, Estrella de David, Mandala
 */
(function() {
  'use strict';

  const SacredGeometry = {
    canvas: null,
    ctx: null,
    animationId: null,
    rotation: 0,
    type: 'flower', // flower, star, mandala, vesica
    opacity: 0.06,
    color: '#d4af37',
    clickRevealed: false,
    rotationSpeed: 0.001, // ~60 segundos por revolución
    isRunning: false,

    /**
     * Inicializar geometría sagrada
     */
    init(options = {}) {
      this.type = options.type || 'flower';
      this.opacity = options.opacity || 0.06;
      this.color = options.color || '#d4af37';
      this.container = options.container || document.body;

      this.createCanvas();
      this.setupClickInteraction();
      this.animate();
      
      console.log('✝ Geometría sagrada inicializada:', this.type);
    },

    /**
     * Crear canvas
     */
    createCanvas() {
      if (this.canvas) return;

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'sacred-geometry-canvas';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: ${this.opacity};
        transition: opacity 0.5s ease;
      `;

      this.ctx = this.canvas.getContext('2d');
      this.resize();
      
      this.container.appendChild(this.canvas);

      window.addEventListener('resize', () => this.resize());
    },

    /**
     * Redimensionar canvas
     */
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    /**
     * Configurar interacción click
     */
    setupClickInteraction() {
      this.canvas.style.pointerEvents = 'auto';
      this.canvas.addEventListener('click', (e) => {
        this.reveal(e.clientX, e.clientY);
      });
    },

    /**
     * Revelar mensaje al hacer click
     */
    reveal(x, y) {
      if (this.clickRevealed) return;
      this.clickRevealed = true;

      // Aumentar opacidad temporalmente
      this.canvas.style.opacity = '0.3';

      // Crear mensaje
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        transform: translate(-50%, -50%);
        font-family: 'Cinzel', serif;
        font-size: 1.2rem;
        color: #f4e2a1;
        text-shadow: 0 0 20px rgba(212,175,55,0.8);
        animation: revealMessage 3s ease-out forwards;
        pointer-events: none;
        z-index: 10000;
        background: rgba(5,13,26,0.9);
        padding: 1rem 2rem;
        border-radius: 8px;
        border: 1px solid rgba(212,175,55,0.5);
      `;
      message.textContent = 'El cosmos entero es oración';
      document.body.appendChild(message);

      // Animación CSS
      if (!document.getElementById('reveal-style')) {
        const style = document.createElement('style');
        style.id = 'reveal-style';
        style.textContent = `
          @keyframes revealMessage {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            80% { opacity: 1; }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
          }
        `;
        document.head.appendChild(style);
      }

      // Restaurar opacidad después
      setTimeout(() => {
        this.canvas.style.opacity = String(this.opacity);
        message.remove();
        this.clickRevealed = false;
      }, 3000);
    },

    /**
     * Generar Flor de la Vida
     */
    drawFlowerOfLife(cx, cy, radius) {
      const circles = 7;
      const spacing = radius;

      for (let i = 0; i < circles; i++) {
        for (let j = 0; j < circles; j++) {
          const x = cx + (i - circles/2) * spacing;
          const y = cy + (j - circles/2) * spacing;
          
          this.ctx.beginPath();
          this.ctx.arc(x, y, radius, 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }
    },

    /**
     * Generar Estrella de David
     */
    drawStarOfDavid(cx, cy, size) {
      // Triángulo hacia arriba
      this.ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 120 - 90) * Math.PI / 180;
        const x = cx + Math.cos(angle) * size;
        const y = cy + Math.sin(angle) * size;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.stroke();

      // Triángulo hacia abajo
      this.ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 120 + 90) * Math.PI / 180;
        const x = cx + Math.cos(angle) * size;
        const y = cy + Math.sin(angle) * size;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.stroke();
    },

    /**
     * Generar Mandala procedural
     */
    drawMandala(cx, cy, radius, seed) {
      const petals = 8 + (seed % 12);
      const layers = 3 + (seed % 3);
      
      for (let layer = 0; layer < layers; layer++) {
        const layerRadius = radius * (layer + 1) / layers;
        const petalCount = petals * (layer + 1);
        
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2 + this.rotation;
          const nextAngle = ((i + 1) / petalCount) * Math.PI * 2 + this.rotation;
          
          const x1 = cx + Math.cos(angle) * layerRadius * 0.3;
          const y1 = cy + Math.sin(angle) * layerRadius * 0.3;
          const x2 = cx + Math.cos(angle) * layerRadius;
          const y2 = cy + Math.sin(angle) * layerRadius;
          const x3 = cx + Math.cos(nextAngle) * layerRadius;
          const y3 = cy + Math.sin(nextAngle) * layerRadius;
          
          this.ctx.beginPath();
          this.ctx.moveTo(cx, cy);
          this.ctx.quadraticCurveTo(x2, y2, cx, cy);
          this.ctx.stroke();
        }
      }
    },

    /**
     * Generar Vesica Piscis
     */
    drawVesicaPiscis(cx, cy, size) {
      // Primer círculo
      this.ctx.beginPath();
      this.ctx.arc(cx - size/2, cy, size, -Math.PI/2, Math.PI/2);
      this.ctx.stroke();

      // Segundo círculo
      this.ctx.beginPath();
      this.ctx.arc(cx + size/2, cy, size, Math.PI/2, -Math.PI/2);
      this.ctx.stroke();

      // Centro
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, size * 0.2, 0, Math.PI * 2);
      this.ctx.stroke();
    },

    /**
     * Animación principal
     */
    animate() {
      if (this.isRunning) return;
      this.isRunning = true;

      const loop = () => {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Configurar estilo
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const radius = Math.min(cx, cy) * 0.4;

        // Rotación
        this.rotation += this.rotationSpeed;

        // Dibujar según tipo
        switch (this.type) {
          case 'flower':
            this.drawFlowerOfLife(cx, cy, radius * 0.3);
            break;
          case 'star':
            this.drawStarOfDavid(cx, cy, radius * 0.6);
            break;
          case 'mandala':
            const seed = this.getDailySeed();
            this.drawMandala(cx, cy, radius, seed);
            break;
          case 'vesica':
            this.drawVesicaPiscis(cx, cy, radius * 0.5);
            break;
          default:
            this.drawFlowerOfLife(cx, cy, radius * 0.3);
        }

        this.animationId = requestAnimationFrame(loop);
      };

      loop();
    },

    /**
     * Obtener semilla única del día
     */
    getDailySeed() {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${now.getMonth()}${now.getDate()}`;
      return parseInt(dateStr) % 365;
    },

    /**
     * Actualizar color según tiempo litúrgico
     */
    setColor(color) {
      this.color = color;
    },

    /**
     * Pausar animación
     */
    pause() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.isRunning = false;
    },

    /**
     * Reanudar animación
     */
    resume() {
      if (!this.isRunning) {
        this.animate();
      }
    },

    /**
     * Cambiar tipo de geometría
     */
    setType(type) {
      this.type = type;
    },

    /**
     * Generar y descargar mandala del día
     */
    downloadDailyMandala() {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 800;
      tempCanvas.height = 800;
      const tempCtx = tempCanvas.getContext('2d');

      // Fondo
      tempCtx.fillStyle = '#050814';
      tempCtx.fillRect(0, 0, 800, 800);

      // Configurar estilo
      tempCtx.strokeStyle = '#d4af37';
      tempCtx.lineWidth = 2;

      const seed = this.getDailySeed();
      const cx = 400, cy = 400, radius = 300;
      const petals = 8 + (seed % 12);
      const layers = 3 + (seed % 3);

      for (let layer = 0; layer < layers; layer++) {
        const layerRadius = radius * (layer + 1) / layers;
        const petalCount = petals * (layer + 1);
        
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2;
          const x = cx + Math.cos(angle) * layerRadius;
          const y = cy + Math.sin(angle) * layerRadius;
          
          tempCtx.beginPath();
          tempCtx.arc(x, y, layerRadius * 0.3, 0, Math.PI * 2);
          tempCtx.stroke();
        }
      }

      // Añadir texto
      tempCtx.fillStyle = '#d4af37';
      tempCtx.font = '24px Cinzel';
      tempCtx.textAlign = 'center';
      tempCtx.fillText('Tu Mandala de Hoy', 400, 750);

      // Descargar
      const link = document.createElement('a');
      link.download = `mandala-${new Date().toISOString().split('T')[0]}.png`;
      link.href = tempCanvas.toDataURL('image/png');
      link.click();
    },

    /**
     * Limpiar recursos
     */
    dispose() {
      this.pause();
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
      this.canvas = null;
      this.ctx = null;
    }
  };

  // Inicialización automática
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SacredGeometry.init());
  } else {
    SacredGeometry.init();
  }

  // Exportar
  window.SacredGeometry = SacredGeometry;

})();