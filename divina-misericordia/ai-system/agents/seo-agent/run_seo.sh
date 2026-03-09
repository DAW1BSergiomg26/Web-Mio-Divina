#!/bin/bash
BASE="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
source "$BASE/recovery/state_manager.sh"

DATE=$(date +"%Y-%m-%d_%H-%M")
LOG="$BASE/logs/seo.log"
REPORT="$BASE/reports/seo_$DATE.txt"

mkdir -p "$BASE/logs" "$BASE/reports" "$BASE/state"

echo "=================================" | tee -a "$LOG"
echo "AI SEO AGENT v3 — $(date)" | tee -a "$LOG"
echo "=================================" | tee -a "$LOG"

save_state "seo" "RUNNING" "$REPORT"

PROMPT="Eres un experto SEO senior con 10 años de experiencia. Analiza COMPLETO el sitio web en public/.

1. METADATOS: title, meta description, Open Graph, Twitter Cards
2. ESTRUCTURA: jerarquia H1-H2-H3, keywords en headings
3. CONTENIDO: densidad keywords, texto alternativo imagenes, enlaces
4. TECNICO: velocidad estimada, Schema markup, Sitemap, robots.txt

Para cada mejora muestra codigo ANTES y DESPUES.
Finaliza con top 10 acciones por impacto."

echo "Ejecutando SEO..." | tee -a "$LOG"

if timeout 300 opencode run "$PROMPT" > "$REPORT" 2>&1; then
  clear_state "seo"
  echo "SEO completado: $REPORT" | tee -a "$LOG"
else
  save_state "seo" "INTERRUPTED" "$REPORT"
  echo "SEO interrumpido — ejecuta de nuevo" | tee -a "$LOG"
fi

echo "Informe: $REPORT" | tee -a "$LOG"
