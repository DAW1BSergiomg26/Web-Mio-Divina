// Actualizar menús de navegación en todas las páginas
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

let modified = 0;

htmlFiles.forEach(file => {
  if (file === 'pwa-init.html' || file === 'estudios-biblicos.html') return;
  
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Añadir enlace a Estudios Bíblicos en el nav
  if (content.includes('devociones-marianas.html') && !content.includes('estudios-biblicos.html')) {
    // Añadir después de devociones-marianas
    content = content.replace(
      /(<a href="devociones-marianas\.html"[^>]*>.*?<\/a>)/s,
      '$1\n    <a href="estudios-biblicos.html">Estudios</a>'
    );
    
    // También añadir en footer
    if (content.includes('Devociones Marianas</a>') && !content.includes('estudios-biblicos.html')) {
      content = content.replace(
        /(<a href="devociones-marianas\.html">Devociones Marianas<\/a>)/,
        '$1\n      <a href="estudios-biblicos.html">Estudios Bíblicos</a>'
      );
    }
    
    fs.writeFileSync(filePath, content);
    modified++;
    console.log(`  ✅ ${file}`);
  }
});

console.log(`\n📊 RESUMEN:`);
console.log(`   ✅ Páginas actualizadas: ${modified}`);