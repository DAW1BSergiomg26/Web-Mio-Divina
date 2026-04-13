const fs = require('fs');
const path = require('path');

const pwaScripts = `
<!-- PWA y Service Worker -->
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('[PWA] SW registrado'))
      .catch(err => console.log('[PWA] SW failed:', err));
  }
</script>
<script src="js/pwa-install.js"></script>
<script src="js/notifications.js"></script>
`;

const scriptsToAdd = `
<!-- PWA y Service Worker -->
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('[PWA] SW registrado'))
      .catch(err => console.log('[PWA] SW failed:', err));
  }
</script>
<script src="js/pwa-install.js"></script>
<script src="js/notifications.js"></script>
</body>`;

const dir = './public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Solo agregar si no tiene service worker
  if (!content.includes('service-worker.js') && content.includes('</body>')) {
    content = content.replace('</body>', scriptsToAdd);
    fs.writeFileSync(filePath, content);
    console.log('Actualizado:', file);
  }
});

console.log('Proceso completado');