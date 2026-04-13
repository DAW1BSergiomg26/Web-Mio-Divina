/**
 * Generador de Tarjetas Devocionales Personalizadas
 * Canvas para crear estampas únicas
 */
(function() {
  'use strict';

  const DevotionalCardGenerator = {
    canvas: null,
    ctx: null,

    init() {
      this.createStyles();
    },

    createStyles() {
      if (document.getElementById('devotional-card-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'devotional-card-styles';
      style.textContent = `
        .devotional-generator {
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
          background: rgba(10,22,40,0.8);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
        }
        .devotional-generator h3 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .devotional-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .devotional-form label {
          font-family: 'EB Garamond', serif;
          color: rgba(250,247,240,0.8);
        }
        .devotional-form input, .devotional-form select {
          padding: 10px 15px;
          background: rgba(5,13,26,0.8);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 8px;
          color: #faf7f0;
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
        }
        .devotional-form input:focus, .devotional-form select:focus {
          outline: none;
          border-color: #d4af37;
        }
        .devotional-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #d4af37, #b8960c);
          border: none;
          border-radius: 25px;
          color: #050d1a;
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        .devotional-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(212,175,55,0.5);
        }
        .devotional-preview {
          margin-top: 2rem;
          text-align: center;
        }
        .devotional-preview img {
          max-width: 100%;
          border: 2px solid rgba(212,175,55,0.5);
          border-radius: 8px;
        }
        .devotional-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 1rem;
        }
        .devotional-actions button {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid rgba(212,175,55,0.5);
          border-radius: 20px;
          color: #d4af37;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .devotional-actions button:hover {
          background: rgba(212,175,55,0.2);
        }
      `;
      document.head.appendChild(style);
    },

    createCard(options) {
      const { saintName, yourName, date, color = 'd4af37' } = options;
      
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      const colors = {
        d4af37: ['#d4af37', '#f4e2a1', '#b8960c'],
        8b2323: ['#8b2323', '#a84343', '#d4af37'],
        2d5a3d: ['#2d5a3d', '#4a7d5c', '#d4af37'],
        1e3a5f: ['#1e3a5f', '#4a7fb0', '#d4af37']
      };
      const palette = colors[color] || colors.d4af37;
      
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, 600, 800);
      
      this.drawOrnamentalFrame(ctx, 600, 800, palette);
      
      ctx.font = 'italic 28px "Cinzel Decorative", serif';
      ctx.fillStyle = palette[0];
      ctx.textAlign = 'center';
      ctx.shadowColor = palette[0];
      ctx.shadowBlur = 10;
      ctx.fillText(saintName, 300, 180);
      
      this.drawCross(ctx, 300, 300, 80, palette);
      
      ctx.font = 'italic 48px "EB Garamond", serif';
      ctx.fillStyle = palette[1];
      ctx.fillText(yourName || 'Tu nombre', 300, 450);
      
      ctx.font = '16px "EB Garamond", serif';
      ctx.fillStyle = 'rgba(244,226,161,0.6)';
      if (date) {
        ctx.fillText(date, 300, 490);
      }
      
      const prayer = this.getSaintPrayer(saintName);
      ctx.font = 'italic 18px "EB Garamond", serif';
      ctx.fillStyle = 'rgba(250,247,240,0.8)';
      ctx.fillText(prayer, 300, 600);
      
      ctx.font = '12px "EB Garamond", serif';
      ctx.fillStyle = 'rgba(212,175,55,0.5)';
      ctx.fillText('Generado por Web Mio Divina - Divina Misericordia', 300, 770);
      
      return canvas;
    },

    drawOrnamentalFrame(ctx, w, h, palette) {
      ctx.strokeStyle = palette[0];
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 30, w - 60, h - 60);
      
      for (let i = 0; i < 4; i++) {
        const x = 50 + i * 150;
        ctx.beginPath();
        ctx.arc(x, 50, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, h - 50, 15, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      for (let i = 0; i < 6; i++) {
        const y = 50 + i * 140;
        ctx.beginPath();
        ctx.arc(50, y, 10, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(w - 50, y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    },

    drawCross(ctx, x, y, size, palette) {
      ctx.fillStyle = palette[0];
      ctx.shadowColor = palette[0];
      ctx.shadowBlur = 20;
      
      const h = size * 3;
      const w = size * 0.8;
      const t = size * 0.25;
      
      ctx.fillRect(x - w/2, y - h/2, w, t);
      ctx.fillRect(x - t/2, y - h/2, t, h);
      
      ctx.shadowBlur = 0;
    },

    getSaintPrayer(saintName) {
      const prayers = {
        'María': 'Santa María, Madre de Dios, ruega por nosotros.',
        'Jesús': 'Jesús, en Vos confío.',
        'José': 'San José, patrones nuestro, rogad por nosotros.',
        'Faustina': 'Jesús, misericordioso, ten piedad de nosotros.',
        'default': 'Oración por la intersección del santo.'
      };
      
      const key = Object.keys(prayers).find(k => 
        saintName.toLowerCase().includes(k.toLowerCase())
      );
      return prayers[key] || prayers.default;
    },

    downloadCard(canvas, filename) {
      const link = document.createElement('a');
      link.download = filename || 'estampa-devocional.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  window.DevotionalCardGenerator = DevotionalCardGenerator;
  document.addEventListener('DOMContentLoaded', () => DevotionalCardGenerator.init());
  console('🖾 Devotional Card Generator loaded');
})();