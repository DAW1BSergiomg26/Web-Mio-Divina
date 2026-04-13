/**
 * Intenciones de Oración - Componente Devocional
 * Gestión de intenciones privadas guardadas en localStorage
 */
(function() {
  'use strict';

  const PrayerIntentions = {
    container: null,
    intentions: [],
    maxIntentions: 10,

    init(containerSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.loadIntentions();
      this.render();
    },

    loadIntentions() {
      const stored = localStorage.getItem('prayer_intentions');
      if (stored) {
        this.intentions = JSON.parse(stored);
      }
    },

    saveIntentions() {
      localStorage.setItem('prayer_intentions', JSON.stringify(this.intentions));
    },

    addIntention(text) {
      if (!text.trim()) return;

      const intention = {
        id: Date.now(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        prayed: false
      };

      this.intentions.unshift(intention);
      
      // Mantener máximo 10
      if (this.intentions.length > this.maxIntentions) {
        this.intentions = this.intentions.slice(0, this.maxIntentions);
      }

      this.saveIntentions();
      this.render();
    },

    togglePrayed(id) {
      const intention = this.intentions.find(i => i.id === id);
      if (intention) {
        intention.prayed = !intention.prayed;
        this.saveIntentions();
        this.render();
      }
    },

    deleteIntention(id) {
      this.intentions = this.intentions.filter(i => i.id !== id);
      this.saveIntentions();
      this.render();
    },

    clearAll() {
      this.intentions = [];
      this.saveIntentions();
      this.render();
    },

    render() {
      this.container.innerHTML = `
        <div class="prayer-intentions-container">
          <div class="intentions-header">
            <h3 class="intentions-title">📝 Intenciones de Oración</h3>
            <p class="intentions-notice">Tu intención es privada y solo existe en tu dispositivo</p>
          </div>
          <form class="intention-form">
            <textarea 
              class="intention-input" 
              placeholder="Escribe tu intención de oración..."
              rows="2"
              maxlength="200"
            ></textarea>
            <button type="submit" class="intention-submit">
              <span class="submit-icon">✨</span>
              <span class="submit-text">Confiar al Señor</span>
            </button>
          </form>
          <div class="intentions-list">
            ${this.intentions.length === 0 ? 
              '<p class="no-intentions">Aún no hay intenciones. Comparte tus peticiones con el corazón.</p>' :
              this.intentions.map(i => `
                <div class="intention-item ${i.prayed ? 'prayed' : ''}" data-id="${i.id}">
                  <button class="intention-check ${i.prayed ? 'checked' : ''}" aria-label="${i.prayed ? 'Marcar como no rezada' : 'Marcar como rezada'}">
                    ${i.prayed ? '✓' : '○'}
                  </button>
                  <p class="intention-text">${this.escapeHtml(i.text)}</p>
                  <button class="intention-delete" aria-label="Eliminar intención">✕</button>
                </div>
              `).join('')
            }
          </div>
          ${this.intentions.length > 0 ? `
            <button class="clear-all-btn">Borrar todas las intenciones</button>
          ` : ''}
        </div>
      `;

      this.addStyles();
      this.bindEvents();
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    addStyles() {
      if (document.getElementById('prayer-intentions-styles')) return;

      const style = document.createElement('style');
      style.id = 'prayer-intentions-styles';
      style.textContent = `
        .prayer-intentions-container {
          max-width: 500px;
          margin: 30px auto;
          padding: 25px;
          background: linear-gradient(180deg, rgba(10,22,40,0.9) 0%, rgba(5,13,26,0.95) 100%);
          border-radius: 16px;
          border: 1px solid rgba(212,175,55,0.2);
        }
        .intentions-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .intentions-title {
          font-family: 'Cinzel Decorative', serif;
          color: var(--gold-light, #f4e2a1);
          margin: 0 0 8px 0;
          font-size: 1.4rem;
        }
        .intentions-notice {
          font-size: 0.75rem;
          color: rgba(250,247,240,0.5);
          margin: 0;
          font-style: italic;
        }
        .intention-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .intention-input {
          width: 100%;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 10px;
          color: var(--white, #faf7f0);
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          resize: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .intention-input::placeholder {
          color: rgba(250,247,240,0.4);
        }
        .intention-input:focus {
          outline: none;
          border-color: var(--gold, #d4af37);
          box-shadow: 0 0 15px rgba(212,175,55,0.2);
        }
        .intention-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--gold-dark, #b8960c) 0%, var(--gold, #d4af37) 100%);
          border: none;
          border-radius: 25px;
          color: var(--blue-deep, #050d1a);
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .intention-submit:hover {
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(212,175,55,0.5);
        }
        .intention-submit .submit-icon {
          font-size: 1.1rem;
        }
        .intentions-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 300px;
          overflow-y: auto;
        }
        .no-intentions {
          text-align: center;
          color: rgba(250,247,240,0.5);
          font-style: italic;
          padding: 20px;
        }
        .intention-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border-left: 3px solid var(--gold, #d4af37);
          transition: all 0.3s ease;
        }
        .intention-item.prayed {
          opacity: 0.6;
          border-left-color: var(--celestial, #6fa8dc);
        }
        .intention-item.prayed .intention-text {
          text-decoration: line-through;
        }
        .intention-check {
          background: none;
          border: none;
          color: var(--gold, #d4af37);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        .intention-check:hover {
          transform: scale(1.2);
        }
        .intention-check.checked {
          color: var(--celestial, #6fa8dc);
        }
        .intention-text {
          flex: 1;
          margin: 0;
          color: var(--white, #faf7f0);
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .intention-delete {
          background: none;
          border: none;
          color: rgba(250,247,240,0.3);
          cursor: pointer;
          padding: 4px 8px;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }
        .intention-delete:hover {
          color: #cc4444;
        }
        .clear-all-btn {
          display: block;
          margin: 20px auto 0;
          background: none;
          border: 1px solid rgba(250,247,240,0.2);
          color: rgba(250,247,240,0.5);
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }
        .clear-all-btn:hover {
          border-color: #cc4444;
          color: #cc4444;
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      const form = this.container.querySelector('.intention-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.intention-input');
        this.addIntention(input.value);
        input.value = '';
      });

      // Checkbox
      this.container.querySelectorAll('.intention-check').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.closest('.intention-item').dataset.id);
          this.togglePrayed(id);
        });
      });

      // Delete
      this.container.querySelectorAll('.intention-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.closest('.intention-item').dataset.id);
          this.deleteIntention(id);
        });
      });

      // Clear all
      const clearBtn = this.container.querySelector('.clear-all-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('¿Borrar todas las intenciones?')) {
            this.clearAll();
          }
        });
      }
    }
  };

  window.PrayerIntentions = PrayerIntentions;
})();