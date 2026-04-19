# Divina Misericordia - Portal de Espiritualidad Católica

## Descripción

Portal web de la Asociación Apóstoles de la Divina Misericordia. Sitio de espiritualidad católica con devociones, oraciones, coronilla, novena y contenido litúrgico.

## Estado del Proyecto

**Versión:** 2.0.0  
**Estado:** En desarrollo activo - Fase 1 y 2 completadas

## Estructura del Proyecto

```
divina-misericordia/
├── build/                  # Scripts de build y generación
│   ├── build.js           # Copia archivos estáticos
│   ├── build-css.js       # Minifica CSS
│   ├── build-js.js        # Minifica JavaScript
│   ├── build-images.js    # Optimiza imágenes
│   ├── optimize-all.js    # Build completo
│   └── generate-templates.js # Generador de templates
├── public/                 # Archivos públicos (servidos)
│   ├── css/
│   │   └── styles.css    # CSS unificado v2.0
│   ├── img/              # Imágenes
│   ├── js/               # JavaScript
│   ├── liturgia/         # Páginas de liturgia
│   ├── devociones/       # Páginas de devociones
│   ├── comunidad/        # Páginas de comunidad
│   └── ...
├── src/
│   ├── config.js         # Configuración centralizada
│   └── html/             # Templates fuente
├── index.js              # Servidor Node.js
├── package.json          # Dependencias y scripts
└── README.md             # Este archivo
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev        # Inicia el servidor en localhost:3002
npm start          # Alias de dev

# Build y optimización
npm run build      # Build completo
npm run build:css  # Minificar CSS
npm run build:js   # Minificar JavaScript
npm run build:images # Optimizar imágenes
npm run optimize   # Build completo optimizado
```

## Características Implementadas

### Fase 1: Estructura y Organización ✅
- package.json con scripts de build
- Build system automatizado
- Sistema de templates (en desarrollo)
- Configuración centralizada en `src/config.js`

### Fase 2: Performance ✅
- Servidor con caché inteligente (Cache-Control, ETag)
- Minificación de CSS con CleanCSS
- Minificación de JS con Terser
- Optimización de imágenes (WebP)
- Headers de caché por tipo de archivo

### Estilos CSS (v2.0) ✅
- CSS unificado en un solo archivo
- Metodología BEM
- Variables CSS para design tokens
- Diseño responsive
- Animaciones y efectos visuales
- Accesibilidad (skip links, focus states)

## Servidor

El servidor sirve archivos estáticos desde `public/` en el puerto 3002 (configurable via PORT).

### Características del servidor:
- Caching inteligente por tipo de archivo
- ETag headers
- Compresión futura (preparado)
- Seguridad contra directory traversal
- API endpoints para CMS (si está configurado)

## Dependencias de Desarrollo

```json
{
  "clean-css": "^5.3.3",    // Minificación CSS
  "terser": "^5.31.0",      // Minificación JS
  "sharp": "^0.33.3",       // Procesamiento de imágenes
  "imagemin": "^8.0.1"      // Optimización de imágenes
}
```

## Notas de Desarrollo

- El archivo CSS principal está en `public/css/styles.css`
- Las imágenes se sirven desde `public/img/`
- El servidor busca primero en `public/` según la URL solicitada
- Para producción, usar `npm run optimize` antes de desplegar

## Próximos Pasos

- [ ] Completar sistema de templates HTML
- [ ] Optimizar imágenes del proyecto
- [ ] Implementar lazy loading nativo
- [ ] Generar sitemap.xml automático
- [ ] Mejorar Service Worker para PWA
- [ ] Configurar CI/CD con GitHub Actions

---

**Jesús, En Vos Confío** 🕊️