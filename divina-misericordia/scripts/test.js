const fs = require('fs');

const files = ['index.html', 'novena.html', 'coronilla.html', 'admin.html', 'test-audio.html', 'el-altar.html'];

console.log('=== VERIFICACIÓN DE OPTIMIZACIONES ===\n');

files.forEach(file => {
  const content = fs.readFileSync('public/' + file, 'utf8');
  const defer = content.includes('defer src');
  const lazy = content.includes('loading="lazy"');
  const meta = content.includes('name="description"');
  
  console.log('📄 ' + file);
  console.log('   defer: ' + (defer ? '✅' : '❌'));
  console.log('   lazy:  ' + (lazy ? '✅' : '❌'));
  console.log('   meta:  ' + (meta ? '✅' : '❌'));
  console.log('');
});

console.log('=== VERIFICACIÓN DE sitemap.xml ===\n');

const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const urlCorrecta = sitemap.includes('misericordiadejesus.es');
const urlIncorrecta = sitemap.includes('misercordiadejesus');

console.log('URL correcta: ' + (urlCorrecta ? '✅' : '❌'));
console.log('URL incorrecta: ' + (urlIncorrecta ? '❌' : '✅'));

console.log('\n=== VERIFICACIÓN DE service-worker ===\n');

const sw = fs.readFileSync('public/sw.js', 'utf8');
const cacheName = sw.includes('divina-misericordia-v2');
console.log('Cache name v2: ' + (cacheName ? '✅' : '❌'));

console.log('\n=== VERIFICACIÓN DE admin.html ===\n');

const admin = fs.readFileSync('public/admin.html', 'utf8');
const hasHash = admin.includes('sha256');
const noPlainPass = !admin.includes('CONTRASEÑA = "Rufi14"');
console.log('Credenciales hasheadas: ' + (hasHash ? '✅' : '❌'));
console.log('Sin contraseña en texto: ' + (noPlainPass ? '✅' : '❌'));

console.log('\n=== VERIFICACIÓN DE scripts npm ===\n');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const hasBackup = pkg.scripts.backup !== undefined;
const hasRestore = pkg.scripts.restore !== undefined;
console.log('Script backup: ' + (hasBackup ? '✅' : '❌'));
console.log('Script restore: ' + (hasRestore ? '✅' : '❌'));

console.log('\n✅ VERIFICACIÓN COMPLETA');
