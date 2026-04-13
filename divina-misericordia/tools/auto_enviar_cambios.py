#!/usr/bin/env python3
"""
Script para enviar resumen de cambios por correo
Automáticamente detecta cambios en Git y envía resumen detallado
"""

import smtplib
import subprocess
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

REMITENTE = "menu2informatico@gmail.com"
DESTINATARIO = "menu2informatico@gmail.com"
PASSWORD = "orqu qkzr skzt gsye"


def obtener_cambios():
    """Obtener los cambios pendientes del repositorio Git"""
    try:
        # Obtener estado
        status = subprocess.check_output(["git", "status", "--short"], text=True)

        # Obtener diff si hay cambios
        diff = ""
        if status.strip():
            diff = subprocess.check_output(["git", "diff"], text=True)[:3000]

        # Obtener último commit
        last_commit = subprocess.check_output(
            ["git", "log", "-1", "--oneline"], text=True
        )

        # Obtener rama actual
        branch = subprocess.check_output(
            ["git", "branch", "--show-current"], text=True
        ).strip()

        return {
            "status": status,
            "diff": diff,
            "last_commit": last_commit,
            "branch": branch,
            "hay_cambios": bool(status.strip()),
        }
    except Exception as e:
        return {"error": str(e), "hay_cambios": False}


def enviar_correo(detalles_adicionales=""):
    """Enviar correo con los cambios del repositorio"""
    ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    cambios = obtener_cambios()

    if "error" in cambios:
        contenido = f"Error al obtener cambios: {cambios['error']}"
    elif not cambios.get("hay_cambios"):
        print("No hay cambios pendientes para enviar")
        return False
    else:
        contenido = f"""
════════════════════════════════════════════════════════════════
        📋 RESUMEN DE CAMBIOS - WEB DIVINA MISERICORDIA
════════════════════════════════════════════════════════════════

Fecha: {ahora}
Rama: {cambios["branch"]}
Último commit: {cambios["last_commit"].strip()}

───────────────────────────────────────────────────────────────
📝 CAMBIOS PENDIENTES:
───────────────────────────────────────────────────────────────

{cambios["status"]}

───────────────────────────────────────────────────────────────
📄 DETALLES:
───────────────────────────────────────────────────────────────

{detalles_adicionales if detalles_adicionales else "Sin detalles adicionales."}

───────────────────────────────────────────────────────────────
🔄 DIFF (primeros 3000 caracteres):
───────────────────────────────────────────────────────────────

{cambios["diff"][:3000] if cambios["diff"] else "Sin diff disponible"}

───────────────────────────────────────────────────────────────
🌐 ENLACES
───────────────────────────────────────────────────────────────

GitHub: https://github.com/DAW1BSergiomg26/Web-Mio-Divina
Rama: {cambios["branch"]}

════════════════════════════════════════════════════════════════
        ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA
                    «Jesús, confío en Ti»
════════════════════════════════════════════════════════════════
"""

    msg = MIMEMultipart()
    msg["From"] = REMITENTE
    msg["To"] = DESTINATARIO
    msg["Subject"] = f"📝 Cambios: {cambios['branch']} - {ahora}"
    msg.attach(MIMEText(contenido, "plain", "utf-8"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(REMITENTE, PASSWORD)
        server.sendmail(REMITENTE, DESTINATARIO, msg.as_string())
        server.quit()
        print("✅ Correo enviado exitosamente!")
        return True
    except Exception as e:
        print(f"❌ Error al enviar correo: {e}")
        return False


if __name__ == "__main__":
    import sys

    detalles = sys.argv[1] if len(sys.argv) > 1 else ""
    enviar_correo(detalles)
