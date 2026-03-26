# Divina Misericordia - Static Website

Sitio web de la ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA.

## Requisitos

- Node.js (versión 14 o superior)

## Instalación

```bash
npm install
```

## Ejecutar el proyecto

```bash
npm start
```

El servidor arrancará en http://localhost:3001

## Estructura de carpetas

```
mi-app/
├── index.js              # Servidor Node.js
├── package.json          # Configuración del proyecto
├── AGENTS.md            # Guía para desarrolladores
├── README.md            # Este archivo
└── public/              # Archivos estáticos (servidos al navegador)
    ├── index.html       # Página de inicio
    ├── introduccion.html
    ├── quienes-somos.html
    ├── hora-de-la-misericordia.html
    ├── coronilla.html
    ├── los-rayos.html
    ├── galeria.html
    ├── oraciones.html
    ├── noticias.html
    ├── contacto.html
    ├── css/
    │   └── styles.css   # Estilos principales
    ├── js/
    │   └── main.js      # JavaScript del cliente
    └── img/
        └── logo-*.jpg   # Imágenes y logos
```

## Cómo añadir una nueva página

1. Crear un nuevo archivo HTML en `public/` (ejemplo: `nueva-pagina.html`)
2. Copiar la estructura de otra página existente
3. Actualizar el título y el contenido
4. Añadir el enlace en el menú de navegación

## Cómo modificar estilos

Editar `public/css/styles.css`

## Cómo modificar JavaScript

Editar `public/js/main.js`

## Tecnologías

- Node.js (servidor)
- Vanilla JavaScript (sin frameworks)
- CSS moderno con variables y diseño responsivo
