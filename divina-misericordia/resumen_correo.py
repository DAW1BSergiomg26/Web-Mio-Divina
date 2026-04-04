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
        📋 RESUMEN - WEB DIVINA MISERICORDIA
═══════════════════════════════════════════════════════════════════

Fecha: {ahora}

──────────────────────────────────────────────────────────────────
✅ ÚLTIMO COMMIT SUBIDO
──────────────────────────────────────────────────────────────────

baacc75 - Fix scroll buttons - all pages now use professional gold buttons

──────────────────────────────────────────────────────────────────
📊 PANEL ADMIN ACTUALIZADO
──────────────────────────────────────────────────────────────────

El panel admin ahora tiene todas las secciones organizadas:

1. 🏠 PRINCIPALES - Inicio, Coronilla, Novena, etc.
2. 🌹 MARÍA Y VIRGENES - María, Virgen Caacupé, Luján, etc.
3. 📿 SANTO ROSARIO - Rosario completo y misterios
4. ✨ OTRAS DEVOCIONES - San José, San Judas, San Cayetano, etc.
5. 🙏 ORACIONES ESPECIALES - Estudiante, San Miguel, San Antonio
6. 👑 SANTOS PAPAS - Francisco, Benedicto XVI, Juan Pablo II, León XIV
7. 🎵 MÚSICA Y EXTRAS - Música Sacra, Altar 3D, Admin, 404

──────────────────────────────────────────────────────────────────
🌐 ENLACES
──────────────────────────────────────────────────────────────────

Web: http://localhost:3002
Admin: http://localhost:3002/admin_panel.html
Música: http://localhost:3002/musica-sacra.html
GitHub: https://github.com/DAW1BSergiomg26/Web-Mio-Divina

──────────────────────────────────────────────────────────────────
💻 COMANDOS WSL
──────────────────────────────────────────────────────────────────

cd /mnt/c/Users/astur/Desktop/Web\\ Mio\\ Divina/divina-misericordia
node index.js

═══════════════════════════════════════════════════════════════════
        ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA
═══════════════════════════════════════════════════════════════════
"""

msg = MIMEMultipart()
msg["From"] = REMITENTE
msg["To"] = DESTINATARIO
msg["Subject"] = f"📋 Actualizacion Panel Admin - {ahora}"
msg.attach(MIMEText(contenido, "plain", "utf-8"))

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()
server.login(REMITENTE, PASSWORD)
server.sendmail(REMITENTE, DESTINATARIO, msg.as_string())
server.quit()
print("Correo enviado!")
