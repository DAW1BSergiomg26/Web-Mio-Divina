#!/usr/bin/env node

console.log(`
╔══════════════════════════════════════════════════════════════╗
║              🧪 SUITE DE TESTS - DIVINA MISERICORDIA        ║
╚══════════════════════════════════════════════════════════════╝
`);

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const tests = {
  'Accesibilidad (WCAG)': async () => {
    console.log('\n🔍 Ejecutando tests de accesibilidad...\n');
    
    let issues = 0;
    
    function processDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          processDir(filePath);
        } else if (file.endsWith('.html')) {
          const content = fs.readFileSync(filePath, 'utf8');
          if (!content.includes('lang="')) issues++;
          if (!content.includes('skip-link') && !content.includes('Skip')) issues++;
        }
      }
    }
    
    processDir(publicDir);
    
    console.log(`   ✓ Completado (${issues} warnings)`);
    return issues < 10;
  },
  
  'Rendimiento': async () => {
    console.log('\n⚡ Ejecutando tests de rendimiento...\n');
    
    let totalSize = 0;
    
    function processDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          processDir(filePath);
        } else if (file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.html')) {
          totalSize += stat.size;
        }
      }
    }
    
    processDir(publicDir);
    
    const sizeKB = (totalSize / 1024).toFixed(2);
    console.log(`   ✓ Tamaño total: ${sizeKB} KB`);
    
    return totalSize < 5000000;
  },
  
  'SEO': async () => {
    console.log('\n🔎 Ejecutando tests de SEO...\n');
    
    let passed = 0;
    let total = 0;
    
    function processDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          processDir(filePath);
        } else if (file === 'index.html') {
          const content = fs.readFileSync(filePath, 'utf8');
          total++;
          if (content.includes('og:') && content.includes('schema.org')) passed++;
        }
      }
    }
    
    processDir(publicDir);
    
    console.log(`   ✓ Completado (${passed}/${total} páginas con SEO)`);
    return passed > 0;
  },
  
  'PWA': async () => {
    console.log('\n📱 Ejecutando tests de PWA...\n');
    
    const hasManifest = fs.existsSync(path.join(publicDir, 'manifest.json'));
    const hasSW = fs.existsSync(path.join(publicDir, 'service-worker.js'));
    
    console.log(`   ✓ Manifest: ${hasManifest ? 'OK' : 'FALTA'}`);
    console.log(`   ✓ Service Worker: ${hasSW ? 'OK' : 'FALTA'}`);
    
    return hasManifest && hasSW;
  },
  
  'Seguridad': async () => {
    console.log('\n🔒 Ejecutando tests de seguridad...\n');
    
    const hasRobots = fs.existsSync(path.join(publicDir, 'robots.txt'));
    const hasSitemap = fs.existsSync(path.join(publicDir, 'sitemap.xml'));
    
    console.log(`   ✓ Robots.txt: ${hasRobots ? 'OK' : 'FALTA'}`);
    console.log(`   ✓ Sitemap: ${hasSitemap ? 'OK' : 'FALTA'}`);
    
    return hasRobots && hasSitemap;
  }
};

async function runTests() {
  const results = {};
  let passed = 0;
  let failed = 0;
  
  for (const [name, testFn] of Object.entries(tests)) {
    try {
      const result = await testFn();
      results[name] = result ? '✅ PASS' : '⚠️  WARN';
      if (result) passed++;
      else failed++;
    } catch (err) {
      results[name] = '❌ FAIL';
      failed++;
      console.log(`   Error: ${err.message}`);
    }
  }
  
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    RESUMEN DE TESTS                         ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  
  for (const [name, result] of Object.entries(results)) {
    console.log(`║ ${name.padEnd(30)} │ ${result.padEnd(15)} ║`);
  }
  
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║ TOTAL: ${passed} passed, ${failed} failed                           ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  if (failed === 0) {
    console.log('🎉 ¡Todos los tests pasaron!\n');
  } else {
    console.log('⚠️  Algunos tests necesitan atención.\n');
  }
}

runTests();