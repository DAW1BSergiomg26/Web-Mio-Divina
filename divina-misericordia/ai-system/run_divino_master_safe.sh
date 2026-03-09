#!/bin/bash
# Script seguro para ejecutar DIVINO MASTER

TMP_FILE="state/divino_progress.json.tmp"
STATE_FILE="state/divino_progress.json"

# Revisa si existe el archivo .tmp
if [ -f "$TMP_FILE" ]; then
  echo "🔧 Revisando $TMP_FILE..."
  
  # Intentar parsearlo con jq
  if ! jq empty "$TMP_FILE" >/dev/null 2>&1; then
    echo "⚠️ $TMP_FILE está corrupto, reparando..."
    ./fix_divino_progress.sh
  else
    echo "✅ $TMP_FILE es válido."
  fi
fi

# Ejecutar DIVINO MASTER normalmente
./agents/divino-master/run_divino_master_v4.sh
