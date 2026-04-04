#!/usr/bin/env python3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

REMITENTE = "menu2informatico@gmail.com"
DESTINATARIO = "menu2informatico@gmail.com"
PASSWORD = "orqu qkzr skzt gsye"

ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

contenido = f"""
═══════════════════════════════════════════════════════════════════
        💾 RESPALDO DE SEGURIDAD - WEB DIVINA MISERICORDIA
═══════════════════════════════════════════════════════════════════

Fecha: {ahora}

──────────────────────────────────────────────────────────────────
✅ PUNTO DE RESTAURACIÓN CREADO
──────────────────────────────────────────────────────────────────

Rama: musica-y-mejoras-004
Commit: 3ea2b22

──────────────────────────────────────────────────────────────────
📊 ESTADO ACTUAL
──────────────────────────────────────────────────────────────────

✓ 181 pistas de música
✓ 14 categorías
✓ Reproductor con favoritos, shuffle, repeat
✓ Panel admin actualizado
✓ 27 páginas HTML

──────────────────────────────────────────────────────────────────
🔄 CÓMO RESTAURAR SI ALGO FALLA
──────────────────────────────────────────────────────────────────

Si algo se daña, puedes volver a este punto:

1. En GitHub:
   - Ir a https://github.com/DAW1BSergiomg26/Web-Mio-Divina
   - Buscar la rama "musica-y-mejoras-004"
   - Click en "Compare" o "Merge"

2. En tu PC (WSL):
   git checkout musica-y-mejoras-004

──────────────────────────────────────────────────────────────────
📂 RAMAS ACTIVAS
──────────────────────────────────────────────────────────────────

- main          → Rama principal (última versión)
- musica-y-mejoras-004 → Este respaldo

──────────────────────────────────────────────────────────────────
🌐 ENLACES
──────────────────────────────────────────────────────────────────

Web: http://localhost:3002
GitHub: https://github.com/DAW1BSergiomg26/Web-Mio-Divina
Rama respaldo: https://github.com/DAW1BSergiomg26/Web-Mio-Divina/tree/musica-y-mejoras-004

═══════════════════════════════════════════════════════════════════
        ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA
═══════════════════════════════════════════════════════════════════
"""

msg = MIMEMultipart()
msg["From"] = REMITENTE
msg["To"] = DESTINATARIO
msg["Subject"] = f"💾 Respaldo creado: musica-y-mejoras-004 - {ahora}"
msg.attach(MIMEText(contenido, "plain", "utf-8"))

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()
server.login(REMITENTE, PASSWORD)
server.sendmail(REMITENTE, DESTINATARIO, msg.as_string())
server.quit()
print("Correo enviado!")
