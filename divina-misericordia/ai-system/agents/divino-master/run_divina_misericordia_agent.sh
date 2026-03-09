#!/bin/bash
# Agente lanzador para el proyecto "Apóstoles de la Divina Misericordia"

AGENT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$AGENT_DIR/../../.." && pwd)"
LOG="$PROJECT_ROOT/ai-system/logs/divino_master.log"

PAGINA="$1"
shift
INSTRUCCIONES="$*"

if [ -z "$PAGINA" ]; then
  echo "Uso: $0 ruta/relativa/a/public/pagina.html \"Instrucciones opcionales\""
  echo "Ejemplo: $0 public/index.html \"Mejorar hero, botones y CTAs\""
  exit 1
fi

# Ejecuta el script principal del agente (hace backup, prepara LOG, etc.)
bash "$AGENT_DIR/run_divino_master.sh"

echo "" | tee -a "$LOG"
echo "Lanzando mejora sobre: $PAGINA" | tee -a "$LOG"
echo "Instrucciones: $INSTRUCCIONES" | tee -a "$LOG"

# Aquí es donde en el futuro puedes conectar con tu sistema de IA
# Por ahora solo deja constancia en el log.
