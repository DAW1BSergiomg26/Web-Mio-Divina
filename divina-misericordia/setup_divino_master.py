import os

os.makedirs("ai-system/agents/divino-master", exist_ok=True)

script = """#!/bin/bash
# Agente DIVINO MASTER
BASE="$(cd "$(dirname "$0")/../../.." && pwd)/ai-system"
PUBLIC="$(cd "$(dirname "$0")/../../.." && pwd)/public"
DATE=$(date +"%Y-%m-%d_%H-%M")
LOG="$BASE/logs/divino_master.log"
BACKUP_DIR="$PUBLIC/backups/divino_$DATE"

mkdir -p "$BASE/logs" "$BASE/state" "$BACKUP_DIR"
cp "$PUBLIC"/*.html "$BACKUP_DIR/" 2>/dev/null
echo "BACKUP COMPLETO: $BACKUP_DIR" | tee -a "$LOG"

IMG_FAUSTINA="img/Sor Faustina.png"
IMG_JESUS="img/jesus_misericordioso.jpeg"
IMG_LOGO="img/logo-divina.png"
IMG_LOGO2="img/logo_divina_misericordia.jpg"

mejorar() {
  local PAG="$1"
  local INSTRUCCIONES="$2"

  echo "" | tee -a "$LOG"
  echo "=============================" | tee -a "$LOG"
  echo "PROCESANDO: $PAG" | tee -a "$LOG"
  echo "=============================" | tee -a "$LOG"

  PROMPT="Eres el mejor desarrollador web del mundo especializado en sitios religiosos católicos.
Sitio: Apóstoles de la Divina Misericordia.
Página: $PAG
Instrucciones: $INSTRUCCIONES
Debes mejorar la página HTML, estilos y posibles scripts, manteniendo imagen devocional, respetando los textos, mejorando accesibilidad, rendimiento, SEO y consistencia visual."

  echo "$PROMPT" | tee -a "$LOG"
}
"""

output_path = os.path.join("ai-system", "agents", "divino-master", "run_divino_master.sh")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(script)

print(f"MASTER DIVINO COMPLETO creado OK en: {output_path}")
