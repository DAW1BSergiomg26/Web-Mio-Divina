#!/bin/bash

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PUBLIC="$ROOT/public"

STATE="$ROOT/ai-system/state/divino_progress.json"
LOG="$ROOT/ai-system/logs/divino_master.log"
REPORT="$ROOT/ai-system/reports/divino_historial.md"

AUDIT="$ROOT/ai-system/agents/audit-agent"
SEO="$ROOT/ai-system/agents/seo-agent"
CONTENT="$ROOT/ai-system/agents/content-agent"
LECTURAS="$ROOT/ai-system/agents/lecturas-agent"
IMPLEMENT="$ROOT/ai-system/agents/implementar-agent"

echo "======================================"
echo "        DIVINO MASTER V3"
echo "======================================"

echo "Proyecto: $ROOT"
echo ""

if [ ! -f "$STATE" ]; then
 echo '{"paginas_completadas":[]}' > "$STATE"
fi

procesar_pagina() {

PAG="$1"

echo ""
echo "Procesando: $PAG"
echo "----------------------------"

if grep -q "$PAG" "$STATE"; then
 echo "Página ya optimizada. Saltando."
 return
fi

echo "1️⃣ Auditoría HTML"
bash "$AUDIT/run.sh" "$PAG"

echo "2️⃣ Optimización SEO"
bash "$SEO/run.sh" "$PAG"

echo "3️⃣ Mejora de contenido"
bash "$CONTENT/run.sh" "$PAG"

echo "4️⃣ Contenido espiritual"
bash "$LECTURAS/run.sh" "$PAG"

echo "5️⃣ Implementando mejoras"
bash "$IMPLEMENT/run.sh" "$PAG"

echo "6️⃣ Optimización final con IA"

PROMPT="Optimiza completamente el archivo public/$PAG del sitio Apostoles de la Divina Misericordia. Mejora SEO, semántica HTML, accesibilidad, estructura, enlazado interno y contenido espiritual."

opencode run "$PROMPT" > "$PUBLIC/$PAG"

echo "✔ Página optimizada: $PAG"

echo "$PAG" >> "$STATE"

echo "[$(date)] Procesado: $PAG" >> "$LOG"

echo "- $PAG optimizada $(date)" >> "$REPORT"

}

for FILE in $PUBLIC/*.html
do
 PAG=$(basename "$FILE")
 procesar_pagina "$PAG"
done

echo ""
echo "======================================"
echo "   PROCESO COMPLETADO"
echo "======================================"
