#!/bin/bash

echo "================================"
echo "AI WEB OPTIMIZATION AGENT"
echo "================================"

echo "Analizando proyecto..."

opencode run "$(cat agent_prompt.txt)"

echo ""
echo "================================"
echo "ANÁLISIS COMPLETADO"
echo "================================"
