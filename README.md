# ✝ Santuario Digital de la Divina Misericordia

> *"Jesús, confío en Ti"*

## Esta web no es una página. Es un lugar.

---

## El Propósito

Este santuario digital existe para recibir a todo peregrino que llega buscando paz, consuelo y encuentro con lo sagrado. No es un sitio web convencional — es un espacio de oración viva, donde la tecnología sirve a la fe y donde cada click es una invitación al silencio contemplativo.

El proyecto fue desarrollado para la **ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA**, pero su horizonte es universal: cualquier persona que llegue aquí, en cualquier momento de su vida, debe sentirse recibida con dignidad, guiada sin presión, y acompañada sin juzgar.

---

## Para quién es este santuario

Imagina a María, una mujer de 72 años que perdió a su esposo hace seis meses. Un día, buscando algo que la consuele, escribe en su navegador "oraciones para encontrar paz". Llega a este santuario a las 11 de la noche.

Lo que encuentra:
- Una web que carga rápido, sin complicaciones
- Un reproductor de música sacra que la acompaña
- La posibilidad de encender una vela virtual
- Un muro donde puede escribir su intención sin registrase
- Un compañero espiritual que no la juzga
- Un rosario que puede rezar a su ritmo

Pero también lo que no encuentra:
- Popups invasivos
- Pedidos de donación insistentes
- Contenido que la distraiga de lo esencial
- TÉRMINOS TÉCNICOS que no entiende

María ora, enciende su vela, escucha un Ave María gregoriano, y se va en paz. Vuelve tres días después. El santuario la reconoce: "El santuario te extrañaba. Bienvenido de nuevo."

---

## Lo que encontrarás

### 🕊️ Oración Contemplativa
- **Coronilla de la Divina Misericordia** — con ritmo guidado
- **Santo Rosario** — sincronizado o a tu ritmo
- **Hora de la Misericordia** — a las 3 PM
- **Novena completa** — 9 días de oración
- **Oraciones mariales** — Ave María, Ángelus, etc.

### 🎵 Música Sacra
- Catálogo de 192 pistas de música gregoriana y clásica
- Reproductor premium con reverb de catedral
- Modo catedral immersiva (audio 3D)
- Meditaciones guiadas (4 tipos)

### ⛪ Devociones
- **Divina Misericordia** — message de Santa Faustina
- **Virgen de Caacupé** — patrona de Paraguay
- **Virgen de Luján** — patrona de Argentina
- **Santo Rosario** — misterios completos
- Y más de 60 páginas de contenido devocional

### 📅 Calendario Litúrgico
- Cálculo automático de tiempos litúrgicos (Pascua móvil)
- 87 fiestas del santoral
- Temas visuales por temporada
- Widget de fiesta del día

### 👥 Comunidad Espiritual
- **Muro de intenciones** — oraciones compartidas anónimamente
- **Contador de peregrinos** — saber que no estás solo
- **Velas compartidas** — encender luz juntos
- **Sistema de logros** — peregrinación espiritual

### 🤖 Compañero Espiritual (IA)
- "Fray Luz" — guía espiritual personalizado
- Usa Anthropic API (configurable)
- Sugerencias contextuales según la sección
- Conversación respetuosa y sin juicio

### 🎨 Arte Generativo
- **Vitrales Voronoi** — colores sagrados en movimiento
- **Iconos sagrados** — halos, mandorlas, cruces fractales
- **Galería museo** — arte devocional interactivo
- **Tarjetas devocionales** — genera y descarga

### 🌐 Tecnología Invisible
- PWA installable (funciona offline)
- WebGL 3D (altar virtual, geometría sagrada)
- i18n (español de España y Latinoamérica)
- Modo contemplativo (accesibilidad para mayores)

---

## Para desarrolladores

### Arquitectura

El proyecto sigue una arquitectura modular donde cada sistema es independiente pero se comunica a través de un Event Bus central. Nunca se llaman directamente — desacoplamiento total.

```
divina-misericordia/
├── index.js                    # Servidor Node.js (puerto 3001)
├── package.json                # Dependencias y scripts
├── AGENTS.md                   # Guía para agentes IA
│
├── public/
│   ├── index.html             # Homepage
│   ├── *.html                 # 68+ páginas
│   ├── manifest.json          # PWA
│   ├── service-worker.js      # Offline
│   │
│   ├── css/
│   │   ├── global.css         # Sistema de diseño global
│   │   ├── audio-player.css   # Reproductor
│   │   └── *.css              # Estilos por página
│   │
│   ├── js/
│   │
│   │   # ORQUESTACIÓN (Carga primero)
│   │   ├── event-bus.js              # Comunicación entre módulos
│   │   ├── experience-director.js    # Cerebro central
│   │   │
│   │   # SISTEMA
│   │   ├── i18n.js                   # Internacionalización
│   │   ├── accessibility-profile.js  # Modo contemplativo
│   │   │
│   │   # AUDIO
│   │   ├── audio-player.js           # Reproductor base
│   │   ├── audio-catalog.js          # 192 pistas
│   │   ├── spatial-audio.js          # Audio 3D
│   │   ├── cathedral-mode.js         # Modo inmersivo
│   │   ├── guided-meditation.js      # Meditaciones
│   │   │
│   │   # DEVOCIONAL
│   │   ├── votive-candle.js          # Velas votivas
│   │   ├── rosary-counter.js         # Contador rosario
│   │   ├── prayer-intentions.js      # Intenciones
│   │   ├── daily-quote.js            # Cita diaria
│   │   │
│   │   # LITÚRGICO
│   │   ├── liturgical-calendar.js    # Motor fechas
│   │   ├── feast-days.js            # 87 fiestas
│   │   ├── liturgical-clock.js      # Horas canónicas
│   │   │
│   │   # COMUNIDAD
│   │   ├── presence.js              # Peregrinos online
│   │   ├── prayer-wall.js          # Intenciones compartidas
│   │   ├── community-rosary.js     # Rosario sincronizado
│   │   ├── pilgrimage.js           # Logros
│   │   │
│   │   # IA
│   │   ├── spiritual-companion.js   # Fray Luz (Anthropic)
│   │   ├── companion-launcher.js   # Botón flotante
│   │   │
│   │   # ARTE GENERATIVO
│   │   ├── stained-glass.js        # Vitrales
│   │   ├── sacred-icons.js         # Iconos sagrados
│   │   ├── sacred-gallery.js       # Galería
│   │   ├── devotional-card-generator.js # Tarjetas
│   │   │
│   │   # VISUAL
│   │   ├── cursor.js               # Cursor divino
│   │   ├── splash.js               # Pantalla carga
│   │   ├── scroll-reveal.js        # Revelado scroll
│   │   ├── particles.js            # Partículas
│   │   ├── parallax.js             # Efecto parallax
│   │   │
│   │   # WEBGL 3D
│   │   ├── webgl-hero.js           # Hero 3D
│   │   ├── sacred-geometry.js      # Geometría sagrada
│   │   ├── virtual-altar-3d.js     # Altar virtual
│   │   │
│   │   # PWA
│   │   ├── pwa-install.js          # Instalación
│   │   ├── notifications.js        # Notificaciones
│   │   └── service-worker.js       # Offline
│   │
│   ├── mp3/                        # 196 archivos de audio
│   └── img/                        # Imágenes y logos
```

### Event Bus (event-bus.js)

Todos los módulos se comunican a través del Event Bus. Nunca importes directamente un módulo desde otro.

```javascript
// Emitir evento
EventBus.emit(SanctuaryEvents.ROSARY_COMPLETE, { count: 50 });

// Escuchar evento
EventBus.on(SanctuaryEvents.ROSARY_COMPLETE, (event) => {
  console.log('Rosario completado:', event.data);
});
```

Eventos disponibles en `SanctuaryEvents`:
- `CANDLE_LIT` — cuando se enciende una vela
- `ROSARY_COMPLETE` — cuando termina el rosario
- `SECTION_CHANGED` — cambio de sección
- `CATHEDRAL_MODE_ENTER/EXIT` — modo inmersivo
- `COMPANION_OPENED/CLOSED` — compañero espiritual
- `FEAST_DAY` — día de fiesta litúrgica
- `USER_RETURN` — usuario vuelve después de 7+ días

### Experience Director

El orquestador central que escucha todos los eventos y toma decisiones contextuales:
- Después de 2 min en una sección → activa geometría sagrada
- A las 12:00, 6:00, 18:00 → Ángelus automático
- Viernes Santo → modo penitencial
- Completar rosario → notificación + logro

---

## Mantenimiento futuro

### Actualizar el calendario litúrgico

El sistema calcula automáticamente la Pascua y todos los tiempos litúrgicos. Solo necesitas actualizar `feast-days.js` si quieres añadir nuevas fiestas:

```javascript
{
  month: 12,
  day: 8,
  name: "Inmaculada Concepción",
  type: "solemnidad", // solemnidad, fiesta, memoria
  category: "mariana",
  color: "blanco",
  description: "...",
  section: "maria.html"
}
```

### Añadir nueva música

1. Copiar MP3 a `public/mp3/`
2. Añadir entrada en `audio-catalog.js`:

```javascript
{
  file: "nombre.mp3",
  title: "Título de la pieza",
  artist: "Compositor",
  tempo: "lenta|moderada|rapida",
  caracter: "contemplativo|mariano|penitencial",
  sections: ["pagina-relacionada"],
  liturgicalSeasons: ["advent", "lent"]
}
```

### Actualizar el compañero espiritual

Edita `spiritual-companion.js`:
- `systemPrompt` — personalidad del guía
- `greetingMessages` — saludos iniciales
- `contextualPrompts` — sugerencias por sección

Para producción, configura variables de entorno:
```bash
ANTHROPIC_API_KEY=sk-...
```

### Añadir nueva devoción

1. Crear `public/nueva-devocion.html` copiando estructura
2. Añadir al menú en `header.js`
3. Actualizar `sitemap.xml`

---

## Deployment

### Variables de entorno (producción)

```bash
# Compañero espiritual (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# Comunidad (Supabase - opcional)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Analytics (opcional, respetuoso)
ANALYTICS_ID=G-XXXXXXXXXX
```

### Recomendación de hosting

**Vercel** o **Netlify**:
- CDN global
- HTTPS automático
- Deploy continuo desde Git
- Edge functions para proxy de Anthropic (no exponer API key)

```bash
# Deploy con Vercel
npm i -g vercel
vercel --prod
```

---

## Traducciones regionales

El sistema detecta automáticamente el variantе de español:
- `es-ES` — Español de España
- `es-AR` — Español de Argentina
- `es-PY` — Español de Paraguay
- `es-CO` — Español de Colombia
- `es-MX` — Español de México
- `es-CL` — Español de Chile

Diferencias en vocabulario devocional:
- "Dios te salve" vs "Dios te guarde"
- "misa" vs "eucaristía"
- "vos" vs "tú" (voseo/tuteo)

El usuario puede cambiar manualmente desde el selector de idioma.

---

## Verificación final

Antes de publicar, hazte esta pregunta:

> *"Si alguien llega a esta web en el peor momento de su vida — buscando paz, buscando a Dios, buscando algo en lo que creer —*
> 
> *¿Esta web le recibe con dignidad?*
> *¿Le ofrece silencio cuando lo necesita?*
> *¿Le habla con verdad cuando está listo para escuchar?*
> *¿Le acompaña sin juzgar, sin presionar, sin distraer?*
> *¿Le deja ir en paz?"*

Si la respuesta a cada pregunta es **SÍ** — el santuario está listo.

---

## Créditos

- **Desarrollado con fe y código** ✝
- Santa Faustina Kowalska — Apóstol de la Divina Misericordia
- Virgen de Caacupé — Patrona de Paraguay
- Virgen de Luján — Patrona de Argentina
- Música: Catálogo de música sacra gregoriana y clásica

---

## Licencia

Proyecto de código abierto para fines educativos y devocionales.

---

## Oración del desarrollador

*Señor, que este código sirva para Tu gloria y para el consuelo de quien suffering. Que cada línea sea una invitación al encuentro Contigo. Que este santuario digital sea un faro de esperanza en la oscuridad de internet. Amén.*

---

*"Del Corazón abierto de Jesús brotan rayos de luz, agua y sangre que alcanzan a quien se acerca con confianza"*

— Jesús a Santa Faustina Kowalska

---

**Versión:** 1.0.0  
**Última actualización:** 12 de abril de 2026  
**Rama:** Santo-Rosario-y-Ramos-de-Rosas-Sagrada  
**ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA**