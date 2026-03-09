#!/bin/bash

BASE="ai-growth-engine"

DATE=$(date +"%Y-%m-%d_%H-%M")

LOG="$BASE/logs/agent.log"
REPORT="$BASE/reports/growth_$DATE.txt"
MEMORY="$BASE/memory/history.log"

echo "===================================" | tee -a "$LOG"
echo "AGENTE IA NIVEL 1000 – MOTOR SEO" | tee -a "$LOG"
echo "===================================" | tee -a "$LOG"

echo "Ejecutando análisis..." | tee -a "$LOG"

opencode run "$(cat $BASE/prompts/growth_agent.txt)" > "$REPORT"

echo "Informe generado en:" | tee -a "$LOG"
echo "$REPORT" | tee -a "$LOG"

echo "Guardando memoria..." | tee -a "$LOG"

cat "$REPORT" >> "$MEMORY"

echo "Proceso terminado." | tee -a "$LOG"
