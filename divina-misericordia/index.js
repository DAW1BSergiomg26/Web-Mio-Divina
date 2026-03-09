const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3001;

const server = http.createServer((req, res) => {
  console.log(`Petición: ${req.method} ${req.url}`);

  let urlPath = req.url;

  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  const filePath = path.join(__dirname, 'public', urlPath);

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

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Server Error');
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}/`);
});
