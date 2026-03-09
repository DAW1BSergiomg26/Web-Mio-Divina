#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║         ✨  DIVINA CONTROL PANEL  — OMEGA v2.0  ✨              ║
# ║      Sistema Unificado de IA — La Divina Misericordia           ║
# ║      Proyecto: divina-misericordia                               ║
# ╚══════════════════════════════════════════════════════════════════╝

# ─── COLORES ────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; PURPLE='\033[0;35m'; CYAN='\033[0;36m'
WHITE='\033[1;37m'; GOLD='\033[0;33m'; BOLD='\033[1m'
DIM='\033[2m'; RESET='\033[0m'

# ─── RUTAS ──────────────────────────────────────────────────────────
PROJECT_ROOT="/mnt/c/Users/astur/Desktop/Web Mio Divina/divina-misericordia"
AI_SYSTEM="$PROJECT_ROOT/ai-system"
GOD_AGENT="$PROJECT_ROOT/god-ai-agent"
PUBLIC="$PROJECT_ROOT/public"
REPORTS="$AI_SYSTEM/reports"
STATE="$AI_SYSTEM/state"
LOGS="$AI_SYSTEM/logs"
MASTER_LOG="$LOGS/divina_master_$(date +%Y%m%d_%H%M%S).log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── UTILIDADES ─────────────────────────────────────────────────────
banner() {
  clear
  echo -e "${GOLD}"
  echo "  ╔════════════════════════════════════════════════════════════╗"
  echo "  ║           ✨  DIVINA CONTROL PANEL  ✨                    ║"
  echo "  ║        Sistema Unificado de Inteligencia Artificial         ║"
  echo "  ║          La Divina Misericordia — Omega v2.0               ║"
  echo "  ╚════════════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
  echo -e "  ${DIM}📅 $TIMESTAMP${RESET}"
  echo -e "  ${DIM}📁 $PROJECT_ROOT${RESET}"
  echo ""
}

log()     { echo "[$(date +%H:%M:%S)] $1" >> "$MASTER_LOG" 2>/dev/null; }
success() { echo -e "${GREEN}  ✅  $1${RESET}"; log "✅ $1"; }
error()   { echo -e "${RED}  ❌  $1${RESET}";   log "❌ $1"; }
info()    { echo -e "${CYAN}  ℹ️   $1${RESET}";  log "ℹ️ $1"; }
warn()    { echo -e "${YELLOW}  ⚠️  $1${RESET}"; log "⚠️ $1"; }
step()    { echo -e "${PURPLE}  🔷  ${BOLD}$1${RESET}"; log "🔷 $1"; }
divider() { echo -e "${BLUE}  ────────────────────────────────────────────────────${RESET}"; }

run_script() {
  local script="$1" name="$2" dir="${3:-$PROJECT_ROOT}"
  echo ""; divider
  step "Ejecutando: $name"
  divider
  if [ -f "$dir/$script" ]; then
    chmod +x "$dir/$script" 2>/dev/null
    cd "$dir" && bash "$script" 2>&1 | tee -a "$MASTER_LOG"
    [ ${PIPESTATUS[0]} -eq 0 ] && success "$name completado" || error "$name terminó con errores"
  else
    warn "$name no encontrado: $dir/$script"
  fi
}

pause_menu() {
  echo ""; echo -ne "${DIM}  Pulsa Enter para volver al menú...${RESET}"; read
  main_menu
}

# ─── VERIFICAR ENTORNO ──────────────────────────────────────────────
check_environment() {
  echo -e "${YELLOW}  🔍 Verificando proyecto divina-misericordia...${RESET}"; echo ""

  if [ ! -d "$PROJECT_ROOT" ]; then
    error "Proyecto no encontrado: $PROJECT_ROOT"
    echo ""
    echo -e "${YELLOW}  💡 Rutas disponibles:${RESET}"
    ls "/mnt/c/Users/astur/Desktop/Web Mio Divina/" 2>/dev/null || echo "     (no accesible)"
    exit 1
  fi

  mkdir -p "$LOGS" "$REPORTS" "$STATE" 2>/dev/null

  local components=(
    "$PROJECT_ROOT/pipeline_seo_opencode.sh:Pipeline SEO"
    "$PROJECT_ROOT/pipeline_completo_opencode.sh:Pipeline Completo"
    "$PROJECT_ROOT/run_super_agent.sh:Super Agente"
    "$PROJECT_ROOT/run_ai_agent.sh:AI Agente"
    "$GOD_AGENT/run_god_agent.sh:God Agente"
    "$AI_SYSTEM/run_divino_master_safe.sh:Divino Master"
    "$PUBLIC/index.html:Web — index.html"
    "$SCRIPT_DIR/transformar_web.py:Transformador Web"
  )

  echo -e "${WHITE}  📋 Estado de componentes:${RESET}"
  for c in "${components[@]}"; do
    local path="${c%%:*}" name="${c##*:}"
    [ -f "$path" ] && echo -e "    ${GREEN}✓${RESET} $name" || echo -e "    ${YELLOW}○${RESET} $name ${DIM}(no encontrado)${RESET}"
  done; echo ""
}

# ─── MENÚ PRINCIPAL ─────────────────────────────────────────────────
main_menu() {
  banner
  echo -e "${WHITE}${BOLD}  ¿Qué deseas hacer hoy?${RESET}"; echo ""
  echo -e "  ${GOLD}[1]${RESET} ${WHITE}🚀 EJECUTAR TODO${RESET}              ${DIM}— Todas las IAs en secuencia${RESET}"
  echo -e "  ${GOLD}[2]${RESET} ${WHITE}🎨 TRANSFORMAR WEB${RESET}            ${DIM}— Copiar diseño del index a todas las páginas${RESET}"
  echo -e "  ${GOLD}[3]${RESET} ${WHITE}🔍 Analizar web${RESET}               ${DIM}— Auditoría completa del sitio${RESET}"
  echo -e "  ${GOLD}[4]${RESET} ${WHITE}📈 Optimizar SEO${RESET}              ${DIM}— Pipeline SEO + keywords${RESET}"
  echo -e "  ${GOLD}[5]${RESET} ${WHITE}✍️  Generar contenido${RESET}          ${DIM}— IA para nuevas páginas y textos${RESET}"
  echo -e "  ${GOLD}[6]${RESET} ${WHITE}🤖 Ejecutar agentes${RESET}           ${DIM}— Super Agente + AI Agente${RESET}"
  echo -e "  ${GOLD}[7]${RESET} ${WHITE}⚡ Pipeline completo${RESET}          ${DIM}— Optimización estructural total${RESET}"
  echo -e "  ${GOLD}[8]${RESET} ${WHITE}🛡️  God Agent${RESET}                 ${DIM}— Control global del sistema${RESET}"
  echo -e "  ${GOLD}[9]${RESET} ${WHITE}📊 Ver reportes${RESET}               ${DIM}— Estado y progreso del proyecto${RESET}"
  echo -e "  ${GOLD}[w]${RESET} ${WHITE}🌐 Ver páginas web${RESET}            ${DIM}— Lista de páginas en /public${RESET}"
  echo -e "  ${GOLD}[0]${RESET} ${WHITE}❌ Salir${RESET}"
  echo ""
  echo -ne "${GOLD}  divina > ${RESET}"
  read choice
  handle_choice "$choice"
}

handle_choice() {
  case "$1" in
    1) run_all ;;
    2) transform_web ;;
    3) run_audit ;;
    4) run_seo ;;
    5) run_content ;;
    6) run_agents ;;
    7) run_pipeline_completo ;;
    8) run_god_agent ;;
    9) show_reports ;;
    w|W) list_pages ;;
    0) farewell ;;
    *) warn "Opción no válida"; sleep 1; main_menu ;;
  esac
}

# ─── [1] EJECUTAR TODO ──────────────────────────────────────────────
run_all() {
  banner
  echo -e "${GOLD}${BOLD}  🚀 MODO OMEGA — TODAS LAS IAs ACTIVAS${RESET}"
  echo -e "${DIM}  Ejecutando sistema completo en secuencia óptima...${RESET}"; echo ""
  local T0=$(date +%s)

  echo -e "${PURPLE}  ══ CAPA 0: TRANSFORMACIÓN WEB ══${RESET}"
  _do_transform_web

  echo -e "${PURPLE}  ══ CAPA 1: PIPELINES ══${RESET}"
  run_script "pipeline_seo_opencode.sh"      "Pipeline SEO"      "$PROJECT_ROOT"
  run_script "pipeline_completo_opencode.sh" "Pipeline Completo" "$PROJECT_ROOT"

  echo -e "${PURPLE}  ══ CAPA 2: AGENTES ══${RESET}"
  run_script "run_super_agent.sh" "Super Agente" "$PROJECT_ROOT"
  run_script "run_ai_agent.sh"    "AI Agente"    "$PROJECT_ROOT"

  echo -e "${PURPLE}  ══ CAPA 3: GOD AGENT ══${RESET}"
  run_script "run_god_agent.sh" "God Agente" "$GOD_AGENT"

  echo -e "${PURPLE}  ══ CAPA 4: DIVINO MASTER ══${RESET}"
  run_script "run_divino_master_safe.sh" "Divino Master" "$AI_SYSTEM"

  local DUR=$(( $(date +%s) - T0 ))
  echo ""
  echo -e "${GOLD}  ════════════════════════════════════════════════════${RESET}"
  echo -e "${GREEN}${BOLD}  ✨ SISTEMA OMEGA COMPLETADO en ${DUR}s${RESET}"
  echo -e "${GREEN}  📋 Log: $MASTER_LOG${RESET}"
  echo -e "${GOLD}  ════════════════════════════════════════════════════${RESET}"
  echo ""

  cat > "$STATE/last_run.json" <<EOF
{
  "last_run": "$(date -Iseconds)",
  "duration_seconds": $DUR,
  "mode": "OMEGA_ALL",
  "status": "completed"
}
EOF
  pause_menu
}

# ─── [2] TRANSFORMAR WEB ────────────────────────────────────────────
transform_web() {
  banner
  echo -e "${GOLD}${BOLD}  🎨 TRANSFORMADOR WEB — DISEÑO SAGRADO${RESET}"
  echo -e "${DIM}  Aplica el diseño del index.html a todas las páginas${RESET}"; echo ""
  _do_transform_web
  pause_menu
}

_do_transform_web() {
  # Buscar transformar_web.py (en la misma carpeta que este script)
  local PY_SCRIPT=""
  local candidates=(
    "$SCRIPT_DIR/transformar_web.py"
    "$PROJECT_ROOT/transformar_web.py"
    "/mnt/c/Users/astur/Desktop/transformar_web.py"
  )
  for c in "${candidates[@]}"; do
    [ -f "$c" ] && PY_SCRIPT="$c" && break
  done

  if [ -z "$PY_SCRIPT" ]; then
    error "No se encontró transformar_web.py"
    warn "Coloca transformar_web.py junto a DIVINA_CONTROL_PANEL.sh"
    return
  fi

  if command -v python3 &>/dev/null; then
    step "Ejecutando transformar_web.py..."
    python3 "$PY_SCRIPT" 2>&1 | tee -a "$MASTER_LOG"
    [ ${PIPESTATUS[0]} -eq 0 ] && success "Transformación web completada" || error "Error en la transformación"
  elif command -v python &>/dev/null; then
    step "Ejecutando transformar_web.py (python)..."
    python "$PY_SCRIPT" 2>&1 | tee -a "$MASTER_LOG"
    [ ${PIPESTATUS[0]} -eq 0 ] && success "Transformación web completada" || error "Error en la transformación"
  else
    error "Python no está instalado o no está en el PATH"
    info "Instala Python 3: sudo apt install python3"
  fi
}

# ─── [3] AUDITORÍA ──────────────────────────────────────────────────
run_audit() {
  banner
  echo -e "${CYAN}${BOLD}  🔍 AUDITORÍA DEL SITIO${RESET}"; echo ""
  info "Verificando archivos clave..."
  for f in index.html sitemap.xml robots.txt; do
    [ -f "$PUBLIC/$f" ] && success "$f — $(du -h "$PUBLIC/$f" 2>/dev/null | cut -f1)B" || error "$f — FALTANTE"
  done
  echo ""
  local page_count=$(ls "$PUBLIC"/*.html 2>/dev/null | wc -l)
  info "Total páginas HTML: $page_count"
  echo ""
  run_script "run_divino_master_safe.sh" "Audit Agent" "$AI_SYSTEM"
  pause_menu
}

# ─── [4] SEO ────────────────────────────────────────────────────────
run_seo() {
  banner; echo -e "${CYAN}${BOLD}  📈 OPTIMIZACIÓN SEO${RESET}"; echo ""
  run_script "pipeline_seo_opencode.sh" "Pipeline SEO" "$PROJECT_ROOT"
  pause_menu
}

# ─── [5] CONTENIDO ──────────────────────────────────────────────────
run_content() {
  banner; echo -e "${CYAN}${BOLD}  ✍️  GENERACIÓN DE CONTENIDO${RESET}"; echo ""
  run_script "pipeline_completo_opencode.sh" "Pipeline Contenido" "$PROJECT_ROOT"
  pause_menu
}

# ─── [6] AGENTES ────────────────────────────────────────────────────
run_agents() {
  banner; echo -e "${CYAN}${BOLD}  🤖 SUPER AGENTE + AI AGENTE${RESET}"; echo ""
  run_script "run_super_agent.sh" "Super Agente" "$PROJECT_ROOT"
  run_script "run_ai_agent.sh"    "AI Agente"    "$PROJECT_ROOT"
  pause_menu
}

# ─── [7] PIPELINE COMPLETO ──────────────────────────────────────────
run_pipeline_completo() {
  banner; echo -e "${CYAN}${BOLD}  ⚡ PIPELINE COMPLETO${RESET}"; echo ""
  run_script "pipeline_completo_opencode.sh" "Pipeline Completo" "$PROJECT_ROOT"
  pause_menu
}

# ─── [8] GOD AGENT ──────────────────────────────────────────────────
run_god_agent() {
  banner; echo -e "${GOLD}${BOLD}  ⚡ GOD AGENT — CONTROL GLOBAL${RESET}"; echo ""
  run_script "run_god_agent.sh" "God Agente" "$GOD_AGENT"
  pause_menu
}

# ─── [9] REPORTES ───────────────────────────────────────────────────
show_reports() {
  banner; echo -e "${CYAN}${BOLD}  📊 REPORTES Y ESTADO${RESET}"; echo ""
  [ -f "$STATE/last_run.json" ] && { echo -e "${WHITE}  ⏱️  Última ejecución:${RESET}"; cat "$STATE/last_run.json"; echo ""; }
  [ -f "$STATE/divino_progress.json" ] && { echo -e "${WHITE}  📈 Progreso:${RESET}"; cat "$STATE/divino_progress.json"; echo ""; }
  [ -f "$REPORTS/divino_historial.md" ] && { echo -e "${WHITE}  📜 Historial (últimas 15 líneas):${RESET}"; tail -15 "$REPORTS/divino_historial.md"; echo ""; }
  echo -e "${WHITE}  📋 Logs:${RESET}"; ls -lh "$LOGS/"*.log 2>/dev/null || info "No hay logs aún"
  pause_menu
}

# ─── [w] PÁGINAS ────────────────────────────────────────────────────
list_pages() {
  banner; echo -e "${CYAN}${BOLD}  🌐 PÁGINAS WEB${RESET}"; echo ""
  if [ -d "$PUBLIC" ]; then
    local count=0
    for f in "$PUBLIC"/*.html; do
      [ -f "$f" ] || continue
      local name=$(basename "$f") size=$(du -h "$f" 2>/dev/null | cut -f1)
      printf "    ${GREEN}%-44s${RESET} ${DIM}%s${RESET}\n" "$name" "${size}B"
      ((count++))
    done
    echo ""; info "Total: $count páginas HTML"
  else
    error "Carpeta public no encontrada"
  fi
  pause_menu
}

# ─── DESPEDIDA ──────────────────────────────────────────────────────
farewell() {
  echo -e "${GOLD}"
  echo "  ╔══════════════════════════════════════════════════════╗"
  echo "  ║   ✨ Que la Divina Misericordia guíe tu código  ✨  ║"
  echo "  ║           Hasta la próxima, programador 🙏            ║"
  echo "  ╚══════════════════════════════════════════════════════╝"
  echo -e "${RESET}"; exit 0
}

# ─── INICIO ─────────────────────────────────────────────────────────
check_environment
main_menu
