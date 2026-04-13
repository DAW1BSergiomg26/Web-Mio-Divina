/**
 * Motor de Calendario Litúrgico
 * Calcula tiempos litúrgicos, festividades y adapta el tema visual
 * Sin dependencias - Módulo puro JavaScript
 */
(function() {
  'use strict';

  const LiturgicalCalendar = {
    // Alias para compatibilidad con feast-days.js
    FEAST_DAYS: null,

    // Colores litúrgicos
    COLORS: {
      morado: { primary: '#5c4b8a', light: '#7a6aa8', dark: '#3d3259' },
      blanco: { primary: '#f8f5e6', light: '#ffffff', dark: '#d4d0c0' },
      verde: { primary: '#2d5a3d', light: '#4a7d5c', dark: '#1e3d29' },
      rojo: { primary: '#8b2323', light: '#a84343', dark: '#5c1717' },
      rosa: { primary: '#c490a8', light: '#d4aabf', dark: '#9e6e84' },
      dorado: { primary: '#d4af37', light: '#f4d87a', dark: '#a68920' }
    },

    // Tiempos litúrgicos
    SEASONS: {
      adviento: {
        name: 'Adviento',
        color: 'morado',
        description: 'Tiempo de preparación y espera del Salvador'
      },
      navidad: {
        name: 'Navidad',
        color: 'blanco',
        description: 'Celebración del nacimiento de Cristo'
      },
      tiempo_ordinario_1: {
        name: 'Tiempo Ordinario',
        color: 'verde',
        description: 'Período entre Navidad y Cuaresma'
      },
      cuaresma: {
        name: 'Cuaresma',
        color: 'morado',
        description: 'Tiempo de penitencia y conversión'
      },
      semana_santa: {
        name: 'Semana Santa',
        color: 'rojo',
        description: 'Pasión, Muerte y Resurrección de Cristo'
      },
      pascua: {
        name: 'Pascua',
        color: 'blanco',
        description: 'Tiempo de Resurrección y esperanza'
      },
      tiempo_ordinario_2: {
        name: 'Tiempo Ordinario',
        color: 'verde',
        description: 'Período entre Pentecostés y Adviento'
      }
    },

    /**
     * Calcula la fecha de Pascua usando el algoritmo de Meeus/Jones/Butcher
     * @param {number} year - Año para calcular
     * @returns {Date} Fecha de Pascua
     */
    calculateEaster(year) {
      const a = Math.floor(year / 100);
      const b = year % 100;
      const c = Math.floor(a / 4);
      const d = a % 4;
      const e = Math.floor((a + 8) / 25);
      const f = Math.floor((a - e + 1) / 3);
      const g = Math.floor((19 * a + b - c - f + 15) % 30);
      const h = Math.floor(b / 4);
      const i = b % 4;
      const k = Math.floor((a + 1) / 25);
      const l = Math.floor((32 + 2 * d + 2 * h - g - i) % 7);
      const m = Math.floor((g + 11 * l) / 451);
      const month = Math.floor((g + l - 7 * m + 114) / 31);
      const day = ((g + l - 7 * m + 114) % 31) + 1;
      return new Date(year, month - 1, day);
    },

    /**
     * Calcula todas las fechas litúrgicas importantes para un año dado
     * @param {number} year - Año
     * @returns {Object} Objeto con todas las fechas calculadas
     */
    calculateLiturgicalDates(year) {
      const easter = this.calculateEaster(year);
      const christmas = new Date(year, 11, 25);
      const firstAdvent = this.getFirstAdventSunday(year);

      return {
        // Fechas de Cuaresma y Semana Santa
        miercolesCeniza: new Date(easter.getTime() - 46 * 24 * 60 * 60 * 1000),
        domingoRamos: new Date(easter.getTime() - 7 * 24 * 60 * 60 * 1000),
        juevesSanto: new Date(easter.getTime() - 3 * 24 * 60 * 60 * 1000),
        viernesSanto: new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000),
        sabadoSanto: new Date(easter.getTime() - 1 * 24 * 60 * 60 * 1000),
        pascua: easter,

        // Tiempo pascual
        ascension: new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000),
        pentecostes: new Date(easter.getTime() + 49 * 24 * 60 * 60 * 1000),
        trinidad: new Date(easter.getTime() + 56 * 24 * 60 * 60 * 1000),
        corpusChristi: new Date(easter.getTime() + 60 * 24 * 60 * 60 * 1000),

        // Navidad
        navidad: christmas,
        epifania: new Date(year, 0, 6),
        presentacion: new Date(year, 1, 2),

        // Adviento
        primerAdviento: firstAdvent,

        // Fin del año litúrgico
        cristoRey: this.getLastSundayOfYear(year)
      };
    },

    /**
     * Obtiene el primer domingo de Adviento
     * @param {number} year - Año
     * @returns {Date} Primer domingo de Adviento
     */
    getFirstAdventSunday(year) {
      const christmas = new Date(year, 11, 25);
      const dayOfWeek = christmas.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 21 : (dayOfWeek + 21) % 7;
      const lastSunday = new Date(christmas.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
      return new Date(lastSunday.getTime() - 7 * 24 * 60 * 60 * 1000);
    },

    /**
     * Obtiene el último domingo del año litúrgico (Cristo Rey)
     * @param {number} year - Año
     * @returns {Date} Último domingo de noviembre
     */
    getLastSundayOfYear(year) {
      const november = new Date(year, 10, 30);
      const dayOfWeek = november.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 0 : dayOfWeek;
      return new Date(november.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
    },

    /**
     * Obtiene el tiempo litúrgico actual
     * @param {Date} date - Fecha a evaluar (default: hoy)
     * @returns {Object} Información del tiempo litúrgico
     */
    getCurrentLiturgicalTime(date = new Date()) {
      const year = date.getFullYear();
      const dates = this.calculateLiturgicalDates(year);
      const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Función helper para comparar fechas (solo día, mes, año)
      const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
      };

      const isBetween = (date, start, end) => {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        return d >= s && d <= e;
      };

      // Verificar si es tiempo de Adviento (4 semanas antes de Navidad)
      if (isBetween(today, dates.primerAdviento, dates.navidad)) {
        // Verificar si es el 3er domingo de Adviento (Domingo de Gaudete)
        const thirdAdv = new Date(dates.primerAdviento.getTime() + 14 * 24 * 60 * 60 * 1000);
        if (isSameDay(today, thirdAdv)) {
          return {
            season: 'adviento',
            color: 'rosa',
            weekNumber: 3,
            description: 'Domingo de Gaudete - alegres en el Señor',
            isSpecial: true,
            specialName: 'Domingo de Gaudete'
          };
        }
        // Calcular semana de Adviento
        const daysSinceFirst = Math.floor((today - dates.primerAdviento) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.floor(daysSinceFirst / 7) + 1;
        return {
          season: 'adviento',
          color: 'morado',
          weekNumber: weekNumber,
          description: this.SEASONS.adviento.description
        };
      }

      // Verificar si es tiempo de Navidad (desde Navidad hasta antes de Cuaresma)
      if (isBetween(today, dates.navidad, dates.miercolesCeniza)) {
        // Verificar si es Epifanía
        if (isSameDay(today, dates.epifania)) {
          return {
            season: 'navidad',
            color: 'blanco',
            weekNumber: 0,
            description: 'La manifestacion del Salvador a los Gentiles',
            isSpecial: true,
            specialName: 'Epifanía del Señor'
          };
        }
        // Verificar si es Presentación (2 febrero)
        if (isSameDay(today, dates.presentacion)) {
          return {
            season: 'navidad',
            color: 'blanco',
            weekNumber: 0,
            description: 'Jesús presentado en el templo',
            isSpecial: true,
            specialName: 'Presentación del Señor'
          };
        }
        return {
          season: 'navidad',
          color: 'blanco',
          weekNumber: this.getWeekNumber(today, dates.navidad),
          description: this.SEASONS.navidad.description
        };
      }

      // Verificar Cuaresma (desde Miércoles de Ceniza hasta Domingo de Ramos)
      if (isBetween(today, dates.miercolesCeniza, dates.domingoRamos)) {
        // Verificar si es Miércoles de Ceniza
        if (isSameDay(today, dates.miercolesCeniza)) {
          return {
            season: 'cuaresma',
            color: 'morado',
            weekNumber: 0,
            description: 'Inicio de la Cuaresma - día de ayuno',
            isSpecial: true,
            specialName: 'Miércoles de Ceniza'
          };
        }
        // Verificar si es alguno de los domingos de Cuaresma (4to domingo lleva rosa)
        const daysSinceAsh = Math.floor((today - dates.miercolesCeniza) / (24 * 60 * 60 * 1000));
        const weeksIntoLent = Math.floor(daysSinceAsh / 7);
        if (weeksIntoLent === 3) { // 4to domingo
          return {
            season: 'cuaresma',
            color: 'rosa',
            weekNumber: 4,
            description: 'Domingo de Laetare - alegrémonos',
            isSpecial: true,
            specialName: 'Domingo de Laetare'
          };
        }
        return {
          season: 'cuaresma',
          color: 'morado',
          weekNumber: Math.min(Math.floor(daysSinceAsh / 7) + 1, 6),
          description: this.SEASONS.cuaresma.description
        };
      }

      // Verificar Semana Santa (Domingo de Ramos a Sábado Santo)
      if (isBetween(today, dates.domingoRamos, dates.sabadoSanto)) {
        // Jueves Santo
        if (isSameDay(today, dates.juevesSanto)) {
          return {
            season: 'semana_santa',
            color: 'rojo',
            weekNumber: 0,
            description: 'Institución de la Eucaristía',
            isSpecial: true,
            specialName: 'Jueves Santo'
          };
        }
        // Viernes Santo
        if (isSameDay(today, dates.viernesSanto)) {
          return {
            season: 'semana_santa',
            color: 'rojo',
            weekNumber: 0,
            description: 'Muerte de Cristo en la cruz',
            isSpecial: true,
            specialName: 'Viernes Santo'
          };
        }
        // Sábado Santo
        if (isSameDay(today, dates.sabadoSanto)) {
          return {
            season: 'semana_santa',
            color: 'rojo',
            weekNumber: 0,
            description: 'Silencio y espera del Resurrection',
            isSpecial: true,
            specialName: 'Sábado Santo'
          };
        }
        return {
          season: 'semana_santa',
          color: 'rojo',
          weekNumber: this.getWeekNumber(today, dates.domingoRamos),
          description: this.SEASONS.semana_santa.description
        };
      }

      // Verificar Tiempo de Pascua
      if (isBetween(today, dates.pascua, dates.ascension)) {
        // Domingo de Resurrección
        if (isSameDay(today, dates.pascua)) {
          return {
            season: 'pascua',
            color: 'blanco',
            weekNumber: 0,
            description: 'El Señor ha resucitado',
            isSpecial: true,
            specialName: 'Domingo de Resurrección'
          };
        }
        return {
          season: 'pascua',
          color: 'blanco',
          weekNumber: this.getWeekNumber(today, dates.pascua),
          description: this.SEASONS.pascua.description
        };
      }

      // Verificar Ascensión (40 días después de Pascua)
      if (isSameDay(today, dates.ascension)) {
        return {
          season: 'pascua',
          color: 'blanco',
          weekNumber: 0,
          description: 'Jesús asciende al cielo',
          isSpecial: true,
          specialName: 'Ascensión del Señor'
        };
      }

      // Verificar Pentecostés
      if (isSameDay(today, dates.pentecostes)) {
        return {
          season: 'pascua',
          color: 'rojo',
          weekNumber: 0,
          description: 'El Espíritu Santo desciende sobre la Iglesia',
          isSpecial: true,
          specialName: 'Pentecostés'
        };
      }

      // Verificar Corpus Christi
      if (isSameDay(today, dates.corpusChristi)) {
        return {
          season: 'tiempo_ordinario_2',
          color: 'blanco',
          weekNumber: 0,
          description: 'Fiesta del Cuerpo y Sangre de Cristo',
          isSpecial: true,
          specialName: 'Corpus Christi'
        };
      }

      // Verificar Cristo Rey
      if (isSameDay(today, dates.cristoRey)) {
        return {
          season: 'tiempo_ordinario_2',
          color: 'blanco',
          weekNumber: 0,
          description: 'Cristo Rey del Universo',
          isSpecial: true,
          specialName: 'Solemnidad de Cristo Rey'
        };
      }

      // Después de Pentecostés hasta Adviento
      if (today > dates.pentecostes && today < dates.primerAdviento) {
        return {
          season: 'tiempo_ordinario_2',
          color: 'verde',
          weekNumber: this.getWeekNumber(today, dates.pentecostes),
          description: this.SEASONS.tiempo_ordinario_2.description
        };
      }

      // Tiempo Ordinario 1 (después de la Presentación hasta Cuaresma)
      if (today >= dates.presentacion && today < dates.miercolesCeniza) {
        return {
          season: 'tiempo_ordinario_1',
          color: 'verde',
          weekNumber: this.getWeekNumber(today, dates.presentacion),
          description: this.SEASONS.tiempo_ordinario_1.description
        };
      }

      // Por defecto, tiempo ordinario
      return {
        season: 'tiempo_ordinario_2',
        color: 'verde',
        weekNumber: 1,
        description: this.SEASONS.tiempo_ordinario_2.description
      };
    },

    /**
     * Calcula el número de semana desde una fecha base
     */
    getWeekNumber(date, baseDate) {
      const days = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
      return Math.floor(days / 7) + 1;
    },

    /**
     * Obtiene la fiesta del día desde feast-days.js
     * @param {Date} date - Fecha a verificar
     * @returns {Object|null} Fiesta del día o null
     */
    getTodayFeast(date) {
      // Verificar si FEAST_DAYS está disponible globalmente
      let feastData = typeof FEAST_DAYS !== 'undefined' ? FEAST_DAYS : null;
      
      if (!feastData && typeof window !== 'undefined') {
        // Intentar cargar dinámicamente
        const script = document.querySelector('script[src*="feast-days"]');
        if (script) {
          // El script ya está incluido, esperar un momento y reintentar
          setTimeout(() => {
            const event = new CustomEvent('liturgicalCalendarReady', { detail: { date } });
            document.dispatchEvent(event);
          }, 100);
        }
      }
      
      if (!feastData) return null;

      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // Buscar fiesta fija
      const feast = feastData.find(f => f.month === month && f.day === day);
      
      if (feast) return feast;

      // Verificar si es Domingo de la Divina Misericordia (2do domingo de Pascua)
      const year = date.getFullYear();
      const dates = this.calculateLiturgicalDates(year);
      const secondEaster = new Date(dates.pascua.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      if (this.isSameDay(date, secondEaster)) {
        return {
          month: 0, day: 0,
          name: 'Domingo de la Divina Misericordia',
          type: 'fiesta',
          category: 'senor',
          color: 'rojo',
          description: 'Jesús, en Vos confío - Fiesta de la Divina Misericordia',
          section: 'index.html'
        };
      }

      return null;
    },

    /**
     * Helper para comparar fechas (repetido para uso en getTodayFeast)
     */
    isSameDay(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() &&
             d1.getMonth() === d2.getMonth() &&
             d1.getDate() === d2.getDate();
    },

    /**
     * Obtiene el santo del día
     * @param {Date} date - Fecha
     * @returns {Object|null} Santo del día
     */
    getTodaySaint(date) {
      // Integrar con feast-days.js para obtener santos
      return this.getTodayFeast(date);
    },

    /**
     * Carga dinámicamente feast-days.js
     */
    loadFeastDays() {
      const script = document.createElement('script');
      script.src = 'js/feast-days.js';
      script.onload = () => {
        this.FEAST_DAYS = window.FEAST_DAYS;
      };
      document.head.appendChild(script);
    },

    /**
     * Aplica el tema visual según el tiempo litúrgico
     * @param {Object} liturgicalTime - Resultado de getCurrentLiturgicalTime
     */
    applyTheme(liturgicalTime) {
      const body = document.body;
      
      // Remover clases de temporada anteriores
      body.classList.remove(
        'season-adviento', 'season-navidad', 'season-cuaresma',
        'season-semana-santa', 'season-pascua', 'season-ordinario'
      );

      // Agregar nueva clase según la temporada
      const seasonClass = this.getSeasonClass(liturgicalTime.season);
      body.classList.add(seasonClass);

      // Aplicar variables CSS según el color
      this.applyColorVariables(liturgicalTime.color);
    },

    /**
     * Obtiene la clase CSS para la temporada
     */
    getSeasonClass(season) {
      const map = {
        'adviento': 'season-adviento',
        'navidad': 'season-navidad',
        'tiempo_ordinario_1': 'season-ordinario',
        'tiempo_ordinario_2': 'season-ordinario',
        'cuaresma': 'season-cuaresma',
        'semana_santa': 'season-semana-santa',
        'pascua': 'season-pascua'
      };
      return map[season] || 'season-ordinario';
    },

    /**
     * Aplica variables CSS de color
     */
    applyColorVariables(colorName) {
      const root = document.documentElement;
      const colors = this.COLORS[colorName];
      
      if (colors) {
        root.style.setProperty('--liturgical-color', colors.primary);
        root.style.setProperty('--liturgical-color-light', colors.light);
        root.style.setProperty('--liturgical-color-dark', colors.dark);
      }
    },

    /**
     * Inicializa el calendario litúrgico
     */
    init() {
      const now = new Date();
      const liturgicalTime = this.getCurrentLiturgicalTime(now);
      this.applyTheme(liturgicalTime);
      
      // Guardar referencia global para acceso
      window.currentLiturgicalTime = liturgicalTime;
      
      console.log(`🎼 Tiempo Litúrgico: ${liturgicalTime.season} - ${liturgicalTime.description}`);
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LiturgicalCalendar.init());
  } else {
    LiturgicalCalendar.init();
  }

  // Exportar al ámbito global
  window.LiturgicalCalendar = LiturgicalCalendar;

})();