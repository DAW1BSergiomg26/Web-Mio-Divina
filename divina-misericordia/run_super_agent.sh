#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H-%M")

REPORT="../ai-agent/reports/super_agent_$DATE.txt"

echo "================================="
echo "SUPER AI WEB AGENT"
echo "================================="

echo "Analizando proyecto..."

opencode run "$(cat super-ai-agent/super_agent_prompt.txt)" > $REPORT

echo ""
echo "Informe guardado en:"
echo $REPORT

echo "================================="
echo "ANÁLISIS COMPLETADO"
echo "================================="
