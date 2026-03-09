# AGENTS.md - Development Guidelines

## Project Overview

This is a simple Node.js static file server project for a spiritual community website (ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA). It uses vanilla JavaScript (CommonJS) with no build tools or framework dependencies.

## Running the Project

```bash
npm start      # Start the server (alias: npm run dev)
npm run dev    # Start the server in development mode
```

The server runs on port 3001 and serves static files from the `public/` directory.

## Build, Lint, and Test Commands

This project has **no** build, lint, or test tooling configured.

- **Build**: N/A (static files served directly)
- **Lint**: None configured
- **Tests**: None configured

### Recommendations for Future Setup

If you need to add tooling, consider:

```bash
# JavaScript linting with ESLint
npm install eslint --save-dev
npx eslint . --ext .js

# Testing with Jest
npm install jest --save-dev
npx jest                    # Run all tests
npx jest --testNamePattern="specific test"  # Run single test
```

## Code Style Guidelines

### General Principles

- Keep code simple and readable
- Use functional patterns with clear, descriptive names
- Comment in Spanish (matching existing codebase style)
- Use 2 spaces for indentation

### JavaScript (Node.js / CommonJS)

```javascript
// ✓ Use const/let, avoid var
const fs = require('fs');
let counter = 0;

// ✓ Use descriptive names
function marcarSoloEste(linkActivo) { }

// ✓ Handle errors explicitly
fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error('Error leyendo archivo:', filePath, err.code);
    // Handle error appropriately
  }
});

// ✓ Use early returns
if (err.code === 'ENOENT') {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  return res.end('<h1>404</h1>');
}
```

### Naming Conventions

- **Variables/functions**: `camelCase` (e.g., `navLinks`, `actualizarBotonTop`)
- **Constants**: `UPPER_SNAKE_CASE` for true constants
- **Classes**: Not used in this project (vanilla JS only)
- **Files**: lowercase with descriptive names (e.g., `main.js`, `index.js`)

### HTML

- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Use lowercase for tags and attributes
- Use double quotes for attribute values
- Include `lang="es-ES"` for Spanish content

### CSS

- Use lowercase class names with descriptive prefixes
- Group related styles together
- Follow BEM-like conventions for component styles

### Error Handling

- Always handle async errors in callbacks
- Log errors with descriptive messages
- Return appropriate HTTP status codes (404 for not found, 500 for server errors)
- Never expose stack traces to clients

### Imports/Dependencies

- Use CommonJS `require()` for Node.js
- Place requires at the top of files
- Use core modules when possible (`fs`, `path`, `http`)

### Security Considerations

- Validate file paths to prevent directory traversal attacks
- Don't expose sensitive information in error messages
- Use proper Content-Type headers

## File Structure

```
├── index.js              # Main server entry point (Node.js)
├── package.json          # Project configuration
├── AGENTS.md             # Development guidelines for AI agents
├── README.md             # Project documentation
└── public/               # Static files served by the server
    ├── index.html        # Homepage
    ├── *.html            # Other pages (contacto.html, etc.)
    ├── css/
    │   └── styles.css    # Main stylesheet
    ├── js/
    │   └── main.js       # Client-side JavaScript
    └── img/
        └── *             # Images (logos, etc.)
```

### Quick Reference

| Path | Description |
|------|-------------|
| `/` | Homepage (index.html) |
| `/contacto.html` | Contact page |
| `/css/styles.css` | Main CSS |
| `/js/main.js` | Main JavaScript |

## Common Tasks

### Adding a New Route
Edit `index.js` and add conditions in the URL handling logic.

### Adding Client-Side JavaScript
Add new files in `public/js/` and include via `<script>` tags in HTML.

### Adding Styles
Add CSS files in `public/css/` and link in HTML `<head>`.

## Important Notes

- The codebase uses Spanish comments and console messages
- The server uses port 3001 by default
- This is a simple static file server - no database or complex backend logic
