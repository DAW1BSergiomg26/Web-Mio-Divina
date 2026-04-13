// genera-biblia-json.js
// Script para generar biblia-data.js desde un archivo de traducción
const fs = require('fs');
const readline = require('readline');

// Cambia esta ruta por tu archivo de traducción
const archivoFuente = 'biblia_traduccion.txt';
const archivoSalida = 'biblia-data.js';

const bibliaData = {
  nt: { nombre: "Nuevo Testamento", libros: [] },
  at: { nombre: "Antiguo Testamento", libros: [] }
};

// Función para encontrar o crear libro
function getLibro(testamento, nombreLibro, abreviado) {
  let libros = bibliaData[testamento].libros;
  let libro = libros.find(l => l.nombre === nombreLibro);
  if (!libro) {
    libro = { nombre: nombreLibro, capitulos: 0, abreviado: abreviado || nombreLibro, contenido: {} };
    libros.push(libro);
  }
  return libro;
}

// Leer archivo línea por línea
const rl = readline.createInterface({
  input: fs.createReadStream(archivoFuente),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (!line.trim() || line.startsWith('#')) return;
  
  const partes = line.split('|');
  if (partes.length < 5) return;
  
  const [testamento, libroNombre, capituloStr, versiculoStr, ...textoArr] = partes;
  const texto = textoArr.join('|').trim();
  const capitulo = parseInt(capituloStr);
  const versiculo = parseInt(versiculoStr);

  if (isNaN(capitulo) || isNaN(versiculo)) return;

  const libro = getLibro(testamento.toLowerCase(), libroNombre);
  if (!libro.contenido[capitulo]) libro.contenido[capitulo] = [];
  libro.contenido[capitulo].push({ v: versiculo, t: texto });

  // Ajustar número de capítulos si es mayor
  if (capitulo > libro.capitulos) libro.capitulos = capitulo;
});

rl.on('close', () => {
  // Guardar archivo JS listo para tu proyecto
  const salida = `// Datos de la Biblia - Generado automáticamente\nconst bibliaData = ${JSON.stringify(bibliaData, null, 2)};\n\n` +
                 `if (typeof module !== 'undefined' && module.exports) {\n` +
                 `  module.exports = bibliaData;\n` +
                 `}\n`;

  fs.writeFileSync(archivoSalida, salida, 'utf8');
  console.log(`✅ biblia-data.js generado con éxito: ${archivoSalida}`);
});

rl.on('error', (err) => {
  console.error('❌ Error al leer el archivo:', err.message);
  console.log('📝 Asegúrate de que el archivo bible_traduccion.txt exista en la misma carpeta');
});
