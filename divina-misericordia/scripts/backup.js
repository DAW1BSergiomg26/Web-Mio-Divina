const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, 'backups');
const dataFile = path.join(__dirname, 'data', 'cms-data.json');
const publicDir = path.join(__dirname, 'public');

const BACKUP_PREFIX = 'cms-backup';
const MAX_BACKUPS = 10;

function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
}

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function getBackupFilename() {
  return `${BACKUP_PREFIX}-${getTimestamp()}.json`;
}

function createBackup() {
  ensureBackupDir();
  
  const backupData = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: {}
  };
  
  if (fs.existsSync(dataFile)) {
    try {
      backupData.data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      console.log('✓ Datos CMS cargados');
    } catch (e) {
      console.log('⚠ Error leyendo datos CMS:', e.message);
    }
  } else {
    console.log('ℹ No hay archivo de datos CMS aún');
  }
  
  const backupPath = path.join(backupDir, getBackupFilename());
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
  console.log(`✓ Backup creado: ${backupPath}`);
  
  cleanupOldBackups();
  
  return backupPath;
}

function cleanupOldBackups() {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith(BACKUP_PREFIX))
      .sort()
      .reverse();
    
    if (files.length > MAX_BACKUPS) {
      const toDelete = files.slice(MAX_BACKUPS);
      toDelete.forEach(f => {
        fs.unlinkSync(path.join(backupDir, f));
        console.log(`🗑 Eliminado backup antiguo: ${f}`);
      });
    }
  } catch (e) {
    console.log('⚠ Error limpiando backups:', e.message);
  }
}

function listBackups() {
  ensureBackupDir();
  
  const files = fs.readdirSync(backupDir)
    .filter(f => f.startsWith(BACKUP_PREFIX))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.log('No hay backups disponibles');
    return [];
  }
  
  console.log('\n📁 Backups disponibles:\n');
  files.forEach((f, i) => {
    const stats = fs.statSync(path.join(backupDir, f));
    const date = new Date(stats.mtime).toLocaleString('es-ES');
    console.log(`  ${i + 1}. ${f} (${date})`);
  });
  console.log('');
  
  return files;
}

function restoreBackup(backupFile) {
  const backupPath = path.join(backupDir, backupFile);
  
  if (!fs.existsSync(backupPath)) {
    console.error('❌ Backup no encontrado:', backupFile);
    process.exit(1);
  }
  
  const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  
  if (!backupData.data) {
    console.error('❌ Datos inválidos en backup');
    process.exit(1);
  }
  
  if (!fs.existsSync(path.dirname(dataFile))) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  }
  
  fs.writeFileSync(dataFile, JSON.stringify(backupData.data, null, 2));
  console.log('✓ Datos restaurados desde:', backupFile);
}

const command = process.argv[2];

if (command === 'list') {
  listBackups();
} else if (command && command.startsWith(BACKUP_PREFIX)) {
  restoreBackup(command);
} else if (!command) {
  createBackup();
} else {
  console.log('Uso:');
  console.log('  npm run backup        - Crear backup');
  console.log('  npm run backup list   - Listar backups');
  console.log('  npm run restore "archivo" - Restaurar backup');
}