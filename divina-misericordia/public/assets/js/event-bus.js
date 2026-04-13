/**
 * Event Bus Central del Santuario
 * Sistema de comunicación desacoplada entre todos los módulos
 * Arquitectura pub/sub para coordinación de eventos espirituales
 */
(function() {
  'use strict';

  const SanctuaryEvents = {
    // Eventos de comunidad
    CANDLE_LIT: 'sanctuary:candle:lit',
    ROSARY_COMPLETE: 'sanctuary:rosary:complete',
    ROSARY_DECADE_COMPLETE: 'sanctuary:rosary:decade',
    INTENTION_SHARED: 'sanctuary:intention:shared',
    PILGRIM_COUNT_UPDATED: 'sanctuary:pilgrim:count',

    // Eventos de navegación y secciones
    SECTION_CHANGED: 'sanctuary:section:changed',
    PAGE_LOADED: 'sanctuary:page:loaded',
    HERO_VISIBLE: 'sanctuary:hero:visible',

    // Eventos de audio
    AUDIO_PLAYING: 'sanctuary:audio:playing',
    AUDIO_PAUSED: 'sanctuary:audio:paused',
    AUDIO_STOPPED: 'sanctuary:audio:stopped',
    AUDIO_ZONE_CHANGE: 'sanctuary:audio:zone',
    CATHEDRAL_MODE_ENTER: 'sanctuary:cathedral:enter',
    CATHEDRAL_MODE_EXIT: 'sanctuary:cathedral:exit',

    // Eventos del compañero espiritual
    COMPANION_OPENED: 'sanctuary:companion:opened',
    COMPANION_CLOSED: 'sanctuary:companion:closed',
    COMPANION_MESSAGE: 'sanctuary:companion:message',
    COMPANION_SUGGESTION: 'sanctuary:companion:suggestion',

    // Eventos litúrgicos
    FEAST_DAY: 'sanctuary:feast:active',
    LITURGICAL_TIME_CHANGED: 'sanctuary:liturgical:time',
    ANGELUS_TIME: 'sanctuary:angelus:time',
    VIGIL_ACTIVE: 'sanctuary:vigil:active',

    // Eventos de logros
    PILGRIM_MILESTONE: 'sanctuary:pilgrim:milestone',
    ACHIEVEMENT_UNLOCKED: 'sanctuary:achievement:unlocked',

    // Eventos de modo
    MODE_ACCESSIBILITY_ENABLED: 'sanctuary:mode:accessibility',
    MODE_CONTEMPLATIVE_ENABLED: 'sanctuary:mode:contemplative',
    MODE_PENITENTIAL_ACTIVE: 'sanctuary:mode:penitential',
    MODE_FAST_LOAD: 'sanctuary:mode:fast',

    // Eventos de tiempo
    TIME_ON_PAGE: 'sanctuary:time:onpage',
    USER_RETURN: 'sanctuary:user:return',
    FIRST_VISIT: 'sanctuary:user:firstvisit',

    // Eventos de arte generativo
    STAINED_GLASS_READY: 'sanctuary:art:stainedglass',
    SACRED_ICON_RENDERED: 'sanctuary:art:icon',

    // Eventos de sistema
    INITIALIZED: 'sanctuary:initialized',
    ERROR: 'sanctuary:error',
    OFFLINE_MODE: 'sanctuary:offline'
  };

  class SanctuaryEventBus {
    constructor() {
      this.listeners = {};
      this.eventHistory = [];
      this.maxHistory = 100;
      this.debugMode = false;
    }

    on(event, callback, context = null) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      
      const listener = {
        callback,
        context,
        id: this.generateId()
      };
      
      this.listeners[event].push(listener);
      
      if (this.debugMode) {
        console.log(`[EventBus] Suscrito a ${event} (${listener.id})`);
      }
      
      return listener.id;
    }

    off(event, callbackId = null) {
      if (callbackId) {
        if (this.listeners[event]) {
          this.listeners[event] = this.listeners[event].filter(
            l => l.id !== callbackId
          );
        }
      } else {
        delete this.listeners[event];
      }
    }

    emit(event, data = {}) {
      const eventData = {
        type: event,
        timestamp: Date.now(),
        data,
        source: this.getCallerInfo()
      };

      this.addToHistory(eventData);

      if (this.debugMode) {
        console.log(`[EventBus] Emitido: ${event}`, data);
      }

      if (this.listeners[event]) {
        this.listeners[event].forEach(listener => {
          try {
            listener.callback.call(listener.context, eventData);
          } catch (error) {
            console.error(`[EventBus] Error en listener ${event}:`, error);
          }
        });
      }

      this.emitWildcard(event, data);
    }

    emitWildcard(event, data) {
      const wildcard = event.split(':').slice(0, 2).join(':') + ':*';
      
      if (this.listeners[wildcard]) {
        this.listeners[wildcard].forEach(listener => {
          try {
            listener.callback.call(listener.context, {
              type: event,
              timestamp: Date.now(),
              data,
              source: this.getCallerInfo()
            });
          } catch (error) {
            console.error(`[EventBus] Error en wildcard listener:`, error);
          }
        });
      }
    }

    once(event, callback, context = null) {
      const listenerId = this.on(event, (eventData) => {
        callback.call(context, eventData);
        this.off(event, listenerId);
      }, context);
      
      return listenerId;
    }

    onAny(callback) {
      return this.on('sanctuary:*', callback);
    }

    addToHistory(eventData) {
      this.eventHistory.push(eventData);
      
      if (this.eventHistory.length > this.maxHistory) {
        this.eventHistory = this.eventHistory.slice(-this.maxHistory);
      }
    }

    getHistory(eventType = null, limit = 10) {
      let history = this.eventHistory;
      
      if (eventType) {
        history = history.filter(e => e.type === eventType);
      }
      
      return history.slice(-limit);
    }

    getCallerInfo() {
      try {
        const stack = new Error().stack.split('\n');
        const caller = stack[3] || stack[2] || '';
        const match = caller.match(/\/([^\/]+\.js):(\d+)/);
        return match ? `${match[1]}:${match[2]}` : 'unknown';
      } catch (e) {
        return 'unknown';
      }
    }

    generateId() {
      return 'evt_' + Math.random().toString(36).substr(2, 9);
    }

    enableDebug() {
      this.debugMode = true;
      console.log('[EventBus] Modo debug activado');
    }

    disableDebug() {
      this.debugMode = false;
    }

    getStats() {
      const events = Object.keys(this.listeners);
      const totalListeners = events.reduce((sum, e) => sum + this.listeners[e].length, 0);
      
      return {
        eventTypes: events.length,
        totalListeners,
        historySize: this.eventHistory.length
      };
    }

    clear() {
      this.listeners = {};
      this.eventHistory = [];
    }
  }

  const EventBus = new SanctuaryEventBus();

  window.SanctuaryEvents = SanctuaryEvents;
  window.EventBus = EventBus;

  if (typeof window.define === 'function') {
    define('EventBus', [], function() {
      return { SanctuaryEvents, EventBus };
    });
  }

  console.log('🔔 Event Bus loaded - Sanctuary orchestration ready');
})();