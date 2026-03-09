#!/bin/bash
BASE="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
PUBLIC="$(cd "$(dirname "$0")/../../.." && pwd)/public"
source "$BASE/recovery/state_manager.sh"
DATE=$(date +"%Y-%m-%d_%H-%M")
LOG="$BASE/logs/implementar.log"
REPORT="$BASE/reports/implementar_$DATE.txt"
BACKUP_DIR="$PUBLIC/backups"
mkdir -p "$BASE/logs" "$BASE/reports" "$BASE/state" "$BACKUP_DIR"
echo "================================================" | tee -a "$LOG"
echo "AI IMPLEMENTAR AGENT — $(date)" | tee -a "$LOG"
echo "================================================" | tee -a "$LOG"
PAGINA="${1:-index.html}"
HTML_FILE="$PUBLIC/$PAGINA"
if [ ! -f "$HTML_FILE" ]; then
  echo "ERROR: No existe $HTML_FILE" | tee -a "$LOG"
  exit 1
fi
echo "Pagina: $PAGINA" | tee -a "$LOG"
BACKUP="$BACKUP_DIR/${PAGINA%.html}_backup_$DATE.html"
cp "$HTML_FILE" "$BACKUP"
echo "Backup guardado" | tee -a "$LOG"
HTML_ACTUAL=$(cat "$HTML_FILE")
CSS_ACTUAL=""
[ -f "$PUBLIC/css/styles.css" ] && CSS_ACTUAL=$(cat "$PUBLIC/css/styles.css")
INFORME_PREVIO=""
ULTIMO_CONTENT=$(ls -t "$BASE/reports"/content_*.txt 2>/dev/null | head -1)
[ -f "$ULTIMO_CONTENT" ] && INFORME_PREVIO=$(cat "$ULTIMO_CONTENT")
echo "Enviando a IA..." | tee -a "$LOG"
save_state "implementar" "RUNNING" "$REPORT"
PROMPT="Eres el mejor desarrollador web y experto SEO del mundo.

Mejora COMPLETAMENTE este HTML del sitio catolico Apostoles de la Divina Misericordia.

=== HTML ACTUAL DE $PAGINA ===
$HTML_ACTUAL

=== CSS ACTUAL ===
$CSS_ACTUAL

=== ANALISIS PREVIO ===
$INFORME_PREVIO

=== MEJORAS REQUERIDAS ===
1. SEO: title 55-60 chars con keyword Divina Misericordia, meta description 150-160 chars con CTA, Open Graph completo, Twitter Cards, Canonical URL, Schema JSON-LD Organization
2. HTML SEMANTICO: header nav main section article footer, H1 unico optimizado, jerarquia H1 H2 H3, alt text en TODAS las imagenes, rel=noopener en links externos, aria-labels
3. CONTENIDO: Hero persuasivo y emocional, CTAs claros como Reza la Coronilla y Unete a la comunidad, textos expandidos, lenguaje espiritual calido
4. PERFORMANCE: loading=lazy en imagenes, defer en scripts JS
5. ACCESIBILIDAD: role=navigation role=main, aria-label en botones, skip-to-content

=== REGLAS IMPORTANTES ===
Mantén exactamente las mismas clases CSS del original.
Mantén los mismos links de navegacion entre paginas.
No cambies el diseño visual, solo mejora el contenido y el SEO.
Devuelve UNICAMENTE el HTML completo mejorado.
Sin explicaciones antes ni despues.
Sin bloques markdown ni comillas de codigo.
Empieza directamente con <!DOCTYPE html>"
HTML_TEMP="$BASE/state/html_mejorado_temp.html"
echo "Procesando (2-5 min)..." | tee -a "$LOG"
if timeout 600 opencode run "$PROMPT" > "$HTML_TEMP" 2>&1; then
  if grep -q "DOCTYPE\|<html" "$HTML_TEMP"; then
    cp "$HTML_TEMP" "$REPORT"
    cp "$HTML_TEMP" "$HTML_FILE"
    clear_state "implementar"
    echo "================================================"
    echo "IMPLEMENTACION COMPLETADA"
    echo "Pagina mejorada: $HTML_FILE"
    echo "Backup seguro: $BACKUP"
    echo "================================================"
    read -p "Ver HTML mejorado? (s/n): " VER
    [ "$VER" = "s" ] && less "$HTML_FILE"
  else
    save_state "implementar" "INTERRUPTED" "$HTML_TEMP"
    echo "La IA no devolvio HTML valido"
    echo "Tu original NO fue modificado"
    echo "Contenido recibido:"
    cat "$HTML_TEMP"
  fi
else
  save_state "implementar" "INTERRUPTED" "$HTML_TEMP"
  echo "Interrumpido — original intacto"
  cat "$HTML_TEMP"
fi
