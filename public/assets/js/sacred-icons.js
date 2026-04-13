/**
 * Iconografía Sagrada Generativa
 * Halos, Mandorlas y Cruces Fractales
 */
(function() {
  'use strict';

  const SacredIcons = {
    canvas: null,
    ctx: null,
    
    init() {
      this.createStyles();
    },

    createStyles() {
      if (document.getElementById('sacred-icons-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'sacred-icons-styles';
      style.textContent = `
        .sacred-halo-container {
          position: relative;
          display: inline-block;
        }
        .sacred-halo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .sacred-mandorla {
          position: relative;
          display: inline-block;
        }
        .sacred-mandorla::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          right: -20%;
          bottom: -30%;
          background: radial-gradient(ellipse at center, 
            rgba(255,215,0,0.1) 0%, 
            rgba(255,215,0,0.05) 30%, 
            transparent 70%);
          animation: mandorlaPulse 4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes mandorlaPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .sacred-fractal-cross {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
      `;
      document.head.appendChild(style);
    },

    generateHalo(container, size = 150) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvas.className = 'sacred-halo';
      
      const ctx = canvas.getContext('2d');
      const center = size / 2;
      const time = Date.now() * 0.001;
      
      for (let r = 0; r < size / 2; r += 2) {
        const noise = Math.sin(time * 2 + r * 0.1) * 5;
        const alpha = 0.3 * (1 - r / (size / 2));
        
        const gradient = ctx.createRadialGradient(center, center, r, center, center, r + 5);
        gradient.addColorStop(0, `rgba(255,215,0,${alpha})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(center + noise * 0.2, center, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      const rays = 12;
      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2 + time * 0.2;
        const length = size * 0.4;
        
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(
          center + Math.cos(angle) * length,
          center + Math.sin(angle) * length
        );
        ctx.strokeStyle = `rgba(255,215,0,${0.3 + Math.sin(time * 3 + i) * 0.1})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      if (container) {
        container.appendChild(canvas);
      }
      
      return canvas;
    },

    generateFractalCross(container, size = 100) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvas.className = 'sacred-fractal-cross';
      
      const ctx = canvas.getContext('2d');
      const center = size / 2;
      const time = Date.now() * 0.001;
      
      const drawCross = (x, y, s, depth) => {
        if (depth <= 0 || s < 5) return;
        
        const breathFactor = 1 + Math.sin(time * 2 + depth) * 0.05;
        const h = s * breathFactor / 2;
        const w = h * 0.3;
        
        ctx.fillStyle = `rgba(212,175,55,${0.1 * depth})`;
        
        ctx.fillRect(x - w, y - h, w * 2, h * 2);
        ctx.fillRect(x - h, y - w, h * 2, w * 2);
        
        const newSize = s * 0.35;
        drawCross(x - h, y - h, newSize, depth - 1);
        drawCross(x + h, y - h, newSize, depth - 1);
        drawCross(x - h, y + h, newSize, depth - 1);
        drawCross(x + h, y + h, newSize, depth - 1);
      };
      
      drawCross(center, center, size * 0.8, 4);
      
      if (container) {
        container.appendChild(canvas);
      }
      
      return canvas;
    },

    createMandorlaEffect(imageElement) {
      const wrapper = document.createElement('div');
      wrapper.className = 'sacred-mandorla';
      
      if (imageElement) {
        imageElement.parentNode.insertBefore(wrapper, imageElement);
        wrapper.appendChild(imageElement);
      }
      
      return wrapper;
    }
  };

  window.SacredIcons = SacredIcons;
  document.addEventListener('DOMContentLoaded', () => SacredIcons.init());
  console.log('✝ Sacred Icons module loaded');
})();