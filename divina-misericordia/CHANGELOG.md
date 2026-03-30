# Changelog - Divina Misericordia

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
