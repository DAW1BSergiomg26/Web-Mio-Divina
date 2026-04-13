const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'cms-data.json');

function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
  } catch (e) {
    console.error('Error cargando datos:', e);
  }
  return { noticias: [], intenciones: [], testimonios: [], contactos: [], paginas: {} };
}

function saveData(data) {
  const dataDir = path.dirname(dataFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

const cmsController = {
  loadData,
  saveData,
  
  handleApi: (req, res, apiPath) => {
    const data = loadData();

    // GET datos
    if (req.method === 'GET' && apiPath === 'datos') {
      res.end(JSON.stringify(data));
      return true;
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
            return res.end(JSON.stringify({ error: 'Faltan datos' }));
          }

          // Seguridad: Prevenir Directory Traversal
          const publicDir = path.join(__dirname, '..', 'public');
          const filePath = path.normalize(path.join(publicDir, file));

          if (!filePath.startsWith(publicDir)) {
            res.writeHead(403);
            return res.end(JSON.stringify({ error: 'Acceso denegado' }));
          }

          fs.writeFileSync(filePath, content, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return true;
    }

    // Rutas genéricas POST/DELETE (noticias, intenciones, etc.)
    const resources = ['noticias', 'intenciones', 'testimonios', 'contactos'];
    
    // POST resource
    if (req.method === 'POST' && resources.includes(apiPath)) {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const item = JSON.parse(body);
        item.id = Date.now();
        data[apiPath].unshift(item);
        saveData(data);
        res.end(JSON.stringify({ success: true }));
      });
      return true;
    }

    // DELETE resource
    if (req.method === 'DELETE') {
      for (const resName of resources) {
        if (apiPath.startsWith(resName + '/')) {
          const idx = parseInt(apiPath.split('/')[1]);
          data[resName].splice(idx, 1);
          saveData(data);
          res.end(JSON.stringify({ success: true }));
          return true;
        }
      }
    }

    // Restore backup
    if (req.method === 'POST' && apiPath === 'restore') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        saveData(JSON.parse(body));
        res.end(JSON.stringify({ success: true }));
      });
      return true;
    }

    // Guardar página
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
      return true;
    }

    return false;
  }
};

module.exports = cmsController;
