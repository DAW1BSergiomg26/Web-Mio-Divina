/**
 * Vitralería Digital Generativa
 * Algoritmo de Voronoi para vidrieras sagradas con luz interactiva
 */
(function() {
  'use strict';

  const StainedGlass = {
    canvas: null,
    ctx: null,
    cells: [],
    width: 0,
    height: 0,
    seed: 0,
    mouseX: 0,
    mouseY: 0,
    animationId: null,
    
    palettes: {
      mariana: ['#1e3a5f', '#2e5a8f', '#4a7fb0', '#6fa8dc', '#d4af37', '#f4e2a1', '#ffffff'],
      cristo: ['#8b2323', '#a84343', '#d4af37', '#b8960c', '#f4e2a1', '#ffffff'],
      saints: ['#2d5a3d', '#4a7d5c', '#d4af37', '#b8960c', '#f4e2a1'],
      ordinaria: ['#2a3a4a', '#3a4a5a', '#4a5a6a', '#d4af37', '#b8960c']
    },

    init(containerSelector, options = {}) {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      
      this.width = container.offsetWidth;
      this.height = container.offsetHeight;
      this.seed = options.seed || Math.random() * 10000;
      
      this.createCanvas(container);
      this.generateVoronoi(options.palette || 'mariana');
      this.bindEvents();
      this.animate();
    },

    createCanvas(container) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.08;
      `;
      container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    },

    generateVoronoi(paletteKey) {
      const numPoints = Math.floor(this.width * this.height / 15000) + 10;
      const points = [];
      
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: this.seededRandom(this.seed + i) * this.width,
          y: this.seededRandom(this.seed + i + 1000) * this.height,
          color: this.getRandomColor(paletteKey)
        });
      }

      this.cells = [];
      const step = 4;
      
      for (let y = 0; y < this.height; y += step) {
        for (let x = 0; x < this.width; x += step) {
          let closest = null;
          let minDist = Infinity;
          
          for (const point of points) {
            const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (dist < minDist) {
              minDist = dist;
              closest = point;
            }
          }
          
          if (closest && minDist < 50) {
            this.cells.push({ x, y, color: closest.color });
          }
        }
      }
    },

    seededRandom(seed) {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    },

    getRandomColor(paletteKey) {
      const palette = this.palettes[paletteKey] || this.palettes.ordinaria;
      return palette[Math.floor(this.seededRandom(this.seed + Math.random() * 100) * palette.length)];
    },

    bindEvents() {
      document.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      });
    },

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      
      const time = Date.now() * 0.001;
      
      for (const cell of this.cells) {
        const distToMouse = Math.sqrt((cell.x - this.mouseX) ** 2 + (cell.y - this.mouseY) ** 2);
        const brightness = Math.max(0.3, 1 - distToMouse / 200);
        
        this.ctx.fillStyle = cell.color;
        this.ctx.globalAlpha = 0.3 * brightness;
        this.ctx.fillRect(cell.x, cell.y, 4, 4);
        
        const noise = Math.sin(time + cell.x * 0.01 + cell.y * 0.01) * 0.02;
        this.ctx.globalAlpha = 0.1 + noise;
        this.ctx.fillRect(cell.x + Math.sin(time * 0.5 + cell.x * 0.02) * 2, cell.y, 4, 4);
      }
      
      this.animationId = requestAnimationFrame(() => this.animate());
    },

    createPersonalized(name, paletteKey = 'mariana') {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, 600, 800);
      
      this.generateVoronoiOnCanvas(ctx, 600, 800, paletteKey, this.seed);
      
      ctx.font = 'italic 48px "Cinzel Decorative", serif';
      ctx.fillStyle = '#d4af37';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(212,175,55,0.8)';
      ctx.shadowBlur = 20;
      ctx.fillText(name, 300, 400);
      
      ctx.font = '18px "EB Garamond", serif';
      ctx.fillStyle = 'rgba(244,226,161,0.7)';
      ctx.fillText('Inscrito en luz', 300, 440);
      
      return canvas.toDataURL('image/png');
    },

    generateVoronoiOnCanvas(ctx, w, h, paletteKey, seed) {
      const numPoints = 30;
      const points = [];
      
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.sin(seed + i * 0.5) * 0.5 + 0.5 * w,
          y: Math.sin(seed + i * 0.7) * 0.5 + 0.5 * h,
          color: this.getRandomColor(paletteKey)
        });
      }
      
      const step = 8;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          let closest = null;
          let minDist = Infinity;
          
          for (const point of points) {
            const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (dist < minDist) {
              minDist = dist;
              closest = point;
            }
          }
          
          if (closest) {
            ctx.fillStyle = closest.color;
            ctx.globalAlpha = 0.4;
            ctx.fillRect(x, y, step, step);
          }
        }
      }
    },

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  };

  window.StainedGlass = StainedGlass;
  console.log('🪟 Stained Glass module loaded');
})();