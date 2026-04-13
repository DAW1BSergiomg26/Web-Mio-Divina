/**
 * Sistema de Internacionalización (i18n)
 * Soporte multiidioma español: España y Latinoamérica
 * Detección automática y traducción de devociones regionales
 */
(function() {
  'use strict';

  const i18n = {
    currentLocale: 'es-ES',
    availableLocales: ['es-ES', 'es-AR', 'es-PY', 'es-CO', 'es-MX', 'es-CL'],
    
    translations: {
      'es-ES': {
        name: 'Español de España',
        region: 'España',
        
        prayers: {
          ourFather: 'Padre nuestro que estás en el cielo',
          hailMary: 'Dios te salve María, llena eres de gracia',
          gloryBe: 'Gloria al Padre, y al Hijo, y al Espíritu Santo',
          creed: 'Creo en Dios Padre todopoderoso, creador del cielo y de la tierra',
          angelus: 'El ángel del Señor anunció a María',
          graceAfterMeal: 'Te damos gracias, Señor, por todos tus beneficios'
        },
        
        devotions: {
          divineMercy: 'Divina Misericordia',
          holyRosary: 'Santo Rosario',
          guardianAngel: 'Ángel Guardián',
          saintJoseph: 'San José',
          virginCaacupe: 'Virgen de Caacupé',
          virginLujan: 'Virgen de Luján',
          virginCarmel: 'Virgen del Carmen'
        },
        
        ui: {
          welcome: 'Bienvenido al Santuario',
          explore: 'Explorar',
          pray: 'Orar',
          donate: 'Donar',
          contact: 'Contacto',
          close: 'Cerrar',
          save: 'Guardar',
          cancel: 'Cancelar',
          loading: 'Cargando...',
          error: 'Ha ocurrido un error'
        },
        
        messages: {
          firstVisit: 'Bienvenido al Santuario',
          returnVisit: 'El santuario te extrañaba. Bienvenido de nuevo.',
          rosaryComplete: 'Has completado el rosario. La Virgen intercede por ti.',
          candleLit: 'Tu vela ha sido encendida',
          intentionShared: 'Tu intención ha sido compartida'
        }
      },
      
      'es-AR': {
        name: 'Español de Argentina',
        region: 'Argentina',
        
        prayers: {
          ourFather: 'Padre nuestro que estás en los cielos',
          hailMary: 'Dios te salve María, llena eres de gracia',
          gloryBe: 'Gloria al Padre, y al Hijo, y al Espíritu Santo',
          creed: 'Creo en Dios Padre todopoderoso, creador del cielo y de la tierra',
          angelus: 'El ángel del Señor anunció a María',
          graceAfterMeal: 'Te damos gracias, Señor, por todos tus beneficios'
        },
        
        devotions: {
          divineMercy: 'Divina Misericordia',
          holyRosary: 'Santo Rosario',
          guardianAngel: 'Ángel de la Guarda',
          saintJoseph: 'San José',
          virginCaacupe: 'Virgen de Caacupé',
          virginLujan: 'Nuestra Señora de Luján',
          virginCarmel: 'Virgen del Carmen'
        },
        
        ui: {
          welcome: 'Bienvenido al Santuario',
          explore: 'Conocer',
          pray: 'Rezar',
          donate: 'Colaborar',
          contact: 'Contactar',
          close: 'Cerrar',
          save: 'Guardar',
          cancel: 'Cancelar',
          loading: 'Cargando...',
          error: 'Ocurrió un error'
        },
        
        messages: {
          firstVisit: 'Bienvenido al Santuario',
          returnVisit: 'El santuario te extrañaba. Bienvenido de nuevo.',
          rosaryComplete: 'Completaste el rosario. La Virgen ruega por vos.',
          candleLit: 'Tu vela fue encendida',
          intentionShared: 'Tu intención fue compartida'
        }
      },
      
      'es-PY': {
        name: 'Español de Paraguay',
        region: 'Paraguay',
        
        prayers: {
          ourFather: ' Padre nuestro que estás en el cielo',
          hailMary: 'Dios te salve María, llena eres de gracia',
          gloryBe: 'Gloria al Padre, y al Hijo, y al Espíritu Santo',
          creed: 'Creo en Dios Padre todopoderoso, criador del cielo y de la tierra',
          angelus: 'El ángel del Señor anunció a María',
          graceAfterMeal: 'Te damos gracias, Señor, por todos tus beneficios'
        },
        
        devotions: {
          divineMercy: 'Divina Misericordia',
          holyRosary: 'Santo Rosario',
          guardianAngel: 'Ángel de la Guarda',
          saintJoseph: 'San José',
          virginCaacupe: 'Virgen de Caacupé',
          virginLujan: 'Virgen de Luján',
          virginCarmel: 'Virgen del Carmen'
        },
        
        ui: {
          welcome: 'Bienvenido al Santuario',
          explore: 'Explorar',
          pray: 'Rezar',
          donate: 'Apoyar',
          contact: 'Contactar',
          close: 'Cerrar',
          save: 'Guardar',
          cancel: 'Cancelar',
          loading: 'Cargando...',
          error: 'Ocurrió un error'
        },
        
        messages: {
          firstVisit: 'Bienvenido al Santuario',
          returnVisit: 'El santuario te extrañaba. Volvé cuando quieras.',
          rosaryComplete: 'Completaste el rosario. La Virgen ruega por vos.',
          candleLit: 'La vela está prendida',
          intentionShared: 'Tu intención está compartida'
        }
      },
      
      'es-CO': {
        name: 'Español de Colombia',
        region: 'Colombia',
        
        prayers: {
          ourFather: 'Padre nuestro que estás en los cielos',
          hailMary: 'Dios te salve María, llena eres de gracia',
          gloryBe: 'Gloria al Padre, y al Hijo, y al Espíritu Santo',
          creed: 'Creo en Dios Padre todopoderoso, creador del cielo y de la tierra',
          angelus: 'El ángel del Señor anunció a María',
          graceAfterMeal: 'Te damos gracias, Señor, por todos tus beneficios'
        },
        
        devotions: {
          divineMercy: 'Divina Misericordia',
          holyRosary: 'Santo Rosario',
          guardianAngel: 'Ángel guardián',
          saintJoseph: 'San José',
          virginCaacupe: 'Virgen de Caacupé',
          virginLujan: 'Nuestra Señora de Luján',
          virginCarmel: 'Virgen del Carmen'
        },
        
        ui: {
          welcome: 'Bienvenido al Santuario',
          explore: 'Explorar',
          pray: 'Orar',
          donate: 'Donar',
          contact: 'Contactar',
          close: 'Cerrar',
          save: 'Guardar',
          cancel: 'Cancelar',
          loading: 'Cargando...',
          error: 'Ocurrió un error'
        },
        
        messages: {
          firstVisit: 'Bienvenido al Santuario',
          returnVisit: 'El santuario te extrañaba. Bienvenido de nuevo.',
          rosaryComplete: 'Completaste el rosario. La Virgen intercede por ti.',
          candleLit: 'Tu vela ha sido encendida',
          intentionShared: 'Tu intención ha sido compartida'
        }
      },
      
      'es-MX': {
        name: 'Español de México',
        region: 'México',
        
        prayers: {
          ourFather: 'Padre nuestro que estás en los cielos',
          hailMary: 'Dios te salve María, llena eres de gracia',
          gloryBe: 'Gloria al Padre, y al Hijo, y al Espíritu Santo',
          creed: 'Creo en Dios Padre todopoderoso, criador del cielo y de la tierra',
          angelus: 'El ángel del Señor anunció a María',
          graceAfterMeal: 'Te damos gracias, Señor, por todos tus beneficios'
        },
        
        devotions: {
          divineMercy: 'Divina Misericordia',
          holyRosary: 'Santo Rosario',
          guardianAngel: 'Ángel guardián',
          saintJoseph: 'San José',
          virginCaacupe: 'Virgen de Caacupé',
          virginLujan: 'Nuestra Señora de Luján',
          virginCarmel: 'Virgen del Carmen'
        },
        
        ui: {
          welcome: 'Bienvenido al Santuario',
          explore: 'Explorar',
          pray: 'Rezar',
          donate: 'Donar',
          contact: 'Contactar',
          close: 'Cerrar',
          save: 'Guardar',
          cancel: 'Cancelar',
          loading: 'Cargando...',
          error: 'Ocurrió un error'
        },
        
        messages: {
          firstVisit: 'Bienvenido al Santuario',
          returnVisit: 'El santuario te extrañaba. Bienvenido de nuevo.',
          rosaryComplete: 'Completaste el rosario. La Virgen ora por ti.',
          candleLit: 'Tu vela se ha encendido',
          intentionShared: 'Tu intención se ha compartido'
        }
      },
      
      'es-CL': {
        name: 'Español de Chile',
        region: 'Chile',
        
        prayers: {
          ourFather: 'Padre nuestro que estás en los cielos',
          hailMary: 'Dios te salve María, llena eres de gracia',
          gloryBe: 'Gloria al Padre, y al Hijo, y al Espíritu Santo',
          creed: 'Creo en Dios Padre todopoderoso, creador del cielo y de la tierra',
          angelus: 'El ángel del Señor anunció a María',
          graceAfterMeal: 'Te damos gracias, Señor, por todos tus beneficios'
        },
        
        devotions: {
          divineMercy: 'Divina Misericordia',
          holyRosary: 'Santo Rosario',
          guardianAngel: 'Ángel guardián',
          saintJoseph: 'San José',
          virginCaacupe: 'Virgen de Caacupé',
          virginLujan: 'Nuestra Señora de Luján',
          virginCarmel: 'Virgen del Carmen'
        },
        
        ui: {
          welcome: 'Bienvenido al Santuario',
          explore: 'Explorar',
          pray: 'Rezar',
          donate: 'Donar',
          contact: 'Contactar',
          close: 'Cerrar',
          save: 'Guardar',
          cancel: 'Cancelar',
          loading: 'Cargando...',
          error: 'Ocurrió un error'
        },
        
        messages: {
          firstVisit: 'Bienvenido al Santuario',
          returnVisit: 'El santuario te extrañaba. Bienvenido de nuevo.',
          rosaryComplete: 'Completaste el rosario. La Virgen ruega por ti.',
          candleLit: 'Tu vela se ha encendido',
          intentionShared: 'Tu intención se ha compartido'
        }
      }
    },

    init() {
      this.detectLocale();
      this.loadSavedLocale();
      this.applyTranslations();
      this.setupLanguageSwitcher();
      console.log(`🌍 i18n initialized: ${this.currentLocale}`);
    },

    detectLocale() {
      const browserLang = navigator.language || navigator.userLanguage;
      
      const localeMap = {
        'es-AR': 'es-AR',
        'es-BO': 'es-AR',
        'es-CL': 'es-CL',
        'es-CO': 'es-CO',
        'es-MX': 'es-MX',
        'es-PY': 'es-PY',
        'es-UY': 'es-AR',
        'es': 'es-ES'
      };

      const normalizedLang = browserLang.replace('_', '-');
      this.detectedLocale = localeMap[normalizedLang] || 'es-ES';
    },

    loadSavedLocale() {
      const saved = localStorage.getItem('santuario_locale');
      if (saved && this.availableLocales.includes(saved)) {
        this.currentLocale = saved;
      } else {
        this.currentLocale = this.detectedLocale || 'es-ES';
      }
    },

    saveLocale() {
      localStorage.setItem('santuario_locale', this.currentLocale);
    },

    setLocale(locale) {
      if (this.availableLocales.includes(locale)) {
        this.currentLocale = locale;
        this.saveLocale();
        this.applyTranslations();
        
        EventBus.emit(SanctuaryEvents.MODE_ACCESSIBILITY_ENABLED, {
          locale: locale
        });
      }
    },

    t(key, fallback = '') {
      const keys = key.split('.');
      let value = this.translations[this.currentLocale];
      
      for (const k of keys) {
        if (value && value[k]) {
          value = value[k];
        } else {
          value = null;
          break;
        }
      }

      if (value === null) {
        value = this.translations['es-ES'];
        for (const k of keys) {
          if (value && value[k]) {
            value = value[k];
          } else {
            return fallback || key;
          }
        }
      }

      return value;
    },

    getPrayer(key) {
      return this.t(`prayers.${key}`, '');
    },

    getDevotion(key) {
      return this.t(`devotions.${key}`, '');
    },

    getUI(key) {
      return this.t(`ui.${key}`, '');
    },

    getMessage(key) {
      return this.t(`messages.${key}`, '');
    },

    applyTranslations() {
      const lang = this.currentLocale;
      document.documentElement.lang = lang;
      document.documentElement.setAttribute('data-locale', lang);

      this.translatePageElements();
    },

    translatePageElements() {
      const elements = document.querySelectorAll('[data-i18n]');
      
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = this.t(key);
        
        if (translation) {
          if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
            el.placeholder = translation;
          } else {
            el.textContent = translation;
          }
        }
      });

      const titles = document.querySelectorAll('[data-i18n-title]');
      titles.forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = this.t(key);
      });
    },

    setupLanguageSwitcher() {
      this.createLanguageMenu();
    },

    createLanguageMenu() {
      if (document.querySelector('.language-switcher')) return;

      const menu = document.createElement('div');
      menu.className = 'language-switcher';
      menu.innerHTML = `
        <button class="language-btn">
          <span class="current-lang">${this.getCurrentLocaleName()}</span>
          <span class="lang-arrow">▼</span>
        </button>
        <div class="language-dropdown">
          ${this.availableLocales.map(locale => `
            <button class="lang-option ${locale === this.currentLocale ? 'active' : ''}" 
                    data-locale="${locale}">
              ${this.getLocaleName(locale)}
            </button>
          `).join('')}
        </div>
      `;

      this.createLanguageStyles();
      
      const header = document.querySelector('.main-header, header');
      if (header) {
        header.appendChild(menu);
      }

      const btn = menu.querySelector('.language-btn');
      const dropdown = menu.querySelector('.language-dropdown');
      
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('open');
      });

      document.addEventListener('click', () => {
        menu.classList.remove('open');
      });

      menu.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
          this.setLocale(option.dataset.locale);
          menu.classList.remove('open');
          this.updateLanguageUI();
        });
      });
    },

    updateLanguageUI() {
      const currentLang = document.querySelector('.current-lang');
      if (currentLang) {
        currentLang.textContent = this.getCurrentLocaleName();
      }

      document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.toggle('active', option.dataset.locale === this.currentLocale);
      });
    },

    getCurrentLocaleName() {
      return this.getLocaleName(this.currentLocale);
    },

    getLocaleName(locale) {
      const names = {
        'es-ES': 'Español (España)',
        'es-AR': 'Español (Argentina)',
        'es-PY': 'Español (Paraguay)',
        'es-CO': 'Español (Colombia)',
        'es-MX': 'Español (México)',
        'es-CL': 'Español (Chile)'
      };
      return names[locale] || locale;
    },

    createLanguageStyles() {
      if (document.getElementById('language-switcher-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'language-switcher-styles';
      style.textContent = `
        .language-switcher {
          position: relative;
          display: inline-block;
          z-index: 100;
        }
        .language-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          color: rgba(250,247,240,0.8);
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'EB Garamond', serif;
          font-size: 0.85rem;
          transition: all 0.3s;
        }
        .language-btn:hover {
          background: rgba(212,175,55,0.2);
        }
        .lang-arrow {
          font-size: 0.6rem;
          transition: transform 0.3s;
        }
        .language-switcher.open .lang-arrow {
          transform: rotate(180deg);
        }
        .language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 5px;
          background: rgba(20,18,15,0.98);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 10px;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s;
          min-width: 160px;
        }
        .language-switcher.open .language-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .lang-option {
          display: block;
          width: 100%;
          padding: 10px 15px;
          background: none;
          border: none;
          color: rgba(250,247,240,0.7);
          text-align: left;
          cursor: pointer;
          font-family: 'EB Garamond', serif;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .lang-option:hover {
          background: rgba(212,175,55,0.1);
          color: #faf7f0;
        }
        .lang-option.active {
          color: #d4af37;
          background: rgba(212,175,55,0.15);
        }
      `;
      document.head.appendChild(style);
    },

    getLocale() {
      return this.currentLocale;
    },

    getDetectedLocale() {
      return this.detectedLocale;
    }
  };

  window.i18n = i18n;
  console.log('🌍 i18n loaded');
})();