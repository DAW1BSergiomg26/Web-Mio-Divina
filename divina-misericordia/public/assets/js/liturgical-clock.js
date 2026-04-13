/**
 * Reloj Litúrgico - Horas Canónicas
 * Muestra la hora canónica actual con campanas para Ángelus y Hora de la Misericordia
 */
(function() {
  'use strict';

  const LiturgicalClock = {
    container: null,
    audioContext: null,
    lastChime: null,
    chimeInterval: null,

    horas: {
      '06:00': { nombre: 'Laudes', descripcion: 'Hora de la mañana - Oración de Alabar' },
      '09:00': { nombre: 'Tercia', descripcion: 'Tercera hora - Iluminación del Espíritu' },
      '12:00': { nombre: 'Ángelus', descripcion: 'Sexta hora - Anunciación del Ángel', especial: 'angelus' },
      '15:00': { nombre: 'Nona', descripcion: 'Novena hora - Hora de la Misericordia', especial: 'misericordia' },
      '18:00': { nombre: 'Vísperas', descripcion: 'Hora de la tarde - Acción de gracias' },
      '21:00': { nombre: 'Completas', descripcion: 'Hora de la noche - Preparación al descanso' }
    },

    init(containerSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.render();
      this.startChimeCheck();
    },

    getCurrentHora() {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeKey = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Encontrar la hora canónica más cercana
      const horasKeys = Object.keys(this.horas).map(t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      });
      
      const currentMinutes = hour * 60 + minute;
      let closest = null;
      let minDiff = Infinity;
      
      horasKeys.forEach(h => {
        const diff = Math.abs(h - currentMinutes);
        if (diff < minDiff && diff < 30) {
          minDiff = diff;
          closest = Object.keys(this.horas).find(key => {
            const [h, m] = key.split(':').map(Number);
            return h * 60 + m === h;
          });
        }
      });

      // Si estamos en los primeros minutos de cada hora
      if (minute < 30) {
        const currentHourKey = `${hour.toString().padStart(2, '0')}:00`;
        if (this.horas[currentHourKey]) {
          return { key: currentHourKey, ...this.horas[currentHourKey] };
        }
      }

      // Hora actual simple
      const horaKey = `${hour.toString().padStart(2, '0')}:00`;
      if (this.horas[horaKey]) {
        return { key: horaKey, ...this.horas[horaKey] };
      }

      return null;
    },

    getNextHora() {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const horasKeys = Object.keys(this.horas).map(t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      }).sort((a, b) => a - b);
      
      for (const h of horasKeys) {
        if (h > currentMinutes) {
          const key = `${Math.floor(h / 60).toString().padStart(2, '0')}:${(h % 60).toString().padStart(2, '0')}`;
          return { key, ...this.horas[key] };
        }
      }
      
      return null;
    },

    formatCountdown(minutes) {
      if (minutes < 60) {
        return `${minutes} min`;
      }
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}min`;
    },

    render() {
      const horaActual = this.getCurrentHora();
      const siguiente = this.getNextHora();
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      this.container.innerHTML = `
        <div class="liturgical-clock-container">
          <div class="clock-icon">🔔</div>
          <div class="clock-time">${timeStr}</div>
          ${horaActual ? `
            <div class="current-hora">
              <span class="hora-label">Ahora:</span>
              <span class="hora-name">${horaActual.nombre}</span>
              <span class="hora-desc">${horaActual.descripcion}</span>
              ${horaActual.especial ? `<span class="hora-badge">${horaActual.especial === 'angelus' ? '🎠' : '⏰'}</span>` : ''}
            </div>
          ` : ''}
          ${siguiente ? `
            <div class="next-hora">
              <span class="next-label">Próxima:</span>
              <span class="next-name">${siguiente.nombre}</span>
            </div>
          ` : ''}
        </div>
      `;

      this.addStyles();
    },

    addStyles() {
      if (document.getElementById('liturgical-clock-styles')) return;

      const style = document.createElement('style');
      style.id = 'liturgical-clock-styles';
      style.textContent = `
        .liturgical-clock-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 18px;
          background: rgba(10,22,40,0.8);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          font-size: 0.8rem;
          gap: 6px;
          max-width: 180px;
        }
        .clock-icon {
          font-size: 1rem;
        }
        .clock-time {
          font-family: 'Cinzel', serif;
          color: var(--gold-light, #f4e2a1);
          font-size: 1.1rem;
          font-weight: 600;
        }
        .current-hora {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2px;
        }
        .hora-label {
          font-size: 0.65rem;
          color: rgba(250,247,240,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .hora-name {
          font-family: 'Cinzel', serif;
          color: var(--gold, #d4af37);
          font-weight: 600;
        }
        .hora-desc {
          font-size: 0.7rem;
          color: rgba(250,247,240,0.6);
          font-style: italic;
        }
        .hora-badge {
          font-size: 0.9rem;
          margin-top: 2px;
        }
        .next-hora {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: rgba(250,247,240,0.6);
          padding-top: 6px;
          border-top: 1px solid rgba(212,175,55,0.1);
          width: 100%;
          justify-content: center;
        }
        .next-label {
          color: rgba(250,247,240,0.4);
        }
        .next-name {
          color: var(--celestial, #6fa8dc);
        }
      `;
      document.head.appendChild(style);
    },

    startChimeCheck() {
      // Verificar cada minuto
      setInterval(() => {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // Campana a las 12:00 (Ángelus)
        if (hour === 12 && minute === 0 && second < 3) {
          this.playChime('angelus');
        }

        // Campana a las 15:00 (Hora de la Misericordia)
        if (hour === 15 && minute === 0 && second < 3) {
          this.playChime('misericordia');
        }
      }, 1000);

      // Actualizar display cada minuto
      setInterval(() => this.render(), 60000);
    },

    playChime(type) {
      // Solo si el tab está activo
      if (document.hidden) return;

      // No repetir en el mismo minuto
      const now = new Date();
      const key = `${now.getHours()}:${now.getMinutes()}:${type}`;
      if (this.lastChime === key) return;
      this.lastChime = key;

      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const playNote = (freq, delay, duration) => {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          
          osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + delay);
          osc.type = 'sine';
          
          gain.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
          gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + delay + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + duration);
          
          osc.start(this.audioContext.currentTime + delay);
          osc.stop(this.audioContext.currentTime + delay + duration);
        };

        // Campanas sutiles
        if (type === 'angelus') {
          playNote(660, 0, 1.5);
          playNote(880, 0.3, 1.5);
          playNote(660, 0.6, 2);
        } else if (type === 'misericordia') {
          playNote(440, 0, 1);
          playNote(550, 0.4, 1);
          playNote(440, 0.8, 2);
        }
      } catch (e) {}
    }
  };

  window.LiturgicalClock = LiturgicalClock;
})();