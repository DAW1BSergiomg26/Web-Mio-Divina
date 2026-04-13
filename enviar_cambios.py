#!/usr/bin/env python3
"""
🚀 ENVIAR_CAMBIOS.PY - SISTEMA DE DESPLIEGUE INTELIGENTE (NIVEL DIOS)
Asociación Apóstoles de la Divina Misericordia
-------------------------------------------------------------------
Características:
- 🛡️ Seguridad total vía .env y .gitignore
- 🧠 Clasificación automática (Conventional Commits)
- 📧 Notificaciones Profesionales con Diff Resumido
- ⚡ Control de spam y cambios vacíos
- ⚙️ Configurable mediante auto-deploy-config.json
"""

import os
import sys
import json
import smtplib
import subprocess
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# --- CONFIGURACIÓN Y CARGA DE ENTORNO ---
load_dotenv()
CONFIG_PATH = "auto-deploy-config.json"

def get_config():
    default_config = {
        "mode": "verbose",
        "silent_on_no_changes": True,
        "ai_enabled": True,
        "classification_rules": {
            "ui": [".css", "styles", "img/", "cursor.js", "particles.js"],
            "feat": ["public/js/", "logic", "biblia", "audio"],
            "fix": ["corregir", "fix", "patch", "error"],
            "docs": [".md", "README", "CHANGELOG", "docs/"],
            "chore": ["config", ".gitignore", "package.json", "scripts/"]
        }
    }
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
                return {**default_config, **json.load(f)}
        except Exception as e:
            print(f"⚠️ Error cargando config: {e}. Usando valores por defecto.")
    return default_config

config = get_config()
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# --- LÓGICA DE CLASIFICACIÓN Y GIT ---

def check_real_changes():
    """Verifica si hay cambios reales para evitar commits vacíos o spam."""
    try:
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, check=True, encoding='utf-8')
        return status.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Error verificando Git: {e}")
        return ""
    except UnicodeDecodeError:
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, check=True, encoding='latin-1')
        return status.stdout.strip()

def classify_changes(files):
    """Clasifica el tipo de commit basado en los archivos modificados."""
    rules = config.get("classification_rules", {})
    for commit_type, patterns in rules.items():
        if any(any(p in f for p in patterns) for f in files):
            return commit_type
    return "chore"

def get_git_data():
    """Recopila toda la información necesaria del repositorio."""
    status_raw = check_real_changes()
    if not status_raw:
        return None

    files = [line[3:].strip() for line in status_raw.splitlines()]
    
    try:
        diff = subprocess.check_output(["git", "diff"], text=True, encoding='utf-8')[:2000]
    except Exception:
        try:
            diff = subprocess.check_output(["git", "diff"], text=True, encoding='latin-1')[:2000]
        except Exception:
            diff = "No se pudo extraer el diff (posiblemente binario o codificación compleja)."

    branch = subprocess.check_output(["git", "branch", "--show-current"], text=True).strip()
    
    return {
        "files": files,
        "diff": diff,
        "branch": branch,
        "type": classify_changes(files),
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "count": len(files)
    }

# --- SISTEMA DE NOTIFICACIÓN ---

def build_professional_email(data, ai_summary):
    """Genera el cuerpo del email con el estilo profesional solicitado."""
    files_list = "\n".join([f"• {f}" for f in data['files'][:20]])
    if len(data['files']) > 20:
        files_list += f"\n... y {len(data['files']) - 20} archivos más."
    
    resumed_diff = "Cambios estructurales."
    for line in data['diff'].splitlines():
        if line.startswith('+') and not line.startswith('+++'):
            resumed_diff = line.strip()
            break

    return f"""📝 Actualización Automática - {data['branch']}
🕒 {data['timestamp']}

📌 Commit: {data['type']}(auto): {ai_summary[:60]}...

📁 Archivos modificados ({data['count']}):
{files_list}

✨ Resumen IA:
{ai_summary}

🔄 Diff resumido:
{resumed_diff}

════════════════════════════════════════════════════════════════
        ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA
                    «Jesús, confío en Ti»
════════════════════════════════════════════════════════════════
"""

def send_notification(content, subject):
    """Envía la notificación por email."""
    if not EMAIL_USER or not EMAIL_PASS:
        print("❌ Error: Credenciales de email no configuradas en .env")
        return False

    msg = MIMEMultipart()
    msg["From"] = EMAIL_USER
    msg["To"] = EMAIL_USER
    msg["Subject"] = subject
    msg.attach(MIMEText(content, "plain", "utf-8"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())
        return True
    except Exception as e:
        print(f"❌ Fallo al enviar email: {e}")
        return False

# --- ORQUESTADOR PRINCIPAL ---

def deploy(ai_summary=None):
    """Ejecuta el ciclo completo."""
    data = get_git_data()
    
    if not data:
        print("✨ Repositorio limpio.")
        return

    summary = ai_summary if ai_summary else f"Despliegue automático: {data['type']}"
    
    print(f"🔍 Detectados {data['count']} cambios ({data['type']}).")
    
    email_body = build_professional_email(data, summary)
    subject = f"📝 Actualización: {data['branch']} - {data['type']}"

    if send_notification(email_body, subject):
        print("✅ Notificación enviada.")
        try:
            commit_msg = f"{data['type']}(auto): {summary[:70]}"
            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", commit_msg], check=True)
            subprocess.run(["git", "push"], check=True)
            print(f"🌟 ¡Despliegue exitoso!")
        except Exception as e:
            print(f"❌ Error Git: {e}")
    else:
        print("🛑 Despliegue abortado por error en email.")

if __name__ == "__main__":
    deploy(sys.argv[1] if len(sys.argv) > 1 else None)
