const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

console.log('⚡ Tests de Rendimiento\n');

const results = {
  largeCSS: [],
  largeJS: [],
  manyRequests: {},
  missingMinification: [],
  cacheIssues: []
};

function checkFile(filePath, stats, type) {
  const sizeKB = (stats.size / 1024).toFixed(2);
  const relativePath = filePath.replace(publicDir, '');
  
  if (type === 'css' && stats.size > 50000) {
    results.largeCSS.push({ path: relativePath, size: sizeKB });
  }
  
  if (type === 'js' && stats.size > 50000) {
    results.largeJS.push({ path: relativePath, size: sizeKB });
  }
  
  if (stats.size > 100000 && !filePath.includes('.min.')) {
    results.missingMinification.push({ path: relativePath, size: sizeKB });
  }
}

function processDir(dir, fileCount = { count: 0 }) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDir(filePath, fileCount);
    } else {
      fileCount.count++;
      if (file.endsWith('.css')) checkFile(filePath, stat, 'css');
      if (file.endsWith('.js')) checkFile(filePath, stat, 'js');
    }
  }
  
  return fileCount;
}

processDir(publicDir);

console.log('═══════════════════════════════════════════════════');
console.log('                    RESULTADOS                      ');
console.log('═══════════════════════════════════════════════════\n');

console.log('📊 Archivos estáticos:');
const cssFiles = [];
const jsFiles = [];
const htmlFiles = [];

function countFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      countFiles(filePath);
    } else {
      if (file.endsWith('.css')) cssFiles.push({ path: filePath, size: stat.size });
      if (file.endsWith('.js')) jsFiles.push({ path: filePath, size: stat.size });
      if (file.endsWith('.html')) htmlFiles.push({ path: filePath, size: stat.size });
    }
  }
}
countFiles(publicDir);

const totalCSS = (cssFiles.reduce((a, f) => a + f.size, 0) / 1024).toFixed(2);
const totalJS = (jsFiles.reduce((a, f) => a + f.size, 0) / 1024).toFixed(2);
const totalHTML = (htmlFiles.reduce((a, f) => a + f.size, 0) / 1024).toFixed(2);

console.log(`   CSS: ${cssFiles.length} archivos (${totalCSS} KB)`);
console.log(`   JS: ${jsFiles.length} archivos (${totalJS} KB)`);
console.log(`   HTML: ${htmlFiles.length} páginas (${totalHTML} KB)`);
console.log('');

if (results.largeCSS.length > 0) {
  console.log('⚠️  CSS grande (>50KB):');
  results.largeCSS.forEach(f => console.log(`   - ${f.path} (${f.size}KB)`));
  console.log('');
}

if (results.largeJS.length > 0) {
  console.log('⚠️  JavaScript grande (>50KB):');
  results.largeJS.forEach(f => console.log(`   - ${f.path} (${f.size}KB)`));
  console.log('');
}

if (results.missingMinification.length > 0) {
  console.log('⚠️  Archivos sin minificar (>100KB):');
  results.missingMinification.forEach(f => console.log(`   - ${f.path} (${f.size}KB)`));
  console.log('');
}

const totalSize = (totalCSS + totalJS + totalHTML);
console.log('📈 Peso total estimado:');
console.log(`   ${totalSize} KB (${(totalSize / 1024).toFixed(2)} MB)`);
console.log('');

if (results.largeCSS.length === 0 && results.largeJS.length === 0) {
  console.log('✅ ¡Tests de rendimiento pasados!\n');
} else {
  console.log('💡 Recomendaciones:');
  console.log('   - Ejecuta: npm run build:css');
  console.log('   - Ejecuta: npm run build:js');
  console.log('   - Considera code splitting para JS grande\n');
}

module.exports = { results, totalSize };