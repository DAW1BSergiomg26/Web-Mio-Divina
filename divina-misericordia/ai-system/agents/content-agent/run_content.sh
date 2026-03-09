#!/bin/bash
BASE="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
source "$BASE/recovery/state_manager.sh"

DATE=$(date +"%Y-%m-%d_%H-%M")
LOG="$BASE/logs/content.log"
REPORT="$BASE/reports/content_$DATE.txt"

mkdir -p "$BASE/logs" "$BASE/reports" "$BASE/state"

echo "=================================" | tee -a "$LOG"
echo "AI CONTENT AGENT v3 — $(date)" | tee -a "$LOG"
echo "=================================" | tee -a "$LOG"

save_state "content" "RUNNING" "$REPORT"

PROMPT="Eres un copywriter SEO experto. Analiza el sitio en public/ y genera:

1. ANALISIS: tono de marca, keywords detectadas, gaps de contenido
2. ARTICULO SEO (+1500 palabras): titulo, meta description, H1-H2-H3, CTA
3. PLAN 4 SEMANAS: 4 titulos con keywords y calendario
4. MEJORAS DE COPY: reescribe los 3 textos principales para conversion

Lenguaje natural, persuasivo y orientado a conversion."

echo "Generando contenido..." | tee -a "$LOG"

if timeout 300 opencode run "$PROMPT" > "$REPORT" 2>&1; then
  clear_state "content"
  echo "Contenido generado: $REPORT" | tee -a "$LOG"
else
  save_state "content" "INTERRUPTED" "$REPORT"
  echo "Contenido interrumpido — ejecuta de nuevo" | tee -a "$LOG"
fi

echo "Informe: $REPORT" | tee -a "$LOG"
