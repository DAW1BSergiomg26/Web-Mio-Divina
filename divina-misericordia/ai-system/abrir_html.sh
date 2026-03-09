#!/bin/bash
# Script para abrir cualquier HTML del proyecto en el navegador de Windows
# Uso: ./abrir_html.sh nombre_archivo.html

if [ -z "$1" ]; then
    echo "Por favor, indica el archivo HTML a abrir. Ej: ./abrir_html.sh consagracion.html"
    exit 1
fi

FILE="./public/$1"

if [ ! -f "$FILE" ]; then
    echo "El archivo $FILE no existe."
    exit 1
fi

# Abre el archivo en el navegador de Windows
explorer.exe "$FILE"
