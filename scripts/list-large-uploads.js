import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.resolve('public/uploads');
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const omitidos = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      scanDir(filepath);
    } else {
      if (stats.size > MAX_SIZE) {
        omitidos.push({
          file: filepath.replace(UPLOADS_DIR, ''),
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      }
    }
  }
}

scanDir(UPLOADS_DIR);

fs.writeFileSync('omitidos.json', JSON.stringify(omitidos, null, 2));
console.log(`✅ Encontrados ${omitidos.length} archivos omitidos por peso.`);
console.log(`➡️ Guardado en omitidos.json`);
