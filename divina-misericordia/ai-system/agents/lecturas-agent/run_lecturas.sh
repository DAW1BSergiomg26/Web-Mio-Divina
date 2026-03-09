#!/bin/bash
BASE="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
PUBLIC="$(cd "$(dirname "$0")/../../.." && pwd)/public"
source "$BASE/recovery/state_manager.sh"
DATE=$(date +"%Y-%m-%d_%H-%M")
LOG="$BASE/logs/lecturas.log"
BACKUP_DIR="$PUBLIC/backups"
mkdir -p "$BASE/logs" "$BASE/reports" "$BASE/state" "$BACKUP_DIR"
echo "================================================" | tee -a "$LOG"
echo "AI LECTURAS AGENT - $(date)" | tee -a "$LOG"
echo "================================================" | tee -a "$LOG"
PLANTILLA=$(cat "$PUBLIC/index.html")
CSS=$(cat "$PUBLIC/css/styles.css")
HTML_ACTUAL=$(cat "$PUBLIC/lecturas-recomendadas.html" 2>/dev/null || echo "NUEVA PAGINA")
BACKUP="$BACKUP_DIR/lecturas_backup_$DATE.html"
[ -f "$PUBLIC/lecturas-recomendadas.html" ] && cp "$PUBLIC/lecturas-recomendadas.html" "$BACKUP"
echo "Backup guardado" | tee -a "$LOG"
save_state "lecturas" "RUNNING" "$LOG"
PROMPT="Eres el mejor desarrollador web experto en contenido catolico y SEO.
Crea la pagina lecturas-recomendadas.html COMPLETA.

=== PLANTILLA BASE ===
$PLANTILLA

=== CSS ===
$CSS

=== CONTENIDO ACTUAL ===
$HTML_ACTUAL

=== PAGINA A GENERAR ===

SEO:
title: Lecturas Recomendadas - Divina Misericordia | Apostoles
meta description: Accede a los documentos oficiales de la Iglesia: Biblia, Catecismo, enciclicas papales y obras espirituales sobre la Divina Misericordia.
H1: Lecturas Recomendadas para Crecer en la Fe

INTRODUCCION 150 palabras motivadora sobre la lectura espiritual.

SECCION 1 - DOCUMENTOS FUNDAMENTALES:

1. SAGRADA ESCRITURA
Enlace oficial: https://www.vatican.va/archive/ESL0506/_INDEX.HTM
Descripcion 100 palabras sobre la importancia de la Biblia como Palabra de Dios.
Boton: Leer en Vatican.va

2. CATECISMO DE LA IGLESIA CATOLICA
Enlace: https://www.vatican.va/archive/catechism_sp/index_sp.html
Descripcion 100 palabras sobre el Catecismo como guia completa de fe y moral.
Boton: Leer en Vatican.va

3. CODIGO DE DERECHO CANONICO
Enlace: https://www.vatican.va/archive/cod-iuris-canonici/cic_index_sp.html
Descripcion 80 palabras sobre su importancia para entender la Iglesia.
Boton: Leer en Vatican.va

SECCION 2 - CONCILIOS:

4. CONCILIO VATICANO II
Enlace: https://www.vatican.va/archive/hist_councils/ii_vatican_council/index_sp.htm
Descripcion 100 palabras sobre la renovacion de la Iglesia en el siglo XX.
Boton: Ver documentos

SECCION 3 - MAGISTERIO PONTIFICIO:

5. ENCICLICAS DEL PAPA FRANCISCO
5a. Lumen Fidei 2013
    Enlace: https://www.vatican.va/content/francesco/es/encyclicals/documents/papa-francesco_20130629_enciclica-lumen-fidei.html
    Descripcion 80 palabras sobre la Fe cristiana.
5b. Laudato Si 2015
    Enlace: https://www.vatican.va/content/francesco/es/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html
    Descripcion 80 palabras sobre ecologia y casa comun.

6. ENCICLICAS DEL PAPA BENEDICTO XVI
6a. Deus Caritas Est 2005 - Dios es Amor
    Enlace: https://www.vatican.va/content/benedict-xvi/es/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html
    Descripcion 80 palabras.
6b. Spe Salvi 2007 - Salvados en la Esperanza
    Enlace: https://www.vatican.va/content/benedict-xvi/es/encyclicals/documents/hf_ben-xvi_enc_20071130_spe-salvi.html
    Descripcion 80 palabras.
6c. Caritas in Veritate 2009 - El Amor en la Verdad
    Enlace: https://www.vatican.va/content/benedict-xvi/es/encyclicals/documents/hf_ben-xvi_enc_20090629_caritas-in-veritate.html
    Descripcion 80 palabras.

7. ENCICLICA DE SAN JUAN PABLO II - DESTACADA ESPECIALMENTE
Dives in Misericordia - Rico en Misericordia 1980
Enlace: https://www.vatican.va/content/john-paul-ii/es/encyclicals/documents/hf_jp-ii_enc_30111980_dives-in-misericordia.html
Descripcion 200 palabras. ES LA MAS IMPORTANTE para este sitio.
Destacar con borde dorado o color especial diferente al resto.
Incluir badge: LECTURA ESENCIAL PARA LA DIVINA MISERICORDIA

SECCION 4 - OBRAS RECOMENDADAS:

8. SANTOS PADRES DE LA IGLESIA
Enlace: https://www.newadvent.org/fathers/
Descripcion 120 palabras mencionando San Agustin, San Juan Crisostomo,
San Ambrosio, San Jeronimo y San Gregorio Magno con breve perfil de cada uno.
Boton: Explorar textos

9. JESUS DE NAZARET DE BENEDICTO XVI
Enlace: https://www.vatican.va/content/benedict-xvi/es/books/2011/documents/hf_ben-xvi_book_20110322_jesus-nazareth-ii.html
Indicar claramente: Disponible en PDF
Descripcion 120 palabras sobre esta obra monumental.
Boton: Descargar PDF

DISEÑO REQUERIDO:
- Cada recurso en una tarjeta card con icono emoji representativo
- Boton visible con enlace externo target=_blank rel=noopener noreferrer
- Agrupacion visual por categorias con separadores
- Dives in Misericordia destacada visualmente
- Seccion final motivacional: Por que leer estas obras?
- CTA final: Unete a nuestro grupo de lectura espiritual
- Link de regreso a Oraciones

REGLAS:
Mismo header nav y footer que la plantilla.
Mismas clases CSS.
Todos enlaces externos con target=_blank y rel=noopener noreferrer.
Schema: CollectionPage
Devuelve SOLO HTML completo.
Sin markdown. Sin explicaciones.
Empieza con <!DOCTYPE html>"
HTML_TEMP="$BASE/state/temp_lecturas.html"
echo "Generando Lecturas Recomendadas..." | tee -a "$LOG"
echo "Procesando 2-5 minutos..." | tee -a "$LOG"
if timeout 600 opencode run "$PROMPT" > "$HTML_TEMP" 2>&1; then
  if grep -q "DOCTYPE\|<html" "$HTML_TEMP"; then
    cp "$HTML_TEMP" "$PUBLIC/lecturas-recomendadas.html"
    clear_state "lecturas"
    echo "================================================"
    echo "LECTURAS RECOMENDADAS GENERADA"
    echo "Archivo: $PUBLIC/lecturas-recomendadas.html"
    echo "Backup: $BACKUP"
    echo "================================================"
    read -p "Ver resultado? (s/n): " VER
    [ "$VER" = "s" ] && less "$PUBLIC/lecturas-recomendadas.html"
  else
    save_state "lecturas" "INTERRUPTED" "$HTML_TEMP"
    echo "ERROR: HTML no valido - original conservado"
    cat "$HTML_TEMP"
  fi
else
  save_state "lecturas" "INTERRUPTED" "$HTML_TEMP"
  echo "INTERRUMPIDO - original conservado"
fi
