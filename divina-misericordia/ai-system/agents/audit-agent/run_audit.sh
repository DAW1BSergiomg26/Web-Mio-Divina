#!/bin/bash
# BASE sube 3 niveles: audit-agent → agents → ai-system
BASE="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
source "$BASE/recovery/state_manager.sh"

DATE=$(date +"%Y-%m-%d_%H-%M")
LOG="$BASE/logs/audit.log"
REPORT="$BASE/reports/audit_$DATE.txt"

mkdir -p "$BASE/logs" "$BASE/reports" "$BASE/state"

echo "=================================" | tee -a "$LOG"
echo "AI AUDIT AGENT v3 — $(date)" | tee -a "$LOG"
echo "=================================" | tee -a "$LOG"

save_state "audit" "RUNNING" "$REPORT"

PROMPT="Eres un experto auditor web senior. Analiza COMPLETO el proyecto web en la carpeta public/.

AUDITA en este orden:
1. HTML: estructura, etiquetas semanticas, errores, accesibilidad
2. CSS: errores, clases sin usar, responsive, performance
3. JavaScript: errores, console.log olvidados, funciones sin usar
4. SEO tecnico: title, meta description, canonical, robots
5. Performance: imagenes sin optimizar, recursos bloqueantes
6. Seguridad: links externos sin rel=noopener, formularios

Para cada problema: archivo exacto, severidad CRITICO/IMPORTANTE/MENOR y solucion con codigo.
Finaliza con resumen ejecutivo y puntuacion 0-100."

echo "Ejecutando auditoria..." | tee -a "$LOG"

if timeout 300 opencode run "$PROMPT" > "$REPORT" 2>&1; then
  clear_state "audit"
  echo "Auditoria completada: $REPORT" | tee -a "$LOG"
else
  save_state "audit" "INTERRUPTED" "$REPORT"
  echo "Auditoria interrumpida — ejecuta de nuevo para continuar" | tee -a "$LOG"
fi

echo "Informe: $REPORT" | tee -a "$LOG"
