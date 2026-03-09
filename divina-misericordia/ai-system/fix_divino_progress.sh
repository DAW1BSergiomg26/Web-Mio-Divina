#!/bin/bash
# fix_divino_progress.sh
# Script para reparar divino_progress.json

JSON_FILE="state/divino_progress.json"
TMP_FILE="state/divino_progress.json.tmp"

# Si el tmp existe, úsalo para reconstruir el json principal
if [ -f "$TMP_FILE" ]; then
    echo "Arreglando $JSON_FILE usando $TMP_FILE..."
    
    # Extraemos solo las páginas completadas
    PAGES=$(jq -r 'keys[] | select(. != "paginas_completadas")' "$TMP_FILE")
    
    # Creamos un nuevo array con esas páginas
    jq --argjson arr "[]" '.paginas_completadas = $arr' "$TMP_FILE" > "$JSON_FILE"

    for page in $PAGES; do
        jq --arg page "$page" '.paginas_completadas += [$page]' "$JSON_FILE" > "$JSON_FILE.tmp"
        mv "$JSON_FILE.tmp" "$JSON_FILE"
    done

    echo "JSON reparado:"
    cat "$JSON_FILE"
else
    echo "No existe $TMP_FILE, nada que arreglar."
fi
