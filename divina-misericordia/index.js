const http = require('http');
const fs = require('fs');
const path = require('path');
const cmsController = require('./controllers/cmsController');

const port = 3002;

const server = http.createServer((req, res) => {
  console.log(`Petición: ${req.method} ${req.url}`);

  let urlPath = decodeURIComponent(req.url);

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

    const apiPath = urlPath.replace('/api/', '');
    if (cmsController.handleApi(req, res, apiPath)) {
      return;
    }

    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  }

  // Archivos estáticos
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  
  // Seguridad: Prevenir Directory Traversal
  const publicDir = path.join(__dirname, 'public');
  const filePath = path.normalize(path.join(publicDir, urlPath));

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }

  const ext = path.extname(filePath).toLowerCase();
  
  let contentType = 'text/html; charset=utf-8';
  switch (ext) {
    case '.css': contentType = 'text/css; charset=utf-8'; break;
    case '.js': contentType = 'application/javascript; charset=utf-8'; break;
    case '.png': contentType = 'image/png'; break;
    case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
    case '.ico': contentType = 'image/x-icon'; break;
    case '.json': contentType = 'application/json; charset=utf-8'; break;
    case '.mp3': contentType = 'audio/mpeg'; break;
    case '.wav': contentType = 'audio/wav'; break;
    case '.ogg': contentType = 'audio/ogg'; break;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        const notFoundPath = path.join(__dirname, 'public', '404.html');
        if (fs.existsSync(notFoundPath)) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(fs.readFileSync(notFoundPath, 'utf8'));
        }
        res.writeHead(404);
        return res.end('<h1>404</h1>');
      }
      res.writeHead(500);
      return res.end('Error del servidor');
    }
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
