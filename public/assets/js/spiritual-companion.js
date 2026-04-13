/**
 * Compañero Espiritual - Acompañamiento con IA
 * Director espiritual digital basado en Anthropic API
 */
(function() {
  'use strict';

  const SpiritualCompanion = {
    name: 'Fray Luz',
    isOpen: false,
    conversationHistory: [],
    currentMode: 'acompanamiento',
    isThinking: false,
    apiKey: null,
    isFirstVisit: true,
    
    modes: {
      acompañamiento: {
        name: 'Acompañamiento',
        icon: '🕯️',
        description: 'Conversación espiritual libre',
        systemPrompt: 'El usuario quiere una conversación espiritual libre. Escucha con atención, responde con calidez y sabiduría.'
      },
      lectio: {
        name: 'Lectio Divina',
        icon: '📖',
        description: 'Meditación sobre un texto bíblico',
        systemPrompt: 'Guía al usuario por un texto bíblico usando el método de Lectio Divina: lectura, meditación, oración y contemplación.'
      },
      examen: {
        name: 'Examen de Conciencia',
        icon: '✝️',
        description: 'Examen espiritual adaptado al día',
        systemPrompt: 'Conduce un examen de conciencia con preguntas amables y reflexivas. Ayúdale a reconocer los momentos de gracia y los lugares de crecimiento.'
      },
      novena: {
        name: 'Novena',
        icon: '🌹',
        description: 'Oración novenaria',
        systemPrompt: 'Guía una novena a la devoción específica. Incluye reflexiones y oraciones para cada día de la novena.'
      },
      silencio: {
        name: 'Silencio',
        icon: '🤫',
        description: 'Solo presencia, sin palabras',
        systemPrompt: 'El usuario ha elegido el modo silencio. NO respondas con palabras. Solo indica que estás presente orando con él/ella.'
      }
    },

    init() {
      this.loadStyles();
      this.createPanel();
      this.setupEventListeners();
    },

    loadStyles() {
      if (document.getElementById('companion-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'companion-styles';
      style.textContent = `
        .companion-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 9998;
        }
        .companion-overlay.active {
          opacity: 1;
          pointer-events: all;
        }
        .companion-panel {
          position: fixed;
          top: 0;
          right: -400px;
          width: 380px;
          height: 100vh;
          background: linear-gradient(180deg, #0a0d15 0%, #0f1520 100%);
          border-left: 1px solid rgba(212,175,55,0.3);
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }
        .companion-panel.active {
          right: 0;
        }
        .companion-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .companion-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #f4d87a, #d4af37, #b8960c);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: breathe 4s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .companion-avatar::after {
          content: '✝';
          font-size: 1.5rem;
          color: #050d1a;
        }
        .companion-title {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 1.2rem;
        }
        .companion-close {
          background: none;
          border: none;
          color: #f4e2a1;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .companion-modes {
          display: flex;
          gap: 5px;
          padding: 10px;
          overflow-x: auto;
          border-bottom: 1px solid rgba(212,175,55,0.1);
        }
        .companion-mode-btn {
          flex-shrink: 0;
          padding: 8px 12px;
          background: rgba(212,175,55,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 20px;
          color: #f4e2a1;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .companion-mode-btn:hover, .companion-mode-btn.active {
          background: rgba(212,175,55,0.2);
          border-color: #d4af37;
        }
        .companion-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .companion-message {
          max-width: 85%;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .companion-message.user {
          align-self: flex-end;
          background: rgba(212,175,55,0.2);
          color: #faf7f0;
          border-bottom-right-radius: 4px;
        }
        .companion-message.companion {
          align-self: flex-start;
          background: linear-gradient(135deg, rgba(30,25,20,0.9), rgba(40,35,25,0.9));
          border: 1px solid rgba(212,175,55,0.2);
          color: #faf7f0;
          border-bottom-left-radius: 4px;
        }
        .companion-message.thinking {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .companion-thinking-dots {
          display: flex;
          gap: 4px;
        }
        .companion-thinking-dots span {
          width: 6px;
          height: 6px;
          background: #d4af37;
          border-radius: 50%;
          animation: thinkPulse 1.4s ease-in-out infinite;
        }
        .companion-thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
        .companion-thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes thinkPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        .companion-input-area {
          padding: 1rem;
          border-top: 1px solid rgba(212,175,55,0.2);
        }
        .companion-input-wrapper {
          position: relative;
        }
        .companion-input {
          width: 100%;
          padding: 12px 50px 12px 15px;
          background: rgba(10,15,25,0.8);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 25px;
          color: #faf7f0;
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          resize: none;
        }
        .companion-input::placeholder {
          color: rgba(250,247,240,0.5);
        }
        .companion-send {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #d4af37;
          cursor: pointer;
          font-size: 1.2rem;
        }
        .companion-privacy {
          padding: 10px;
          text-align: center;
          font-size: 0.75rem;
          color: rgba(250,247,240,0.5);
          border-top: 1px solid rgba(212,175,55,0.1);
        }
        .companion-clear-btn {
          position: absolute;
          top: 10px;
          right: 50px;
          background: none;
          border: none;
          color: rgba(250,247,240,0.4);
          cursor: pointer;
          font-size: 0.8rem;
        }
        @media (max-width: 400px) {
          .companion-panel {
            width: 100%;
            right: -100%;
          }
        }
      `;
      document.head.appendChild(style);
    },

    createPanel() {
      const overlay = document.createElement('div');
      overlay.className = 'companion-overlay';
      
      const panel = document.createElement('div');
      panel.className = 'companion-panel';
      panel.innerHTML = `
        <div class="companion-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="companion-avatar"></div>
            <div>
              <div class="companion-title">${this.name}</div>
              <div style="font-size:0.75rem;color:rgba(250,247,240,0.6);">Compañero espiritual</div>
            </div>
          </div>
          <button class="companion-close">×</button>
          <button class="companion-clear-btn" title="Limpiar conversación">🗑️</button>
        </div>
        
        <div class="companion-modes">
          ${Object.entries(this.modes).map(([key, mode]) => `
            <button class="companion-mode-btn ${key === this.currentMode ? 'active' : ''}" data-mode="${key}">
              <span>${mode.icon}</span>
            </button>
          `).join('')}
        </div>
        
        <div class="companion-messages">
          <div class="companion-message companion">
            <p>✝ Paz seas contigo, hermano/hermana.</p>
            <p style="margin-top:10px;font-size:0.85rem;color:rgba(250,247,240,0.6);">
              Soy ${this.name}, tu compañero de camino espiritual. 
              ¿Qué trae hoy a tu corazón?
            </p>
          </div>
        </div>
        
        <div class="companion-input-area">
          <div class="companion-input-wrapper">
            <textarea class="companion-input" rows="2" placeholder="Cuéntame cómo estás hoy..."></textarea>
            <button class="companion-send">➤</button>
          </div>
        </div>
        
        <div class="companion-privacy">
          Esta conversación se borra al cerrar. Tu intimidad es sagrada.
        </div>
      `;
      
      document.body.appendChild(overlay);
      document.body.appendChild(panel);
      
      this.overlay = overlay;
      this.panel = panel;
    },

    setupEventListeners() {
      this.overlay.addEventListener('click', () => this.close());
      this.panel.querySelector('.companion-close').addEventListener('click', () => this.close());
      this.panel.querySelector('.companion-clear-btn').addEventListener('click', () => this.clearHistory());
      
      const modeBtns = this.panel.querySelectorAll('.companion-mode-btn');
      modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const mode = e.currentTarget.dataset.mode;
          this.setMode(mode);
        });
      });
      
      const input = this.panel.querySelector('.companion-input');
      const sendBtn = this.panel.querySelector('.companion-send');
      
      sendBtn.addEventListener('click', () => this.sendMessage());
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    },

    open() {
      this.overlay.classList.add('active');
      this.panel.classList.add('active');
      this.isOpen = true;
      
      if (this.isFirstVisit) {
        setTimeout(() => {
          this.showMessage('companion', 'Antes de conversar, quiero que sepas: esta conversación no se guarda en ningún servidor. Al cerrar el panel, todo se borra. Tu intimidad es sagrada para mí.', false);
          this.isFirstVisit = false;
        }, 1000);
      }
    },

    close() {
      this.overlay.classList.remove('active');
      this.panel.classList.remove('active');
      this.isOpen = false;
    },

    setMode(modeKey) {
      this.currentMode = modeKey;
      
      const btns = this.panel.querySelectorAll('.companion-mode-btn');
      btns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === modeKey);
      });
      
      const modeName = this.modes[modeKey].name;
      this.showMessage('companion', `Entendido. Ahora estamos en modo "${modeName}". ${this.modes[modeKey].description}`, false);
    },

    showMessage(sender, text, addToHistory = true) {
      const messagesContainer = this.panel.querySelector('.companion-messages');
      const messageEl = document.createElement('div');
      messageEl.className = `companion-message ${sender}`;
      
      if (sender === 'companion' && this.isThinking) {
        messageEl.innerHTML = `
          <div class="companion-thinking-dots">
            <span></span><span></span><span></span>
          </div>
          <span style="margin-left:10px;font-size:0.85rem;color:rgba(250,247,240,0.5);">Meditando...</span>
        `;
      } else {
        messageEl.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
      }
      
      messagesContainer.appendChild(messageEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      if (addToHistory && text) {
        this.conversationHistory.push({ role: sender, content: text });
      }
    },

    async sendMessage() {
      const input = this.panel.querySelector('.companion-input');
      const message = input.value.trim();
      
      if (!message || this.isThinking) return;
      
      this.showMessage('user', message);
      input.value = '';
      
      await this.getAIResponse(message);
    },

    async getAIResponse(userMessage) {
      this.isThinking = true;
      
      const messagesContainer = this.panel.querySelector('.companion-messages');
      const thinkingEl = document.createElement('div');
      thinkingEl.className = 'companion-message companion thinking';
      thinkingEl.innerHTML = `
        <div class="companion-thinking-dots"><span></span><span></span><span></span></div>
        <span style="margin-left:10px;color:rgba(250,247,240,0.5);">Meditando con el corazón...</span>
      `;
      messagesContainer.appendChild(thinkingEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      const systemPrompt = this.buildSystemPrompt();
      const contextInfo = this.getContextInfo();
      
      const fullPrompt = `${systemPrompt}\n\nContexto actual: ${contextInfo}\n\nHistorial:\n${this.conversationHistory.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUsuario: ${userMessage}`;
      
      try {
        const response = await this.callAnthropic(fullPrompt);
        messagesContainer.removeChild(thinkingEl);
        this.showMessage('companion', response);
      } catch (error) {
        messagesContainer.removeChild(thinkingEl);
        this.showMessage('companion', 'Algo me impide responder en este momento. Te invito a orar en silencio mientras intentamos de nuevo. Ave María...');
      }
      
      this.isThinking = false;
    },

    buildSystemPrompt() {
      const mode = this.modes[this.currentMode];
      const contextInfo = this.getContextInfo();
      
      return `Eres ${this.name}, un acompañante espiritual católico profundamente formado en la tradición de la Iglesia. Conoces los santos, la Escritura, el Catecismo, la teología espiritual y la liturgia. Hablas con calidez, sin ser condescendiente. Nunca juzgas. Siempre escuchas antes de responder.

IMPORTANTE: Cuando el usuario pregunte específicamente sobre la Divina Misericordia, utiliza tu conocimiento profundo del "Diario de Santa Faustina Kowalska" para ofrecer respuestas basadas en sus enseñanzas, citando su espíritu de confianza total en Jesús ("Jesús, en Ti confío").

Tu estilo es el de un director espiritual sabio: preguntas más de lo que afirmas, acompañas más de lo que diriges, y siempre señalas hacia Dios, no hacia ti mismo.

MODO ACTUAL: ${mode.name} - ${mode.systemPrompt}

LÍMITES: No das consejo médico, legal o psicológico clínico. Para crisis graves: recomiendas hablar con un sacerdote o profesional.

IDIOMA: Español, registro cálido y culto pero accesible. Longitud: 3-5 líneas por defecto, más si el tema lo requiere.

${contextInfo}`;
    },

    getContextInfo() {
      const path = window.location.pathname;
      const section = path.replace('.html', '').replace('/', '') || 'inicio';
      const hour = new Date().getHours();
      
      let timeContext = '';
      if (hour >= 6 && hour < 9) timeContext = 'Es la mañana, buen momento para el examen de conciencia inicial.';
      else if (hour >= 15 && hour < 16) timeContext = 'Es la Hora de la Misericordia (3pm).';
      else if (hour >= 22 || hour < 6) timeContext = 'Es tarde en la noche, momento propicio para el examen de conciencia antes de dormir.';
      
      return `El usuario está en la sección: ${section}. ${timeContext}`;
    },

    async callAnthropic(prompt) {
      const apiKey = localStorage.getItem('anthropic_api_key');
      
      if (!apiKey) {
        return 'Para conversar conmigo, necesito que configures una clave de API de Anthropic en la configuración del sitio. Mientras tanto, te invito a explorar las otras secciones del santuario.';
      }
      
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 500,
            system: 'Eres un acompañante espiritual católico llamado Fray Luz. Responde en español.',
            messages: [{ role: 'user', content: prompt.slice(0, 2000) }]
          })
        });
        
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        return data.content[0].text;
      } catch (error) {
        console.error('Companion API error:', error);
        return 'Hay un momento de silencio entre nosotros. Mientras la tecnología descansa, puedo ofrecerte una reflexión: \"Dios no carga más de lo que podemos llevar, pero nunca nos da menos de lo que necesitamos para crecer.\" ¿Hay algo más en lo que pueda acompañarte?';
      }
    },

    clearHistory() {
      if (confirm('¿Borrar toda la conversación? Esta acción no se puede deshacer.')) {
        this.conversationHistory = [];
        const messagesContainer = this.panel.querySelector('.companion-messages');
        messagesContainer.innerHTML = `
          <div class="companion-message companion">
            <p>✝ La conversación ha comenzado de nuevo.</p>
            <p style="margin-top:10px;font-size:0.85rem;color:rgba(250,247,240,0.6);">
              Paz seas contigo. Soy ${this.name}.
            </p>
          </div>
        `;
      }
    }
  };

  window.SpiritualCompanion = SpiritualCompanion;
  
  document.addEventListener('DOMContentLoaded', () => SpiritualCompanion.init());
  console.log('🕊️ Spiritual Companion loaded');
})();