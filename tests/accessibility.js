const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

console.log('🔍 Tests de Accesibilidad - WCAG 2.1\n');

const issues = {
  missingAlt: [],
  missingLabel: [],
  missingHeading: [],
  lowContrast: [],
  missingSkipLink: [],
  missingLang: []
};

function checkHTML(content, filePath) {
  const relativePath = filePath.replace(publicDir, '');
  
  if (!content.includes('lang="')) {
    issues.missingLang.push(relativePath);
  }
  
  if (!content.includes('skip-link') && !content.includes('skip-link')) {
    issues.missingSkipLink.push(relativePath);
  }
  
  const imgRegex = /<img([^>]*)>/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const attrs = match[1];
    if (!attrs.includes('alt=')) {
      issues.missingAlt.push(relativePath);
      break;
    }
  }
  
  const inputRegex = /<input[^>]*>/gi;
  while ((match = inputRegex.exec(content)) !== null) {
    const attrs = match[1];
    if (!attrs.includes('aria-label') && !attrs.includes('aria-labelledby')) {
      issues.missingLabel.push(relativePath);
      break;
    }
  }
  
  const h1Count = (content.match(/<h1/gi) || []).length;
  if (h1Count === 0) {
    issues.missingHeading.push(relativePath);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.html')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        checkHTML(content, filePath);
      } catch (err) {
        console.log(`  ⚠ Error: ${file}`);
      }
    }
  }
}

processDir(publicDir);

console.log('═══════════════════════════════════════════════════');
console.log('                    RESULTADOS                      ');
console.log('═══════════════════════════════════════════════════\n');

const totalIssues = 
  issues.missingAlt.length + 
  issues.missingLabel.length + 
  issues.missingHeading.length + 
  issues.missingSkipLink.length + 
  issues.missingLang.length;

console.log(`Total de problemas encontrados: ${totalIssues}\n`);

if (issues.missingLang.length > 0) {
  console.log(`❌ Lang attribute (${issues.missingLang.length}):`);
  issues.missingLang.slice(0, 5).forEach(f => console.log(`   - ${f}`));
  if (issues.missingLang.length > 5) console.log(`   ... y ${issues.missingLang.length - 5} más`);
  console.log('');
}

if (issues.missingSkipLink.length > 0) {
  console.log(`❌ Skip Link (${issues.missingSkipLink.length}):`);
  issues.missingSkipLink.slice(0, 5).forEach(f => console.log(`   - ${f}`));
  if (issues.missingSkipLink.length > 5) console.log(`   ... y ${issues.missingSkipLink.length - 5} más`);
  console.log('');
}

if (issues.missingAlt.length > 0) {
  console.log(`⚠️  Imágenes sin alt (${issues.missingAlt.length}):`);
  issues.missingAlt.slice(0, 5).forEach(f => console.log(`   - ${f}`));
  if (issues.missingAlt.length > 5) console.log(`   ... y ${issues.missingAlt.length - 5} más`);
  console.log('');
}

if (issues.missingHeading.length > 0) {
  console.log(`⚠️  Sin H1 (${issues.missingHeading.length}):`);
  issues.missingHeading.slice(0, 3).forEach(f => console.log(`   - ${f}`));
  console.log('');
}

if (totalIssues === 0) {
  console.log('✅ ¡Todos los tests de accesibilidad pasaron!\n');
} else {
  console.log('═══════════════════════════════════════════════════');
  console.log('Para corregir los problemas, ejecuta:');
  console.log('  npm run fix:a11y');
  console.log('═══════════════════════════════════════════════════\n');
}

module.exports = { issues, totalIssues };