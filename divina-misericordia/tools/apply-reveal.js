const fs = require('fs');
const path = require('path');

const dir = './public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// Mapeo de selectores a clases reveal
const revealMap = {
  '<h1': 'reveal-rise',
  '<h2': 'reveal-rise', 
  '<h3': 'reveal-rise',
  '<section': 'reveal-fade',
  '<article': 'reveal-fade',
  '<div class="card"': 'reveal-rise',
  '<div class="track-card"': 'reveal-fade',
  '<div class="santo-card"': 'reveal-rise',
  '<div class="devocion-card"': 'reveal-rise',
  '<div class="category-header"': 'reveal-glow',
  '<div class="library-header"': 'reveal-glow',
  '<p>': 'reveal-fade',
  '<footer': 'reveal-sacred',
  '<div class="main-footer"': 'reveal-sacred'
};

let count = 0;
files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Agregar clases reveal sin duplicar
  Object.keys(revealMap).forEach(selector => {
    const className = revealMap[selector];
    const regex = new RegExp(selector.replace('<', '(<)') + '([^>]*)>', 'gi');
    
    content = content.replace(regex, (match, attrs) => {
      // Verificar si ya tiene clase reveal
      if (attrs.includes('reveal-')) return match;
      return `${selector}${attrs} class="${className}">`;
    });
  });
  
  fs.writeFileSync(filePath, content);
  count++;
  console.log('Reveal classes added:', file);
});

console.log('Total archivos procesados:', count);