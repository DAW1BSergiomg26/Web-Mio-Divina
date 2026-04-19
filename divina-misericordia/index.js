const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const port = process.env.PORT || 3001;
const publicDir = path.join(__dirname, 'public');
const dataFile = path.join(__dirname, 'data', 'cms-data.json');

const ADMIN_KEY = process.env.ADMIN_KEY || 'Rufi141414';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3001', 'http://127.0.0.1:3001'];

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 100;

function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now > record.resetTime + RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}

setInterval(cleanupRateLimit, 5 * 60 * 1000);

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  record.count++;
  rateLimitMap.set(ip, record);
  
  if (record.count > RATE_LIMIT_MAX) {
    return false;
  }
  return true;
}

function validateFilePath(file) {
  if (!file || typeof file !== 'string') return false;
  
  const normalized = path.normalize(file).replace(/^(\.\.[\\/])+/, '');
  if (normalized.includes('..') || normalized.includes('/') || normalized.includes('\\')) return false;
  if (!normalized.endsWith('.html')) return false;
  
  const safePath = path.join(publicDir, normalized);
  const resolvePath = path.resolve(safePath);
  
  if (!resolvePath.startsWith(path.resolve(publicDir))) return false;
  
  return true;
}

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim().split(':')[0];
  }
  return req.socket?.remoteAddress?.split(':')[0] || '127.0.0.1';
}

function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    crypto.randomBytes(bufA.length);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function requireAuth(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Authorization required' }));
    return false;
  }
  const token = authHeader.substring(7);
  if (!safeCompare(token, ADMIN_KEY)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid token' }));
    return false;
  }
  return true;
}

const MAX_BODY_SIZE = 2 * 1024 * 1024;

function parseBody(req, maxSize) {
  return new Promise((resolve, reject) => {
    let body = '';
    let received = 0;
    
    req.on('data', (chunk) => {
      received += chunk.length;
      if (received > maxSize) {
        reject(new Error('Body too large'));
        req.destroy();
        return;
      }
      body += chunk;
    });
    
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    
    req.on('error', reject);
  });
}

function handleError(res, error, context) {
  console.error(`[ERROR] ${context}:`, error.message);
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Internal server error' }));
}

// Navegación centralizada - aquí se define el menú
const NAV_CONFIG = {
 principal: [
    { href: 'index.html', label: 'Inicio' },
    { href: 'quienes-somos.html', label: 'Quiénes Somos' },
    { href: 'introduccion.html', label: 'Introducción' },
    { href: 'santa-faustina.html', label: 'Santa Faustina' },
    { href: 'hora-de-la-misericordia.html', label: 'Hora de la Misericordia' },
    { href: 'coronilla.html', label: 'Coronilla' },
    { href: 'novena.html', label: 'Novena' },
    { href: 'via-crucis.html', label: 'Vía Crucis' },
    { href: 'oraciones.html', label: 'Oraciones' },
    { href: 'santo-rosario.html', label: 'El Santo Rosario' },
    { href: 'maria.html', label: 'María' },
    { href: 'obras-de-misericordia.html', label: 'Obras de Misericordia' },
    { href: 'consagracion.html', label: 'Consagración' },
    { href: 'lugares-de-culto.html', label: 'Lugares de Culto' },
    { href: 'musica-sacra.html', label: 'Música Sacra' },
    { href: 'noticias.html', label: 'Noticias' },
    { href: 'enlaces.html', label: 'Enlaces' }
  ],
  especial: [
    { href: 'virgen-caacupe.html', label: 'Virgen Caacupé', class: 'caacupe-btn' },
    { href: 'devociones-marianas.html', label: 'Devociones Marianas', class: 'devociones-btn' },
    { href: 'otras-devociones.html', label: 'Otras Devociones ✦', class: 'nav-otras-devociones' },
    { href: 'contacto.html', label: 'Contacto' }
  ]
};

// Generar HTML de navegación basado en la página actual
function generarNavHTML(paginaActual) {
  let html = '';
  
  // Menú principal
  NAV_CONFIG.principal.forEach(item => {
    const activo = item.href === paginaActual ? ' class="activo"' : '';
    html += `<a href="${item.href}"${activo}>${item.label}</a>`;
  });
  
  // Menú especial
  NAV_CONFIG.especial.forEach(item => {
    const activo = item.href === paginaActual ? ' activo' : '';
    const classAttr = item.class ? ` class="${item.class}"` : '';
    html += `<a href="${item.href}"${classAttr}${activo}>${item.label}</a>`;
  });
  
  return html;
}

// Obtener la página actual de la URL
function getPaginaDesdeURL(urlPath) {
  if (urlPath === '/' || urlPath === '') return 'index.html';
  return urlPath.split('/').pop();
}

// Sistema de templates
const templatesDir = path.join(publicDir, '_templates');

function loadTemplate(name) {
  const templatePath = path.join(templatesDir, `${name}.html`);
  try {
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }
  } catch (e) {
    console.error(`[WARN] Template no encontrado: ${name}`);
  }
  return null;
}

function renderTemplate(templateName, data) {
  const template = loadTemplate(templateName);
  if (!template) return null;
  
  let result = template;
  
  // Reemplazar placeholders
  Object.keys(data).forEach(key => {
    const placeholder = `{{${key}}}`;
    result = result.split(placeholder).join(data[key]);
  });
  
  return result;
}

// Determinar modo de experiencia según página
function getModoExperiencia(urlPath) {
  const page = getPaginaDesdeURL(urlPath);
  
  const modosOracion = ['coronilla.html', 'novena.html', 'hora-de-la-misericordia.html', 'oraciones.html'];
  const modosContemplacion = ['index.html'];
  
  if (modosOracion.includes(page)) return 'oracion';
  if (modosContemplacion.includes(page)) return 'contemplacion';
  return 'default';
}

// Inyectar navegación en el HTML
function injectarNav(html, urlPath) {
  const paginaActual = getPaginaDesdeURL(urlPath);
  const navHTML = generarNavHTML(paginaActual);
  
  // Reemplazar la navegación existente
  // Busca el patrón <nav id="mainNav">...</nav>
  const navPattern = /<nav id="mainNav">[\s\S]*?<\/nav>/;
  
  if (navPattern.test(html)) {
    return html.replace(navPattern, `<nav id="mainNav">${navHTML}</nav>`);
  }
  
  // También buscar NAV_INJECTED (para templates nuevos)
  if (html.includes('<!-- NAV_INJECTED -->')) {
    return html.replace('<!-- NAV_INJECTED -->', navHTML);
  }
  
  return html;
}

// Añadir año dinâmico al footer
function injectarFecha(html) {
  const anio = new Date().getFullYear();
  return html.split('{{YEAR}}').join(anio);
}

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

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

function log(level, message, data) {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(data && { data })
  };
  if (LOG_LEVEL === 'debug' && data) {
    console.log(JSON.stringify(entry));
  } else if (level !== 'debug') {
    console.log(JSON.stringify(entry));
  }
}

function createBackup() {
  try {
    if (!fs.existsSync(dataFile)) return;
    const backupDir = path.join(__dirname, 'data', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `cms-backup-${timestamp}.json`);
    fs.copyFileSync(dataFile, backupFile);
    
    const files = fs.readdirSync(backupDir).sort();
    if (files.length > 10) {
      const toDelete = files.slice(0, files.length - 10);
      toDelete.forEach(f => fs.unlinkSync(path.join(backupDir, f)));
    }
    log('info', `Backup created: ${backupFile}`);
  } catch (e) {
    log('error', `Backup failed: ${e.message}`);
  }
}

const BACKUP_INTERVAL = parseInt(process.env.BACKUP_INTERVAL || '86400000', 10);
setInterval(createBackup, BACKUP_INTERVAL);
log('info', `Backup scheduled every ${BACKUP_INTERVAL / 86400000} day(s)`);

const server = http.createServer((req, res) => {
  const start = Date.now();
  const clientIP = getClientIP(req);
  
  log('info', `${req.method} ${req.url} from ${clientIP}`);

  let urlPath = req.url;

  // API Endpoints para CMS
  if (urlPath.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (ALLOWED_ORIGINS.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '3600');

    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Too many requests' }));
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const contentLength = parseInt(req.headers['content-length'] || '0', 10);
      if (contentLength > MAX_BODY_SIZE) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Payload too large' }));
      }
    }

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      return res.end();
    }

    const data = loadData();
    const apiPath = urlPath.replace('/api/', '');

    if (req.method === 'GET' && apiPath === 'datos') {
      return res.end(JSON.stringify(data));
    }

    // POST - Guardar archivo HTML ( requiere auth )
    if (req.method === 'POST' && apiPath === 'save') {
      if (!requireAuth(req, res)) return;
      
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { file, content } = JSON.parse(body);
          if (!file || !content) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Faltan datos: file o content' }));
          }
          if (!validateFilePath(file)) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Archivo inválido o no permitido' }));
          }
          const normalized = path.normalize(file).replace(/^(\.\.[\\/])+/, '');
          const filePath = path.join(publicDir, normalized);
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

    // POST noticias ( requerira auth )
    if (req.method === 'POST' && apiPath === 'noticias') {
      if (!requireAuth(req, res)) return;
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

    // DELETE noticias ( requerira auth )
    if (req.method === 'DELETE' && apiPath.startsWith('noticias/')) {
      if (!requireAuth(req, res)) return;
      const idx = parseInt(apiPath.split('/')[1]);
      data.noticias.splice(idx, 1);
      saveData(data);
      return res.end(JSON.stringify({ success: true }));
    }

    // POST intenciones ( requerira auth )
    if (req.method === 'POST' && apiPath === 'intenciones') {
      if (!requireAuth(req, res)) return;
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

    // DELETE intenciones ( requerira auth )
    if (req.method === 'DELETE' && apiPath.startsWith('intenciones/')) {
      if (!requireAuth(req, res)) return;
      const idx = parseInt(apiPath.split('/')[1]);
      data.intenciones.splice(idx, 1);
      saveData(data);
      return res.end(JSON.stringify({ success: true }));
    }

    // POST testimonios ( requerira auth )
    if (req.method === 'POST' && apiPath === 'testimonios') {
      if (!requireAuth(req, res)) return;
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

    // DELETE testimonios ( requerira auth )
    if (req.method === 'DELETE' && apiPath.startsWith('testimonios/')) {
      if (!requireAuth(req, res)) return;
      const idx = parseInt(apiPath.split('/')[1]);
      data.testimonios.splice(idx, 1);
      saveData(data);
      return res.end(JSON.stringify({ success: true }));
    }

    // POST contactos ( publica - para formulario contacto )
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

    // DELETE contactos ( requerira auth )
    if (req.method === 'DELETE' && apiPath.startsWith('contactos/')) {
      if (!requireAuth(req, res)) return;
      const idx = parseInt(apiPath.split('/')[1]);
      data.contactos.splice(idx, 1);
      saveData(data);
      return res.end(JSON.stringify({ success: true }));
    }

    // Restore backup ( requerira auth )
    if (req.method === 'POST' && apiPath === 'restore') {
      if (!requireAuth(req, res)) return;
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const newData = JSON.parse(body);
        saveData(newData);
        res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    // Guardar página/editado ( requerira auth )
    if (req.method === 'POST' && apiPath === 'guardar-pagina') {
      if (!requireAuth(req, res)) return;
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

    // Endpoint para obtener navegación actual ( publica )
    if (req.method === 'GET' && apiPath === 'nav') {
      return res.end(JSON.stringify(NAV_CONFIG));
    }

    // Health check endpoint
    if (req.method === 'GET' && apiPath === 'health') {
      const health = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: Date.now(),
        memory: process.memoryUsage(),
        version: '1.0.0'
      };
      return res.end(JSON.stringify(health));
    }

    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  }

  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  const filePath = path.join(publicDir, urlPath);
  const ext = path.extname(filePath).toLowerCase();
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
    default:
      contentType = 'text/html; charset=utf-8';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error leyendo archivo:', filePath, err.code);
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h1>404</h1><p>Archivo no encontrado</p>');
      }
      res.writeHead(500);
      return res.end('Error del servidor');
    }

    // Detectar modo de experiencia
    const modo = getModoExperiencia(urlPath);
    
    // Inyectar navegación y fecha en archivos HTML
    let responseData = data;
    if (ext === '.html' || ext === '') {
      let htmlString = data.toString('utf8');
      
      // Usar template si está disponible y es página compatible
      if (modo === 'oracion' || modo === 'contemplacion') {
        const template = renderTemplate(modo, {
          TITLE: getPaginaDesdeURL(urlPath).replace('.html', '').replace(/-/g, ' '),
          DESCRIPTION: 'Oración y meditación en el Santuario de la Divina Misericordia',
          CANONICAL: `https://misericordiadejesus.es${urlPath}`,
          CONTENT_INJECTED: htmlString
        });
        if (template) {
          htmlString = template;
        }
      }
      
      const processedHTML = injectarNav(htmlString, urlPath);
      const finalHTML = injectarFecha(processedHTML);
      responseData = Buffer.from(finalHTML, 'utf8');
    }

    const isProduction = process.env.NODE_ENV === 'production';
    
    const headers = { 
      'Content-Type': contentType,
      'Cache-Control': isProduction ? 'public, max-age=3600' : 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': isProduction ? '3600' : '0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
    };
    
    res.writeHead(200, headers);
    res.end(responseData);
    
    const duration = Date.now() - start;
    log('info', `Response ${res.statusCode} in ${duration}ms`);
  });
});

server.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
  console.log(`Panel de admin: http://localhost:${port}/admin.html`);
  console.log(`Navegación centralizada activada`);
});