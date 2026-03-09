#!/bin/bash

while true
do

clear

echo "==================================="
echo "AGENTE IA NIVEL 10000"
echo "CONSOLA DE CRECIMIENTO WEB"
echo "==================================="

echo "1 - Auditoría web"
echo "2 - Optimización SEO"
echo "3 - Generar artículo SEO"
echo "4 - Crear páginas HTML"
echo "5 - Ejecutar motor SEO 5000"
echo "6 - Ver informes"
echo "7 - Piloto automático"
echo "0 - Salir"

read -p "Selecciona opción: " opcion

case $opcion in

1)
echo "Ejecutando auditoría..."
../god-ai-agent/run_god_agent.sh
read -p "Enter para continuar"
;;

2)
echo "Ejecutando optimización SEO..."
../ai-autonomous-agent/run_autonomous_ai.sh
read -p "Enter para continuar"
;;

3)
echo "Generando contenido SEO..."
../ai-seo-super-engine/run_ai5000.sh
read -p "Enter para continuar"
;;

4)
echo "Creando páginas HTML..."
../ai-seo-super-engine/run_ai5000.sh
read -p "Enter para continuar"
;;

5)
echo "Ejecutando motor SEO masivo..."
../ai-seo-super-engine/run_ai5000.sh
read -p "Enter para continuar"
;;

6)
echo "Mostrando informes..."
ls ../ai-seo-super-engine/reports
read -p "Enter para continuar"
;;

7)
echo "Iniciando piloto automático..."

while true
do
../ai-seo-super-engine/run_ai5000.sh
sleep 3600
done
;;

0)
echo "Saliendo..."
exit
;;

*)
echo "Opción inválida"
sleep 2
;;

esac

done
