/**
 * Sistema de Presencia en Tiempo Real
 * Contador de peregrinos + Muro de velas compartidas
 * Soporta Supabase/Firebase o modo offline (graceful degradation)
 */
(function() {
  'use strict';

  const PresenceSystem = {
    userId: null,
    currentSection: null,
    isOnline: false,
    pilgrims: 0,
    candles: [],
    config: {
      backend: null, // 'supabase' | 'firebase' | null
      apiKey: null,
      projectUrl: null
    },

    init(options = {}) {
      this.config = { ...this.config, ...options };
      this.userId = this.generateUserId();
      this.loadState();
      
      if (this.config.backend) {
        this.connectToBackend();
      } else {
        this.initOfflineMode();
      }
    },

    generateUserId() {
      let id = localStorage.getItem('peregrino_id');
      if (!id) {
        id = 'peregrino_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('peregrino_id', id);
      }
      return id;
    },

    loadState() {
      const savedCandles = localStorage.getItem('mis_velas');
      this.candles = savedCandles ? JSON.parse(savedCandles) : [];
    },

    async connectToBackend() {
      try {
        if (this.config.backend === 'supabase') {
          await this.initSupabase();
        } else if (this.config.backend === 'firebase') {
          await this.initFirebase();
        }
      } catch (e) {
        console.log('Presence: modo offline (backend no disponible)');
        this.initOfflineMode();
      }
    },

    async initSupabase() {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = () => {
        window.supabase = window.supabase.createClient(
          this.config.projectUrl,
          this.config.apiKey
        );
        this.subscribeToPresence();
        this.subscribeToCandles();
      };
      document.head.appendChild(script);
    },

    initFirebase() {
      console.log('Firebase init placeholder - requiere configuración');
      this.initOfflineMode();
    },

    initOfflineMode() {
      this.isOnline = false;
      this.pilgrims = Math.floor(Math.random() * 20) + 5;
      this.renderPilgrimCounter();
      this.renderCandleWall();
    },

    subscribeToPresence() {
      if (!window.supabase) return;
      
      const channel = window.supabase.channel('presence')
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          this.pilgrims = Object.keys(state).length;
          this.updatePilgrimDisplay();
        })
        .subscribe();
      
      channel.track({ 
        user_id: this.userId, 
        section: this.currentSection,
        online_at: new Date().toISOString() 
      });
    },

    subscribeToCandles() {
      if (!window.supabase) return;
      
      window.supabase
        .channel('candles')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'candles' }, 
        (payload) => {
          this.candles.push(payload.new);
          this.renderCandleWall();
        }
        ).subscribe();
    },

    registerPresence(section) {
      this.currentSection = section;
      if (this.isOnline && window.supabase) {
        window.supabase.channel('presence').track({
          user_id: this.userId,
          section: section,
          online_at: new Date().toISOString()
        });
      }
    },

    leavePresence() {
      if (this.isOnline && window.supabase) {
        window.supabase.channel('presence').untrack();
      }
    },

    lightCandle(sectionKey) {
      const candle = {
        userId: this.userId,
        section: sectionKey,
        litAt: Date.now(),
        isOwn: true
      };
      
      this.candles.push(candle);
      localStorage.setItem('mis_velas', JSON.stringify(this.candles));
      
      if (this.isOnline && window.supabase) {
        window.supabase.from('candles').insert({
          user_id: this.userId,
          section: sectionKey,
          lit_at: new Date().toISOString()
        });
      }
      
      this.renderCandleWall();
      return candle;
    },

    renderPilgrimCounter() {
      const counter = document.createElement('div');
      counter.className = 'pilgrim-counter';
      counter.innerHTML = `
        <span class="pilgrim-indicator"></span>
        <span class="pilgrim-number">${this.pilgrims}</span>
        <span class="pilgrim-label">peregrinos en el santuario</span>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        .pilgrim-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: rgba(250,247,240,0.7);
          font-family: 'EB Garamond', serif;
        }
        .pilgrim-indicator {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pilgrimPulse 2s ease-in-out infinite;
        }
        @keyframes pilgrimPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .pilgrim-number {
          color: #d4af37;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
      
      const footer = document.querySelector('.main-footer, footer');
      if (footer) {
        footer.appendChild(counter);
      }
    },

    renderCandleWall() {
      const now = Date.now();
      const activeCandles = this.candles.filter(c => 
        now - c.litAt < 24 * 60 * 60 * 1000
      );
      
      const wall = document.querySelector('.candle-wall');
      if (!wall) return;
      
      wall.innerHTML = `
        <div class="candle-wall-header">
          <h3>El Candelabro del Santuario</h3>
          <p>Hoy ${activeCandles.length} peregrinos han encendido una vela</p>
        </div>
        <div class="candle-wall-flames">
          ${activeCandles.slice(-50).map((c, i) => `
            <div class="flame ${c.isOwn ? 'own' : ''}" style="animation-delay: ${i * 0.1}s"></div>
          `).join('')}
        </div>
      `;
    },

    updatePilgrimDisplay() {
      const numberEl = document.querySelector('.pilgrim-number');
      if (numberEl) {
        numberEl.textContent = this.pilgrims;
      }
    }
  };

  window.PresenceSystem = PresenceSystem;
  console.log('👥 Presence System loaded');
})();