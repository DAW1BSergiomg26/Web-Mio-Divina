#!/bin/bash
# state_manager — NO define BASE, la hereda del script que lo sourcea

save_state() {
  local TASK="$1"
  local STATUS="$2"
  local STEP="$3"
  local TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
  mkdir -p "$BASE/state"
  echo "{
  \"task\": \"$TASK\",
  \"status\": \"$STATUS\",
  \"step\": \"$STEP\",
  \"timestamp\": \"$TIMESTAMP\"
}" > "$BASE/state/current_task.json"
  echo "[$TIMESTAMP] TASK=$TASK STATUS=$STATUS STEP=$STEP" >> "$BASE/state/progress.log"
  echo "Estado guardado: $TASK — $STATUS"
}

read_state() {
  if [ -f "$BASE/state/current_task.json" ]; then
    echo "Estado anterior:"
    cat "$BASE/state/current_task.json"
    return 0
  else
    echo "Sin estado previo"
    return 1
  fi
}

clear_state() {
  local TASK="$1"
  local TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
  mkdir -p "$BASE/state"
  echo "{
  \"task\": \"$TASK\",
  \"status\": \"COMPLETED\",
  \"timestamp\": \"$TIMESTAMP\"
}" > "$BASE/state/current_task.json"
  echo "[$TIMESTAMP] TASK=$TASK STATUS=COMPLETED" >> "$BASE/state/progress.log"
  echo "Tarea completada: $TASK"
}

check_interrupted() {
  if [ -f "$BASE/state/current_task.json" ]; then
    local STATUS=$(grep '"status"' "$BASE/state/current_task.json" | cut -d'"' -f4)
    if [ "$STATUS" = "RUNNING" ]; then
      echo "TAREA INTERRUMPIDA DETECTADA:"
      cat "$BASE/state/current_task.json"
      return 0
    fi
  fi
  return 1
}
