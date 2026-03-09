#!/bin/bash

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PUBLIC="$ROOT/public"

STATE="$ROOT/ai-system/state/divino_progress.json"
LOG="$ROOT/ai-system/logs/divino_master.log"
REPORT="$ROOT/ai-system/reports/divino_historial.md"

SEO_AGENT="$ROOT/ai-system/agents/seo-agent"
AUDIT_AGENT="$ROOT/ai-system/agents/audit-agent"
CONTENT_AGENT="$ROOT/ai-system/agents/content-agent"

echo "======================================"
echo "       DIVINO MASTER V2"
echo "======================================"

echo "Proyecto: $ROOT"
echo ""

if [ ! -f "$STATE" ]; then
 echo '{"paginas_completadas":[]}' > "$STATE"
fi

procesar_pagina() {

PAG="$1"

echo ""
echo "Procesando $PAG"

if grep -q "$PAG" "$STATE"; then
 echo "Ya procesada, saltando..."
 return
fi

echo "1️⃣ Auditoria"
bash "$AUDIT_AGENT/run.sh" "$PAG"

echo "2️⃣ SEO"
bash "$SEO_AGENT/run.sh" "$PAG"

echo "3️⃣ Contenido"
bash "$CONTENT_AGENT/run.sh" "$PAG"

echo "4️⃣ Mejora HTML con OpenCode"

PROMPT="Optimiza completamente public/$PAG del sitio Apostoles de la Divina Misericordia. Mejora SEO, estructura, accesibilidad, enlazado interno y contenido."

opencode run "$PROMPT" > "$PUBLIC/$PAG"

echo "Completado $PAG"

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
echo "PROCESO COMPLETADO"
echo "======================================"
