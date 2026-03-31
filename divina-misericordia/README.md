# Divina Misericordia - Santuario Digital Espiritual

> *"Jesús, en Vos Confío"*

## Descripción

El Portal de la Divina Misericordia es un santuario digital desarrollado para la **ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA**. Este proyecto constituye una experiencia web espiritual única que combina tecnología moderna con devoción católica, creando un espacio de recogimiento y oración para los fieles.

### Propósito

- Proporcionar recursos de oración digital (coronilla, novena, hora de la misericordia)
- Dar a conocer la vida y mensaje de Santa Faustina Kowalska
- Ofrecer un espacio de devoción mariana
- Crear comunidad espiritual a través de intenciones de oración
- Funcionar como santuario offline para momentos sin conexión

---

## Arquitectura del Sistema

```
divina-misericordia/
├── index.js                    # Servidor Node.js
├── package.json                # Configuración NPM
├── README.md                   # Este archivo
├── CHANGELOG.md               # Historial de versiones
├── AGENTS.md                  # Guía para desarrolladores
│
├── public/                     # Archivos estáticos
│   ├── index.html             # Página principal
│   ├── offline.html           # Página offline
│   ├── manifest.json          # PWA Manifest
│   ├── service-worker.js      # SW principal
│   ├── sw.js                  # SW secundario
│   ├── robots.txt             # Configuración SEO
│   ├── sitemap.xml            # Mapa del sitio
│   │
│   ├── css/                   # Estilos
│   │   ├── styles.css         # Estilos principales
│   │   ├── global.css         # Variables globales
│   │   ├── audio-player.css   # Reproductor audio
│   │   └── reproductor-*.css  # Estilos adicionales
│   │
│   ├── js/                    # Scripts del cliente
│   │   ├── main.js            # Punto de entrada
│   │   │
│   │   ├── # CORE
│   │   │   ├── header.js      # Componente header
│   │   │   ├── footer.js      # Componente footer
│   │   │   ├── cursor.js      # Cursor divino
│   │   │   └── global-components.js
│   │   │
│   │   ├── # AUDIO
│   │   │   ├── audio-catalog.js     # Catálogo musical
│   │   │   ├── audio-player.js      # Reproductor base
│   │   │   ├── audio-section-manager.js
│   │   │   ├── reproductor-sagrado.js
│   │   │   ├── reproductor-global.js
│   │   │   └── sistema-musical-sacro.js
│   │   │
│   │   ├── # DEVOCIONAL
│   │   │   ├── votive-candle.js    # Velas votivas
│   │   │   ├── rosary-counter.js   # Contador rosario
│   │   │   ├── prayer-intentions.js # Intenciones oración
│   │   │   └── daily-quote.js      # Cita espiritual
│   │   │
│   │   ├── # LITÚRGICO
│   │   │   ├── feast-days.js       # Base datos fiestas
│   │   │   ├── liturgical-calendar.js # Motor calendario
│   │   │   ├── liturgical-widgets.js  # Widgets fiesta/santo
│   │   │   └── liturgical-clock.js    # Horas canónicas
│   │   │
│   │   ├── # ANIMACIÓN
│   │   │   ├── splash.js           # Pantalla carga
│   │   │   ├── transitions.js      # Transiciones
│   │   │   ├── scroll-reveal.js    # Revelado scroll
│   │   │   ├── parallax.js         # Efecto parallax
│   │   │   ├── particles.js        # Partículas
│   │   │   └── motion-bundle.js    # Bundle animaciones
│   │   │
│   │   ├── # PWA
│   │   │   ├── pwa-install.js      # Instalación PWA
│   │   │   ├── notifications.js    # Notificaciones
│   │   │   └── reading-progress.js # Barra progreso
│   │   │
│   │   ├── # DETALLES
│   │   │   ├── spiritual-details.js # Easter eggs
│   │   │   ├── scroll-buttons.js   # Botones scroll
│   │   │   └── golden-line.js      # Línea dorada
│   │   │
│   │   └── # BIBLIA
│   │       ├── biblia.js           # Sistema bíblico
│   │       ├── biblia-data.js      # Datos bíblicos
│   │       └── genera-biblia-json.js
│   │
│   ├── mp3/                      # Música sacra
│   └── img/                      # Imágenes y logos
```

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-repositorio> divina-misericordia
cd divina-misericordia

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar producción
npm start
```

El servidor arrancará en **http://localhost:3001**

---

## Características Principales

### ✝ Sistema de Oración
- Coronilla de la Divina Misericordia
- Novena completa
- Hora de la Misericordia (3:00 PM)
- Rosario digital con contador

### 🎵 Música Sacra
- Catálogo curado de música gregoriana y clásica
- Reproductor multisección
- Sugerencias litúrgicas automáticas

### 📅 Calendario Litúrgico
- Cálculo automático de tiempos litúrgicos
- Fiestas marianas y del santoral
- Temas visuales por temporada
- Widget de fiesta del día

### 🌟 Experiencia Espiritual
- Easter eggs (escribir "AVE")
- Micro-textos espiritualizados
- Título de pestaña dinámico
- Seleção de texto personalizada

### 📱 PWA
- Instalable en dispositivos
- Modo offline completo
- Notificaciones litúrgicas
- Caché inteligente

---

## Cómo Añadir Contenido

### Nueva Devoción o Santo

1. **Crear página HTML** en `public/` (ej: `san-jose.html`)
2. **Copiar estructura** de página existente
3. **Añadir al menú** de navegación
4. **Actualizar sitemap.xml** con la nueva URL

### Nueva Canción

1. **Añadir al JSON** en `js/audio-catalog.js`:
```javascript
{
  file: "nombre.mp3",
  title: "Título",
  artist: "Artista",
  tempo: "lenta|moderada|rapida",
  caracter: "contemplativo|mariano|penitencial",
  sections: ["pagina-relacionada"]
}
```

2. **Copiar archivo MP3** a `public/mp3/`

### Actualizar Fiestas Litúrgicas

Editar `js/feast-days.js`:
```javascript
{
  month: 12,
  day: 8,
  name: "Inmaculada Concepción",
  type: "solemnidad",
  category: "mariana",
  color: "blanco",
  description: "...",
  section: "maria.html"
}
```

---

## Tech Stack

- **Backend**: Node.js + Express (servidor estático)
- **Frontend**: Vanilla JavaScript (ES6+)
- **CSS**: Variables CSS, Flexbox, Grid
- **PWA**: Service Workers, Manifest
- **Sin frameworks** - máxima ligereza

---

## Créditos

- **Desarrollado con fe y código** ✝
- Música: Catálogo de música sacra gregoriana y clásica
- Diseño: Inspirado en el arte sacro y la iconografía de la Divina Misericordia
- Santa Faustina Kowalska - Apóstol de la Divina Misericordia

---

## Licencia

Proyecto de código abierto para fines educativos y devocionales.

---

*"Del Corazón abierto de Jesús brotan rayos de luz, agua y sangre que alcanzan a quien se acerca con confianza"*

— Jesús a Santa Faustina Kowalska