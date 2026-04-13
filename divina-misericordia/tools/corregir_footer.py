import os
import re
import sys

# Forzar UTF-8 en la salida
sys.stdout.reconfigure(encoding="utf-8")

# Leer el footer correcto de index.html
with open("public/index.html", "r", encoding="utf-8") as f:
    index_content = f.read()

# Extraer el footer de index.html
footer_match = re.search(
    r'<footer class="main-footer sacred-footer">.*?</footer>', index_content, re.DOTALL
)
if footer_match:
    correct_footer = footer_match.group(0)
else:
    print("No se encontró el footer en index.html")
    exit(1)

# Lista de archivos a corregir (excluyendo index.html y el-altar.html)
html_files = [
    "virgen-lujan.html",
    "virgen-caacupe.html",
    "via-crucis.html",
    "ss-leon-xiv.html",
    "ss-juan-pablo-ii.html",
    "ss-francisco.html",
    "ss-benedicto-xvi.html",
    "santo-rosario.html",
    "santa-francisca-romana.html",
    "santa-faustina.html",
    "san-sanson.html",
    "san-jose.html",
    "san-judas-tadeo.html",
    "san-jose-dormido.html",
    "san-cayetano.html",
    "san-francisco.html",
    "san-benito.html",
    "quienes-somos.html",
    "otras-devociones.html",
    "oraciones.html",
    "oracion-san-pancracio.html",
    "oracion-santa-cruz.html",
    "oracion-san-miguel.html",
    "oracion-san-antonio.html",
    "oracion-eucharistia.html",
    "oracion-del-estudiante.html",
    "obras-de-misericordia.html",
    "novena.html",
    "noticias.html",
    "musica-sacra.html",
    "misterios-luminosos.html",
    "misterios-gozosos.html",
    "misterios-dolorosos.html",
    "misterios-de-gloria.html",
    "medalla-milagrosa.html",
    "maria.html",
    "maria-auxiliadora.html",
    "lugares-de-culto.html",
    "los-rayos.html",
    "lecturas-recomendadas.html",
    "la-santina.html",
    "introduccion.html",
    "hora-de-la-misericordia.html",
    "galeria.html",
    "espacio-jovenes.html",
    "enlaces.html",
    "divino-nino-jesus.html",
    "devociones-marianas.html",
    "cruz-del-perdon.html",
    "coronilla.html",
    "contacto.html",
    "consagracion.html",
]

correct_footer_dos_espacios = correct_footer.replace("  ", "    ")

# Procesar cada archivo
for filename in html_files:
    filepath = f"public/{filename}"
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Buscar y reemplazar el footer
        old_footer_pattern = r'<footer class="main-footer sacred-footer">.*?</footer>'

        # Determinar qué formato de indentation usar basado en el archivo
        if "    <a href" in content or "        <a href" in content:
            new_footer = correct_footer.replace("  ", "    ")
        elif "  <a href" in content:
            new_footer = correct_footer
        else:
            new_footer = correct_footer_dos_espacios

        new_content = re.sub(old_footer_pattern, new_footer, content, flags=re.DOTALL)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

        print(f"✓ Corregido: {filename}")
    except Exception as e:
        print(f"✗ Error en {filename}: {e}")

print("\n¡Todos los archivos corregidos!")
