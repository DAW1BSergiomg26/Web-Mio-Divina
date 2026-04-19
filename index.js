const http = require('http');
const fs = require('fs');
const path = require('path');
const cmsController = require('./controllers/cmsController');

const port = process.env.PORT || 3002;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Headers de seguridad
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'self';"
};

const CACHE_CONFIG = {
  '.html': { maxAge: 3600, mustRevalidate: true },
  '.css': { maxAge: 86400 * 30, immutable: true },
  '.js': { maxAge: 86400 * 30, immutable: true },
  '.json': { maxAge: 3600 },
  '.png': { maxAge: 86400 * 365, immutable: true },
  '.jpg': { maxAge: 86400 * 365, immutable: true },
  '.jpeg': { maxAge: 86400 * 365, immutable: true },
  '.webp': { maxAge: 86400 * 365, immutable: true },
  '.ico': { maxAge: 86400 * 365, immutable: true },
  '.svg': { maxAge: 86400 * 30, immutable: true },
  '.mp3': { maxAge: 86400 * 30 },
  '.wav': { maxAge: 86400 * 30 },
  '.ogg': { maxAge: 86400 * 30 },
  '.woff': { maxAge: 86400 * 365, immutable: true },
  '.woff2': { maxAge: 86400 * 365, immutable: true },
  '.ttf': { maxAge: 86400 * 365, immutable: true }
};

function getCacheHeaders(ext) {
  const config = CACHE_CONFIG[ext] || {};
  let cacheControl = 'public, ';
  
  if (config.immutable) {
    cacheControl += 'max-age=' + config.maxAge + ', immutable';
  } else if (config.mustRevalidate) {
    cacheControl += 'max-age=' + config.maxAge + ', must-revalidate';
  } else {
    cacheControl += 'max-age=' + config.maxAge;
  }
  
  return {
    'Cache-Control': cacheControl,
    'ETag': generateETag(),
    'Vary': 'Accept-Encoding'
  };
}

function generateETag() {
  return '"' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2) + '"';
}

function serveFile(filePath, res, ext) {
  const cacheHeaders = getCacheHeaders(ext);
  
  // Agregar headers de seguridad excepto para recursos estáticos caching
  const isStaticAsset = ['.css', '.js', '.webp', '.png', '.jpg', '.jpeg', '.ico', '.svg', '.woff', '.woff2', '.ttf'].includes(ext);
  const securityHeaders = isStaticAsset ? {} : SECURITY_HEADERS;
  
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    ...cacheHeaders,
    ...securityHeaders
  });
  
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (urlPath.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      return res.end();
    }

    const apiPath = urlPath.replace('/api/', '');
    if (cmsController.handleApi(req, res, apiPath)) {
      return;
    }

    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  }

  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  if (urlPath === '/favicon.ico') {
    urlPath = '/img/favicon.ico';
  }

  const publicDir = path.join(__dirname, 'public');
  const filePath = path.normalize(path.join(publicDir, urlPath));

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }

  const ext = path.extname(filePath).toLowerCase();
  
  if (!MIME_TYPES[ext]) {
    if (ext) {
      res.writeHead(404);
      return res.end('Tipo de archivo no soportado');
    }
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        const notFoundPath = path.join(publicDir, '404.html');
        if (fs.existsSync(notFoundPath)) {
          res.writeHead(404, { 
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
          });
          return res.end(fs.readFileSync(notFoundPath, 'utf8'));
        }
        res.writeHead(404);
        return res.end('<h1>404 - Página no encontrada</h1>');
      }
      res.writeHead(500);
      return res.end('Error del servidor');
    }
    
    serveFile(filePath, res, ext);
  });
});

server.listen(port, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════════╗
  ║           🌟 SERVIDOR DIVINA MISERICORDIA 🌟                ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  Servidor activo: http://localhost:${port}                     ║
  ║  Caché inteligente: ACTIVADO                                  ║
  ║  ETag: ACTIVADO                                              ║
  ╚══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = server;