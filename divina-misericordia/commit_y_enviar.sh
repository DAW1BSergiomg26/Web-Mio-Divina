#!/bin/bash
# Script para hacer commit, push y enviar correo automáticamente
# Uso: ./commit_y_enviar.sh "mensaje del commit"

MENSAJE=${1:-"Actualización automática"}

# Hacer git add de todos los cambios
git add -A

# Hacer commit
git commit -m "$MENSAJE"

# Hacer push
git push

# Enviar correo con los detalles
python auto_enviar_cambios.py "$MENSAJE"

echo "✅ Completado: Commit, Push y Correo enviados"