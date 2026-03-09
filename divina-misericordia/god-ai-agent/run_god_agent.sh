#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H-%M")

REPORT="reports/god_report_$DATE.txt"

echo "==============================="
echo "SUPER AGENTE IA NIVEL DIOS"
echo "==============================="

echo "Analizando proyecto..."

opencode run "$(cat prompts/god_prompt.txt)" > "$REPORT"

echo ""
echo "Informe generado en:"
echo "$REPORT"

echo "==============================="
echo "ANÁLISIS COMPLETADO"
echo "==============================="
