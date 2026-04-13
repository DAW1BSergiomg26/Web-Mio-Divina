const fs = require('fs');
const path = require('path');

const dir = './public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const scripts = `
<!-- Motion Design Bundle -->
<script src="js/splash.js"></script>
<script src="js/transitions.js"></script>
<script src="js/scroll-reveal.js"></script>
<script src="js/parallax.js"></script>
<script src="js/reading-progress.js"></script>
<script src="js/particles.js"></script>
</body>`;

let count = 0;
files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar si no tiene motion bundle
  if (!content.includes('splash.js') && content.includes('</body>')) {
    content = content.replace('</body>', scripts);
    fs.writeFileSync(filePath, content);
    count++;
    console.log('Actualizado:', file);
  }
});

console.log('Total archivos actualizados:', count);