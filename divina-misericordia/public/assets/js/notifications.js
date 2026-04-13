/**
 * Notificaciones Litúrgicas - Sistema de recordatorios espirituales
 * Respetuoso: nunca pide permiso automáticamente, configurables por el usuario
 */
(function() {
  'use strict';

  const LiturgicalNotifications = {
    config: {
      angelus: { enabled: false, times: ['12:00', '18:00'] },
      horaMisericordia: { enabled: false, time: '15:00' },
      visperas: { enabled: false, time: '19:00' },
      fiestasMarianas: { enabled: false },
      santosDelDia: { enabled: false }
    },
    checkInterval: null,

    init() {
      this.loadConfig();
      this.renderSettings();
      this.startScheduler();
    },

    loadConfig() {
      const saved = localStorage.getItem('liturgical_notifications');
      if (saved) {
        this.config = JSON.parse(saved);
      }
    },

    saveConfig() {
      localStorage.setItem('liturgical_notifications', JSON.stringify(this.config));
    },

    isSupported() {
      return 'Notification' in window && 'serviceWorker' in navigator;
    },

    async requestPermission() {
      if (!this.isSupported()) return false;

      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (e) {
        return false;
      }
    },

    async enable(configKey) {
      // Primero verificar si ya tenemos permiso
      if (Notification.permission === 'granted') {
        this.config[configKey].enabled = true;
        this.saveConfig();
        return true;
      }

      // Si no hay permiso, pedirlo
      const granted = await this.requestPermission();
      if (granted) {
        this.config[configKey].enabled = true;
        this.saveConfig();
        return true;
      }

      return false;
    },

    disable(configKey) {
      this.config[configKey].enabled = false;
      this.saveConfig();
    },

    toggle(configKey) {
      if (this.config[configKey].enabled) {
        this.disable(configKey);
      } else {
        this.enable(configKey);
      }
      this.renderSettings();
    },

    startScheduler() {
      // Verificar cada minuto
      this.checkInterval = setInterval(() => {
        this.checkAndNotify();
      }, 60000);

      // Verificar inmediatamente
      this.checkAndNotify();
    },

    checkAndNotify() {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      // Ángelus (12:00 y 18:00)
      if (this.config.angelus.enabled) {
        if (timeStr === '12:00' || timeStr === '18:00') {
          this.showNotification('Ángelus', 'El Señor te envía su paz ✝', '/oraciones.html');
        }
      }

      // Hora de la Misericordia (15:00)
      if (this.config.horaMisericordia.enabled && timeStr === '15:00') {
        this.showNotification('Hora de la Misericordia', 'Jesús te espera a las 3 PM', '/hora-de-la-misericordia.html');
      }

      // Vísperas (19:00)
      if (this.config.visperas.enabled && timeStr === '19:00') {
        this.showNotification('Vísperas', 'Hora de la oración vespertina', '/oraciones.html');
      }

      // Santos del día (solo una vez al día)
      if (this.config.santosDelDia.enabled && timeStr === '08:00') {
        this.notifySantoDelDia();
      }
    },

    async showNotification(title, body, url) {
      if (Notification.permission !== 'granted') return;

      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body: body,
          icon: '/img/icon-192x192.png',
          badge: '/img/icon-72x72.png',
          tag: title.toLowerCase().replace(/ /g, '-'),
          data: { url: url }
        });
      } catch (e) {
        console.log('[Notifications] Error showing:', e);
      }
    },

    notifySantoDelDia() {
      const saints = [
        { name: 'Santa Faustina', url: '/santa-faustina.html' },
        { name: 'San José', url: '/san-jose.html' },
        { name: 'Nuestra Señora de Guadalupe', url: '/virgen-lujan.html' },
        { name: 'San Francisco de Asís', url: '/san-francisco.html' },
        { name: 'Santa Teresa de Lisieux', url: '/oraciones.html' },
        { name: 'San Juan Pablo II', url: '/ss-juan-pablo-ii.html' },
        { name: 'Madre Teresa de Calcuta', url: '/quienes-somos.html' },
        { name: 'San Ignacio de Loyola', url: '/estudios-biblicos.html' },
        { name: 'Santa María Magdalena', url: '/maria.html' },
        { name: 'San Pedro', url: '/oraciones.html' }
      ];

      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
      const saint = saints[dayOfYear % saints.length];

      this.showNotification('Santo del Día', `Hoy celebramos a ${saint.name}`, saint.url);
    },

    renderSettings() {
      // Crear panel de configuración si no existe
      let panel = document.getElementById('notifications-settings');
      
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'notifications-settings';
        panel.className = 'notifications-settings';
        
        // Insertar después del header o al inicio del main
        const main = document.querySelector('main') || document.body;
        main.insertBefore(panel, main.firstChild);
      }

      panel.innerHTML = `
        <div class="notifications-panel">
          <div class="panel-header">
            <span class="panel-icon">🔔</span>
            <h3 class="panel-title">Recordatorios Espirituales</h3>
          </div>
          <p class="panel-desc">Recibe notificaciones respetuosas en momentos de oración</p>
          
          <div class="notification-options">
            <div class="option-item">
              <div class="option-info">
                <span class="option-name">Ángelus</span>
                <span class="option-desc">12:00 PM y 6:00 PM</span>
              </div>
              <label class="toggle">
                <input type="checkbox" ${this.config.angelus.enabled ? 'checked' : ''} data-key="angelus">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="option-item">
              <div class="option-info">
                <span class="option-name">Hora de la Misericordia</span>
                <span class="option-desc">3:00 PM - Jesús te espera</span>
              </div>
              <label class="toggle">
                <input type="checkbox" ${this.config.horaMisericordia.enabled ? 'checked' : ''} data-key="horaMisericordia">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="option-item">
              <div class="option-info">
                <span class="option-name">Vísperas</span>
                <span class="option-desc">7:00 PM - Oración vespertina</span>
              </div>
              <label class="toggle">
                <input type="checkbox" ${this.config.visperas.enabled ? 'checked' : ''} data-key="visperas">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="option-item">
              <div class="option-info">
                <span class="option-name">Santos del día</span>
                <span class="option-desc">Notificación matutina</span>
              </div>
              <label class="toggle">
                <input type="checkbox" ${this.config.santosDelDia.enabled ? 'checked' : ''} data-key="santosDelDia">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          ${!this.isSupported() ? '<p class="panel-warning">Las notificaciones no están disponibles en este navegador</p>' : ''}
          ${Notification.permission === 'default' ? '<button class="enable-btn" onclick="LiturgicalNotifications.requestPermission()">Activar notificaciones</button>' : ''}
        </div>
      `;

      this.addStyles();

      // Bind events
      panel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          this.toggle(e.target.dataset.key);
        });
      });
    },

    addStyles() {
      if (document.getElementById('notifications-styles')) return;

      const style = document.createElement('style');
      style.id = 'notifications-styles';
      style.textContent = `
        .notifications-settings {
          margin: 30px auto;
          max-width: 600px;
        }
        .notifications-panel {
          background: linear-gradient(180deg, rgba(10,22,40,0.95) 0%, rgba(5,13,26,0.98) 100%);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          padding: 25px;
        }
        .panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .panel-icon {
          font-size: 1.5rem;
        }
        .panel-title {
          font-family: 'Cinzel Decorative', serif;
          color: var(--gold-light, #f4e2a1);
          margin: 0;
          font-size: 1.2rem;
        }
        .panel-desc {
          color: rgba(250,247,240,0.6);
          font-size: 0.9rem;
          margin: 0 0 20px 0;
        }
        .notification-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 15px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
        }
        .option-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .option-name {
          font-family: 'Cinzel', serif;
          color: var(--white, #faf7f0);
          font-size: 0.95rem;
        }
        .option-desc {
          font-size: 0.75rem;
          color: rgba(250,247,240,0.5);
        }
        .toggle {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #333;
          transition: 0.3s;
          border-radius: 26px;
        }
        .toggle-slider::before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }
        .toggle input:checked + .toggle-slider {
          background: linear-gradient(135deg, var(--gold-dark, #b8960c) 0%, var(--gold, #d4af37) 100%);
        }
        .toggle input:checked + .toggle-slider::before {
          transform: translateX(24px);
        }
        .panel-warning {
          color: rgba(250,247,240,0.5);
          font-size: 0.85rem;
          margin-top: 15px;
          padding: 10px;
          background: rgba(255,200,0,0.1);
          border-radius: 8px;
        }
        .enable-btn {
          display: block;
          width: 100%;
          margin-top: 15px;
          padding: 12px;
          background: linear-gradient(135deg, var(--gold-dark, #b8960c) 0%, var(--gold, #d4af37) 100%);
          color: var(--blue-deep, #050d1a);
          border: none;
          border-radius: 25px;
          font-family: 'Cinzel', serif;
          cursor: pointer;
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LiturgicalNotifications.init());
  } else {
    LiturgicalNotifications.init();
  }

  window.LiturgicalNotifications = LiturgicalNotifications;
})();