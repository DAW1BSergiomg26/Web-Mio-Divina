const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3002;
const dataFile = path.join(__dirname, 'data', 'cms-data.json');

function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
  } catch (e) {
    console.error('Error cargando datos:', e);
  }
  return { noticias: [], intenciones: [], testimonios: [], contactos: [] };
}

function saveData(data) {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  console.log(`Petición: ${req.method} ${req.url}`);

  let urlPath = req.url;
  
  // Decodificar URL para manejar espacios y caracteres especiales
  urlPath = decodeURIComponent(urlPath);
  
  // DEBUG: registrar todas las URLs
  if (urlPath.includes('.mp3')) {
    console.log('DEBUG: Solicitud MP3 detectada:', urlPath);
  }

  // API Endpoints para CMS
  if (urlPath.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      return res.end();
    }

    const data = loadData();
    const apiPath = urlPath.replace('/api/', '');

    // GET datos
    if (req.method === 'GET' && apiPath === 'datos') {
      return res.end(JSON.stringify(data));
    }

    // POST - Guardar archivo HTML
    if (req.method === 'POST' && apiPath === 'save') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { file, content } = JSON.parse(body);
          if (!file || !content) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Faltan datos: file o content' }));
          }
          const filePath = path.join(__dirname, 'public', file);
          console.log(`[GUARDANDO] Archivo: ${filePath}`);
          console.log(`[GUARDANDO] Tamaño: ${content.length} caracteres`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`[OK] Archivo guardado correctamente: ${file}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, message: 'Archivo guardado correctamente' }));
        } catch (e) {
          console.error('[ERROR] Guardando archivo:', e);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    // POST noticias
    if (req.method === 'POST' && apiPath === 'noticias') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const item = JSON.parse(body);
        item.id = Date.now();
        data.noticias.unshift(item);
        saveData(data);
        res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    // DELETE noticias
    if (req.method === 'DELETE' && apiPath.startsWith('noticias/')) {
      const idx = parseInt(apiPath.split('/')[1]);
      data.noticias.splice(idx, 1);
      saveData(data);
      return res.end(JSON.stringify({ success: true }));
    }

    // POST intenciones
    if (req.method === 'POST' && apiPath === 'intenciones') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const item = JSON.parse(body);
        item.id = Date.now();
        data.intenciones.unshift(item);
        saveData(data);
        res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    // DELETE intenciones
    if (req.method === 'DELETE' && apiPath.startsWith('intenciones/')) {
      const idx = parseInt(apiPath.split('/')[1]);
      data.intenciones.splice(idx, 1);
      saveData(data);
      return res.end(JSON.stringify({ success: true }));
    }

    // POST testimonios
    if (req.method === 'POST' && apiPath === 'testimonios') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const item = JSON.parse(body);
        item.id = Date.now();
        data.testimonios.unshift(item);
        saveData(data);
        res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    // DELETE testimonios
    if (req.method === 'DELETE' && apiPath.startsWith('testimonios/')) {
      const idx = parseInt(apiPath.split('/')[1]);
      data.testimonios.splice(idx, 1);
      saveData(data);
      return res.end(JSON.stringify({ success: true }));
    }

    // POST contactos
    if (req.method === 'POST' && apiPath === 'contactos') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const item = JSON.parse(body);
        item.id = Date.now();
        data.contactos.unshift(item);
        saveData(data);
        res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    // DELETE contactos
    if (req.method === 'DELETE' && apiPath.startsWith('contactos/')) {
      const idx = parseInt(apiPath.split('/')[1]);
      data.contactos.splice(idx, 1);
      saveData(data);
      return res.end(JSON.stringify({ success: true }));
    }

    // Restore backup
    if (req.method === 'POST' && apiPath === 'restore') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const newData = JSON.parse(body);
        saveData(newData);
        res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    // Guardar página/editado
    if (req.method === 'POST' && apiPath === 'guardar-pagina') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const { pagina, data: paginaData } = JSON.parse(body);
        data.paginas = data.paginas || {};
        data.paginas[pagina] = paginaData;
        saveData(data);
        res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  }

  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  const filePath = path.join(__dirname, 'public', urlPath);
  const ext = path.extname(filePath).toLowerCase();
  
  // DEBUG extra
  if (urlPath.includes('mp3')) {
    console.log('DEBUG MP3: urlPath=', urlPath);
    console.log('DEBUG MP3: filePath=', filePath);
    console.log('DEBUG MP3: ext=', ext);
    console.log('DEBUG MP3: exists=', require('fs').existsSync(filePath));
    
    // Forzar que venga del sistema de archivos
    const publicDir = path.join(__dirname, 'public');
    const decodedUrlPath = decodeURIComponent(urlPath);
    const correctPath = path.join(publicDir, decodedUrlPath);
    console.log('DEBUG MP3: correctPath=', correctPath);
    console.log('DEBUG MP3: exists2=', require('fs').existsSync(correctPath));
  }
  
  let contentType = 'text/html; charset=utf-8';

  switch (ext) {
    case '.css':
      contentType = 'text/css; charset=utf-8';
      break;
    case '.js':
      contentType = 'application/javascript; charset=utf-8';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
    case '.json':
      contentType = 'application/json; charset=utf-8';
      break;
    case '.mp3':
      contentType = 'audio/mpeg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
    case '.ogg':
      contentType = 'audio/ogg';
      break;
    default:
      contentType = 'text/html; charset=utf-8';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error leyendo archivo:', filePath, err.code);
      // Agregar más debugging para MP3
      if (ext === '.mp3') {
        console.error('DEBUG MP3 - URL solicitada:', urlPath);
        console.error('DEBUG MP3 - Ruta resolved:', filePath);
        console.error('DEBUG MP3 - Existe:', require('fs').existsSync(filePath));
      }
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h1>404</h1><p>Archivo no encontrado</p>');
      }
      res.writeHead(500);
      return res.end('Error del servidor');
    }
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
  console.log(`Panel de admin: http://localhost:${port}/admin.html`);
});
