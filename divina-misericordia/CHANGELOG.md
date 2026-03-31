# Changelog - Divina Misericordia

## [2.4.0] - 2026-03-31

### Added - Experiencias 3D y WebGL
- **webgl-hero.js**: Cielo nocturno sagrado con Three.js
  - StarField shader con parallax mouse (+/-15deg)
  - Nebulosa dorada/azul con noise shader
  - Rayo de luz cenital volumétrico
  - Cruz de partículas con elevación al scroll
  - Fallback para móviles, IntersectionObserver para pause
- **sacred-geometry.js**: Geometría sagrada generativa Canvas 2D
  - Flor de la Vida, Estrella de David, Mandala, Vesica Piscis
  - Click revela mensaje: "El cosmos entero es oración"
  - Mandala único por día con descarga PNG
  - Rotación lenta (60-90s), opacidad subliminal (0.04-0.08)
- **virtual-altar-3d.js**: Altar 3D navegable
  - Mesa mármol, cruz con glow, velas animadas, flores, pano
  - OrbitControls limitado (+/-45deg horizontal, sin zoom)
  - Click interacciones: cruz→cita, velas→toggle, flores→offer
  - Modo Adoración con cámara automática
  - Audio: ambiental catedral, crackling vela, campanilla

---

## [2.3.0] - 2026-03-31

### Added - Sistema Global Unificado
- **global.css**: Variables CSS completas, tokens de diseño, clases utilitarias
- **system-init.js**: Punto de entrada único para componentes globales
- **cursor.js**: Módulo cursor divino (ya existente, integrado)
- **scroll-buttons.js**: Botones de navegación con soporte color dinámico
- **golden-line.js**: Línea luminosa post-footer con cruces pulsantes
- **footer.js**: Footer global con variaciones de tema
- **header.js**: Header global con variaciones específicas:
  - default: variación base
  - marianas: para devociones marianas
  - caacupe: para Virgen de Caacupé
  - musica: para Música Sacra
- **404.html**: Página 404 personalizada espiritual
- **spiritual-details.js**: Easter eggs y micro-textos espiritualizados

### Fixed
- Servidor index.js configurado para servir 404.html automáticamente

---

## [2.2.0] - 2026-03-31

### Added - SEO y Accesibilidad WCAG 2.1 AA
- **sitemap.xml**: Actualizado con 51 URLs, priorities, lastmod
- **robots.txt**: Configuración optimizada para indexación
- **Meta tags**: Open Graph, Twitter Cards en todas las páginas
- **Schema.org**: JSON-LD ReligiousOrganization, WebSite, Breadcrumbs
- **ARIA labels**: Cursor, Rosario, Velas, Videos
- **aria-current="page"**: Navegación activa accesible
- **Skip link**: "Saltar al contenido principal"
- **Focus styles**: outline con color dorado
- **Tipografía responsiva**: clamp() para fuentes, line-height 1.65
- **Scripts con defer**: Optimización de carga

### Added - Calendario Litúrgico
- **feast-days.js**: Base de datos con 80+ fiestas litúrgicas
  - Fiestas marianas (12 diciembre, Lourdes, Fátima, etc.)
  - Santos del santoral universal
  - Advocaciones españolas (Covadonga, Pilar, etc.)
- **liturgical-calendar.js**: Motor de calendario
  - Algoritmo de Pascua (Meeus/Jones/Butcher)
  - Cálculo automático de tiempos litúrgicos
  - Tema visual dinámico según temporada
- **liturgical-widgets.js**: Widgets interactivos
  - FeastBanner: Banner de fiesta del día
  - DailySaint: Santo del día
  - LiturgicalMusic: Sugerencias musicales
- **global.css**: Temas por temporada (adviento, navidad, cuaresma, pascua)

### Added - Detalles Espirituales
- **spiritual-details.js**: Easter eggs y micro-textos
  - Easter Egg "AVE": Animación de luz dorada
  - Título de pestaña dinámico
  - Mensaje de consola ASCII
  - Selección de texto personalizada
  - Micro-textos espiritualizados
- **README.md**: Documentación técnica completa

### Fixed - HTML Malformed
- Corregidas etiquetas `<section<`, `<footer<`, etc.
- Restaurados caracteres correctos (Jesús, « », ✝, ☾, ⏰)

---

## [2.1.0] - 2026-03-31

### Added - Sistema de Motion Design
- **Splash Screen (splash.js)**: Pantalla de carga sagrada con animación de materialización luminosa
  - Se muestra una vez por sesión (sessionStorage)
  - Efecto de cruz con anillos concéntricos
  - Duración: 2s máximo
- **Page Transitions (transitions.js)**: Transiciones entre secciones
  - Efecto cortina de luz
  - Duración: 400ms salida + 400ms entrada
  - Compatible con historial del navegador
- **Scroll Reveal (scroll-reveal.js)**: Sistema de revelación por scroll
  - Clases: `.reveal-fade`, `.reveal-rise`, `.reveal-glow`, `.reveal-sacred`
  - Threshold: 0.15
  - Soporte para stagger (delay escalonado)
- **Parallax Espiritual (parallax.js)**: Parallax sutil
  - Elementos con `data-parallax="0.3"`
  - Optimizado con requestAnimationFrame
  - Desactivado en móvil
- **Reading Progress (reading-progress.js)**: Indicador de progreso
  - Barra de progreso en top de página
  - Color según tokens de la sección
- **Partículas Sacras (particles.js)**: Canvas particles ligero
  - Solo en: Inicio, Música Sacra, Devociones
  - Máximo 15 partículas, 2-3px cada una
  - Frame budget: 2ms máximo

### Added - Hover States Premium
- Botones con luz expansiva desde punto de cursor
- Links con subrayado progresivo izquierda-derecha
- Imágenes con halo dorado
- Tarjetas con elevación suave
- Nav links con línea inferior

### Fixed
- Respeto total de `prefers-reduced-motion: reduce` en todas las animaciones
- Optimización de rendimiento: transform/opacity siempre, nunca top/left

---

## [2.0.0] - 2026-03-31

### Added
- **Sistema de Curaduría Musical**: Catálogo centralizado con 70 pistas clasificadas por tempo, carácter e instrumentación
- **Audio Catalog (audio-catalog.js)**: Módulo JavaScript con metadata completa y asignaciones por sección
- **Audio Section Manager (audio-section-manager.js)**: Sistema de reproducción automática según la sección actual
- **Sistema de Notificaciones Toast**: Mensajes de error elegantes para fallos de audio

### Changed
- **audio-player.js**: 
  - Implementado lazy loading (`preload='none'`) para evitar bloqueo inicial
  - Carga audio bajo demanda al hacer play
  - Mejora en manejo de errores con UI visual
  - Funciones fade in/out para transiciones suaves

### Fixed
- **Cursor Divine**: Optimizado para usar `transform: translate3d()` en lugar de top/left para mejor rendimiento
- **Integración del catálogo**: musica-sacra.html ahora usa AudioCatalog.getCategories() en lugar de array hardcodeado

---

## [1.5.0] - 2026-03-30

### Added
- **Componentes Globales**: Sistema unificado de componentes (cursor, header, footer, golden-line, scroll-buttons)
- **global-components.js**: Punto de entrada único para inicialización de componentes
- **global.css**: Sistema de diseño con variables CSS personalizadas
- **audio-player.css**: Estilos premium para el reproductor de música sacra
- **reproductor-sagrado.css**: Estilos para reproductores individuales en páginas

### Changed
- Estandarización del footer en todas las páginas (~60 páginas)
- Normalización de estructura de navigation en header

---

## [1.4.0] - 2026-03-29

### Added
- **Reproductor Premium (audio-player.js)**: Sistema avanzado de reproducción musical con:
  - Web Audio API / HTMLAudioElement
  - Controles completos (play, pause, stop, prev, next, seek, volume)
  - Visualizador de audio
  - Fade in/out entre pistas
  - Modo minimizado
  - Botón flotante
- **Reproductor Sagrado (reproductor-sagrado.js)**: Versión ligera para páginas individuales

### Changed
- Refactorización completa del sistema de audio
- Separación de responsabilidades: audio-player para biblioteca, reproductor-sagrado para páginas individuales

---

## [1.3.0] - 2026-03-28

### Added
- **Cursor Divino (cursor.js)**: Cursor personalizado tipo cruz con:
  - Animación suave con requestAnimationFrame
  - Efectos de hover (cruz con rayos)
  - Detección de dispositivos táctiles
  - Compatibilidad cross-browser
- **Scroll Buttons (scroll-buttons.js)**: Botones de navegación flotantes
- **Golden Line (golden-line.js)**: Línea decorativa brillante en el footer

---

## [1.2.0] - 2026-03-27

### Added
- **Sistema Musical Sacro**: Biblioteca de 70 pistas MP3 organizadas en categorías:
  - Himnos de Devoción
  - Música Barroca Clásica
  - Música de Contemplación
  - Música de Gloria
  - Música Cinematográfica Sagrada
  - Música Épica y Aventura
  - El Señor de los Anillos
  - Crónicas de Narnia
  - Divina Misericordia

### Fixed
- Corregidos paths de archivos de audio
- Verificada disponibilidad de los 70 archivos MP3

---

## [1.1.0] - 2026-03-26

### Added
- **Header Global (header.js)**: Navegación unificada con variaciones temáticas
- **Footer Global (footer.js)**: Footer consistente con menú de enlaces
- **Sistema de Temas**: Variaciones para páginas marianas, Caacupé y música

---

## [1.0.0] - 2026-03-25

### Added
- Proyecto base: Static file server con Node.js
- Estructura inicial de HTML/CSS/JS
- Catálogo de oraciones y devociones
- Diseño con variables CSS personalizadas

---

## Notas de Desarrollo

### Tecnologías Utilizadas
- Node.js static file server (puerto 3001)
- Vanilla JavaScript (CommonJS)
- CSS3 con animaciones y variables
- HTML5 Semántico

### Estructura de Archivos
```
├── public/
│   ├── js/
│   │   ├── audio-catalog.js       # Catálogo centralizado
│   │   ├── audio-player.js        # Reproductor premium
│   │   ├── audio-section-manager.js  # Gestor por sección
│   │   ├── reproductor-sagrado.js # Reproductor páginas individuales
│   │   ├── cursor.js              # Cursor divino
│   │   ├── header.js              # Header global
│   │   ├── footer.js              # Footer global
│   │   ├── golden-line.js         # Línea dorada
│   │   ├── scroll-buttons.js      # Botones navegación
│   │   └── global-components.js   # Punto de entrada
│   ├── css/
│   │   ├── global.css             # Diseño sistema
│   │   ├── audio-player.css      # Estilos reproductor
│   │   └── reproductor-sagrado.css
│   └── mp3/                       # 70 archivos de audio
```

### Pendientes / known Issues
- sistema-musical-sacro.js es código legacy (sin uso activo)
- reproductor-global.js solo se usa en test-audio.html
- Considerar eliminar archivos no usados en producción
