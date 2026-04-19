/**
 * Cita Espiritual del Día - Componente de Reflexión
 * Selección determinista por día del año
 */
(function() {
  'use strict';

  const DailyQuote = {
    container: null,
    quotes: [
      // Citas del Diario de Santa Faustina
      { text: "Jesús, confío en Ti.", author: "Santa Faustina", source: "Diario" },
      { text: "La misericordia es el atributo más grande de Dios.", author: "Santa Faustina", source: "Diario 180" },
      { text: "Jesús, quiero ser completamente transformeada en Tu misericordia.", author: "Santa Faustina", source: "Diario 281" },
      { text: "Dios no mira mis pecados, sino mi amor.", author: "Santa Faustina", source: "Diario 723" },
      { text: "Jesús, ayúdame a sempre mantener mi corazón limpio.", author: "Santa Faustina", source: "Diario 412" },
      
      // Citas del Papa Juan Pablo II
      { text: "No tengáis miedo de acogerme.", author: "Juan Pablo II", source: "Homilía 1978" },
      { text: "La divina misericordia es el mensaje más profundo del Concilio.", author: "Juan Pablo II", source: "Dominum et Vivificantem" },
      { text: "Cristo tiene un corazón privilegiado para ti.", author: "Juan Pablo II", source: "Mensaje" },
      { text: "La esperanza es la fuerza que nos sostiene.", author: "Juan Pablo II", source: "Discurso" },
      { text: "La oración es el fundamento de toda acción.", author: "Juan Pablo II", source: "Cruzada" },

      // Citas de la Biblia
      { text: "Dios es amor.", author: "Biblia", source: "1 Juan 4:8" },
      { text: "Yo estaré con ustedes todos los días.", author: "Biblia", source: "Mateo 28:20" },
      { text: "Donde dos o tres están juntos en mi nombre, ahí estaré yo.", author: "Biblia", source: "Mateo 18:20" },
      { text: "Pedid y se os dará; buscad y encontraréis.", author: "Biblia", source: "Mateo 7:7" },
      { text: "El Señor es mi pastor, nada me faltará.", author: "Biblia", source: "Salmo 23:1" },
      { text: "Que mi alma magnifique al Señor.", author: "Biblia", source: "Lucas 1:46" },
      { text: "En el principio era el Verbo.", author: "Biblia", source: "Juan 1:1" },
      { text: "La luz brilla en las tinieblas.", author: "Biblia", source: "Juan 1:5" },
      { text: "Nadie tiene mayor amor que este.", author: "Biblia", source: "Juan 15:13" },
      { text: "Yo soy el camino, la verdad y la vida.", author: "Biblia", source: "Juan 14:6" },
      
      // Citas de Santos
      { text: "La oración es el arma del cristiano.", author: "San Francisco de Sales", source: "Filotea" },
      { text: "Donde hay caridad, está Dios.", author: "San Francisco de Asís", source: "Ofrecimiento" },
      { text: "Ama y haz lo que quieras.", author: "San Agustín", source: "Homilía" },
      { text: "La virginidad es un holocausto pleasing to God.", author: "San Jerónimo", source: "Carta" },
      { text: "Dios nos ama tal como somos, no como deberíamos ser.", author: "Teresa de Calcuta", source: "Discurso" },
      { text: "La paz comienza con una sonrisa.", author: "Madre Teresa", source: "Mensaje" },
      { text: "Haz el bien y no mires a quién.", author: "San Juan de Dios", source: "Máxima" },
      { text: "El que ora se salva.", author: "San Alfonso María de Ligorio", source: "Práctica" },
      { text: "María, estrella de la mañana, guía nuestro camino.", author: "San Bernardo", source: "Homilía" },
      { text: "La cruz es la escuela del amor.", author: "San Juan de la Cruz", source: "Cántico" },
      { text: "Contempla a Dios en todas las cosas.", author: "San Ignacio de Loyola", source: "Espiritualidad" },
      { text: "La paciencia es la fortaleza del débil.", author: "San Benito", source: "Regla" },
      { text: "Ora et labora.", author: "San Benito", source: "Regla" },
      { text: "El amor lo puede todo.", author: "Santa Teresa de Jesús", source: "Camino" },
      { text: "Dios es mi luz y mi salvación.", author: "Santa Teresa de Lisieux", source: "Manuscritos" },
      { text: "El pequeños actos con amor son lo que más agrada a Dios.", author: "Santa Teresa de Lisieux", source: "Historia de un alma" },
      
      // Citas de Magisterio
      { text: "La divina misericordia es el tesoro más precioso.", author: "Catecismo", source: "CCC 2448" },
      { text: "La oración es una relación personal con Dios.", author: "Catecismo", source: "CCC 2558" },
      { text: "Los sacramentos comunican la gracia de Cristo.", author: "Catecismo", source: "CCC 1131" },
      { text: "La Eucaristía es fuente y cima de la vida cristiana.", author: "Catecismo", source: "CCC 1324" },
      { text: "María es Madre de la Iglesia.", author: "Pablo VI", source: "Marialis Cultus" },
      { text: "La misericordia es el camino de salvación.", author: "Francisco", source: "Misericordiae Vultus" },
      { text: "Sed misericordiosos como el Padre.", author: "Francisco", source: "Bula" },
      { text: "La alegría del evangelio llena el corazón.", author: "Francisco", source: "Evangelii Gaudium" },
      { text: "No tengáis miedo de la santa audacia.", author: "Francisco", source: "Evangelii Gaudium" },
      { text: "El rostro de Dios es el rostro misericordioso.", author: "Francisco", source: "Misericordia" },

      // Citas adicionales
      { text: "Confía siempre en la divina providencia.", author: "Pío XII", source: "Discurso" },
      { text: "La oración es la llave del corazón.", author: "Pío XI", source: "Mensaje" },
      { text: "La fe es luz que guía nuestros pasos.", author: "Benedicto XVI", source: "Spe Salvi" },
      { text: "La esperanza no defrauda.", author: "Benedicto XVI", source: "Spe Salvi" },
      { text: "La caridad es el vínculo de la perfección.", author: "Pablo VI", source: "Gaudium et Spes" },
      { text: "María es la estrella de la nueva evangelización.", author: "Juan Pablo II", source: "Mensaje" },
      { text: "La vida es un don que debemos cuidar.", author: "Francisco", source: "Laudato Si" },
      { text: "La creación es un libro que debemos leer.", author: "Francisco", source: "Laudato Si" },
      { text: "El perdón sana las heridas del alma.", author: "Juan Pablo II", source: "Mensaje" },
      { text: "La gracia santificante nos hace hijos de Dios.", author: "Catecismo", source: "CCC 1244" },
      { text: "La confianza filial es la esencia de la oración.", author: "Teresa de Calcuta", source: "Discurso" },
      { text: "Dios escrita su amor en nuestro corazón.", author: "San Pablo", source: "Romanos 5:5" },
      { text: "La fe esperanza y caridad permanecen.", author: "San Pablo", source: "1 Corintios 13:13" },
      { text: "Soy siervo inutil, solo hago lo que debo.", author: "Parábola", source: "Lucas 17:10" },
      { text: "El reino de Dios está dentro de vosotros.", author: "Biblia", source: "Lucas 17:21" },
      { text: "Venid a mí los que estáis cansados.", author: "Biblia", source: "Mateo 11:28" },
      { text: "Yo soy el pan vivo que bajó del cielo.", author: "Biblia", source: "Juan 6:51" },
      { text: "Yo soy la vid, vosotros los sarmientos.", author: "Biblia", source: "Juan 15:5" },
      { text: "El Espiritu blown donde quiere.", author: "Biblia", source: "Juan 3:8" },
      { text: "Reconciliaos con Dios.", author: "San Pablo", source: "2 Corintios 5:20" },
      { text: "La mortificación alegra el alma.", author: "Catecismo", source: "CCC 2015" },
      { text: "La paciencia es corona del cristiano.", author: "San Juan Crisostomo", source: "Homilía" },
      { text: "La humildad es la base de la santidad.", author: "San Francisco de Sales", source: "Filotea" },
      { text: "La obediencia es sacrificio racional.", author: "San Ignacio", source: "Ejercicios" },
      { text: "El silencio es escuela de sabiduría.", author: "San Juan de la Cruz", source: "Subida" },
      { text: "La noche oscura purifica el alma.", author: "San Juan de la Cruz", source: "Noche Oscura" }
    ],

    init(containerSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.render();
    },

    getTodayQuote() {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      const index = dayOfYear % this.quotes.length;
      return this.quotes[index];
    },

    render() {
      const quote = this.getTodayQuote();
      
      this.container.innerHTML = `
        <div class="daily-quote-container">
          <div class="quote-header">
            <span class="quote-icon">☀️</span>
            <span class="quote-label">Cita Espiritual del Día</span>
          </div>
          <blockquote class="quote-text">
            <span class="quote-mark open">"</span>
            <span class="quote-content">${quote.text}</span>
            <span class="quote-mark close">"</span>
          </blockquote>
          <div class="quote-attribution">
            <span class="quote-author">— ${quote.author}</span>
            <span class="quote-source">${quote.source}</span>
          </div>
          <button class="quote-share-btn">
            <span class="share-icon">📤</span>
            Compartir
          </button>
        </div>
      `;

      this.addStyles();
      this.bindEvents();
    },

    addStyles() {
      if (document.getElementById('daily-quote-styles')) return;

      const style = document.createElement('style');
      style.id = 'daily-quote-styles';
      style.textContent = `
        .daily-quote-container {
          max-width: 600px;
          margin: 30px auto;
          padding: 30px;
          background: linear-gradient(180deg, rgba(10,22,40,0.95) 0%, rgba(5,13,26,0.98) 100%);
          border-radius: 20px;
          border: 1px solid rgba(212,175,55,0.3);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .daily-quote-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold, #d4af37), transparent);
        }
        .quote-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .quote-icon {
          font-size: 1.5rem;
        }
        .quote-label {
          font-family: 'Cinzel', serif;
          color: var(--gold, #d4af37);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .quote-text {
          position: relative;
          margin: 0 0 20px 0;
          padding: 20px 0;
        }
        .quote-mark {
          font-family: 'Cinzel Decorative', serif;
          font-size: 4rem;
          color: var(--gold, #d4af37);
          opacity: 0.3;
          position: absolute;
          line-height: 1;
        }
        .quote-mark.open {
          top: 0;
          left: -10px;
        }
        .quote-mark.close {
          bottom: -20px;
          right: -10px;
        }
        .quote-content {
          font-family: 'EB Garamond', serif;
          font-size: 1.3rem;
          color: var(--white, #faf7f0);
          line-height: 1.6;
          font-style: italic;
          display: block;
          animation: fadeInWord 0.5s ease forwards;
          opacity: 0;
        }
        @keyframes fadeInWord {
          to { opacity: 1; }
        }
        .quote-attribution {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 20px;
        }
        .quote-author {
          font-family: 'Cinzel', serif;
          color: var(--gold-light, #f4e2a1);
          font-size: 1rem;
          font-weight: 600;
        }
        .quote-source {
          font-size: 0.8rem;
          color: rgba(250,247,240,0.5);
        }
        .quote-share-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 25px;
          color: var(--gold-light, #f4e2a1);
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .quote-share-btn:hover {
          background: rgba(212,175,55,0.2);
          border-color: var(--gold, #d4af37);
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      const shareBtn = this.container.querySelector('.quote-share-btn');
      shareBtn.addEventListener('click', () => this.share());
    },

    share() {
      const quote = this.getTodayQuote();
      const text = `"${quote.text}" — ${quote.author} (${quote.source})`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Cita Espiritual del Día',
          text: text
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text).then(() => {
          const btn = this.container.querySelector('.quote-share-btn');
          btn.textContent = '✓ Copiado';
          setTimeout(() => {
            btn.innerHTML = '<span class="share-icon">📤</span> Compartir';
          }, 2000);
        });
      }
    }
  };

  window.DailyQuote = DailyQuote;
})();