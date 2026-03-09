#!/bin/bash
# ================================================
# MASTER DIVINO — APOSTOLES DE LA DIVINA MISERICORDIA
# ================================================
BASE="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
PUBLIC="$(cd "$(dirname "$0")/../../.." && pwd)/public"
DATE=$(date +"%Y-%m-%d_%H-%M")
LOG="$BASE/logs/divino_master.log"
BACKUP_DIR="$PUBLIC/backups/divino_$DATE"

mkdir -p "$BASE/logs" "$BASE/state" "$BACKUP_DIR"
cp "$PUBLIC"/*.html "$BACKUP_DIR/" 2>/dev/null
echo "BACKUP COMPLETO: $BACKUP_DIR" | tee -a "$LOG"

mejorar() {
  local PAG="$1"
  local PROMPT_EXTRA="$2"

  echo "" | tee -a "$LOG"
  echo "=============================" | tee -a "$LOG"
  echo "PROCESANDO: $PAG" | tee -a "$LOG"
  echo "=============================" | tee -a "$LOG"

  PROMPT="Eres el mejor desarrollador web del mundo especializado en sitios religiosos católicos.
Sitio: Apóstoles de la Divina Misericordia
Tema: Divina Misericordia de Jesucristo

INSTRUCCIONES GENERALES:
1. Usa public/index.html como referencia de estructura, navegación y estilos.
2. Respeta y reutiliza las clases CSS y componentes ya existentes del sitio.
3. Lee el contenido actual de public/\$PAG y mejóralo profundamente.
4. Escribe el archivo completo public/\$PAG sobrescribiendo el anterior.

PAUTA DE DISEÑO:
- Mantén el mismo header y footer que index.html.
- Colores principales: azul marino, dorado y blanco.
- Estética sagrada, limpia, legible, sin estridencias.
- Todas las imágenes con loading=\"lazy\" y alt descriptivo.
- Enlaces externos con target=\"_blank\" y rel=\"noopener noreferrer\".
- HTML semántico (header, main, section, article, footer).
- Accesibilidad: contraste correcto, aria-label donde sea necesario.

SEO Y CONTENIDO:
- Mínimo 500 palabras de contenido de calidad por página.
- Título <title> único (55–60 caracteres) con enfoque en Divina Misericordia.
- Meta description única (150–160 caracteres) con CTA espiritual.
- Un solo <h1> principal, jerarquía de h2/h3 clara.
- CTAs claros, respetuosos y motivadores hacia la oración y la confianza en Jesús.
- Siempre en español correcto y devocional.

EXTRAS:
- Incluye schema JSON-LD cuando tenga sentido (artículo, organización, etc.).
- Optimiza la estructura para tiempos de carga (evita scripts innecesarios).
- No elimines contenido esencial de fe; mejóralo y ordénalo mejor.

INSTRUCCIONES ESPECÍFICAS DE ESTA PÁGINA:
\$PROMPT_EXTRA

Escribe el HTML completo final de public/\$PAG respetando todo lo anterior."

    timeout 900 opencode run --model openai/gpt-4.1-mini "$PROMPT" 2>&1 | tee -a "$LOG"
  echo "COMPLETADO: $PAG" | tee -a "$LOG"
  sleep 5

}

while true; do
  clear
  echo "=============================================="
  echo "   MASTER DIVINO — WEB APOSTOLES MISERICORDIA"
  echo "=============================================="
  echo "  Fecha: $(date)"
  echo "  Backup: $BACKUP_DIR"
  echo "=============================================="
  echo ""
  echo "  1  - PAPAS (4 páginas mismo formato)"
  echo "  2  - MARÍA"
  echo "  3  - OBRAS DE MISERICORDIA"
  echo "  4  - CONSAGRACIÓN"
  echo "  5  - CORONILLA"
  echo "  6  - HORA DE LA MISERICORDIA"
  echo "  7  - LOS RAYOS"
  echo "  8  - SANTA FAUSTINA"
  echo "  9  - GALERÍA con vídeos YouTube"
  echo "  10 - ORACIONES sagradas"
  echo "  11 - NOTICIAS encuadrada"
  echo "  12 - LUGARES DE CULTO video corregido"
  echo "  13 - TESTIMONIOS"
  echo "  14 - ESPACIO JÓVENES nivel DIOS"
  echo "  15 - ENLACES mismo formato lecturas"
  echo "  16 - QUIÉNES SOMOS"
  echo "  17 - CONTACTO formulario sagrado"
  echo "  18 - TODAS las páginas seguidas"
  echo "  0  - Salir"
  echo ""
  read -r -p "  Elige opción: " OPT

  case "$OPT" in
    1)
      INSTRUCCIONES_PAPAS_BASE="
DISEÑO IDENTICO PARA TODAS LAS PÁGINAS DE PAPAS:

ESTRUCTURA:
- Hero con imagen del papa centrada (mismo tamaño en las 4 páginas).
- Badge dorado con años de pontificado.
- H1 con nombre completo del papa.
- Grid 2 columnas en escritorio, 1 en móvil.

SECCIONES (en este orden):
1. Breve perfil (2 párrafos introductorios).
2. Su pontificado (fechas, hechos clave, ~200 palabras).
3. Su relación con la Divina Misericordia (~250 palabras).
4. Documentos y enseñanzas principales (lista con descripción).
5. Frases célebres (3 citas en blockquote con estilo dorado).
6. Canonización o beatificación si aplica.
7. Galería mínima (3 imágenes con alt descriptivo).
8. CTA: ver oraciones relacionadas y volver a Papas.

CSS SUGERIDO:
.papa-foto { width:280px; height:350px; object-fit:cover; object-position:top; border-radius:8px; border:3px solid gold; }
.papa-cita { border-left:4px solid gold; padding:15px; font-style:italic; }
.papa-badge { background:gold; color:#1a1a2e; padding:5px 15px; border-radius:20px; }

No uses imágenes locales que no existan. Si no hay imagen usa:
https://via.placeholder.com/280x350/1a1a2e/gold?text=Foto+Papa
"

      mejorar "ss-francisco.html" "$INSTRUCCIONES_PAPAS_BASE
PAPA ESPECÍFICO: FRANCISCO
Destaca su énfasis en la misericordia y el Jubileo de la Misericordia."

      mejorar "ss-juan-pablo-ii.html" "$INSTRUCCIONES_PAPAS_BASE
PAPA ESPECÍFICO: SAN JUAN PABLO II
Incluye canonización de Santa Faustina y creación de la Fiesta de la Divina Misericordia."

      mejorar "ss-benedicto-xvi.html" "$INSTRUCCIONES_PAPAS_BASE
PAPA ESPECÍFICO: BENEDICTO XVI
Profundiza en su teología sobre la misericordia y continuidad del mensaje."

      mejorar "ss-leon-xiv.html" "$INSTRUCCIONES_PAPAS_BASE
PAPA ESPECÍFICO: LEÓN XIV
Si el archivo está vacío, crea contenido coherente y devocional simulando un papa dedicado a la Misericordia."
      read -r -p "Enter para continuar" _
      ;;

    2)
      mejorar "maria.html" "PÁGINA: MARÍA SANTÍSIMA EN LA DIVINA MISERICORDIA
Hero, Magnificat, títulos marianos, oraciones, Diario de Santa Faustina y vídeos sobre María y la Misericordia."
      read -r -p "Enter para continuar" _
      ;;

    3)
      mejorar "obras-de-misericordia.html" "PÁGINA: OBRAS DE MISERICORDIA
Obras corporales y espirituales con cards, citas bíblicas y ejemplos prácticos actuales."
      read -r -p "Enter para continuar" _
      ;;

    4)
      mejorar "consagracion.html" "PÁGINA: CONSAGRACIÓN A LA DIVINA MISERICORDIA
Historia, acto de consagración, preparación, modo de vivirla y consagración familiar."
      read -r -p "Enter para continuar" _
      ;;

    5)
      mejorar "coronilla.html" "PÁGINA: CORONILLA DE LA DIVINA MISERICORDIA
Origen, promesas, texto completo, guía paso a paso, hora de la misericordia y vídeos."
      read -r -p "Enter para continuar" _
      ;;

    6)
      mejorar "hora-de-la-misericordia.html" "PÁGINA: LA HORA DE LA MISERICORDIA
Explicación, cita del Diario, pasos para vivirla, reloj JavaScript y equivalencias horarias."
      read -r -p "Enter para continuar" _
      ;;

    7)
      mejorar "los-rayos.html" "PÁGINA: LOS RAYOS DE LA DIVINA MISERICORDIA
Origen, significado de rayos rojo y blanco, historia de la imagen, artículos y vídeos."
      read -r -p "Enter para continuar" _
      ;;

    8)
      mejorar "santa-faustina.html" "PÁGINA: SANTA FAUSTINA KOWALSKA
Biografía, vida religiosa, apariciones, Diario, virtudes, mensaje actual, novena y oración."
      read -r -p "Enter para continuar" _
      ;;

    9)
      mejorar "galeria.html" "PÁGINA: GALERÍA SAGRADA
Galería de imágenes (grid + lightbox CSS) y vídeos de YouTube sobre la Divina Misericordia."
      read -r -p "Enter para continuar" _
      ;;

    10)
      mejorar "oraciones.html" "PÁGINA: ORACIONES SAGRADAS
Colección estructurada de oraciones principales, de mañana, de noche, especiales y letanías."
      read -r -p "Enter para continuar" _
      ;;

    11)
      mejorar "noticias.html" "PÁGINA: NOTICIAS
Cards alineadas, imágenes iguales, 8 noticias largas sobre eventos de la Divina Misericordia."
      read -r -p "Enter para continuar" _
      ;;

    12)
      mejorar "lugares-de-culto.html" "PÁGINA: LUGARES DE CULTO
Santuarios principales, vídeo responsive 16:9, secciones sobre peregrinaciones y mapa preparado."
      read -r -p "Enter para continuar" _
      ;;

    13)
      mejorar "testimonios.html" "PÁGINA: TESTIMONIOS
Testimonios emotivos, formulario para enviar nuevos testimonios y citas breves animadas."
      read -r -p "Enter para continuar" _
      ;;

    14)
      mejorar "espacio-jovenes.html" "PÁGINA: ESPACIO JÓVENES
Estilo dark futurista, reto de 33 días, quiz interactivo, playlist y meditación guiada."
      read -r -p "Enter para continuar" _
      ;;

    15)
      mejorar "enlaces.html" "PÁGINA: ENLACES DE INTERÉS
Mismo diseño que lecturas-recomendadas, enlaces por categorías con buen formato."
      read -r -p "Enter para continuar" _
      ;;

    16)
      mejorar "quienes-somos.html" "PÁGINA: QUIÉNES SOMOS
Misión, historia, pilares, valores, patronos, estadísticas de impacto y CTAs."
      read -r -p "Enter para continuar" _
      ;;

    17)
      mejorar "contacto.html" "PÁGINA: CONTACTO
Fondo con rayos, formulario glassmorphism, información de contacto y FAQ."
      read -r -p "Enter para continuar" _
      ;;

    18)
      echo "EJECUTANDO TODAS LAS PÁGINAS EN SECUENCIA..."
      echo "Esto puede tardar bastante tiempo."
      read -r -p "Confirmar? (s/n): " CONFIRM
      if [ "$CONFIRM" = "s" ]; then
        for OPT_AUTO in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17; do
          case "$OPT_AUTO" in
            1) "$0" <<< "1" ;;
            2) "$0" <<< "2" ;;
            3) "$0" <<< "3" ;;
            4) "$0" <<< "4" ;;
            5) "$0" <<< "5" ;;
            6) "$0" <<< "6" ;;
            7) "$0" <<< "7" ;;
            8) "$0" <<< "8" ;;
            9) "$0" <<< "9" ;;
            10) "$0" <<< "10" ;;
            11) "$0" <<< "11" ;;
            12) "$0" <<< "12" ;;
            13) "$0" <<< "13" ;;
            14) "$0" <<< "14" ;;
            15) "$0" <<< "15" ;;
            16) "$0" <<< "16" ;;
            17) "$0" <<< "17" ;;
          esac
        done
      fi
      ;;

    0)
      echo "Saliendo del Master Divino..."
      exit 0
      ;;

    *)
      echo "Opción no válida"
      sleep 1
      ;;
  esac
done
