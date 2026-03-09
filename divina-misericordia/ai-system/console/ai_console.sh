#!/bin/bash
# ==========================================
# AI SYSTEM v3 DIOS — CONTROL CENTER
# ==========================================

BASE="$(cd "$(dirname "$0")/.." && pwd)"
source "$BASE/recovery/state_manager.sh"

show_header() {
  clear
  echo "============================================"
  echo "   AI SYSTEM v3 DIOS — CONTROL CENTER      "
  echo "============================================"
  echo "  Proyecto : Web Mio Divina"
  echo "  Fecha    : $(date)"
  echo "  Reports  : $(ls $BASE/reports/ 2>/dev/null | wc -l) generados"
  echo "============================================"
}

show_recovery_alert() {
  if check_interrupted 2>/dev/null; then
    echo ""
    echo "  ⚠️  HAY UNA TAREA INTERRUMPIDA"
    echo "  Elige la opcion 8 para recuperar"
    echo ""
  fi
}

while true
do
  show_header
  show_recovery_alert

  echo "  1 — Auditoria web completa"
  echo "  2 — Optimizacion SEO"
  echo "  3 — Generar contenido SEO"
  echo "  4 — Ejecutar TODOS los agentes"
  echo "  5 — Ver informes generados"
  echo "  6 — Ver logs del sistema"
  echo "  7 — Piloto automatico (cada hora)"
  echo "  8 — Recuperar tarea interrumpida"
  echo "  9 — Ver estado del sistema"
  echo "  0 — Salir"
  echo ""
  read -p "  Elige opcion: " OPCION

  case $OPCION in
    1)
      echo "Ejecutando auditoria..."
      bash "$BASE/agents/audit-agent/run_audit.sh"
      read -p "Enter para continuar"
      ;;
    2)
      echo "Ejecutando SEO..."
      bash "$BASE/agents/seo-agent/run_seo.sh"
      read -p "Enter para continuar"
      ;;
    3)
      echo "Generando contenido..."
      bash "$BASE/agents/content-agent/run_content.sh"
      read -p "Enter para continuar"
      ;;
    4)
      echo "Ejecutando TODOS los agentes..."
      bash "$BASE/agents/audit-agent/run_audit.sh"
      bash "$BASE/agents/seo-agent/run_seo.sh"
      bash "$BASE/agents/content-agent/run_content.sh"
      echo "Todos completados"
      read -p "Enter para continuar"
      ;;
    5)
      echo ""
      echo "INFORMES DISPONIBLES:"
      ls -lht "$BASE/reports/" | head -20
      echo ""
      read -p "Nombre del informe a leer (o Enter para salir): " RNAME
      if [ -n "$RNAME" ]; then
        cat "$BASE/reports/$RNAME" | less
      fi
      ;;
    6)
      echo ""
      echo "LOGS DISPONIBLES:"
      ls -lh "$BASE/logs/"
      echo ""
      read -p "Log a ver (audit/seo/content): " LOGNAME
      if [ -f "$BASE/logs/$LOGNAME.log" ]; then
        tail -50 "$BASE/logs/$LOGNAME.log" | less
      else
        echo "Log no encontrado"
        sleep 1
      fi
      ;;
    7)
      echo "PILOTO AUTOMATICO ON — Ctrl+C para parar"
      echo "Ejecutara todos los agentes cada hora"
      CICLO=1
      while true; do
        echo ""
        echo "=== CICLO $CICLO — $(date) ==="
        bash "$BASE/agents/audit-agent/run_audit.sh"
        bash "$BASE/agents/seo-agent/run_seo.sh"
        bash "$BASE/agents/content-agent/run_content.sh"
        echo "Ciclo $CICLO completado. Proxima ejecucion en 60 min..."
        CICLO=$((CICLO + 1))
        sleep 3600
      done
      ;;
    8)
      echo ""
      echo "SISTEMA DE RECUPERACION"
      read_state
      echo ""
      read -p "Que agente recuperar? (audit/seo/content): " AGENT
      case $AGENT in
        audit) bash "$BASE/agents/audit-agent/run_audit.sh" ;;
        seo)   bash "$BASE/agents/seo-agent/run_seo.sh" ;;
        content) bash "$BASE/agents/content-agent/run_content.sh" ;;
        *) echo "Agente no reconocido" ;;
      esac
      read -p "Enter para continuar"
      ;;
    9)
      echo ""
      echo "ESTADO DEL SISTEMA:"
      echo "-------------------"
      echo "Reports: $(ls $BASE/reports/ 2>/dev/null | wc -l)"
      echo "Logs:"
      ls -lh "$BASE/logs/" 2>/dev/null
      echo ""
      echo "Ultimo estado:"
      read_state
      echo ""
      echo "Espacio en disco:"
      du -sh "$BASE/"
      read -p "Enter para continuar"
      ;;
    0)
      echo "Saliendo del sistema..."
      exit 0
      ;;
    *)
      echo "Opcion no valida"
      sleep 1
      ;;
  esac
done
