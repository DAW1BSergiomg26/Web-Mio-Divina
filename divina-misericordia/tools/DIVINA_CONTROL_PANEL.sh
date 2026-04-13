#!/bin/bash
# ============================================================
#   ✨ DIVINA CONTROL PANEL ✨
#   Sistema Unificado de IA — La Divina Misericordia
#   Versión: OMEGA 1.0 — Todos los agentes en un solo cerebro
# ============================================================

# ─── COLORES Y ESTILOS ───────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GOLD='\033[0;33m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ─── CONFIGURACIÓN DE RUTAS ──────────────────────────────────
PROJECT_ROOT="/mnt/c/Users/astur/Desktop/Web Mio Divina/mi-app"
AI_SYSTEM="$PROJECT_ROOT/ai-system"
GOD_AGENT="$PROJECT_ROOT/god-ai-agent"
PUBLIC="$PROJECT_ROOT/public"
REPORTS="$AI_SYSTEM/reports"
STATE="$AI_SYSTEM/state"
LOGS="$AI_SYSTEM/logs"

# ─── LOG MAESTRO ─────────────────────────────────────────────
MASTER_LOG="$LOGS/divina_master_$(date +%Y%m%d_%H%M%S).log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# ─── FUNCIONES UTILITARIAS ───────────────────────────────────

banner() {
  clear
  echo -e "${GOLD}"
  echo "  ╔══════════════════════════════════════════════════════════╗"
  echo "  ║         ✨  DIVINA CONTROL PANEL  ✨                    ║"
  echo "  ║      Sistema Unificado de Inteligencia Artificial        ║"
  echo "  ║           La Divina Misericordia — Omega v1.0            ║"
  echo "  ╚══════════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
  echo -e "${DIM}  📅 $TIMESTAMP${RESET}"
  echo -e "${DIM}  📁 Proyecto: $PROJECT_ROOT${RESET}"
  echo ""
}

log() {
  echo -e "${DIM}[$(date +%H:%M:%S)]${RESET} $1"
  echo "[$(date +%H:%M:%S)] $1" >> "$MASTER_LOG" 2>/dev/null
}

success() { echo -e "${GREEN}  ✅  $1${RESET}"; log "✅ $1"; }
error()   { echo -e "${RED}  ❌  $1${RESET}";   log "❌ $1"; }
info()    { echo -e "${CYAN}  ℹ️  $1${RESET}";   log "ℹ️ $1"; }
warn()    { echo -e "${YELLOW}  ⚠️  $1${RESET}";  log "⚠️ $1"; }
step()    { echo -e "${PURPLE}  🔷  $1${RESET}";  log "🔷 $1"; }

run_script() {
  local script="$1"
  local name="$2"
  local dir="${3:-$PROJECT_ROOT}"

  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  step "Ejecutando: ${BOLD}$name${RESET}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

  if [ -f "$dir/$script" ]; then
    chmod +x "$dir/$script" 2>/dev/null
    cd "$dir" && bash "$script" 2>&1 | tee -a "$MASTER_LOG"
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
      success "$name completado"
    else
      error "$name terminó con errores (continuando...)"
    fi
  else
    warn "$name no encontrado en: $dir/$script"
  fi
}

progress_bar() {
  local task="$1"
  local total=20
  echo -ne "${CYAN}  ⏳ $task: [${RESET}"
  for i in $(seq 1 $total); do
    echo -ne "${GREEN}█${RESET}"
    sleep 0.05
  done
  echo -e "${CYAN}] Listo${RESET}"
}

# ─── VERIFICAR ENTORNO ───────────────────────────────────────
check_environment() {
  echo -e "${YELLOW}  🔍 Verificando entorno del proyecto...${RESET}"
  echo ""

  if [ ! -d "$PROJECT_ROOT" ]; then
    error "Directorio del proyecto no encontrado: $PROJECT_ROOT"
    error "Asegúrate de ejecutar desde WSL con la ruta correcta."
    exit 1
  fi

  mkdir -p "$LOGS" "$REPORTS" "$STATE" 2>/dev/null

  local checks=(
    "$PROJECT_ROOT/pipeline_seo_opencode.sh:Pipeline SEO"
    "$PROJECT_ROOT/pipeline_completo_opencode.sh:Pipeline Completo"
    "$PROJECT_ROOT/run_super_agent.sh:Super Agente"
    "$PROJECT_ROOT/run_ai_agent.sh:AI Agente"
    "$GOD_AGENT/run_god_agent.sh:God Agente"
    "$AI_SYSTEM/run_divino_master_safe.sh:Divino Master"
  )

  echo -e "${WHITE}  Estado de componentes:${RESET}"
  for check in "${checks[@]}"; do
    local path="${check%%:*}"
    local name="${check##*:}"
    if [ -f "$path" ]; then
      echo -e "    ${GREEN}✓${RESET} $name"
    else
      echo -e "    ${YELLOW}?${RESET} $name ${DIM}(no encontrado — se omitirá)${RESET}"
    fi
  done
  echo ""
}

# ─── MENÚ PRINCIPAL ──────────────────────────────────────────
main_menu() {
  banner
  echo -e "${WHITE}${BOLD}  ¿Qué deseas hacer hoy?${RESET}"
  echo ""
  echo -e "  ${GOLD}[1]${RESET} ${WHITE}🚀 EJECUTAR TODO${RESET}           ${DIM}— Activa todos los agentes en secuencia${RESET}"
  echo -e "  ${GOLD}[2]${RESET} ${WHITE}🔍 Analizar web${RESET}            ${DIM}— Auditoría completa del sitio${RESET}"
  echo -e "  ${GOLD}[3]${RESET} ${WHITE}📈 Optimizar SEO${RESET}           ${DIM}— Pipeline SEO + keywords${RESET}"
  echo -e "  ${GOLD}[4]${RESET} ${WHITE}✍️  Generar contenido${RESET}       ${DIM}— IA para nuevas páginas y textos${RESET}"
  echo -e "  ${GOLD}[5]${RESET} ${WHITE}🤖 Ejecutar agentes${RESET}        ${DIM}— Super Agente + AI Agente${RESET}"
  echo -e "  ${GOLD}[6]${RESET} ${WHITE}⚡ Pipeline completo${RESET}       ${DIM}— Optimización estructural total${RESET}"
  echo -e "  ${GOLD}[7]${RESET} ${WHITE}🛡️  God Agent${RESET}              ${DIM}— Control global del sistema${RESET}"
  echo -e "  ${GOLD}[8]${RESET} ${WHITE}📊 Ver reportes${RESET}            ${DIM}— Estado y progreso del proyecto${RESET}"
  echo -e "  ${GOLD}[9]${RESET} ${WHITE}🌐 Ver páginas web${RESET}         ${DIM}— Lista de páginas en /public${RESET}"
  echo -e "  ${GOLD}[0]${RESET} ${WHITE}❌ Salir${RESET}"
  echo ""
  echo -ne "${GOLD}  divina > ${RESET}"
  read choice
  handle_choice "$choice"
}

# ─── MANEJADOR DE OPCIONES ───────────────────────────────────
handle_choice() {
  case "$1" in
    1) run_all ;;
    2) run_audit ;;
    3) run_seo ;;
    4) run_content ;;
    5) run_agents ;;
    6) run_pipeline_completo ;;
    7) run_god_agent ;;
    8) show_reports ;;
    9) list_pages ;;
    0) farewell ;;
    *) warn "Opción no válida"; sleep 1; main_menu ;;
  esac
}

# ─── [1] EJECUTAR TODO ───────────────────────────────────────
run_all() {
  banner
  echo -e "${GOLD}${BOLD}  🚀 MODO OMEGA — TODOS LOS AGENTES ACTIVOS${RESET}"
  echo -e "${DIM}  Ejecutando el sistema completo de IA en secuencia óptima...${RESET}"
  echo ""

  local START_TIME=$(date +%s)

  # CAPA 1: Pipelines
  echo -e "${PURPLE}  ═══ CAPA 1: PIPELINES ═══${RESET}"
  run_script "pipeline_seo_opencode.sh"      "Pipeline SEO"       "$PROJECT_ROOT"
  run_script "pipeline_completo_opencode.sh" "Pipeline Completo"  "$PROJECT_ROOT"

  # CAPA 2: Agentes coordinados
  echo -e "${PURPLE}  ═══ CAPA 2: AGENTES ═══${RESET}"
  run_script "run_super_agent.sh" "Super Agente"  "$PROJECT_ROOT"
  run_script "run_ai_agent.sh"    "AI Agente"     "$PROJECT_ROOT"

  # CAPA 3: God Agent
  echo -e "${PURPLE}  ═══ CAPA 3: GOD AGENT ═══${RESET}"
  run_script "run_god_agent.sh" "God Agente" "$GOD_AGENT"

  # CAPA 4: Divino Master
  echo -e "${PURPLE}  ═══ CAPA 4: DIVINO MASTER ═══${RESET}"
  run_script "run_divino_master_safe.sh" "Divino Master" "$AI_SYSTEM"

  # Resumen final
  local END_TIME=$(date +%s)
  local DURATION=$((END_TIME - START_TIME))

  echo ""
  echo -e "${GOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${GREEN}${BOLD}  ✨ SISTEMA OMEGA COMPLETADO${RESET}"
  echo -e "${GREEN}  ⏱️  Tiempo total: ${DURATION}s${RESET}"
  echo -e "${GREEN}  📋 Log guardado: $MASTER_LOG${RESET}"
  echo -e "${GOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""

  # Guardar estado
  cat > "$STATE/last_run.json" <<EOF
{
  "last_run": "$(date -Iseconds)",
  "duration_seconds": $DURATION,
  "mode": "OMEGA_ALL",
  "status": "completed",
  "agents": ["pipeline_seo", "pipeline_completo", "super_agent", "ai_agent", "god_agent", "divino_master"]
}
EOF

  pause_menu
}

# ─── [2] AUDITORÍA ───────────────────────────────────────────
run_audit() {
  banner
  echo -e "${CYAN}${BOLD}  🔍 AUDITORÍA COMPLETA DEL SITIO${RESET}"
  echo ""

  info "Analizando páginas HTML en /public..."
  echo ""

  local page_count=$(ls "$PUBLIC"/*.html 2>/dev/null | wc -l)
  info "Páginas encontradas: $page_count"

  echo ""
  echo -e "${WHITE}  📋 Verificación de archivos clave:${RESET}"
  for file in index.html sitemap.xml robots.txt; do
    if [ -f "$PUBLIC/$file" ]; then
      local size=$(du -h "$PUBLIC/$file" 2>/dev/null | cut -f1)
      success "$file — ${size}B"
    else
      error "$file — FALTANTE"
    fi
  done

  echo ""
  echo -e "${WHITE}  🤖 Ejecutando audit-agent...${RESET}"
  run_script "run_divino_master_safe.sh" "Audit Agent" "$AI_SYSTEM"

  pause_menu
}

# ─── [3] SEO ─────────────────────────────────────────────────
run_seo() {
  banner
  echo -e "${CYAN}${BOLD}  📈 OPTIMIZACIÓN SEO${RESET}"
  echo ""
  run_script "pipeline_seo_opencode.sh" "Pipeline SEO" "$PROJECT_ROOT"
  pause_menu
}

# ─── [4] CONTENIDO ───────────────────────────────────────────
run_content() {
  banner
  echo -e "${CYAN}${BOLD}  ✍️ GENERACIÓN DE CONTENIDO IA${RESET}"
  echo ""
  run_script "pipeline_completo_opencode.sh" "Pipeline Contenido" "$PROJECT_ROOT"
  pause_menu
}

# ─── [5] AGENTES ─────────────────────────────────────────────
run_agents() {
  banner
  echo -e "${CYAN}${BOLD}  🤖 EJECUTANDO SUPER AGENTE + AI AGENTE${RESET}"
  echo ""
  run_script "run_super_agent.sh" "Super Agente" "$PROJECT_ROOT"
  run_script "run_ai_agent.sh"    "AI Agente"    "$PROJECT_ROOT"
  pause_menu
}

# ─── [6] PIPELINE COMPLETO ───────────────────────────────────
run_pipeline_completo() {
  banner
  echo -e "${CYAN}${BOLD}  ⚡ PIPELINE COMPLETO${RESET}"
  echo ""
  run_script "pipeline_completo_opencode.sh" "Pipeline Completo" "$PROJECT_ROOT"
  pause_menu
}

# ─── [7] GOD AGENT ───────────────────────────────────────────
run_god_agent() {
  banner
  echo -e "${GOLD}${BOLD}  ⚡ GOD AGENT — CONTROL GLOBAL${RESET}"
  echo ""
  run_script "run_god_agent.sh" "God Agente" "$GOD_AGENT"
  pause_menu
}

# ─── [8] REPORTES ────────────────────────────────────────────
show_reports() {
  banner
  echo -e "${CYAN}${BOLD}  📊 REPORTES Y ESTADO DEL SISTEMA${RESET}"
  echo ""

  if [ -f "$STATE/divino_progress.json" ]; then
    echo -e "${WHITE}  📈 Progreso Divino Master:${RESET}"
    cat "$STATE/divino_progress.json"
    echo ""
  fi

  if [ -f "$STATE/last_run.json" ]; then
    echo -e "${WHITE}  ⏱️  Última ejecución:${RESET}"
    cat "$STATE/last_run.json"
    echo ""
  fi

  if [ -f "$REPORTS/divino_historial.md" ]; then
    echo -e "${WHITE}  📜 Historial (últimas 20 líneas):${RESET}"
    tail -20 "$REPORTS/divino_historial.md"
    echo ""
  fi

  echo -e "${WHITE}  📋 Logs disponibles:${RESET}"
  ls -lh "$LOGS"/*.log 2>/dev/null || info "No hay logs aún"

  pause_menu
}

# ─── [9] LISTAR PÁGINAS ──────────────────────────────────────
list_pages() {
  banner
  echo -e "${CYAN}${BOLD}  🌐 PÁGINAS WEB DEL SITIO${RESET}"
  echo ""

  if [ -d "$PUBLIC" ]; then
    echo -e "${WHITE}  📁 Archivos en /public:${RESET}"
    echo ""
    local count=0
    for f in "$PUBLIC"/*.html; do
      if [ -f "$f" ]; then
        local name=$(basename "$f")
        local size=$(du -h "$f" 2>/dev/null | cut -f1)
        printf "    ${GREEN}%-40s${RESET} ${DIM}%s${RESET}\n" "$name" "${size}B"
        ((count++))
      fi
    done
    echo ""
    info "Total: $count páginas HTML"
  else
    error "Carpeta /public no encontrada"
  fi

  pause_menu
}

# ─── PAUSA Y VOLVER AL MENÚ ──────────────────────────────────
pause_menu() {
  echo ""
  echo -ne "${DIM}  Presiona Enter para volver al menú...${RESET}"
  read
  main_menu
}

# ─── DESPEDIDA ───────────────────────────────────────────────
farewell() {
  echo ""
  echo -e "${GOLD}"
  echo "  ╔══════════════════════════════════════════════════╗"
  echo "  ║   ✨ Que la Divina Misericordia guíe tu código  ║"
  echo "  ║         Hasta la próxima, programador 🙏          ║"
  echo "  ╚══════════════════════════════════════════════════╝"
  echo -e "${RESET}"
  exit 0
}

# ─── PUNTO DE ENTRADA ────────────────────────────────────────
check_environment
main_menu
