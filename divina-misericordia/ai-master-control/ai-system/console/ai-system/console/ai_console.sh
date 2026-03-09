#!/bin/bash

BASE="$(cd "$(dirname "$0")/.." && pwd)"

while true
do

clear

echo "====================================="
echo "AI SYSTEM CONTROL CENTER"
echo "====================================="

echo "1 - Auditoría web"
echo "2 - Optimización SEO"
echo "3 - Generar contenido"
echo "4 - Ejecutar todos los agentes"
echo "5 - Ver informes"
echo "0 - Salir"

read -p "Selecciona opción: " opcion

case $opcion in

1)
"$BASE/agents/audit-agent/run_audit.sh"
read -p "Enter para continuar"
;;

2)
"$BASE/agents/seo-agent/run_seo.sh"
read -p "Enter para continuar"
;;

3)
"$BASE/agents/content-agent/run_content.sh"
read -p "Enter para continuar"
;;

4)
"$BASE/agents/audit-agent/run_audit.sh"
"$BASE/agents/seo-agent/run_seo.sh"
"$BASE/agents/content-agent/run_content.sh"
read -p "Enter para continuar"
;;

5)
ls "$BASE/reports"
read -p "Enter para continuar"
;;

0)
exit
;;

*)
echo "Opción inválida"
sleep 2
;;

esac

done
