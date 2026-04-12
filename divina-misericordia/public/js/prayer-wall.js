/**
 * Muro de Intenciones Compartidas
 * Sistema de oraciones comunitarias con privacidad total
 */
(function() {
  'use strict';

  const PrayerWall = {
    intentions: [],
    sharedIntentions: [],
    maxShared: 50,
    
    init(containerSelector) {
      this.loadSharedIntentions();
      this.render(containerSelector);
    },

    loadSharedIntentions() {
      const stored = localStorage.getItem('intenciones_compartidas');
      this.sharedIntentions = stored ? JSON.parse(stored) : [];
    },

    saveSharedIntentions() {
      const filtered = this.sharedIntentions.slice(-this.maxShared);
      localStorage.setItem('intenciones_compartidas', JSON.stringify(filtered));
      this.sharedIntentions = filtered;
    },

    filterContent(text) {
      const forbidden = ['spam', 'publicidad', 'promocion'];
      const words = text.toLowerCase().split(' ');
      return words.some(w => forbidden.includes(w)) ? null : text;
    },

    shareIntention(text, userId) {
      const filtered = this.filterContent(text);
      if (!filtered) return null;
      
      const intention = {
        id: Date.now(),
        text: filtered,
        sharedAt: Date.now(),
        prayers: 0,
        isOwn: true
      };
      
      this.sharedIntentions.push(intention);
      this.saveSharedIntentions();
      this.renderIntentions();
      
      return intention;
    },

    prayFor(intentionId) {
      const intention = this.sharedIntentions.find(i => i.id === intentionId);
      if (intention) {
        intention.prayers = (intention.prayers || 0) + 1;
        this.saveSharedIntentions();
        this.renderIntentions();
      }
    },

    render(containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      
      this.createStyles();
      
      container.innerHTML = `
        <div class="prayer-wall">
          <div class="prayer-wall-header">
            <h3>✝ Muro de Intenciones</h3>
            <p>Oraciones compartidas anónimamente</p>
          </div>
          
          <div class="prayer-share-toggle">
            <label class="toggle-label">
              <input type="checkbox" id="share-toggle">
              <span class="toggle-switch"></span>
              <span class="toggle-text">Compartir mi intención con la comunidad</span>
            </label>
          </div>
          
          <div class="prayer-intentions-grid">
            ${this.renderIntentions()}
          </div>
        </div>
      `;
      
      this.bindEvents();
    },

    renderIntentions() {
      const now = Date.now();
      const active = this.sharedIntentions
        .filter(i => now - i.sharedAt < 24 * 60 * 60 * 1000)
        .sort((a, b) => b.prayers - a.prayers);
      
      return active.map(i => `
        <div class="prayer-card ${i.prayers > 3 ? 'prayed' : ''}">
          <p class="prayer-text">${i.text}</p>
          <div class="prayer-footer">
            <button class="prayer-count" data-id="${i.id}">
              ✝ ${i.prayers} rezando
            </button>
            <span class="prayer-time">${this.getTimeAgo(i.sharedAt)}</span>
          </div>
        </div>
      `).join('');
    },

    getTimeAgo(timestamp) {
      const diff = Date.now() - timestamp;
      const minutes = Math.floor(diff / 60000);
      if (minutes < 60) return 'hace ' + minutes + 'm';
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return 'hace ' + hours + 'h';
      return 'hace 1d';
    },

    createStyles() {
      if (document.getElementById('prayer-wall-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'prayer-wall-styles';
      style.textContent = `
        .prayer-wall {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .prayer-wall-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .prayer-wall-header h3 {
          font-family: 'Cinzel Decorative', serif;
          color: #d4af37;
          font-size: 1.5rem;
        }
        .prayer-share-toggle {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .toggle-label input {
          display: none;
        }
        .toggle-switch {
          width: 44px;
          height: 24px;
          background: rgba(212,175,55,0.2);
          border-radius: 12px;
          position: relative;
          transition: background 0.3s;
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background: #d4af37;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.3s;
        }
        .toggle-label input:checked + .toggle-switch {
          background: rgba(212,175,55,0.6);
        }
        .toggle-label input:checked + .toggle-switch::after {
          transform: translateX(20px);
        }
        .toggle-text {
          color: rgba(250,247,240,0.7);
          font-size: 0.9rem;
        }
        .prayer-intentions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .prayer-card {
          background: linear-gradient(135deg, rgba(30,25,20,0.9), rgba(40,35,25,0.9));
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .prayer-card:hover {
          border-color: rgba(212,175,55,0.4);
        }
        .prayer-card.prayed {
          box-shadow: 0 0 20px rgba(212,175,55,0.2);
        }
        .prayer-text {
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          color: #faf7f0;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .prayer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .prayer-count {
          background: none;
          border: none;
          color: #d4af37;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 4px 10px;
          border-radius: 15px;
          transition: all 0.2s;
        }
        .prayer-count:hover {
          background: rgba(212,175,55,0.2);
        }
        .prayer-time {
          font-size: 0.75rem;
          color: rgba(250,247,240,0.5);
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      const prayBtns = document.querySelectorAll('.prayer-count');
      prayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.dataset.id);
          this.prayFor(id);
        });
      });
    }
  };

  window.PrayerWall = PrayerWall;
  console.log('🙏 Prayer Wall loaded');
})();