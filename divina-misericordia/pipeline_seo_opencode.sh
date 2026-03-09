#!/bin/bash

echo "🚀 INICIANDO PIPELINE SEO + FRONTEND CON OPENCODE"
echo "Proyecto: Web Divina Misericordia"
echo ""

PROMPTS_DIR="./prompts"

if [ ! -d "$PROMPTS_DIR" ]; then
  echo "❌ No existe la carpeta /prompts"
  exit 1
fi

for file in $PROMPTS_DIR/*.txt
do
  echo ""
  echo "-------------------------------------"
  echo "📄 Ejecutando: $file"
  echo "-------------------------------------"

  echo "💾 Creando backup..."
  git add .
  git commit -m "backup antes de $(basename $file)" > /dev/null 2>&1

  echo "▶ Ejecutar este prompt con OpenCode? (s/n)"
  read respuesta

  if [ "$respuesta" = "s" ]; then
    opencode run "$(cat $file)"
  else
    echo "⏭ Saltando prompt..."
  fi

  echo ""
  echo "🌐 Revisa tu web en:"
  echo "http://localhost:3001"
  echo ""

  echo "¿Continuar con el siguiente prompt? (s/n)"
  read continuar

  if [ "$continuar" != "s" ]; then
    echo "⛔ Pipeline detenido por el usuario."
    exit
  fi

done

echo ""
echo "🏆 PIPELINE COMPLETADO"
echo "Revisa el informe final generado."
