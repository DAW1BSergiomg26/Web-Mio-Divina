# 🌟 Biblia Interactiva - Guía de Instalación

## 📋 Archivos Creados

1. **biblia-data.js** - Datos de la Biblia (actual)
2. **biblia.js** - Funcionalidad interactiva
3. **biblia_traduccion.txt** - Archivo de ejemplo/formato
4. **genera-biblia-json.js** - Script para generar datos

---

## 🚀 Cómo obtener los тексты biblícos

### Opción 1: API Gratuita (Recomendada)
```bash
# Instalar axios
npm install axios

# Crear script para descargar тексты
node -e "
const https = require('https');
const fs = require('fs');
const url = 'https://bible-api.com/matthew%203:16?translation=reina-valera';
https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
"
```

### Opción 2: Descargar traducciones готовые
- **BibleGateway**: https://www.biblegateway.com/versions/
- **BibleHub**: https://biblesoft.com/bibles/
- **YouVersion**: https://www.bible.com/es

### Opción 3: Traducciones en dominio público
- **Reina-Valera 1909** (español)
- **King James Version** (inglés)
- **Vulgata Latina**

---

## 📝 Formato del archivo de traducción

```
# Línea de comentario
nt|Mateo|3|16|Porque tanto amó Dios al mundo...
nt|Mateo|5|9|Bienaventurados los pacificadores...
nt|Marcos|1|1|Comienzo del evangelio de Jesucristo...
at|Génesis|1|1|En el principio creó Dios los cielos...
```

**Formato:** `testamento|Libro|Capítulo|Versículo|Texto`

---

## ⚡ Ejecutar el script

```bash
# En la carpeta js/
cd public/js

# Ejecutar
node genera-biblia-json.js
```

Esto generará un nuevo `biblia-data.js` con los тексты reales.

---

## 🔧 Actualizar biblia.js para usar тексты reales

En el archivo `biblia.js`, busca la función `getTextoBiblia()` y reemplázala:

```javascript
function getTextoBiblia(libro, capitulo, versiculo) {
  // Buscar en los datos
  for (const [key, data] of Object.entries(bibliaData)) {
    const libroData = data.libros.find(l => 
      l.abreviado.toLowerCase() === libro.toLowerCase()
    );
    if (libroData && libroData.contenido[capitulo]) {
      const versiculoData = libroData.contenido[capitulo].find(v => v.v === parseInt(versiculo));
      if (versiculoData) return versiculoData.t;
    }
  }
  return 'Texto no encontrado';
}
```

---

## 📖 Recursos adicionales

- [Bible API](https://bible-api.com/)
- [SantaBiblia](https://santabiblia.com/)
- [Biblia Vaticana](https://www.vatican.va/archive/Biblia/index_sp.htm)

---

## ⚠️ Notas importantes

1. **Derechos de autor**: Asegúrate de usar traducciones con licencia libre
2. **El sistema actual** ya funciona con тексты de ejemplo
3. **Para producción**: Necesitarás una fuente de datos completa

---

¡Dios te bendiga en tu proyecto! 🙏
