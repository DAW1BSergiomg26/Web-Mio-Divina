#!/bin/bash
BASE="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
PUBLIC="$(cd "$(dirname "$0")/../../.." && pwd)/public"
source "$BASE/recovery/state_manager.sh"
DATE=$(date +"%Y-%m-%d_%H-%M")
LOG="$BASE/logs/super_total.log"
BACKUP_DIR="$PUBLIC/backups/$DATE"
mkdir -p "$BASE/logs" "$BASE/reports" "$BASE/state" "$BACKUP_DIR"
echo "================================================" | tee -a "$LOG"
echo "AI SUPER AGENTE TOTAL - $(date)" | tee -a "$LOG"
echo "================================================" | tee -a "$LOG"
PLANTILLA=$(cat "$PUBLIC/index.html")
CSS=$(cat "$PUBLIC/css/styles.css")
cp "$PUBLIC"/*.html "$BACKUP_DIR/" 2>/dev/null
echo "Backup completo en: $BACKUP_DIR" | tee -a "$LOG"

mejorar_pagina() {
  local PAGINA="$1"
  local TIPO="$2"
  local INSTRUCCIONES="$3"
  local HTML_FILE="$PUBLIC/$PAGINA"
  echo "Procesando: $PAGINA..." | tee -a "$LOG"
  HTML_ACTUAL=$(cat "$HTML_FILE" 2>/dev/null || echo "NUEVA PAGINA")
  PROMPT="Eres el mejor desarrollador web y experto SEO del mundo.
Sitio: Apostoles de la Divina Misericordia
URL: https://www.apostolesmisericordia.es

INSTRUCCIONES DE TRABAJO:
1. Lee el archivo $PAGINA del proyecto
2. Lee el archivo public/css/styles.css
3. Lee el archivo public/index.html como plantilla base
4. Aplica todas las mejoras indicadas
5. Sobrescribe $PAGINA con el HTML mejorado completo

=== INSTRUCCIONES DE MEJORA ===
$INSTRUCCIONES

=== REGLAS GLOBALES ===
1. Mismo header nav y footer que index.html
2. Mismas clases CSS del sitio
3. Mismo diseño visual consistente
4. Links del menu identicos en todas las paginas
5. title unico 55-60 chars con keyword Divina Misericordia
6. meta description unica 150-160 chars con CTA
7. H1 unico descriptivo de esta pagina
8. Open Graph completo
9. Schema JSON-LD apropiado
10. Contenido minimo 300 palabras por pagina
11. CTAs relevantes y visibles
12. Lenguaje espiritual calido y persuasivo

Escribe el archivo $PAGINA directamente con todo el HTML mejorado."
  TEMP="$BASE/state/temp_$PAGINA"
  if timeout 600 opencode run "$PROMPT" > "$TEMP" 2>&1; then
    if grep -q "DOCTYPE\|<html" "$TEMP"; then
      cp "$TEMP" "$HTML_FILE"
      echo "OK: $PAGINA" | tee -a "$LOG"
    else
      echo "FALLO: $PAGINA - original conservado" | tee -a "$LOG"
    fi
  else
    echo "TIMEOUT: $PAGINA - original conservado" | tee -a "$LOG"
  fi
}

crear_pagina() {
  local PAGINA="$1"
  local TITULO="$2"
  local CONTENIDO="$3"
  echo "Creando: $PAGINA..." | tee -a "$LOG"
  PROMPT="Eres el mejor desarrollador web y experto en contenido catolico y SEO.

INSTRUCCIONES DE TRABAJO:
1. Lee el archivo public/index.html como plantilla base del sitio
2. Lee el archivo public/css/styles.css para mantener estilos
3. Crea y escribe el archivo public/$PAGINA con contenido COMPLETO

=== PAGINA A CREAR ===
Archivo: $PAGINA
Titulo: $TITULO

=== CONTENIDO COMPLETO A GENERAR ===
$CONTENIDO

=== REGLAS ===
1. Usa EXACTAMENTE el mismo header nav y footer que index.html
2. Mismas clases CSS del sitio
3. Contenido COMPLETO y detallado en espanol minimo 500 palabras
4. SEO: title unico, meta description, Open Graph, Schema JSON-LD
5. loading=lazy en todas las imagenes
6. CTAs relevantes y visibles
7. Lenguaje espiritual calido y motivador
8. Navegacion funcional entre secciones con JavaScript si necesario

Escribe el archivo public/$PAGINA directamente con todo el contenido."
  TEMP="$BASE/state/temp_$PAGINA"
  if timeout 600 opencode run "$PROMPT" > "$TEMP" 2>&1; then
    if grep -q "DOCTYPE\|<html" "$TEMP"; then
      cp "$TEMP" "$PUBLIC/$PAGINA"
      echo "CREADA: $PAGINA" | tee -a "$LOG"
    else
      echo "FALLO: $PAGINA no creada" | tee -a "$LOG"
    fi
  fi
}

while true; do
  clear
  echo "=============================================="
  echo "  AI SUPER AGENTE TOTAL - WEB MIO DIVINA"
  echo "=============================================="
  echo "  Fecha: $(date)"
  echo "=============================================="
  echo ""
  echo "  1 - Mejorar TODAS las paginas"
  echo "  2 - Mejorar paginas de Papas"
  echo "  3 - Generar Novena completa 9 dias"
  echo "  4 - Generar Via Crucis 14 estaciones"
  echo "  5 - Mejorar pagina especifica"
  echo "  6 - Ver progreso y logs"
  echo "  0 - Salir"
  echo ""
  read -p "  Elige opcion: " OPT

  case $OPT in
    1)
      echo "MEJORANDO TODAS LAS PAGINAS..."
      for PAG in quienes-somos.html contacto.html oraciones.html testimonios.html galeria.html noticias.html enlaces.html espacio-jovenes.html obras-de-misericordia.html maria.html santa-faustina.html los-rayos.html introduccion.html consagracion.html coronilla.html hora-de-la-misericordia.html; do
        [ -f "$PUBLIC/$PAG" ] && mejorar_pagina "$PAG" "general" "Mejora contenido completo. Añade textos detallados minimo 300 palabras. CTAs relevantes. Consistencia visual total con el resto del sitio. Lenguaje espiritual calido y persuasivo." && sleep 5
      done
      echo "TODAS LAS PAGINAS PROCESADAS"
      read -p "Enter para continuar"
      ;;
    2)
      echo "MEJORANDO PAGINAS DE PAPAS..."
      INS_PAPA="FORMATO CONSISTENTE para todas las paginas de papas:
- Foto del papa centrada con style=width:300px;height:400px;object-fit:cover
- Nombre completo y años de pontificado como H1
- Biografia completa minimo 400 palabras
- Seccion: Su relacion con la Divina Misericordia minimo 200 palabras
- Seccion: Documentos y ensenanzas principales
- Seccion: Frases celebres al menos 3 citas textuales
- Seccion: Canonizacion o beatificacion si aplica
- CTA: Ver oraciones relacionadas y Conoce mas sobre la Divina Misericordia
- Mismo estilo visual en las 4 paginas de papas
- Imagen con dimensiones fijas iguales en todos"

      mejorar_pagina "ss-francisco.html" "papa" "$INS_PAPA Papa Francisco Jorge Mario Bergoglio 2013 hasta actualidad. Primer papa jesuita y latinoamericano de Argentina. Muy cercano a los pobres y a la misericordia divina."
      sleep 10
      mejorar_pagina "ss-juan-pablo-ii.html" "papa" "$INS_PAPA San Juan Pablo II Karol Wojtyla 1978-2005. Canonizo a Santa Faustina Kowalska. Proclamo la Fiesta de la Divina Misericordia. El papa de la Misericordia por excelencia."
      sleep 10
      mejorar_pagina "ss-benedicto-xvi.html" "papa" "$INS_PAPA Papa Benedicto XVI Joseph Ratzinger 2005-2013. Gran teologo. Escribio Jesus de Nazaret. Primera renuncia papal en siglos. Continuo la devocion a la Divina Misericordia."
      sleep 10
      mejorar_pagina "ss-leon-xiv.html" "papa" "$INS_PAPA Papa Leon XIV. Genera contenido basado en lo que ya existe en la pagina actual sobre este pontifice."
      echo "PAGINAS DE PAPAS COMPLETADAS"
      read -p "Enter para continuar"
      ;;
    3)
      echo "GENERANDO NOVENA COMPLETA..."
      crear_pagina "novena.html" "Novena de la Divina Misericordia" "
Crea la Novena de la Divina Misericordia COMPLETA con las 9 intenciones reveladas por Jesus a Santa Faustina Kowalska.

ESTRUCTURA COMPLETA:
- Introduccion a la Novena historia y origen 200 palabras
- Oracion inicial para cada dia
- Navegacion visual entre los 9 dias con botones o tabs

9 DIAS COMPLETOS:
Dia 1: Toda la humanidad - oracion completa y meditacion 200 palabras
Dia 2: Sacerdotes y religiosos - oracion completa y meditacion 200 palabras
Dia 3: Almas devotas y fieles - oracion completa y meditacion 200 palabras
Dia 4: Paganos y no creyentes - oracion completa y meditacion 200 palabras
Dia 5: Los herejes y cismaticos - oracion completa y meditacion 200 palabras
Dia 6: Los mansos y humildes - oracion completa y meditacion 200 palabras
Dia 7: Los que honran la Misericordia - oracion completa y meditacion 200 palabras
Dia 8: Las almas del purgatorio - oracion completa y meditacion 200 palabras
Dia 9: Las almas tibias - oracion completa y meditacion 200 palabras

Para cada dia incluye:
- Intencion del dia en H2
- Texto de la intencion revelado a Santa Faustina
- Meditacion personal 200 palabras
- Oracion especifica del dia
- Boton Dia anterior y Dia siguiente

- Oracion final de la Novena
- CTA: Reza tambien la Coronilla de la Divina Misericordia
- Diseño con tabs o acordeon JavaScript para navegar entre dias"

      echo "NOVENA GENERADA"
      read -p "Enter para continuar"
      ;;
    4)
      echo "GENERANDO VIA CRUCIS COMPLETO..."
      crear_pagina "via-crucis.html" "Via Crucis de la Divina Misericordia" "
Crea el Via Crucis COMPLETO con las 14 estaciones tradicionales conectadas con la Divina Misericordia.

ESTRUCTURA COMPLETA:
- Introduccion al Via Crucis 200 palabras
- Oracion inicial
- Barra de progreso visual mostrando las 14 estaciones
- Navegacion entre estaciones con botones

14 ESTACIONES COMPLETAS con al menos 200 palabras cada una:
I: Jesus es condenado a muerte
II: Jesus carga con la Cruz
III: Jesus cae por primera vez
IV: Jesus encuentra a su Madre
V: El Cirineo ayuda a Jesus
VI: La Veronica enjuga el rostro de Jesus
VII: Jesus cae por segunda vez
VIII: Jesus consuela a las mujeres de Jerusalem
IX: Jesus cae por tercera vez
X: Jesus es despojado de sus vestiduras
XI: Jesus es clavado en la Cruz
XII: Jesus muere en la Cruz
XIII: Jesus es bajado de la Cruz
XIV: Jesus es sepultado

Para cada estacion incluye:
- Numero romano grande y destacado
- Titulo de la estacion en H2
- Versículo biblico relacionado
- Meditacion 200 palabras conectando con la Divina Misericordia
- Oracion especifica de la estacion
- Proposito o compromiso personal
- Botones Estacion anterior y Estacion siguiente

- Oracion final de clausura
- CTA: Reza la Novena de la Divina Misericordia
- JavaScript para navegacion entre estaciones sin recargar pagina"

      echo "VIA CRUCIS GENERADO"
      read -p "Enter para continuar"
      ;;
    5)
      echo "PAGINAS DISPONIBLES:"
      ls "$PUBLIC"/*.html | xargs -I{} basename {}
      echo ""
      read -p "Nombre del archivo: " PAG_ESP
      read -p "Instrucciones especiales (Enter para mejora general): " INS_ESP
      [ -z "$INS_ESP" ] && INS_ESP="Mejora contenido completo. Textos detallados minimo 300 palabras. CTAs. SEO optimizado. Consistencia visual."
      mejorar_pagina "$PAG_ESP" "especifica" "$INS_ESP"
      read -p "Enter para continuar"
      ;;
    6)
      echo "PROGRESO:"
      echo "Backups: $(ls $BACKUP_DIR 2>/dev/null | wc -l) archivos"
      echo "Reports: $(ls $BASE/reports/ 2>/dev/null | wc -l) informes"
      echo ""
      echo "Ultimas lineas del log:"
      tail -30 "$LOG" 2>/dev/null
      read -p "Enter para continuar"
      ;;
    0)
      echo "Saliendo..."
      exit 0
      ;;
    *)
      echo "Opcion no valida"
      sleep 1
      ;;
  esac
done
