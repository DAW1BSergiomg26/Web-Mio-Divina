#!/bin/bash

# Definir ROOT y PUBLIC correctamente
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
PUBLIC="$(cd "$(dirname "$0")/../../.." && pwd)/public"
STATE="$ROOT/state/divino_progress.json"
HISTORIAL="$ROOT/reports/divino_historial.md"
LOG="$ROOT/logs/divino_master.log"

mkdir -p "$ROOT/state" "$ROOT/reports" "$ROOT/logs"

# Inicializar progreso si no existe
[ ! -f "$STATE" ] && echo '{}' > "$STATE"
[ ! -f "$HISTORIAL" ] && echo "# Historial de DIVINO MASTER\n" > "$HISTORIAL"

# Definir los agentes
AUDIT="$ROOT/agents/audit-agent/run.sh"
SEO="$ROOT/agents/seo-agent/run.sh"
CONTENT="$ROOT/agents/content-agent/run.sh"
LECTURAS="$ROOT/agents/lecturas-agent/run.sh"
IMPLEMENT="$ROOT/agents/implementar-agent/run.sh"

# Procesar HTML
for file in "$PUBLIC"/*.html; do
    echo "🌟 Procesando $(basename $file)..."
    bash "$AUDIT" "$file"
    bash "$SEO" "$file"
    bash "$CONTENT" "$file"
    bash "$LECTURAS" "$file"
    bash "$IMPLEMENT" "$file"
done

echo "✅ DIVINO MASTER V4 completado"
