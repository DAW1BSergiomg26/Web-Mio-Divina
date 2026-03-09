#!/bin/bash

# =========================
# DIVINO MASTER V4 AUTÓNOMO
# =========================

# Rutas principales
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
PUBLIC="$(cd "$(dirname "$0")/../../.." && pwd)/public"
STATE="$ROOT/state/divino_progress.json"
HISTORIAL="$ROOT/reports/divino_historial.md"
LOG="$ROOT/logs/divino_master.log"

# Crear carpetas si no existen
mkdir -p "$ROOT/state" "$ROOT/reports" "$ROOT/logs"

# Inicializar archivos si no existen
[ ! -f "$STATE" ] && echo '{}' > "$STATE"
[ ! -f "$HISTORIAL" ] && echo "# Historial de DIVINO MASTER\n" > "$HISTORIAL"

# Agentes
AUDIT="$ROOT/agents/audit-agent/run.sh"
SEO="$ROOT/agents/seo-agent/run.sh"
CONTENT="$ROOT/agents/content-agent/run.sh"
LECTURAS="$ROOT/agents/lecturas-agent/run.sh"
IMPLEMENT="$ROOT/agents/implementar-agent/run.sh"

# Función para registrar
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"
  echo "- $1" >> "$HISTORIAL"
}

# Leer progreso
PROGRESS=$(cat "$STATE")

# Procesar HTML
for file in "$PUBLIC"/*.html; do
  fname=$(basename "$file")

  # Saltar si ya procesado
  if echo "$PROGRESS" | grep -q "\"$fname\": \"done\""; then
    log "⏩ $fname ya procesado. Saltando..."
    continue
  fi

  log "🌟 Procesando $fname"

  bash "$AUDIT" "$file" && log "1️⃣ Auditoría completada"
  bash "$SEO" "$file" && log "2️⃣ SEO completado"
  bash "$CONTENT" "$file" && log "3️⃣ Contenido mejorado"
  bash "$LECTURAS" "$file" && log "4️⃣ Contenido espiritual"
  bash "$IMPLEMENT" "$file" && log "5️⃣ Cambios implementados"

  log "✅ $fname procesado completamente"

  # Guardar progreso
  jq --arg file "$fname" '.[$file]="done"' "$STATE" > "$STATE.tmp" && mv "$STATE.tmp" "$STATE"
done

log "🎉 DIVINO MASTER V4 completado con éxito"
